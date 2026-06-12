const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const durumController = require("../controllers/durumController");

const router = express.Router();

router.get("/", asyncHandler(durumController.sistemDurumu));
router.get("/veritabani", asyncHandler(durumController.veritabaniDurumu));
router.get("/ozet", asyncHandler(durumController.dashboardOzeti));

module.exports = router;
