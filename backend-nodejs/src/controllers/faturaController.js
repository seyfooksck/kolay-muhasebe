const { sequelize, Cari, Stok, Fatura, FaturaKalemi } = require("../models");
const AppError = require("../utils/AppError");

const faturaListele = async (req, res) => {
  const faturalar = await Fatura.findAll({
    include: [{ model: Cari, as: "cari" }],
    order: [["id", "DESC"]]
  });

  res.json({ basarili: true, veri: faturalar });
};

const faturaDetay = async (req, res) => {
  const fatura = await Fatura.findByPk(req.params.id, {
    include: [
      { model: Cari, as: "cari" },
      {
        model: FaturaKalemi,
        as: "kalemler",
        include: [{ model: Stok, as: "stok" }]
      }
    ]
  });

  if (!fatura) {
    throw new AppError("Fatura bulunamadi.", 404);
  }

  res.json({ basarili: true, veri: fatura });
};

const faturaOlustur = async (req, res) => {
  const { cari_id, fatura_tarihi, kalemler } = req.body;

  if (!cari_id) {
    throw new AppError("Cari secimi zorunludur.");
  }

  if (!Array.isArray(kalemler) || kalemler.length === 0) {
    throw new AppError("Fatura en az bir kalem icermelidir.");
  }

  const sonuc = await sequelize.transaction(async (transaction) => {
    const cari = await Cari.findByPk(cari_id, { transaction });

    if (!cari) {
      throw new AppError("Cari bulunamadi.", 404);
    }

    let araToplam = 0;
    let kdvToplam = 0;
    const olusacakKalemler = [];

    for (const kalem of kalemler) {
      const stok = await Stok.findByPk(kalem.stok_id, {
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (!stok) {
        throw new AppError(`Stok bulunamadi. Stok id: ${kalem.stok_id}`, 404);
      }

      const miktar = Number(kalem.miktar);
      const birimFiyat = Number(kalem.birim_fiyat ?? stok.birim_fiyat);
      const kdvOrani = Number(kalem.kdv_orani ?? stok.kdv_orani);
      const mevcutStok = Number(stok.mevcut_stok_miktari);

      if (miktar <= 0) {
        throw new AppError("Kalem miktari sifirdan buyuk olmalidir.");
      }

      if (!Number.isInteger(miktar)) {
        throw new AppError("Kalem miktari tam sayi olmalidir.");
      }

      if (mevcutStok < miktar) {
        throw new AppError(`${stok.urun_adi} icin yetersiz stok vardir.`);
      }

      const satirAraToplam = miktar * birimFiyat;
      const satirKdvToplam = satirAraToplam * (kdvOrani / 100);
      const satirToplam = satirAraToplam + satirKdvToplam;

      araToplam += satirAraToplam;
      kdvToplam += satirKdvToplam;

      await stok.update(
        { mevcut_stok_miktari: mevcutStok - miktar },
        { transaction }
      );

      olusacakKalemler.push({
        stok_id: stok.id,
        miktar,
        birim_fiyat: birimFiyat,
        kdv_orani: kdvOrani,
        satir_toplam: satirToplam
      });
    }

    const fatura = await Fatura.create(
      {
        cari_id,
        fatura_tarihi: fatura_tarihi || new Date(),
        ara_toplam: araToplam,
        kdv_toplam: kdvToplam,
        genel_toplam: araToplam + kdvToplam
      },
      { transaction }
    );

    await FaturaKalemi.bulkCreate(
      olusacakKalemler.map((kalem) => ({
        ...kalem,
        fatura_id: fatura.id
      })),
      { transaction }
    );

    return Fatura.findByPk(fatura.id, {
      include: [
        { model: Cari, as: "cari" },
        {
          model: FaturaKalemi,
          as: "kalemler",
          include: [{ model: Stok, as: "stok" }]
        }
      ],
      transaction
    });
  });

  res.status(201).json({ basarili: true, veri: sonuc });
};

module.exports = {
  faturaListele,
  faturaDetay,
  faturaOlustur
};
