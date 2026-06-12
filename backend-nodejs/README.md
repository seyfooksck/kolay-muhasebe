# Backend Node.js API

Mini muhasebe uygulamasi icin Express, Sequelize ve MySQL kullanan moduler API.

## MySQL Ayari

MySQL bilgileri `src/config/bilsoft.js` icinden girilir:

```js
mysql: {
  host: "localhost",
  port: 3306,
  database: "mini_muhasebe",
  username: "root",
  password: "your_password"
}
```

Veritabani yoksa MySQL uzerinde olusturun:

```sql
CREATE DATABASE mini_muhasebe CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;
```

Uygulama baslarken Sequelize tabloları otomatik olusturur veya gunceller.

## SSH ile MySQL Baglantisi

MySQL portu disaridan kapaliysa `src/config/bilsoft.js` icinde SSH tunnel aktif edilebilir:

```js
ssh: {
  aktif: true,
  host: "sunucu_ip_adresi",
  port: 22,
  username: "ssh_kullanici_adi",
  password: "ssh_sifresi",
  privateKeyPath: "",
  localHost: "127.0.0.1",
  localPort: 3307
}
```

Bu modda Sequelize MySQL'e `127.0.0.1:3307` uzerinden baglanir; uygulama bu lokal portu SSH ile `mysql.host:mysql.port` adresine tüneller.

SSH anahtari kullanacaksaniz `password` yerine `privateKeyPath` alanina private key dosya yolunu girin.

## Calistirma

```bash
npm install
npm run dev
```

veya:

```bash
npm start
```

## Test Urunleri Yukleme

`src/seed.js` icindeki `urunler` listesini duzenleyip test stoklarini yukleyebilirsiniz:

```bash
npm run seed
```

## Endpointler

- `GET /api/durum`
- `GET /api/durum/veritabani`
- `GET /api/durum/ozet`
- `GET /api/cari`
- `GET /api/cari/:id`
- `POST /api/cari`
- `PUT /api/cari/:id`
- `DELETE /api/cari/:id`
- `GET /api/stok`
- `GET /api/stok/:id`
- `POST /api/stok`
- `PUT /api/stok/:id`
- `DELETE /api/stok/:id`
- `GET /api/fatura`
- `GET /api/fatura/:id`
- `POST /api/fatura`
- `POST /api/chatbot/sor`

## Ornek Cari Ekleme

```json
{
  "cari_kodu": "CARI-001",
  "cari_adi": "Ornek Musteri",
  "vergi_no_tckn": "1234567890",
  "telefon": "05555555555",
  "e_posta": "ornek@firma.com",
  "adres": "Istanbul"
}
```

## Ornek Stok Ekleme

```json
{
  "stok_kodu": "STOK-001",
  "urun_adi": "Ornek Urun",
  "birim": "Adet",
  "birim_fiyat": 100,
  "kdv_orani": 20,
  "mevcut_stok_miktari": 50
}
```

## Ornek Fatura Ekleme

```json
{
  "cari_id": 1,
  "fatura_tarihi": "2026-06-10",
  "kalemler": [
    {
      "stok_id": 1,
      "miktar": 2,
      "birim_fiyat": 100,
      "kdv_orani": 20
    }
  ]
}
```

## Ornek ChatBot Sorusu

```json
{
  "soru": "En cok satilan urunum hangisi?"
}
```
