const express = require("express");
const { AirdropController } = require("../../controllers/user");

const router = express.Router();

router.post("/", AirdropController.post);
router.get("/", AirdropController.get);
router.get("/:id", AirdropController.getSingle);
router.put("/:id", AirdropController.put);
router.delete("/:id", AirdropController.drop);

module.exports = router;
