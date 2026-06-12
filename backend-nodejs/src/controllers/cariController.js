const { Op } = require("sequelize");
const { Cari } = require("../models");
const AppError = require("../utils/AppError");
const { epostaDomainKontrolEt } = require("../utils/domainKontrol");

const cariListele = async (req, res) => {
  const { arama } = req.query;

  const where = arama
    ? {
        [Op.or]: [
          { cari_kodu: { [Op.like]: `%${arama}%` } },
          { cari_adi: { [Op.like]: `%${arama}%` } },
          { vergi_no_tckn: { [Op.like]: `%${arama}%` } },
          { e_posta: { [Op.like]: `%${arama}%` } }
        ]
      }
    : undefined;

  const cariler = await Cari.findAll({ where, order: [["id", "DESC"]] });

  res.json({ basarili: true, veri: cariler });
};

const cariDetay = async (req, res) => {
  const cari = await Cari.findByPk(req.params.id);

  if (!cari) {
    throw new AppError("Cari bulunamadi.", 404);
  }

  res.json({ basarili: true, veri: cari });
};

const cariOlustur = async (req, res) => {
  const kayitVerisi = await cariVerisiniHazirla(req.body);
  const cari = await Cari.create(kayitVerisi);

  res.status(201).json({ basarili: true, veri: cari });
};

const cariGuncelle = async (req, res) => {
  const cari = await Cari.findByPk(req.params.id);

  if (!cari) {
    throw new AppError("Cari bulunamadi.", 404);
  }

  const kayitVerisi = await cariVerisiniHazirla(req.body);
  await cari.update(kayitVerisi);

  res.json({ basarili: true, veri: cari });
};

const cariSil = async (req, res) => {
  const cari = await Cari.findByPk(req.params.id);

  if (!cari) {
    throw new AppError("Cari bulunamadi.", 404);
  }

  await cari.destroy();

  res.json({ basarili: true, mesaj: "Cari silindi." });
};

const cariVerisiniHazirla = async (veri) => {
  const kayitVerisi = { ...veri };

  if (kayitVerisi.e_posta) {
    await epostaDomainKontrolEt(kayitVerisi.e_posta);
  }

  return kayitVerisi;
};

module.exports = {
  cariListele,
  cariDetay,
  cariOlustur,
  cariGuncelle,
  cariSil
};
