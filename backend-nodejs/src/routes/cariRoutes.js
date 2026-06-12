const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const cariController = require("../controllers/cariController");

const router = express.Router();

router.get("/", asyncHandler(cariController.cariListele));
router.get("/:id", asyncHandler(cariController.cariDetay));
router.post("/", asyncHandler(cariController.cariOlustur));
router.put("/:id", asyncHandler(cariController.cariGuncelle));
router.delete("/:id", asyncHandler(cariController.cariSil));

module.exports = router;
