const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const stokController = require("../controllers/stokController");

const router = express.Router();

router.get("/", asyncHandler(stokController.stokListele));
router.get("/:id", asyncHandler(stokController.stokDetay));
router.post("/", asyncHandler(stokController.stokOlustur));
router.put("/:id", asyncHandler(stokController.stokGuncelle));
router.delete("/:id", asyncHandler(stokController.stokSil));

module.exports = router;
