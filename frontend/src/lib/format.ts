export function paraFormatla(deger: string | number | null | undefined) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY"
  }).format(Number(deger || 0));
}

export function tarihFormatla(deger: string | Date | null | undefined) {
  if (!deger) {
    return "-";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium"
  }).format(new Date(deger));
}
