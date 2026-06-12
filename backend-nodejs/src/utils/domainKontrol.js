const AppError = require("./AppError");

const domainKontrolEt = async (domain) => {
  const temizDomain = domainTemizle(domain);

  if (!temizDomain) {
    return "";
  }

  const response = await fetch(
    `https://dns.google/resolve?name=${encodeURIComponent(temizDomain)}&type=A`
  );

  if (!response.ok) {
    throw new AppError("Domain kontrol servisine ulasilamadi.", 502);
  }

  const sonuc = await response.json();

  if (sonuc.Status !== 0) {
    throw new AppError(`${temizDomain} icin DNS A kaydi bulunamadi.`);
  }

  return temizDomain;
};

const epostaDomainKontrolEt = async (eposta) => {
  if (!eposta) {
    return "";
  }

  const domain = String(eposta).split("@")[1];

  if (!domain) {
    throw new AppError("E-posta domain bilgisi bulunamadi.");
  }

  return domainKontrolEt(domain);
};

const domainTemizle = (domain) => {
  if (!domain) {
    return "";
  }

  return String(domain)
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split("?")[0]
    .replace(/\.$/, "");
};

module.exports = {
  domainKontrolEt,
  epostaDomainKontrolEt,
  domainTemizle
};
