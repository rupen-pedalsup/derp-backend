const { default: mongoose } = require("mongoose");
const { mongoUri } = require("../utils/config");

const dbConnect = (callback = () => {}) => {
  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Connected to Database...");
      callback();
    })
    .catch((err) => {
      console.error(`Failed to connect to MongoDB: ${err.message}`);
    });
};

module.exports = dbConnect;
