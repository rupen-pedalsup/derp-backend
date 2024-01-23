const express = require("express");
const AdminRoute = require("./admin.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/account",
    route: AdminRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
