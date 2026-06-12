"use client";

import { useEffect, useState } from "react";
import { Bot, Package, ReceiptText, Users } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiIstegi } from "@/lib/api";
import { paraFormatla } from "@/lib/format";
import type { DashboardOzeti } from "@/types/api";

type DashboardKarti = {
  baslik: string;
  alan: keyof DashboardOzeti;
  icon: typeof Users;
  para?: boolean;
};

const kartlar: DashboardKarti[] = [
  {
    baslik: "Toplam Cari",
    alan: "toplam_cari_sayisi",
    icon: Users
  },
  {
    baslik: "Toplam Stok",
    alan: "toplam_stok_sayisi",
    icon: Package
  },
  {
    baslik: "Bugünkü Satış",
    alan: "bugunku_satis_toplami",
    icon: ReceiptText,
    para: true
  }
] as const;

export function Dashboard() {
  const [ozet, setOzet] = useState<DashboardOzeti | null>(null);
  const [hata, setHata] = useState("");

  useEffect(() => {
    apiIstegi<DashboardOzeti>("/durum/ozet")
      .then(setOzet)
      .catch((error) => setHata(error.message));
  }, []);

  return (
    <>
      <PageHeader
        baslik="Dashboard"
        aciklama="Cari, stok ve satış özetlerini tek ekrandan takip edin."
      />

      {hata && (
        <Alert className="mb-6">
          <AlertTitle>Backend bağlantısı kurulamadı</AlertTitle>
          <AlertDescription>{hata}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {kartlar.map((kart) => {
          const Icon = kart.icon;
          const deger = ozet?.[kart.alan] ?? 0;

          return (
            <Card key={kart.baslik}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kart.baslik}
                </CardTitle>
                <Icon className="size-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">
                  {kart.para ? paraFormatla(deger) : deger}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="size-5" />
            Hızlı Kullanım
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
          <p>Önce cari ve stok kayıtlarını oluşturun.</p>
          <p>Satış / Fatura ekranında cari seçip ürünleri sepete ekleyin.</p>
          <p>Fatura kaydedildiğinde backend stok miktarını otomatik düşürür.</p>
          <p>ChatBot ekranında satış verileri üzerinden Türkçe sorular sorun.</p>
        </CardContent>
      </Card>
    </>
  );
}
