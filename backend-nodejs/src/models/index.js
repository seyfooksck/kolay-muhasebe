const sequelize = require("../config/veritabani");
const Cari = require("./cariModel");
const Stok = require("./stokModel");
const Fatura = require("./faturaModel");
const FaturaKalemi = require("./faturaKalemiModel");

Cari.hasMany(Fatura, {
  foreignKey: "cari_id",
  as: "faturalar"
});

Fatura.belongsTo(Cari, {
  foreignKey: "cari_id",
  as: "cari"
});

Fatura.hasMany(FaturaKalemi, {
  foreignKey: "fatura_id",
  as: "kalemler"
});

FaturaKalemi.belongsTo(Fatura, {
  foreignKey: "fatura_id",
  as: "fatura"
});

Stok.hasMany(FaturaKalemi, {
  foreignKey: "stok_id",
  as: "fatura_kalemleri"
});

FaturaKalemi.belongsTo(Stok, {
  foreignKey: "stok_id",
  as: "stok"
});

module.exports = {
  sequelize,
  Cari,
  Stok,
  Fatura,
  FaturaKalemi
};
