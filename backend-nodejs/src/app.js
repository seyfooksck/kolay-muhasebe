const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const hopkardesimyavasnapıyorsunsenoyle = require("./middlewares/rateLimitMiddleware");
const hataMiddleware = require("./middlewares/hataMiddleware");
const cariRoutes = require("./routes/cariRoutes");
const stokRoutes = require("./routes/stokRoutes");
const faturaRoutes = require("./routes/faturaRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const durumRoutes = require("./routes/durumRoutes");

const app = express();

app.use(helmet());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(hopkardesimyavasnapıyorsunsenoyle);

app.use("/api/durum", durumRoutes);
app.use("/api/cari", cariRoutes);
app.use("/api/stok", stokRoutes);
app.use("/api/fatura", faturaRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.use((req, res) => {
  res.status(404).json({
    basarili: false,
    mesaj: "Endpoint bulunamadi."
  });
});

app.use(hataMiddleware);

module.exports = app;
