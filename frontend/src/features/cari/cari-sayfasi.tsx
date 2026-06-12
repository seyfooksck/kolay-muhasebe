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
import { Textarea } from "@/components/ui/textarea";
import { apiIstegi } from "@/lib/api";
import type { Cari } from "@/types/api";

const bosForm = {
  cari_kodu: "",
  cari_adi: "",
  vergi_no_tckn: "",
  telefon: "",
  e_posta: "",
  adres: ""
};

export function CariSayfasi() {
  const [cariler, setCariler] = useState<Cari[]>([]);
  const [form, setForm] = useState(bosForm);
  const [duzenlenenId, setDuzenlenenId] = useState<number | null>(null);
  const [arama, setArama] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);

  const filtreliCariler = useMemo(() => {
    const terim = arama.toLocaleLowerCase("tr-TR");

    return cariler.filter((cari) =>
      [cari.cari_kodu, cari.cari_adi, cari.vergi_no_tckn, cari.e_posta]
        .filter(Boolean)
        .some((deger) => String(deger).toLocaleLowerCase("tr-TR").includes(terim))
    );
  }, [arama, cariler]);

  const carileriGetir = async () => {
    try {
      setCariler(await apiIstegi<Cari[]>("/cari"));
    } catch (error) {
      setMesaj(error instanceof Error ? error.message : "Cariler getirilemedi.");
    }
  };

  useEffect(() => {
    const yukle = async () => {
      await carileriGetir();
    };

    yukle();
  }, []);

  const kaydet = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setYukleniyor(true);
    setMesaj("");

    try {
      await apiIstegi<Cari>(duzenlenenId ? `/cari/${duzenlenenId}` : "/cari", {
        method: duzenlenenId ? "PUT" : "POST",
        body: form
      });

      setForm(bosForm);
      setDuzenlenenId(null);
      setMesaj("Cari kaydi basariyla kaydedildi.");
      await carileriGetir();
    } catch (error) {
      setMesaj(error instanceof Error ? error.message : "Kayit tamamlanamadi.");
    } finally {
      setYukleniyor(false);
    }
  };

  const duzenle = (cari: Cari) => {
    setDuzenlenenId(cari.id);
    setForm({
      cari_kodu: cari.cari_kodu,
      cari_adi: cari.cari_adi,
      vergi_no_tckn: cari.vergi_no_tckn || "",
      telefon: cari.telefon || "",
      e_posta: cari.e_posta || "",
      adres: cari.adres || ""
    });
  };

  const sil = async (id: number) => {
    if (!confirm("Cari kaydi silinsin mi?")) {
      return;
    }

    await apiIstegi(`/cari/${id}`, { method: "DELETE" });
    await carileriGetir();
  };

  return (
    <>
      <PageHeader
        baslik="Cari Yönetimi"
        aciklama="Müşteri ve tedarikçi cari kartlarını yönetin."
      />

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{duzenlenenId ? "Cari Düzenle" : "Yeni Cari"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={kaydet}>
              <div className="grid gap-2">
                <Label htmlFor="cari_kodu">Cari Kodu</Label>
                <Input
                  id="cari_kodu"
                  required
                  disabled={Boolean(duzenlenenId)}
                  value={form.cari_kodu}
                  onChange={(e) => setForm({ ...form, cari_kodu: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cari_adi">Cari Adı</Label>
                <Input
                  id="cari_adi"
                  required
                  value={form.cari_adi}
                  onChange={(e) => setForm({ ...form, cari_adi: e.target.value })}
                />
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="vergi_no_tckn">Vergi No / TCKN</Label>
                  <Input
                    id="vergi_no_tckn"
                    value={form.vergi_no_tckn}
                    onChange={(e) => setForm({ ...form, vergi_no_tckn: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telefon">Telefon</Label>
                  <Input
                    id="telefon"
                    value={form.telefon}
                    onChange={(e) => setForm({ ...form, telefon: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="e_posta">E-posta</Label>
                <Input
                  id="e_posta"
                  type="email"
                  value={form.e_posta}
                  onChange={(e) => setForm({ ...form, e_posta: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Kaydetme sırasında e-postanın @ sonrasındaki domain için DNS A kaydı kontrol edilir.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="adres">Adres</Label>
                <Textarea
                  id="adres"
                  value={form.adres}
                  onChange={(e) => setForm({ ...form, adres: e.target.value })}
                />
              </div>
              {mesaj && <p className="text-sm text-muted-foreground">{mesaj}</p>}
              <div className="flex gap-2">
                <Button type="submit" disabled={yukleniyor}>
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
            <CardTitle>Cari Listesi</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari kodu, adı, vergi no veya e-posta ara"
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
                  <TableHead>Ad</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>E-posta</TableHead>
                  <TableHead className="text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtreliCariler.map((cari) => (
                  <TableRow key={cari.id}>
                    <TableCell>{cari.cari_kodu}</TableCell>
                    <TableCell>{cari.cari_adi}</TableCell>
                    <TableCell>{cari.telefon || "-"}</TableCell>
                    <TableCell>{cari.e_posta || "-"}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button variant="outline" size="icon-sm" onClick={() => duzenle(cari)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="destructive" size="icon-sm" onClick={() => sil(cari.id)}>
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
