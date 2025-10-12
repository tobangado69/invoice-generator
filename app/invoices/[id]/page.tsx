"use client";

/**
 * Invoice Detail Page
 * Displays single invoice with preview and actions
 * Fully localized
 */

import { useParams } from "next/navigation";
import { useInvoice } from "@/hooks/use-invoices";
import { InvoicePreview } from "@/components/invoice-preview";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, error } = useInvoice(parseInt(params.id));

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Card className="p-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full mt-6" />
        </Card>
      </div>
    );
  }

  if (error || !data?.success || !data.data) {
    return (
      <div className="space-y-4">
        <Link href="/invoices">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("nav.back")}
          </Button>
        </Link>
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("error.notFound")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link href="/invoices">
        <Button variant="ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("nav.backToList")}
        </Button>
      </Link>
      <InvoicePreview invoice={data.data} />
    </div>
  );
}
