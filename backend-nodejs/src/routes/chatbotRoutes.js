const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const chatbotController = require("../controllers/chatbotController");

const router = express.Router();

router.post("/sor", asyncHandler(chatbotController.chatbotCevapla));

module.exports = router;
