const express = require("express");
const { TransactionController } = require("../../controllers/user");

const router = express.Router();

router.post("/", TransactionController.scanTransactions);
router.post("/btc/:address", TransactionController.scanBtcTransaction);

module.exports = router;
