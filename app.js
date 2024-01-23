const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options("*", cors());

// api routes
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

// send back a 404 error for any unknown api request
app.use("*", (req, res, next) => {
  let message = {
    status: 404,
    message: "Requested API not found",
    data: {},
  };
  return res.status(404).send(message);
});

module.exports = app;
