const { DataTypes } = require("sequelize");
const sequelize = require("../config/veritabani");

const Stok = sequelize.define(
  "Stok",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    stok_kodu: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    urun_adi: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    birim: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    birim_fiyat: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0
    },
    kdv_orani: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 20
    },
    mevcut_stok_miktari: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    tableName: "stoklar"
  }
);

module.exports = Stok;
