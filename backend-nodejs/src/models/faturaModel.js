const { DataTypes } = require("sequelize");
const sequelize = require("../config/veritabani");

const Fatura = sequelize.define(
  "Fatura",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    cari_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fatura_tarihi: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ara_toplam: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0
    },
    kdv_toplam: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0
    },
    genel_toplam: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    tableName: "faturalar"
  }
);

module.exports = Fatura;
