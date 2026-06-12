"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, Send } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { apiIstegi } from "@/lib/api";
import type { ChatbotCevabi } from "@/types/api";

const ornekSorular = [
  "En çok satılan ürünüm hangisi?",
  "En fazla ciro yaptığım cari hangisi?",
  "Bugünkü satış toplamım ne kadar?",
  "Bu ay toplam kaç satış yaptım?",
  "En az stoğu kalan ürünler hangileri?",
  "Hangi üründen kaç adet sattım?"
];

type Mesaj = {
  rol: "kullanici" | "bot";
  metin: string;
};

export function ChatbotSayfasi() {
  const [soru, setSoru] = useState("");
  const [mesajlar, setMesajlar] = useState<Mesaj[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const mesajSonuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    mesajSonuRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [mesajlar]);

  const sor = async (event?: FormEvent<HTMLFormElement>, hazirSoru = soru) => {
    event?.preventDefault();

    if (!hazirSoru.trim() || yukleniyor) {
      return;
    }

    setYukleniyor(true);
    setMesajlar((onceki) => [...onceki, { rol: "kullanici", metin: hazirSoru }]);
    setSoru("");

    try {
      const cevap = await apiIstegi<ChatbotCevabi>("/chatbot/sor", {
        method: "POST",
        body: { soru: hazirSoru }
      });

      setMesajlar((onceki) => [...onceki, { rol: "bot", metin: cevap.cevap }]);
    } catch (error) {
      setMesajlar((onceki) => [
        ...onceki,
        {
          rol: "bot",
          metin: error instanceof Error ? error.message : "Cevap alinamadi."
        }
      ]);
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <>
      <PageHeader
        baslik="ChatBot"
        aciklama="Satış verileriniz üzerinden doğal dile yakın sorular sorun."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="min-h-[620px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="size-5" />
              Sohbet
            </CardTitle>
          </CardHeader>
          <CardContent className="flex min-h-[520px] flex-col gap-4">
            <div className="max-h-[460px] min-h-[420px] flex-1 space-y-3 overflow-y-auto rounded-xl border bg-muted/30 p-4 pr-3">
              {mesajlar.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Henüz mesaj yok. Sağdaki örneklerden birini seçebilir veya kendi sorunuzu yazabilirsiniz.
                </p>
              )}
              {mesajlar.map((mesaj, index) => (
                <div
                  key={`${mesaj.rol}-${index}`}
                  className={
                    mesaj.rol === "kullanici"
                      ? "ml-auto max-w-[80%] rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground"
                      : "max-w-[80%] rounded-xl bg-background px-4 py-2 text-sm shadow-sm"
                  }
                >
                  {mesaj.metin}
                </div>
              ))}
              {yukleniyor && (
                <div className="max-w-[80%] rounded-xl bg-background px-4 py-2 text-sm text-muted-foreground shadow-sm">
                  Cevap hazırlanıyor...
                </div>
              )}
              <div ref={mesajSonuRef} />
            </div>

            <form className="flex gap-2" onSubmit={(event) => sor(event)}>
              <Textarea
                placeholder="Sorunuzu yazın..."
                value={soru}
                onChange={(event) => setSoru(event.target.value)}
                className="min-h-12"
              />
              <Button type="submit" disabled={yukleniyor}>
                <Send className="size-4" />
                Sor
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Örnek Sorular</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {ornekSorular.map((ornek) => (
              <Button
                key={ornek}
                variant="outline"
                className="h-auto justify-start whitespace-normal py-3 text-left"
                disabled={yukleniyor}
                onClick={() => sor(undefined, ornek)}
              >
                {ornek}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
