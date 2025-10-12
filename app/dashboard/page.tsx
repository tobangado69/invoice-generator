"use client";

/**
 * Dashboard Page
 * Overview of invoices with stats in IDR format
 */

import { useInvoices } from "@/hooks/use-invoices";
import { useCompany } from "@/hooks/use-company";
import { InvoiceTable } from "@/components/invoice-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIDR } from "@/lib/indonesian-utils";
import { useMemo } from "react";

export default function DashboardPage() {
  const { data: invoicesData, isLoading } = useInvoices({ limit: 100 });
  const { data: companyData } = useCompany();

  const stats = useMemo(() => {
    if (!invoicesData?.success) {
      return {
        totalInvoices: 0,
        pendingAmount: 0,
        paidAmount: 0,
        totalAmount: 0,
        ppnCollected: 0,
      };
    }

    const invoices = invoicesData.data;
    const totalInvoices = invoices.length;
    const pendingAmount = invoices
      .filter((i) => i.status !== "paid")
      .reduce((sum, i) => sum + i.totalAmount, 0);
    const paidAmount = invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.totalAmount, 0);
    const totalAmount = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const ppnCollected = invoices.reduce((sum, i) => sum + i.ppnAmount, 0);

    return {
      totalInvoices,
      pendingAmount,
      paidAmount,
      totalAmount,
      ppnCollected,
    };
  }, [invoicesData]);

  const companyName =
    companyData?.success && companyData.data
      ? companyData.data.name
      : "Selamat datang";

  return (
    <div className="space-y-6">
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-balance">
            Selamat datang, {companyName}
          </h1>
          <p className="text-muted-foreground">
            Kelola invoice dan keuangan bisnis Anda
          </p>
        </div>
        <Link href="/invoices/new">
          <Button className="bg-primary text-primary-foreground whitespace-nowrap">
            Buat Invoice
          </Button>
        </Link>
      </section>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Total Invoice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {stats.totalInvoices}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalInvoices === 0
                  ? "Semua"
                  : `${stats.totalInvoices} invoice`}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Belum Dibayar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {formatIDR(stats.pendingAmount)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Sudah Dibayar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {formatIDR(stats.paidAmount)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                PPN Terkumpul
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {formatIDR(stats.ppnCollected)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Invoice Terbaru</h2>
        <InvoiceTable limit={5} />
      </section>
    </div>
  );
}
