const { Op, fn, col, literal } = require("sequelize");
const { Cari, Stok, Fatura, FaturaKalemi } = require("../models");
const AppError = require("../utils/AppError");

const chatbotCevapla = async (req, res) => {
  const soru = String(req.body.soru || req.body.question || "").toLocaleLowerCase("tr-TR");

  if (!soru.trim()) {
    throw new AppError("Soru alani zorunludur.");
  }

  let cevap;

  if (soru.includes("en çok satılan") || soru.includes("en cok satilan")) {
    cevap = await enCokSatilanUrun();
  } else if (soru.includes("en fazla ciro") || soru.includes("en cok ciro")) {
    cevap = await enFazlaCiroYapilanCari();
  } else if (soru.includes("bugünkü satış") || soru.includes("bugunku satis")) {
    cevap = await bugunkuSatisToplami();
  } else if (soru.includes("bu ay") && soru.includes("kaç satış")) {
    cevap = await buAySatisSayisi();
  } else if (soru.includes("en az stok") || soru.includes("az sto")) {
    cevap = await enAzStokluUrunler();
  } else if (soru.includes("kaç adet sattım") || soru.includes("kac adet sattim")) {
    cevap = await urunSatisAdetleri();
  } else {
    cevap = "Bu soruyu henuz anlayamadim. Ornek: En cok satilan urunum hangisi?";
  }

  res.json({ basarili: true, veri: { soru: req.body.soru || req.body.question, cevap } });
};

const enCokSatilanUrun = async () => {
  const kayit = await FaturaKalemi.findOne({
    attributes: ["stok_id", [fn("SUM", col("miktar")), "toplam_miktar"]],
    include: [{ model: Stok, as: "stok", attributes: ["urun_adi"] }],
    group: ["stok_id", "stok.id"],
    order: [[literal("toplam_miktar"), "DESC"]]
  });

  if (!kayit) {
    return "Henuz satis verisi bulunmuyor.";
  }

  return `En cok satilan urun ${kayit.stok.urun_adi}. Toplam satis miktari: ${kayit.get("toplam_miktar")}.`;
};

const enFazlaCiroYapilanCari = async () => {
  const kayit = await Fatura.findOne({
    attributes: ["cari_id", [fn("SUM", col("genel_toplam")), "toplam_ciro"]],
    include: [{ model: Cari, as: "cari", attributes: ["cari_adi"] }],
    group: ["cari_id", "cari.id"],
    order: [[literal("toplam_ciro"), "DESC"]]
  });

  if (!kayit) {
    return "Henuz fatura verisi bulunmuyor.";
  }

  return `En fazla ciro yapilan cari ${kayit.cari.cari_adi}. Toplam ciro: ${kayit.get("toplam_ciro")}.`;
};

const bugunkuSatisToplami = async () => {
  const baslangic = new Date();
  baslangic.setHours(0, 0, 0, 0);

  const bitis = new Date();
  bitis.setHours(23, 59, 59, 999);

  const toplam = await Fatura.sum("genel_toplam", {
    where: {
      fatura_tarihi: {
        [Op.between]: [baslangic, bitis]
      }
    }
  });

  return `Bugunku satis toplami: ${toplam || 0}.`;
};

const buAySatisSayisi = async () => {
  const bugun = new Date();
  const baslangic = new Date(bugun.getFullYear(), bugun.getMonth(), 1);
  const bitis = new Date(bugun.getFullYear(), bugun.getMonth() + 1, 0, 23, 59, 59, 999);

  const sayi = await Fatura.count({
    where: {
      fatura_tarihi: {
        [Op.between]: [baslangic, bitis]
      }
    }
  });

  return `Bu ay toplam ${sayi} satis yapildi.`;
};

const enAzStokluUrunler = async () => {
  const stoklar = await Stok.findAll({
    order: [["mevcut_stok_miktari", "ASC"]],
    limit: 5
  });

  if (stoklar.length === 0) {
    return "Henuz stok kaydi bulunmuyor.";
  }

  return stoklar
    .map((stok) => `${stok.urun_adi}: ${stok.mevcut_stok_miktari} ${stok.birim}`)
    .join(", ");
};

const urunSatisAdetleri = async () => {
  const kayitlar = await FaturaKalemi.findAll({
    attributes: ["stok_id", [fn("SUM", col("miktar")), "toplam_miktar"]],
    include: [{ model: Stok, as: "stok", attributes: ["urun_adi"] }],
    group: ["stok_id", "stok.id"],
    order: [[literal("toplam_miktar"), "DESC"]]
  });

  if (kayitlar.length === 0) {
    return "Henuz satis verisi bulunmuyor.";
  }

  return kayitlar
    .map((kayit) => `${kayit.stok.urun_adi}: ${kayit.get("toplam_miktar")} adet`)
    .join(", ");
};

module.exports = {
  chatbotCevapla
};
