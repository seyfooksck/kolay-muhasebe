"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

const menu = [
  { href: "/", label: "Dashboard" },
  { href: "/cari", label: "Cari Yönetimi" },
  { href: "/stok", label: "Stok Yönetimi" },
  { href: "/fatura", label: "Satış / Fatura" },
  { href: "/faturalar", label: "Fatura Listesi" },
  { href: "/chatbot", label: "ChatBot" }
];

function aktifMi(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileMenu() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="icon" />}>
        <Menu className="size-4" />
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetTitle>Mini Muhasebe</SheetTitle>
        <nav className="mt-6 grid gap-2">
          {menu.map((item) => {
            const aktif = aktifMi(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  aktif
                    ? "rounded-lg border bg-muted px-3 py-2 text-sm font-medium"
                    : "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
