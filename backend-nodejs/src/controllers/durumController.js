const { Op } = require("sequelize");
const { sequelize, Cari, Stok, Fatura } = require("../models");

const sistemDurumu = async (req, res) => {
  res.json({
    basarili: true,
    veri: {
      uygulama: "Mini Muhasebe API",
      durum: "calisiyor"
    }
  });
};

const veritabaniDurumu = async (req, res) => {
  await sequelize.authenticate();

  res.json({
    basarili: true,
    veri: {
      mysql: "baglandi"
    }
  });
};

const dashboardOzeti = async (req, res) => {
  const bugunBaslangic = new Date();
  bugunBaslangic.setHours(0, 0, 0, 0);

  const bugunBitis = new Date();
  bugunBitis.setHours(23, 59, 59, 999);

  const [toplamCariSayisi, toplamStokSayisi, bugunkuSatisToplami] = await Promise.all([
    Cari.count(),
    Stok.count(),
    Fatura.sum("genel_toplam", {
      where: {
        fatura_tarihi: {
          [Op.between]: [bugunBaslangic, bugunBitis]
        }
      }
    })
  ]);

  res.json({
    basarili: true,
    veri: {
      toplam_cari_sayisi: toplamCariSayisi,
      toplam_stok_sayisi: toplamStokSayisi,
      bugunku_satis_toplami: bugunkuSatisToplami || 0
    }
  });
};

module.exports = {
  sistemDurumu,
  veritabaniDurumu,
  dashboardOzeti
};
