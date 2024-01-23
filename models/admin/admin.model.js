const mongoose = require("mongoose");
const { tableName } = require("../../utils/table-name");

const adminSchema = mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model(tableName.admin, adminSchema);

module.exports = Admin;
