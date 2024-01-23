const express = require("express");
const { AdminController } = require("../../controllers/admin");

const router = express.Router();

router.get("/", AdminController.get);

module.exports = router;
