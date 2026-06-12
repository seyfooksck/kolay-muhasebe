const hataMiddleware = (err, req, res, next) => {
  const durumKodu = err.statusCode || 500;

  res.status(durumKodu).json({
    basarili: false,
    mesaj: err.message || "Beklenmeyen bir hata olustu."
  });
};

module.exports = hataMiddleware;
