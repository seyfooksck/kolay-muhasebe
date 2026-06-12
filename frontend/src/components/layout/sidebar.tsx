"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  FileText,
  Home,
  Package,
  ReceiptText,
  Users
} from "lucide-react";

import { cn } from "@/lib/utils";

const menu = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/cari", label: "Cari Yönetimi", icon: Users },
  { href: "/stok", label: "Stok Yönetimi", icon: Package },
  { href: "/fatura", label: "Satış / Fatura", icon: ReceiptText },
  { href: "/faturalar", label: "Fatura Listesi", icon: FileText },
  { href: "/chatbot", label: "ChatBot", icon: Bot }
];

function aktifMi(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 border-r bg-background px-4 py-6 lg:block">
      <div className="mb-8 flex items-center gap-3 rounded-2xl border bg-card p-3 shadow-sm">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <ReceiptText className="size-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Mini Muhasebe</p>
          <h1 className="font-semibold tracking-tight">Bilsoft Panel</h1>
        </div>
      </div>

      <nav className="space-y-1">
        {menu.map((item) => {
          const aktif = aktifMi(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                aktif &&
                  "border-border bg-muted text-foreground shadow-sm hover:bg-muted"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
