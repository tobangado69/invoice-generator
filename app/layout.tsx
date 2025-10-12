import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { Suspense } from "react";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/providers/session-provider";

export const metadata: Metadata = {
  title: "InvoiceFlow - Invoice Generator for Indonesian Businesses",
  description:
    "Generate professional invoices with PPN, NPWP, and terbilang for Indonesian UMKM and freelancers",
  generator: "InvoiceFlow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <SessionProvider>
          <QueryProvider>
            <Suspense fallback={<div>Memuat...</div>}>
              <SiteHeader />
              <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
                {children}
              </main>
              <Analytics />
            </Suspense>
            <Toaster />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
