const { Sequelize } = require("sequelize");
const bilsoft = require("./bilsoft");

const mysqlBaglanti = bilsoft.ssh.aktif
  ? {
      host: bilsoft.ssh.localHost,
      port: bilsoft.ssh.localPort
    }
  : {
      host: bilsoft.mysql.host,
      port: bilsoft.mysql.port
    };

const sequelize = new Sequelize(
  bilsoft.mysql.database,
  bilsoft.mysql.username,
  bilsoft.mysql.password,
  {
    host: mysqlBaglanti.host,
    port: mysqlBaglanti.port,
    dialect: "mysql",
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      createdAt: "olusturma_tarihi",
      updatedAt: "guncelleme_tarihi"
    }
  }
);

module.exports = sequelize;
