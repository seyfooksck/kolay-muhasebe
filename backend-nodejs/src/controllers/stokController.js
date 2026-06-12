const { Op } = require("sequelize");
const { Stok } = require("../models");
const AppError = require("../utils/AppError");

const stokListele = async (req, res) => {
  const { arama } = req.query;

  const where = arama
    ? {
        [Op.or]: [
          { stok_kodu: { [Op.like]: `%${arama}%` } },
          { urun_adi: { [Op.like]: `%${arama}%` } }
        ]
      }
    : undefined;

  const stoklar = await Stok.findAll({ where, order: [["id", "DESC"]] });

  res.json({ basarili: true, veri: stoklar });
};

const stokDetay = async (req, res) => {
  const stok = await Stok.findByPk(req.params.id);

  if (!stok) {
    throw new AppError("Stok bulunamadi.", 404);
  }

  res.json({ basarili: true, veri: stok });
};

const stokOlustur = async (req, res) => {
  const stok = await Stok.create(req.body);

  res.status(201).json({ basarili: true, veri: stok });
};

const stokGuncelle = async (req, res) => {
  const stok = await Stok.findByPk(req.params.id);

  if (!stok) {
    throw new AppError("Stok bulunamadi.", 404);
  }

  await stok.update(req.body);

  res.json({ basarili: true, veri: stok });
};

const stokSil = async (req, res) => {
  const stok = await Stok.findByPk(req.params.id);

  if (!stok) {
    throw new AppError("Stok bulunamadi.", 404);
  }

  await stok.destroy();

  res.json({ basarili: true, mesaj: "Stok silindi." });
};

module.exports = {
  stokListele,
  stokDetay,
  stokOlustur,
  stokGuncelle,
  stokSil
};
