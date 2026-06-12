const bilsoft = {
  sunucu: {
    port: 5000,
    ortam: "development"
  },
  mysql: {
    host: "localhost",
    port: 3306,
    database: "tester",
    username: "tester",
    password: ""
  },
  ssh: {
    aktif: true,
    host: "",
    port: 22,
    username: "root",
    password: "",
    privateKeyPath: "",
    localHost: "127.0.0.1",
    localPort: 3307
  },
  rateLimit: {
    pencereDakika: 15,
    maksimumIstek: 100
  }
};

module.exports = bilsoft;
