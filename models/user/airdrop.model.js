const mongoose = require("mongoose");
const { tableName } = require("../../utils/table-name");

const airdropSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default: "",
    },
    contractAddress: {
      type: String,
      required: true,
      unique: true,
    },
    totalTokens: {
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
