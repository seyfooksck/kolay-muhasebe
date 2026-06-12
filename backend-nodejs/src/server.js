const app = require("./app");
const bilsoft = require("./config/bilsoft");
const { sshTunnelBaslat, sshTunnelKapat } = require("./config/sshTunnel");
const { sequelize } = require("./models");

const baslat = async () => {
  try {
    await sshTunnelBaslat();
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    app.listen(bilsoft.sunucu.port, () => {
      console.log(`API calisiyor: http://localhost:${bilsoft.sunucu.port}`);
    });
  } catch (error) {
    console.error("Sunucu baslatilamadi:", error.message);
    process.exit(1);
  }
};

process.on("SIGINT", () => {
  sshTunnelKapat();
  process.exit(0);
});

process.on("SIGTERM", () => {
  sshTunnelKapat();
  process.exit(0);
});

baslat();
