const express = require("express");
const { UserController } = require("../../controllers/user");

const router = express.Router();

router.get("/", UserController.get);

module.exports = router;
