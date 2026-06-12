# Mini Muhasebe Uygulaması

Bu proje; cari yönetimi, stok yönetimi, satış/fatura işlemleri ve satış verileri üzerinden cevap üreten basit bir ChatBot modülünden oluşan mini muhasebe uygulamasıdır.

Proje iki ana bölümden oluşur:

- `backend-nodejs`: Express.js, Sequelize ORM ve MySQL kullanan REST API.
- `frontend`: Next.js, TypeScript, Tailwind CSS ve shadcn/ui kullanan yönetim paneli.

## API Dokümantasyonu

API kullanım detayları Scalar üzerinde yayınlanmıştır:

https://registry.scalar.com/@seyfooksck/apis/mini-muhasebe-api@latest#tag/durum

Ayrıca OpenAPI dosyası proje içinde bulunur:

```text
backend-nodejs/openapi.json
```

Bu dosya Scalar, Swagger UI veya benzeri OpenAPI araçlarına yüklenerek endpointler, örnek istekler ve örnek cevaplar görüntülenebilir.

## Genel Özellikler

- Cari listeleme, ekleme, düzenleme, detay görüntüleme ve silme.
- Cari e-posta format kontrolü.
- Cari e-posta domain kontrolü: e-postanın `@` sonrasındaki domaini Google DNS üzerinden A kaydıyla kontrol edilir.
- Stok listeleme, ekleme, düzenleme, detay görüntüleme ve silme.
- Satış/fatura oluşturma.
- Fatura oluşturulduğunda stok miktarının transaction içinde düşürülmesi.
- Yetersiz stok varsa satışın engellenmesi.
- Satış faturalarını listeleme.
- Dashboard özetleri.
- Satış verileri üzerinden çalışan kural tabanlı ChatBot.
- Rate limit koruması.
- İsteğe bağlı SSH tunnel ile MySQL bağlantısı.

## Proje Yapısı

```text
CaseStudy
├── backend-nodejs
│   ├── openapi.json
│   ├── src
│   │   ├── config
│   │   │   ├── bilsoft.js
│   │   │   ├── sshTunnel.js
│   │   │   └── veritabani.js
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   ├── utils
│   │   ├── seed.js
│   │   └── server.js
│   └── package.json
├── frontend
│   ├── src
│   │   ├── app
│   │   ├── components
│   │   ├── features
│   │   ├── lib
│   │   └── types
│   └── package.json
├── proje.md
└── Readme.md
```

## Backend Yapısı

Backend tarafı modüler controller ve route yapısıyla hazırlanmıştır.

### Kullanılan Teknolojiler

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- mysql2
- express-rate-limit
- helmet
- cors
- ssh2

### Önemli Klasörler

- `src/config`: MySQL, SSH tunnel ve veritabanı bağlantı ayarları.
- `src/controllers`: İş mantığını yöneten controller dosyaları.
- `src/models`: Sequelize modelleri.
- `src/routes`: API endpoint route dosyaları.
- `src/middlewares`: Hata yakalama, async handler ve rate limit middleware dosyaları.
- `src/utils`: Yardımcı servisler. Örneğin e-posta domain DNS kontrolü.

### Backend Endpointleri

Temel endpointler:

- `GET /api/durum`
- `GET /api/durum/veritabani`
- `GET /api/durum/ozet`
- `GET /api/cari`
- `POST /api/cari`
- `GET /api/cari/:id`
- `PUT /api/cari/:id`
- `DELETE /api/cari/:id`
- `GET /api/stok`
- `POST /api/stok`
- `GET /api/stok/:id`
- `PUT /api/stok/:id`
- `DELETE /api/stok/:id`
- `GET /api/fatura`
- `POST /api/fatura`
- `GET /api/fatura/:id`
- `POST /api/chatbot/sor`

Detaylı kullanım için Scalar dokümanını kullanın:

https://registry.scalar.com/@seyfooksck/apis/mini-muhasebe-api@latest#tag/durum

## Frontend Yapısı

Frontend tarafı Next.js App Router yapısıyla hazırlanmıştır. Arayüz tamamen Türkçe olacak şekilde düzenlenmiştir.

### Kullanılan Teknolojiler

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react

### Frontend Modülleri

