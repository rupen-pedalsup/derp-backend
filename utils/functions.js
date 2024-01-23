const { unmarshalApiKey } = require("./config");
const getValue = (decimals, value) => value / 10 ** decimals;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const fetchTransactions = async (address, lastScanBlock) => {
  const transactions = [];
  const pageSize = 500;
  let currentPage = 1;
  let has_next;

  try {
    do {
      console.log("Fetching page:", currentPage);
      const url = `https://api.unmarshal.com/v3/ethereum/address/${address}/transactions?auth_key=${unmarshalApiKey}&page=${currentPage}&pageSize=${pageSize}&fromBlock=${lastScanBlock}`;

      const fetchResponse = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 5000,
      });

      const fetchResponseJson = await fetchResponse.json();
      const currentTransactions = fetchResponseJson.transactions;
      has_next = fetchResponseJson.has_next;
      transactions.push(...currentTransactions);

      // Update the current page
      if (has_next) {
        currentPage++;
      }
    } while (has_next);

    console.log("All transactions fetched successfully");
    return transactions;
  } catch (error) {
    // To avoid -> cause: ConnectTimeoutError: Connect Timeout Error
    if (retryCount < MAX_RETRIES) {
      console.log(
        `Retrying (${retryCount + 1}/${MAX_RETRIES}) after ${
          RETRY_DELAY_MS / 1000
        } seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return getETHPrice(timestamp, token_id, retryCount + 1);
    } else {
      throw error; // Rethrow the error after max retries
    }
  }
};

const getETHPrice = async (
  timestamp,
  token_id = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // WETH
  retryCount = 0
) => {
  try {
    const url = `https://api.unmarshal.com/v1/pricestore/chain/ethereum/${token_id}?timestamp=${timestamp}&auth_key=${unmarshalApiKey}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 5000,
    });
    const responseJson = await response.json();

    return responseJson;
  } catch (error) {
    // To avoid -> cause: ConnectTimeoutError: Connect Timeout Error
    if (retryCount < MAX_RETRIES) {
      console.log(
        `Retrying (${retryCount + 1}/${MAX_RETRIES}) after ${
          RETRY_DELAY_MS / 1000
        } seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return getETHPrice(timestamp, token_id, retryCount + 1);
    } else {
      throw error; // Rethrow the error after max retries
    }
  }
};

const processBatch = async (batch, address) => {
  try {
    let boughtArr = [];
    let soldArr = [];
    let transactionHash = [];
    let totalBoughtEth = 0;
    let score = 0;

    await Promise.all(
      batch.map(async (transaction) => {
        if (transaction.type === "swap") {
          const bought = transaction.received;
          const sold = transaction.sent;

          await Promise.all(
            bought.map(async (boughtItem) => {
              if (
                boughtItem.to.toLowerCase() === address.toLowerCase() &&
                boughtItem.symbol === "WETH"
              ) {
                const responseUSD = await getETHPrice(transaction.date);
                const value = getValue(boughtItem.decimals, boughtItem.value);
                totalBoughtEth += value;
                boughtArr.push({
                  ethAmount: value,
                  ethPriceUsd: responseUSD.price,
                  timestamp: transaction.date,
                  transactionHash: transaction.id,
                });
              }
            })
          );

          await sleep(2000);

          await Promise.all(
            sold.map(async (soldItem) => {
              if (
                soldItem.from.toLowerCase() === address.toLowerCase() &&
                soldItem.symbol === "WETH"
              ) {
                const responseUSD = await getETHPrice(transaction.date);
                const value = getValue(soldItem.decimals, soldItem.value);
                soldArr.push({
                  ethAmount: value,
                  ethPriceUsd: responseUSD.price,
                  timestamp: transaction.date,
                  transactionHash: transaction.id,
                });
              }
            })
          );
        }
      })
    );

    // Sort
    boughtArr = boughtArr.sort(
      (a, b) =>
        new Date(a.timestamp * 1000) - new Date(b.timestamp * 1000) ||
        a.transactionHash.localeCompare(b.transactionHash)
    );
    soldArr = soldArr.sort(
      (a, b) =>
        new Date(a.timestamp * 1000) - new Date(b.timestamp * 1000) ||
        a.transactionHash.localeCompare(b.transactionHash)
    );

    console.log(boughtArr, "boughtArr");
    console.log(soldArr, "soldArr");

    let i = 0;
    let j = 0;
    while (i < boughtArr.length && j < soldArr.length) {
      let pnl = 0;

      if (soldArr[j].timestamp > boughtArr[i].timestamp) {
        pnl =
          Math.min(boughtArr[i].ethAmount, soldArr[j].ethAmount) *
          (soldArr[j].ethPriceUsd - boughtArr[i].ethPriceUsd);

        let temp = soldArr[j].ethAmount;

        soldArr[j].ethAmount = soldArr[j].ethAmount - boughtArr[i].ethAmount;

        if (pnl < 0) {
          score -= 10;

          // if transaction has not been added to transactionHash array then add it
          if (!transactionHash.includes(soldArr[j].transactionHash)) {
            transactionHash.push(soldArr[j].transactionHash);
          }
        }
        if (soldArr[j].ethAmount < 0) {
          boughtArr[i].ethAmount -= temp;
          j++;
        } else if (soldArr[j].ethAmount === 0) {
          j++;
        } else {
          i++;
        }
      } else {
        j++;
      }
    }

    console.log(score, "score");
    console.log(totalBoughtEth, "totalBoughtEth");

    return { score, transactionHash, totalBoughtEth };
  } catch (error) {
    console.error("Error processing batch:", error.message);
    throw error;
  }
};

const BATCH_SIZE = 100;
const proceedTransaction = async (transactions, address) => {
  try {
    console.log(transactions.length, "transactions.length");

    let totalBoughtEth = 0;
    const transactionChunks = [];

    for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
      const chunk = transactions.slice(i, i + BATCH_SIZE);
      transactionChunks.push(chunk);
    }

    let combinedResults = { score: 0, transactionHash: [] };

    for (let index = 0; index < transactionChunks.length; index++) {
      const batch = transactionChunks[index];
      console.log(`Processing batch ${index + 1}...`);

      try {
        const batchResult = await processBatch(batch, address);
        combinedResults.score += batchResult.score;
        combinedResults.transactionHash.push(...batchResult.transactionHash);
        totalBoughtEth += batchResult.totalBoughtEth;
      } catch (batchError) {
        console.error(
          `Error processing batch ${index + 1}:`,
          batchError.message
        );
      }
    }

    // Calculate score
    if (totalBoughtEth <= 1 && totalBoughtEth > 0) {
      combinedResults.score += 100;
    } else if (totalBoughtEth > 1 && totalBoughtEth <= 5) {
      combinedResults.score += 250;
    } else if (totalBoughtEth > 5 && totalBoughtEth <= 20) {
      combinedResults.score += 500;
    } else if (totalBoughtEth > 20) {
      combinedResults.score += 750;
    }

    console.log(combinedResults.score, "score");
    console.log(totalBoughtEth, "totalBoughtEth");
    console.log(
      combinedResults.transactionHash.length,
      "total transactions processed"
    );

    return combinedResults;
  } catch (error) {
    console.error("Error processing transactions:", error.message);
  }
};

module.exports = { getETHPrice, proceedTransaction, fetchTransactions };
