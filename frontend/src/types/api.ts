export type ApiResponse<T> = {
  basarili: boolean;
  veri?: T;
  mesaj?: string;
};

export type Cari = {
  id: number;
  cari_kodu: string;
  cari_adi: string;
  vergi_no_tckn?: string | null;
  telefon?: string | null;
  e_posta?: string | null;
  adres?: string | null;
};

export type Stok = {
  id: number;
  stok_kodu: string;
  urun_adi: string;
  birim: string;
  birim_fiyat: string | number;
  kdv_orani: string | number;
  mevcut_stok_miktari: number;
};

export type FaturaKalemi = {
  id?: number;
  stok_id: number;
  miktar: number;
  birim_fiyat: string | number;
  kdv_orani: string | number;
  satir_toplam?: string | number;
  stok?: Stok;
};

export type Fatura = {
  id: number;
  cari_id: number;
  fatura_tarihi: string;
  ara_toplam: string | number;
  kdv_toplam: string | number;
  genel_toplam: string | number;
  cari?: Cari;
  kalemler?: FaturaKalemi[];
};

export type DashboardOzeti = {
  toplam_cari_sayisi: number;
  toplam_stok_sayisi: number;
  bugunku_satis_toplami: string | number;
};

export type ChatbotCevabi = {
  soru: string;
  cevap: string;
};
