const { User, Transaction } = require("../../models/user");
const httpStatus = require("http-status");
const {
  proceedTransaction,
  fetchTransactions,
} = require("../../utils/functions");

const scanTransactions = async (req, res) => {
  try {
    const user = await User.findOne({ address: req.body.address });

    if (!user) {
      let response = {
        status: false,
        message: "User not found",
        data: null,
      };

      return res.status(httpStatus.NOT_FOUND).send(response);
    }

    // Fetch transactions
    const transactions = await fetchTransactions(
      req.body.address,
      user.lastScanBlock
    );

    if (transactions.length === 0) {
      let response = {
        status: false,
        message: "No transactions found",
        data: null,
      };

      return res.status(httpStatus.OK).send(response);
    }

    // Proceed transactions
    const transactionData = await proceedTransaction(
      transactions,
      req.body.address
    );

    // Update user's lastScanBlock and score
    user.lastScanBlock = transactions[0].block + 1;
    user.score += transactionData.score;
    await user.save();

    let transaction = await Transaction.findOneAndUpdate(
      { user: user._id },
      {
        $push: {
          txHash: transactionData.transactionHash,
        },
      },
      { new: true }
    );

    if (!transaction) {
      transaction = await Transaction.create({
        user: user._id,
        txHash: transactionData.transactionHash,
      });
    }

    let response = {
      status: true,
      message: "Transactions fetched successfully",
      data: { transactions, transactionDataHash: transaction },
    };

    return res.status(httpStatus.OK).send(response);
  } catch (err) {
    console.log(err);

    let response = {
      status: false,
      message: "Something went wrong",
      data: null,
    };

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
};

const scanBtcTransaction = async (req, res) => {
  try {
    if (!req.body.btcAddress) {
      let response = {
        status: false,
        message: "BTC address is required",
        data: null,
      };

      return res.status(httpStatus.BAD_REQUEST).send(response);
    }

    const resData = await fetch(
      `https://api.blockcypher.com/v1/btc/test3/txs/${req.body.hash}?limit=50&includeHex=true`
    );
    const resJson = await resData.json();

    const to = resJson.addresses[0];
    const from = resJson.addresses[1];

    if (from !== req.body.btcAddress) {
      let response = {
        status: false,
        message: "Invalid transaction",
        data: null,
      };

      return res.status(httpStatus.OK).send(response);
    }

    const currentPrice = await fetch(
      "https://api.coindesk.com/v1/bpi/currentprice.json"
    );
    const currentPriceJson = await currentPrice.json();
    const price = resJson.total * currentPriceJson.bpi.USD.rate_float;

    const totalPrice = resJson.total * price;

    if (totalPrice >= req.body.amount) {
      await User.findOneAndUpdate(
        { address: req.params.address },
        {
          btcAddress: req.body.btcAddress,
        },
        { new: true }
      );

      let response = {
        status: true,
        message: "Transaction validated",
        data: resJson,
      };

      return res.status(httpStatus.OK).send(response);
    }

    let response = {
      status: false,
      message: "Invalid transaction",
      data: null,
    };

    return res.status(httpStatus.OK).send(response);
  } catch (err) {
    console.log(err);

    let response = {
      status: false,
      message: "Something went wrong",
      data: null,
    };

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
};

module.exports = { scanTransactions, scanBtcTransaction };
