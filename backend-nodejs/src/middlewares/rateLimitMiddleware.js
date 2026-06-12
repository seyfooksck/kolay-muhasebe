const rateLimit = require("express-rate-limit");
const bilsoft = require("../config/bilsoft");

const apiRateLimit = rateLimit({
  windowMs: bilsoft.rateLimit.pencereDakika * 60 * 1000,
  limit: bilsoft.rateLimit.maksimumIstek,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    basarili: false,
    mesaj: "Cok fazla istek gonderildi. Lutfen daha sonra tekrar deneyin."
  }
});

module.exports = apiRateLimit;
