import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { MobileMenu } from "@/components/layout/mobile-menu";
import { Sidebar } from "@/components/layout/sidebar";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mini Muhasebe",
  description: "Cari, stok, fatura ve chatbot yönetim paneli",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-muted/30 text-foreground antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur lg:hidden">
              <MobileMenu />
              <div>
                <p className="text-sm text-muted-foreground">Mini Muhasebe</p>
                <p className="font-semibold">Yönetim Paneli</p>
              </div>
            </header>
            <main className="flex-1 p-4 md:p-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
