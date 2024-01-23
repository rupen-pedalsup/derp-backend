const mongoose = require("mongoose");
const { tableName } = require("../../utils/table-name");

const transactionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: tableName.user,
    },
    txHash: {
      type: [String],
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model(tableName.transaction, transactionSchema);

module.exports = Transaction;
