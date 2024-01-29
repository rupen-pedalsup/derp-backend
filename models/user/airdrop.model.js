const mongoose = require("mongoose");
const { tableName } = require("../../utils/table-name");

const airdropSchema = mongoose.Schema(
  {
    airdropName: {
      type: String,
      required: true,
      trim: true,
    },
    tokenName: {
      type: String,
      required: true,
      trim: true,
    },
    tokenSymbol: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    tokenAddress: {
      type: String,
      required: true,
    },
    totalTokens: {
      type: String,
      required: true,
    },
    minTokenPerWallet: {
      type: String,
      required: true,
    },
    maxTokenPerWallet: {
      type: String,
      required: true,
    },
    chain: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Number,
      require: true,
    },
    uri: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Airdrop = mongoose.model(tableName.airdrop, airdropSchema);

module.exports = Airdrop;
