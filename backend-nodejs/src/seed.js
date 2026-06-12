const { sequelize, Stok } = require("./models");
const { sshTunnelBaslat, sshTunnelKapat } = require("./config/sshTunnel");

const urunler = [
  {
    stok_kodu: "STK-001",
    urun_adi: "Kablosuz Mouse",
    birim: "Adet",
    birim_fiyat: 350,
    kdv_orani: 20,
    mevcut_stok_miktari: 75
  },
  {
    stok_kodu: "STK-002",
    urun_adi: "Mekanik Klavye",
    birim: "Adet",
    birim_fiyat: 1250,
    kdv_orani: 20,
    mevcut_stok_miktari: 40
  },
  {
    stok_kodu: "STK-003",
    urun_adi: "24 Inc Monitor",
    birim: "Adet",
    birim_fiyat: 4200,
    kdv_orani: 20,
    mevcut_stok_miktari: 18
  },
  {
    stok_kodu: "STK-004",
    urun_adi: "USB-C Hub",
    birim: "Adet",
    birim_fiyat: 850,
    kdv_orani: 20,
    mevcut_stok_miktari: 55
  },
  {
    stok_kodu: "STK-005",
    urun_adi: "Termal Etiket",
    birim: "Rulo",
    birim_fiyat: 95,
    kdv_orani: 10,
    mevcut_stok_miktari: 250
  }
];

const seedBaslat = async () => {
  try {
    await sshTunnelAc();
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    for (const urun of urunler) {
      const mevcutUrun = await Stok.findOne({
        where: {
          stok_kodu: urun.stok_kodu
        }
      });

      if (mevcutUrun) {
        await mevcutUrun.update(urun);
        console.log(`Guncellendi: ${urun.stok_kodu} - ${urun.urun_adi}`);
      } else {
        await Stok.create(urun);
        console.log(`Eklendi: ${urun.stok_kodu} - ${urun.urun_adi}`);
      }
    }

    console.log(`Seed tamamlandi. Toplam urun: ${urunler.length}`);
  } catch (error) {
    console.error("Seed calistirilamadi:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
    sshTunnelKapat();
  }
};

const sshTunnelAc = async () => {
  try {
    await sshTunnelBaslat();
  } catch (error) {
    if (error.code === "EADDRINUSE") {
      console.log("SSH tunnel portu zaten kullanimda, mevcut tunnel ile devam ediliyor.");
      return;
    }

    throw error;
  }
};

seedBaslat();
