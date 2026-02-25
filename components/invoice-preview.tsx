"use client";

/**
 * Invoice Preview Component
 * Displays invoice details with PDF download, status updates, and delete
 * Fully localized
 */

import { Card } from "@/components/ui/card";
import type { Invoice } from "@/types/invoice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useUpdateInvoice, useDeleteInvoice } from "@/hooks/use-invoices";
import { useCompany } from "@/hooks/use-company";
import { formatIDR, formatIndonesianDate } from "@/lib/indonesian-utils";
import { Download, Trash2, CheckCircle, Send, Eye } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { id as idLocale, enUS as enLocale } from "date-fns/locale";

const translations: Record<string, string> = {
  "pdf.opened": "PDF Dibuka / PDF Opened",
  "pdf.openedDescription": "PDF dibuka di tab baru / PDF opened in new tab",
  "pdf.openFailed": "Gagal membuka PDF / Failed to open PDF",
  "pdf.downloaded": "PDF Diunduh / PDF Downloaded",
  "pdf.downloadedDescription": "File PDF berhasil diunduh / PDF file downloaded successfully",
  "pdf.downloadFailed": "Gagal mengunduh PDF / Failed to download PDF",
  "common.error": "Terjadi Kesalahan / Error",
  "invoice.statusUpdated": "Status Diperbarui / Status Updated",
  "invoice.markedAsPaid": "Invoice ditandai dibayar / Invoice marked as paid",
  "invoice.markedAsSent": "Invoice ditandai terkirim / Invoice marked as sent",
  "invoice.updateFailed": "Gagal memperbarui invoice / Failed to update invoice",
  "invoice.deleted": "Invoice Dihapus / Invoice Deleted",
  "invoice.deletedSuccess": "berhasil dihapus / deleted successfully",
  "invoice.deleteFailed": "Gagal menghapus invoice / Failed to delete invoice",
};

function t(key: string): string {
  return translations[key] || key;
}

