const { DataTypes } = require("sequelize");
const sequelize = require("../config/veritabani");

const Cari = sequelize.define(
  "Cari",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    cari_kodu: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    cari_adi: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    vergi_no_tckn: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    telefon: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    e_posta: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    adres: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "cariler"
  }
);

module.exports = Cari;
