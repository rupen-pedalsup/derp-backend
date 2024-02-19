const express = require("express");
const { UserController } = require("../../controllers/user");

const router = express.Router();

router.get("/:address", UserController.loginUser);
router.post("/", UserController.createUser);
router.put("/:address", UserController.put);

module.exports = router;