export function InvoicePreview({
  invoice,
  readOnly = false,
}: {
  invoice: Invoice;
  readOnly?: boolean;
}) {
  const { toast } = useToast();
  const dateLocale = idLocale;
  const router = useRouter();
  const updateInvoice = useUpdateInvoice();
  const deleteInvoiceMutation = useDeleteInvoice();
  const { data: companyData } = useCompany();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingFile, setIsDownloadingFile] = useState(false);

  const handleViewPDF = async () => {
    setIsDownloading(true);
    try {
      // Open PDF in new window for printing
      const pdfUrl = `/api/invoices/${invoice.id}/pdf`;
      window.open(pdfUrl, "_blank", "width=800,height=600");

      toast({
        title: t("pdf.opened"),
        description: t("pdf.openedDescription"),
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("pdf.openFailed"),
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloadingFile(true);
    try {
      const response = await fetch(`/api/invoices/${invoice.id}/download-pdf`);

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoice.invoiceNumber.replace(/\//g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: t("pdf.downloaded"),
        description: t("pdf.downloadedDescription"),
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("pdf.downloadFailed"),
        variant: "destructive",
      });
    } finally {
      setIsDownloadingFile(false);
    }
  };

  const handleMarkPaid = async () => {
    try {
      await updateInvoice.mutateAsync({
        id: invoice.id,
        data: { status: "paid" },
      });
      toast({
        title: t("invoice.statusUpdated"),
        description: t("invoice.markedAsPaid"),
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("invoice.updateFailed"),
        variant: "destructive",
      });
    }
  };

  const handleMarkSent = async () => {
    try {
      await updateInvoice.mutateAsync({
        id: invoice.id,
        data: { status: "sent" },
      });
      toast({
        title: t("invoice.statusUpdated"),
        description: t("invoice.markedAsSent"),
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("invoice.updateFailed"),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Apakah Anda yakin ingin menghapus invoice ini? / Are you sure you want to delete this invoice?"
      )
    ) {
      return;
    }

    try {
      await deleteInvoiceMutation.mutateAsync(invoice.id);
      toast({
        title: t("invoice.deleted"),
        description: `${invoice.invoiceNumber} ${t("invoice.deletedSuccess")}`,
      });
      router.push("/invoices");
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("invoice.deleteFailed"),
        variant: "destructive",
      });
    }
  };

  const statusBadge = {
    paid: { color: "bg-green-100 text-green-700", label: "Dibayar / Paid" },
    sent: { color: "bg-blue-100 text-blue-700", label: "Terkirim / Sent" },
    overdue: {
      color: "bg-red-100 text-red-700",
      label: "Jatuh Tempo / Overdue",
    },
    draft: { color: "bg-gray-100 text-gray-700", label: "Draft" },
  }[invoice.status] || {
    color: "bg-gray-100 text-gray-700",
    label: invoice.status,
  };

  return (
    <div className="space-y-4">
      {!readOnly && (
        <div className="flex flex-wrap gap-2 justify-end">
          <Button
            onClick={handleViewPDF}
            disabled={isDownloading}
            variant="outline"
          >
            <Eye className="w-4 h-4 mr-2" />
            {isDownloading ? "Membuka... / Opening..." : "Lihat PDF / View PDF"}
          </Button>
          <Button
            onClick={handleDownloadPDF}
            disabled={isDownloadingFile}
            className="bg-primary text-primary-foreground"
          >
            <Download className="w-4 h-4 mr-2" />
            {isDownloadingFile
              ? "Mengunduh... / Downloading..."
              : "Unduh PDF / Download PDF"}
          </Button>
          {invoice.status !== "paid" && (
            <Button
              variant="outline"
              onClick={handleMarkPaid}
              disabled={updateInvoice.isPending}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Tandai Dibayar / Mark Paid
            </Button>
          )}
          {invoice.status !== "sent" && invoice.status !== "paid" && (
            <Button
              variant="outline"
              onClick={handleMarkSent}
              disabled={updateInvoice.isPending}
            >
              <Send className="w-4 h-4 mr-2" />
              Tandai Terkirim / Mark Sent
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteInvoiceMutation.isPending}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Hapus / Delete
          </Button>
        </div>
      )}

      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6 pb-6 border-b">
          <div>
            <div className="text-3xl font-bold mb-2">INVOICE</div>
            <div className="text-xl font-semibold text-primary">
              {invoice.invoiceNumber}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Tanggal / Date:{" "}
              {format(new Date(invoice.issueDate), "dd MMMM yyyy", {
                locale: idLocale,
              })}
            </div>
            <div className="text-sm text-muted-foreground">
              Jatuh Tempo / Due:{" "}
              {format(new Date(invoice.dueDate), "dd MMMM yyyy", {
                locale: idLocale,
              })}
            </div>
            <div className="mt-3">
              <Badge className={statusBadge.color}>{statusBadge.label}</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-sm font-semibold mb-2">DARI / FROM:</div>
            <div className="text-sm">
              {companyData?.success && companyData.data ? (
                <>
                  <div className="font-medium">{companyData.data.name}</div>
                  {companyData.data.businessEntity && (
                    <div className="text-muted-foreground text-xs">
                      {companyData.data.businessEntity}
                    </div>
                  )}
                  {companyData.data.address && (
                    <div className="text-muted-foreground text-xs">
                      {companyData.data.address}
                    </div>
                  )}
                  {companyData.data.email && (
                    <div className="text-muted-foreground text-xs">
                      {companyData.data.email}
                    </div>
                  )}
                  {companyData.data.phone && (
                    <div className="text-muted-foreground text-xs">
                      {companyData.data.phone}
                    </div>
                  )}
                  {companyData.data.npwp && (
                    <div className="text-muted-foreground text-xs">
                      NPWP: {companyData.data.npwp}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground text-xs">
                  (Data perusahaan akan ditampilkan di PDF / Company data will
                  be shown in PDF)
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2">KEPADA / BILL TO:</div>
            <div className="text-sm">
              <div className="font-medium">{invoice.clientName}</div>
              {invoice.clientEmail && (
                <div className="text-muted-foreground">
                  {invoice.clientEmail}
                </div>
              )}
              {invoice.clientAddress && (
                <div className="text-muted-foreground">
                  {invoice.clientAddress}
                </div>
              )}
              {invoice.clientNpwp && (
                <div className="text-muted-foreground">
                  NPWP: {invoice.clientNpwp}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground bg-gray-50">
              <tr className="border-y">
                <th className="py-2 px-3">Deskripsi / Description</th>
                <th className="py-2 px-3 text-center">Qty</th>
                <th className="py-2 px-3 text-right">Harga / Rate</th>
                <th className="py-2 px-3 text-right">Jumlah / Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-3 px-3">{item.description}</td>
                  <td className="py-3 px-3 text-center">{item.quantity}</td>
                  <td className="py-3 px-3 text-right">
                    {formatIDR(item.rate)}
                  </td>
                  <td className="py-3 px-3 text-right font-medium">
                    {formatIDR(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals and Terbilang */}
        <div className="mt-6 flex flex-col md:flex-row gap-6">
          {/* Notes Section */}
          <div className="flex-1">
            {invoice.paymentTerms && (
              <div className="mb-4">
                <div className="text-sm font-semibold mb-1">
                  Syarat Pembayaran / Payment Terms:
                </div>
                <div className="text-sm text-muted-foreground">
                  {invoice.paymentTerms}
                </div>
              </div>
            )}
            {invoice.notes && (
              <div>
                <div className="text-sm font-semibold mb-1">
                  Catatan / Notes:
                </div>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {invoice.notes}
                </div>
              </div>
            )}
          </div>

          {/* Totals Section */}
          <div className="w-full md:w-96">
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  {formatIDR(invoice.subtotal)}
                </span>
              </div>

              {invoice.ppnRate > 0 && (
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">
                    PPN ({invoice.ppnRate}%):
                  </span>
                  <span className="font-medium">
                    {formatIDR(invoice.ppnAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span>{formatIDR(invoice.totalAmount)}</span>
              </div>

              {invoice.amountInWords && (
                <div className="mt-3 pt-3 border-t text-xs italic text-gray-600">
                  <div className="font-semibold mb-1">Terbilang:</div>
                  <div>{invoice.amountInWords}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
