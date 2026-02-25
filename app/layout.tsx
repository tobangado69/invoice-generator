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
  title: "InvoiceFlow - Professional Invoice Generator",
  description:
    "Generate professional invoices with VAT, tax ID, and automatic amount-in-words. Perfect for freelancers and businesses.",
  generator: "InvoiceFlow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <SessionProvider>
          <QueryProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <SiteHeader />
              {children}
              <Analytics />
            </Suspense>
            <Toaster />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
