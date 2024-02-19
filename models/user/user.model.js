const mongoose = require("mongoose");
const { tableName } = require("../../utils/table-name");

const userSchema = mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    lastScanBlock: {
      type: Number,
      // Block At 1672531200 (1 Jan 2023) -> 8235441(Block Number)
      default: 8235441,
    },
    solanaAddress: {
      type: String,
      default: null,
    },
    cosmosAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model(tableName.user, userSchema);

module.exports = User;