- `Dashboard`: Toplam cari sayısı, toplam stok sayısı ve bugünkü satış toplamını gösterir.
- `Cari Yönetimi`: Cari ekleme, listeleme, arama, düzenleme ve silme işlemleri.
- `Stok Yönetimi`: Stok ekleme, listeleme, arama, düzenleme ve silme işlemleri.
- `Satış / Fatura`: Cari seçerek stoklardan satış faturası oluşturma ekranı.
- `Fatura Listesi`: Oluşturulan faturaları listeleme ekranı.
- `ChatBot`: Satış verileri üzerinden doğal dile yakın sorular sorma ekranı.

### Önemli Frontend Klasörleri

- `src/app`: Next.js sayfa route yapısı.
- `src/components/layout`: Sidebar ve mobil menü bileşenleri.
- `src/components/ui`: shadcn/ui bileşenleri.
- `src/components/shared`: Ortak kullanılan yardımcı bileşenler.
- `src/features`: Modül bazlı ekran bileşenleri.
- `src/lib`: API istemcisi ve format yardımcıları.
- `src/types`: API tipleri.

## Kurulum

### Gereksinimler

- Node.js
- npm
- MySQL

## Backend Kurulumu

Backend klasörüne girin:

```bash
cd backend-nodejs
```

Bağımlılıkları kurun:

```bash
npm install
```

MySQL bağlantı ayarlarını düzenleyin:

```text
backend-nodejs/src/config/bilsoft.js
```

Örnek MySQL ayarı:

```js
mysql: {
  host: "localhost",
  port: 3306,
  database: "tester",
  username: "tester",
  password: ""
}
```

Veritabanını oluşturun:

```sql
CREATE DATABASE tester CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;
```

SSH tunnel kullanılacaksa `bilsoft.js` içinde `ssh.aktif` değeri `true` yapılabilir:

```js
ssh: {
  aktif: true,
  host: "sunucu_ip_adresi",
  port: 22,
  username: "root",
  password: "ssh_sifresi",
  privateKeyPath: "",
  localHost: "127.0.0.1",
  localPort: 3307
}
```

Backend'i geliştirme modunda çalıştırın:

```bash
npm run dev
```

Backend varsayılan olarak şu adreste çalışır:

```text
http://localhost:5000
```

Veritabanı bağlantısını kontrol etmek için:

```text
http://localhost:5000/api/durum/veritabani
```

## Test Verisi Yükleme

Test amaçlı ürün/stok verileri için:

```bash
cd backend-nodejs
npm run seed
```

Seed verileri şu dosyadan düzenlenebilir:

```text
backend-nodejs/src/seed.js
```

## Frontend Kurulumu

Frontend klasörüne girin:

```bash
cd frontend
```

Bağımlılıkları kurun:

```bash
npm install
```

API adresi gerekiyorsa `.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Frontend'i geliştirme modunda çalıştırın:

```bash
npm run dev
```

Frontend varsayılan olarak şu adreste çalışır:

```text
http://localhost:3000
```

## Kullanım Akışı

1. Backend'i çalıştırın.
2. Frontend'i çalıştırın.
3. Cari Yönetimi ekranından yeni cari ekleyin.
4. Stok Yönetimi ekranından yeni stok ekleyin.
5. Satış / Fatura ekranından cari seçip stok kalemleriyle satış oluşturun.
6. Fatura kaydedildiğinde stok miktarı otomatik düşer.
7. Fatura Listesi ekranından satışları görüntüleyin.
8. ChatBot ekranından satış verilerine göre sorular sorun.

## ChatBot Örnek Soruları

- En çok satılan ürünüm hangisi?
- En fazla ciro yaptığım cari hangisi?
- Bugünkü satış toplamım ne kadar?
- Bu ay toplam kaç satış yaptım?
- En az stoğu kalan ürünler hangileri?
- Hangi üründen kaç adet sattım?

## Kontrol Komutları

Frontend lint kontrolü:

```bash
cd frontend
npm run lint
```

Frontend production build:

```bash
cd frontend
npm run build
```

Backend çalıştırma:

```bash
cd backend-nodejs
npm start
```

## Notlar

- `bilsoft.js` içinde gerçek veritabanı veya SSH şifresi tutulacaksa bu dosyanın public repository'ye gönderilmemesine dikkat edilmelidir.
- GitHub paylaşımı için hassas bilgiler `.env` yapısına taşınabilir.
- API dokümantasyonunun güncel hali `backend-nodejs/openapi.json` dosyasında tutulur.
