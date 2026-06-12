"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { apiIstegi } from "@/lib/api";
import { paraFormatla } from "@/lib/format";
import type { Cari, Fatura, Stok } from "@/types/api";

type SepetKalemi = {
  stok_id: number;
  urun_adi: string;
  miktar: number;
  birim_fiyat: number;
  kdv_orani: number;
};

export function FaturaSayfasi() {
  const [cariler, setCariler] = useState<Cari[]>([]);
  const [stoklar, setStoklar] = useState<Stok[]>([]);
  const [cariId, setCariId] = useState("");
  const [stokId, setStokId] = useState("");
  const [miktar, setMiktar] = useState(1);
  const [sepet, setSepet] = useState<SepetKalemi[]>([]);
  const [mesaj, setMesaj] = useState("");

  useEffect(() => {
    Promise.all([apiIstegi<Cari[]>("/cari"), apiIstegi<Stok[]>("/stok")])
      .then(([cariListesi, stokListesi]) => {
        setCariler(cariListesi);
        setStoklar(stokListesi);
      })
      .catch((error) => setMesaj(error.message));
  }, []);

  const toplamlar = useMemo(() => {
    return sepet.reduce(
      (sonuc, kalem) => {
        const araToplam = kalem.miktar * kalem.birim_fiyat;
        const kdvToplam = araToplam * (kalem.kdv_orani / 100);

        return {
          araToplam: sonuc.araToplam + araToplam,
          kdvToplam: sonuc.kdvToplam + kdvToplam,
          genelToplam: sonuc.genelToplam + araToplam + kdvToplam
        };
      },
      { araToplam: 0, kdvToplam: 0, genelToplam: 0 }
    );
  }, [sepet]);

  const urunEkle = () => {
    const stok = stoklar.find((item) => item.id === Number(stokId));

    if (!stok) {
      setMesaj("Lütfen ürün seçin.");
      return;
    }

    if (miktar <= 0 || !Number.isInteger(miktar)) {
      setMesaj("Miktar tam sayi ve sifirdan buyuk olmalidir.");
      return;
    }

    if (Number(stok.mevcut_stok_miktari) < miktar) {
      setMesaj("Seçilen üründe yeterli stok yok.");
      return;
    }

    setSepet((onceki) => [
      ...onceki,
      {
        stok_id: stok.id,
        urun_adi: stok.urun_adi,
        miktar,
        birim_fiyat: Number(stok.birim_fiyat),
        kdv_orani: Number(stok.kdv_orani)
      }
    ]);
    setStokId("");
    setMiktar(1);
    setMesaj("");
  };

  const faturaKaydet = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMesaj("");

    if (!cariId) {
      setMesaj("Cari seçimi zorunludur.");
      return;
    }

    if (sepet.length === 0) {
      setMesaj("Fatura en az bir ürün içermelidir.");
      return;
    }

    try {
      await apiIstegi<Fatura>("/fatura", {
        method: "POST",
        body: {
          cari_id: Number(cariId),
          fatura_tarihi: new Date().toISOString(),
          kalemler: sepet.map((kalem) => ({
            stok_id: kalem.stok_id,
            miktar: kalem.miktar,
            birim_fiyat: kalem.birim_fiyat,
            kdv_orani: kalem.kdv_orani
          }))
        }
      });

      setSepet([]);
      setCariId("");
      setMesaj("Fatura başarıyla kaydedildi. Stok miktarları güncellendi.");
    } catch (error) {
      setMesaj(error instanceof Error ? error.message : "Fatura kaydedilemedi.");
    }
  };

  return (
    <>
      <PageHeader
        baslik="Satış / Fatura"
        aciklama="Cari seçerek stoklardan satış faturası oluşturun."
      />

      <form className="grid gap-6 xl:grid-cols-[420px_1fr]" onSubmit={faturaKaydet}>
        <Card>
          <CardHeader>
            <CardTitle>Satış Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cari">Cari</Label>
              <select
                id="cari"
                className="h-9 rounded-lg border bg-background px-3 text-sm"
                value={cariId}
                onChange={(event) => setCariId(event.target.value)}
              >
                <option value="">Cari seçin</option>
                {cariler.map((cari) => (
                  <option key={cari.id} value={cari.id}>
                    {cari.cari_adi}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stok">Ürün</Label>
              <select
                id="stok"
                className="h-9 rounded-lg border bg-background px-3 text-sm"
                value={stokId}
                onChange={(event) => setStokId(event.target.value)}
              >
                <option value="">Ürün seçin</option>
                {stoklar.map((stok) => (
                  <option key={stok.id} value={stok.id}>
                    {stok.urun_adi} - Stok: {stok.mevcut_stok_miktari}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="miktar">Miktar</Label>
              <Input
                id="miktar"
                type="number"
                min={1}
                step={1}
                value={miktar}
                onChange={(event) => setMiktar(Number(event.target.value))}
              />
            </div>
            <Button type="button" variant="outline" onClick={urunEkle}>
              <Plus className="size-4" />
              Sepete Ekle
            </Button>
            {mesaj && <p className="text-sm text-muted-foreground">{mesaj}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sepet / Satış Kalemleri</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ürün</TableHead>
                  <TableHead>Miktar</TableHead>
                  <TableHead>Birim Fiyat</TableHead>
                  <TableHead>KDV</TableHead>
                  <TableHead>Toplam</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sepet.map((kalem, index) => {
                  const toplam =
                    kalem.miktar *
                    kalem.birim_fiyat *
                    (1 + kalem.kdv_orani / 100);

                  return (
                    <TableRow key={`${kalem.stok_id}-${index}`}>
                      <TableCell>{kalem.urun_adi}</TableCell>
                      <TableCell>{kalem.miktar}</TableCell>
                      <TableCell>{paraFormatla(kalem.birim_fiyat)}</TableCell>
                      <TableCell>%{kalem.kdv_orani}</TableCell>
                      <TableCell>{paraFormatla(toplam)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon-sm"
                          onClick={() => setSepet(sepet.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <div className="ml-auto grid w-full max-w-sm gap-2 rounded-xl border bg-muted/40 p-4 text-sm">
              <div className="flex justify-between">
                <span>Ara Toplam</span>
                <strong>{paraFormatla(toplamlar.araToplam)}</strong>
              </div>
              <div className="flex justify-between">
                <span>KDV Toplamı</span>
                <strong>{paraFormatla(toplamlar.kdvToplam)}</strong>
              </div>
              <div className="flex justify-between text-lg">
                <span>Genel Toplam</span>
                <strong>{paraFormatla(toplamlar.genelToplam)}</strong>
              </div>
            </div>

            <Button type="submit" size="lg">
              Faturayı Kaydet
            </Button>
          </CardContent>
        </Card>
      </form>
    </>
  );
}
