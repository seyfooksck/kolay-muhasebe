"use client";

import { useEffect, useState } from "react";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { apiIstegi } from "@/lib/api";
import { paraFormatla, tarihFormatla } from "@/lib/format";
import type { Fatura } from "@/types/api";

export function FaturaListesi() {
  const [faturalar, setFaturalar] = useState<Fatura[]>([]);
  const [hata, setHata] = useState("");

  useEffect(() => {
    apiIstegi<Fatura[]>("/fatura")
      .then(setFaturalar)
      .catch((error) => setHata(error.message));
  }, []);

  return (
    <>
      <PageHeader
        baslik="Fatura Listesi"
        aciklama="Kaydedilen satış faturalarını ve toplamlarını görüntüleyin."
      />

      <Card>
        <CardHeader>
          <CardTitle>Satışlar</CardTitle>
          {hata && <p className="text-sm text-muted-foreground">{hata}</p>}
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fatura No</TableHead>
                <TableHead>Cari</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Ara Toplam</TableHead>
                <TableHead>KDV</TableHead>
                <TableHead>Genel Toplam</TableHead>
                <TableHead>Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faturalar.map((fatura) => (
                <TableRow key={fatura.id}>
                  <TableCell>#{fatura.id}</TableCell>
                  <TableCell>{fatura.cari?.cari_adi || "-"}</TableCell>
                  <TableCell>{tarihFormatla(fatura.fatura_tarihi)}</TableCell>
                  <TableCell>{paraFormatla(fatura.ara_toplam)}</TableCell>
                  <TableCell>{paraFormatla(fatura.kdv_toplam)}</TableCell>
                  <TableCell>{paraFormatla(fatura.genel_toplam)}</TableCell>
                  <TableCell>
                    <Badge>Kaydedildi</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
