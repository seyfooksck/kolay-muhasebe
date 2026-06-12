"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";

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
import type { Stok } from "@/types/api";

const bosForm = {
  stok_kodu: "",
  urun_adi: "",
  birim: "Adet",
  birim_fiyat: 0,
  kdv_orani: 20,
  mevcut_stok_miktari: 0
};

export function StokSayfasi() {
  const [stoklar, setStoklar] = useState<Stok[]>([]);
  const [form, setForm] = useState(bosForm);
  const [duzenlenenId, setDuzenlenenId] = useState<number | null>(null);
  const [arama, setArama] = useState("");
  const [mesaj, setMesaj] = useState("");

  const filtreliStoklar = useMemo(() => {
    const terim = arama.toLocaleLowerCase("tr-TR");

    return stoklar.filter((stok) =>
      [stok.stok_kodu, stok.urun_adi]
        .filter(Boolean)
        .some((deger) => String(deger).toLocaleLowerCase("tr-TR").includes(terim))
    );
  }, [arama, stoklar]);

  const stoklariGetir = async () => {
    try {
      setStoklar(await apiIstegi<Stok[]>("/stok"));
    } catch (error) {
      setMesaj(error instanceof Error ? error.message : "Stoklar getirilemedi.");
    }
  };

  useEffect(() => {
    const yukle = async () => {
      await stoklariGetir();
    };

    yukle();
  }, []);

  const kaydet = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMesaj("");

    try {
      await apiIstegi<Stok>(duzenlenenId ? `/stok/${duzenlenenId}` : "/stok", {
        method: duzenlenenId ? "PUT" : "POST",
        body: form
      });

      setForm(bosForm);
      setDuzenlenenId(null);
      setMesaj("Stok kaydi basariyla kaydedildi.");
      await stoklariGetir();
    } catch (error) {
      setMesaj(error instanceof Error ? error.message : "Kayit tamamlanamadi.");
    }
  };

  const duzenle = (stok: Stok) => {
    setDuzenlenenId(stok.id);
    setForm({
      stok_kodu: stok.stok_kodu,
      urun_adi: stok.urun_adi,
      birim: stok.birim,
      birim_fiyat: Number(stok.birim_fiyat),
      kdv_orani: Number(stok.kdv_orani),
      mevcut_stok_miktari: Number(stok.mevcut_stok_miktari)
    });
  };

  const sil = async (id: number) => {
    if (!confirm("Stok kaydi silinsin mi?")) {
      return;
    }

    await apiIstegi(`/stok/${id}`, { method: "DELETE" });
    await stoklariGetir();
  };

  return (
    <>
      <PageHeader
        baslik="Stok Yönetimi"
        aciklama="Ürün kartlarını, fiyatları ve mevcut stok miktarlarını yönetin."
      />

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{duzenlenenId ? "Stok Düzenle" : "Yeni Stok"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={kaydet}>
              <div className="grid gap-2">
                <Label htmlFor="stok_kodu">Stok Kodu</Label>
                <Input
                  id="stok_kodu"
                  required
                  disabled={Boolean(duzenlenenId)}
                  value={form.stok_kodu}
                  onChange={(e) => setForm({ ...form, stok_kodu: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="urun_adi">Ürün Adı</Label>
                <Input
                  id="urun_adi"
                  required
                  value={form.urun_adi}
                  onChange={(e) => setForm({ ...form, urun_adi: e.target.value })}
                />
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="birim">Birim</Label>
                  <Input
                    id="birim"
                    value={form.birim}
                    onChange={(e) => setForm({ ...form, birim: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mevcut_stok_miktari">Mevcut Stok</Label>
                  <Input
                    id="mevcut_stok_miktari"
                    type="number"
                    min={0}
                    step={1}
                    value={form.mevcut_stok_miktari}
                    onChange={(e) =>
                      setForm({ ...form, mevcut_stok_miktari: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="birim_fiyat">Birim Fiyat</Label>
                  <Input
                    id="birim_fiyat"
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.birim_fiyat}
                    onChange={(e) => setForm({ ...form, birim_fiyat: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="kdv_orani">KDV Oranı</Label>
                  <Input
                    id="kdv_orani"
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.kdv_orani}
                    onChange={(e) => setForm({ ...form, kdv_orani: Number(e.target.value) })}
                  />
                </div>
              </div>
              {mesaj && <p className="text-sm text-muted-foreground">{mesaj}</p>}
              <div className="flex gap-2">
                <Button type="submit">
                  <Plus className="size-4" />
                  Kaydet
                </Button>
                {duzenlenenId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDuzenlenenId(null);
                      setForm(bosForm);
                    }}
                  >
                    <X className="size-4" />
                    Vazgeç
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stok Listesi</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Stok kodu veya ürün adı ara"
                className="pl-9"
                value={arama}
                onChange={(e) => setArama(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kod</TableHead>
                  <TableHead>Ürün</TableHead>
                  <TableHead>Birim</TableHead>
                  <TableHead>Fiyat</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead className="text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtreliStoklar.map((stok) => (
                  <TableRow key={stok.id}>
                    <TableCell>{stok.stok_kodu}</TableCell>
                    <TableCell>{stok.urun_adi}</TableCell>
                    <TableCell>{stok.birim}</TableCell>
                    <TableCell>{paraFormatla(stok.birim_fiyat)}</TableCell>
                    <TableCell>{stok.mevcut_stok_miktari}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button variant="outline" size="icon-sm" onClick={() => duzenle(stok)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="destructive" size="icon-sm" onClick={() => sil(stok.id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
