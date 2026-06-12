const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const faturaController = require("../controllers/faturaController");

const router = express.Router();

router.get("/", asyncHandler(faturaController.faturaListele));
router.get("/:id", asyncHandler(faturaController.faturaDetay));
router.post("/", asyncHandler(faturaController.faturaOlustur));

module.exports = router;
