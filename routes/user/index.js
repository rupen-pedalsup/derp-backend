const express = require("express");
const userRoutes = require("./user.route");
const transactionRoutes = require("./transaction.route");
const airdropRoutes = require("./airdrop.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/account",
    route: userRoutes,
  },
  {
    path: "/transaction",
    route: transactionRoutes,
  },
  {
    path: "/airdrop",
    route: airdropRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
