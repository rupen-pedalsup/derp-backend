const { User, Transaction } = require("../../models/user");
const httpStatus = require("http-status");
const {
  proceedTransaction,
  fetchTransactions,
} = require("../../utils/functions");
const { fetchCurrentPrice } = require("../../utils/btc");
const { btcWalletAddress, baseBitcoinUrl } = require("../../utils/config");

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
    const { btcAddress, hash, amount } = req.body;
    if (!btcAddress) {
      return res.status(httpStatus.BAD_REQUEST).send({
        status: false,
        message: "BTC address is required",
        data: null,
      });
    }

    const user = await User.findOne({ btcAddress });
    if (user) {
      return res.status(httpStatus.BAD_REQUEST).send({
        status: false,
        message: "BTC address already exists",
        data: null,
      });
    }

    const resData = await fetch(
      `${baseBitcoinUrl}/${hash}?limit=50&includeHex=true`
    );
    const transaction = await resData.json();

    if (transaction.error) {
      return res.status(httpStatus.OK).send({
        status: false,
        message: transaction.error,
        data: null,
      });
    }

    let fromAddressValid = transaction.inputs.some((input) =>
      input.addresses.includes(btcAddress)
    );
    if (!fromAddressValid) {
      return res.status(httpStatus.OK).send({
        status: false,
        message: "Invalid wallet address",
        data: null,
      });
    }

    let transactionValidated = false;

    for (const output of transaction.outputs) {
      if (output.addresses.includes(btcWalletAddress)) {
        const btcValue = output.value / 100000000;
        const currentBtcPrice = await fetchCurrentPrice();
        const totalPrice = btcValue * currentBtcPrice;

        if (totalPrice >= amount) {
          transactionValidated = true;

          await User.findOneAndUpdate(
            { address: req.params.address },
            {
              btcAddress,
            },
            { new: true }
          );

          break;
        }
      }
    }

    if (!transactionValidated) {
      return res.status(httpStatus.OK).send({
        status: false,
        message: "Invalid transaction amount",
        data: null,
      });
    }

    return res.status(httpStatus.OK).send({
      status: true,
      message: "Transaction validated",
      data: transaction,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging purposes

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: "Something went wrong",
      data: null,
    });
  }
};

module.exports = { scanTransactions, scanBtcTransaction };
