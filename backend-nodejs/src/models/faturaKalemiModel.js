const { DataTypes } = require("sequelize");
const sequelize = require("../config/veritabani");

const FaturaKalemi = sequelize.define(
  "FaturaKalemi",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fatura_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stok_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    miktar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    birim_fiyat: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false
    },
    kdv_orani: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    satir_toplam: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false
    }
  },
  {
    tableName: "fatura_kalemleri"
  }
);

module.exports = FaturaKalemi;
