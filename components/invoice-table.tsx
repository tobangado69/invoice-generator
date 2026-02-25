"use client";

/**
 * Invoice Table Component
 * Displays invoices from database with IDR formatting, filters, and search
 * Fully localized for Indonesian and English
 */

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useInvoices } from "@/hooks/use-invoices";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { formatIDR } from "@/lib/indonesian-utils";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const statusLabels: Record<string, string> = {
  paid: "Paid",
  sent: "Sent",
  overdue: "Overdue",
  draft: "Draft",
};

function StatusBadge({ status }: { status: string }) {
  const styles = {
    paid: "bg-green-100 text-green-700 dark:bg-green-400/20 dark:text-green-300",
    sent: "bg-blue-100 text-blue-700 dark:bg-blue-400/20 dark:text-blue-300",
    overdue: "bg-red-100 text-red-700 dark:bg-red-400/20 dark:text-red-300",
    draft: "bg-gray-100 text-gray-700 dark:bg-gray-400/20 dark:text-gray-300",
  };

  return (
    <Badge
      className={cn(
        "capitalize",
        styles[status as keyof typeof styles] || styles.draft
      )}
    >
      {statusLabels[status] || status}
    </Badge>
  );
}

export function InvoiceTable({ limit }: { limit?: number }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const dateLocale = idLocale;

  // Fetch invoices from database
  const { data, isLoading } = useInvoices({
    status: statusFilter !== "all" ? statusFilter : undefined,
    limit: limit || 50,
  });

  // Client-side search filtering
  const filteredInvoices = useMemo(() => {
    if (!data?.success) return [];

    let invoices = data.data;

    if (query) {
      const q = query.toLowerCase();
      invoices = invoices.filter(
        (invoice) =>
          invoice.invoiceNumber.toLowerCase().includes(q) ||
          invoice.clientName.toLowerCase().includes(q) ||
          (invoice.clientEmail && invoice.clientEmail.toLowerCase().includes(q))
      );
    }

    return invoices;
  }, [data, query]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base">Invoice</CardTitle>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search invoices..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredInvoices.length === 0 ? (
          <div className="h-32 grid place-items-center text-muted-foreground">
            {query || statusFilter !== "all"
              ? "No results"
              : "No invoices yet"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground text-left">
                <tr>
                  <th className="py-2 pr-4">Number</th>
                  <th className="py-2 pr-4">Client</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Due Date</th>
                  <th className="py-2 pr-4 text-right">Total</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-0 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-t hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="py-3 pr-4 font-medium">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="text-foreground">
                        {invoice.clientName}
                      </div>
                      {invoice.clientEmail && (
                        <div className="text-muted-foreground text-xs">
                          {invoice.clientEmail}
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      {format(new Date(invoice.issueDate), "dd MMM yyyy", {
                        locale: dateLocale,
                      })}
                    </td>
                    <td className="py-3 pr-4">
                      {format(new Date(invoice.dueDate), "dd MMM yyyy", {
                        locale: dateLocale,
                      })}
                    </td>
                    <td className="py-3 pr-4 text-right font-medium">
                      {formatIDR(invoice.totalAmount)}
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="py-3 pr-0 text-right">
                      <Link href={`/invoices/${invoice.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
