const express = require("express");
const AdminRoute = require("./admin.route");
const AirdropRoute = require("./airdrop.route");
const UserRoute = require("./user.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/account",
    route: AdminRoute,
  },
  {
    path: "/users",
    route: UserRoute,
  },
  {
    path: "/airdrop",
    route: AirdropRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
