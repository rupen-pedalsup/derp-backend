const express = require("express");
const { AirdropController } = require("../../controllers/user");

const router = express.Router();

router.get("/", AirdropController.get);
router.get("/:id", AirdropController.getSingle);

module.exports = router;
