"use client";

/**
 * Invoice Form Component
 * Full Indonesian invoice creation with PPN, NPWP, terbilang
 */

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { InvoiceItem } from "@/types/invoice";
import { useToast } from "@/hooks/use-toast";
import { useCreateInvoice, useInvoices } from "@/hooks/use-invoices";
import { useCompany } from "@/hooks/use-company";
import {
  formatIDR,
  terbilang,
  calculatePPN,
  generateInvoiceNumber,
  formatNPWP,
  validateNPWP,
  cleanNPWP,
  PAYMENT_TERMS_PRESETS,
} from "@/lib/indonesian-utils";
import { Trash2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function InvoiceForm() {
  const router = useRouter();
  const { toast } = useToast();
  const createInvoiceMutation = useCreateInvoice();
  const { data: invoicesData } = useInvoices({ page: 1, limit: 1 });
  const { data: companyData, isLoading: isLoadingCompany } = useCompany();

  // Invoice header
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10)
  );

  // Client info
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientNpwp, setClientNpwp] = useState("");

  // Items
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, rate: 0, amount: 0 },
  ]);

  // PPN & Notes
  const [usePPN, setUsePPN] = useState(false);
  const [ppnRate, setPpnRate] = useState(11);
  const [paymentTerms, setPaymentTerms] = useState("");
  const [notes, setNotes] = useState("");

  // Auto-generate invoice number
  useEffect(() => {
    if (invoicesData?.success && invoicesData.data.length > 0) {
      const lastInvoice = invoicesData.data[0];
      setInvoiceNumber(generateInvoiceNumber(lastInvoice.invoiceNumber));
    } else {
      setInvoiceNumber(generateInvoiceNumber(null));
    }
  }, [invoicesData]);

  // Set default PPN rate from company
  useEffect(() => {
    if (companyData?.success && companyData.data?.defaultPpnRate) {
      setPpnRate(companyData.data.defaultPpnRate);
      if (companyData.data.isPkp) {
        setUsePPN(true);
      }
    }
  }, [companyData]);

  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.rate || 0),
      0
    );
    const ppnAmount = usePPN ? calculatePPN(subtotal, ppnRate) : 0;
    const total = subtotal + ppnAmount;
    const terbilangText = terbilang(Math.round(total)) + " Rupiah";

    return { subtotal, ppnAmount, total, terbilangText };
  }, [items, usePPN, ppnRate]);

  // Item handlers
  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Auto-calculate amount
    if (field === "quantity" || field === "rate") {
      newItems[index].amount =
        (newItems[index].quantity || 0) * (newItems[index].rate || 0);
    }

    setItems(newItems);
  };

  const handleClientNpwpChange = (value: string) => {
    const cleaned = cleanNPWP(value);
    if (cleaned.length <= 15) {
      if (cleaned.length === 15) {
        setClientNpwp(formatNPWP(cleaned));
      } else {
        setClientNpwp(cleaned);
      }
    }
  };

  const handleSubmit = async (status: "draft" | "sent" = "draft") => {
    // Validation
    if (!clientName.trim()) {
      toast({
        title: "Error",
        description: "Nama klien wajib diisi / Client name is required",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0 || !items[0].description.trim()) {
      toast({
        title: "Error",
        description:
          "Minimal satu item diperlukan / At least one item required",
        variant: "destructive",
      });
      return;
    }

    // Validate client NPWP if provided
    if (clientNpwp && !validateNPWP(clientNpwp) && clientNpwp.length >= 15) {
      toast({
        title: "NPWP Klien Tidak Valid / Invalid Client NPWP",
        description: "Format NPWP harus: XX.XXX.XXX.X-XXX.XXX",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createInvoiceMutation.mutateAsync({
        invoiceNumber,
        clientName,
        clientEmail: clientEmail || undefined,
        clientAddress: clientAddress || undefined,
        clientNpwp: clientNpwp || undefined,
        issueDate,
        dueDate,
        items: items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
        })),
        ppnRate: usePPN ? ppnRate : 0,
        notes: notes || undefined,
        paymentTerms: paymentTerms || undefined,
        status,
      });

      if (result.success) {
        toast({
          title: "Invoice Dibuat / Invoice Created",
          description: `${invoiceNumber} disimpan sebagai ${
            status === "draft" ? "draft" : "terkirim"
          }`,
        });
        router.push(`/invoices/${result.data.id}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat invoice / Failed to create invoice",
        variant: "destructive",
      });
    }
  };

  if (isLoadingCompany) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Buat Invoice / Create Invoice</h1>
        <p className="text-gray-600 mt-1">
          Buat faktur profesional dengan PPN dan NPWP / Create professional
          invoice with VAT and Tax ID
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detail Invoice / Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Invoice Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">
                Nomor Invoice / Invoice Number
              </Label>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="INV/2025/10/001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issueDate">Tanggal Terbit / Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Tanggal Jatuh Tempo / Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Client Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Informasi Klien / Client Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nama Klien / Client Name *</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="PT. Contoh Klien"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="klien@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientAddress">Alamat / Address</Label>
                <Textarea
                  id="clientAddress"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="Jl. Sudirman No. 123, Jakarta"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientNpwp">
                  NPWP Klien / Client Tax ID (Optional)
                </Label>
                <Input
                  id="clientNpwp"
                  value={clientNpwp}
                  onChange={(e) => handleClientNpwpChange(e.target.value)}
                  placeholder="XX.XXX.XXX.X-XXX.XXX"
                  maxLength={20}
                />
                {clientNpwp &&
                  !validateNPWP(clientNpwp) &&
                  clientNpwp.length >= 15 && (
                    <p className="text-sm text-red-500">
                      Format NPWP tidak valid
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Item / Line Items</h3>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Item / Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-12 md:col-span-5 space-y-2">
                    <Label className="text-xs">Deskripsi / Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) =>
                        updateItem(index, "description", e.target.value)
                      }
                      placeholder="Jasa desain website / Web design services"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2 space-y-2">
                    <Label className="text-xs">Qty</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "quantity",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2 space-y-2">
                    <Label className="text-xs">Harga / Rate</Label>
                    <Input
                      type="number"
                      min="0"
                      step="1000"
                      value={item.rate}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "rate",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="col-span-3 md:col-span-2 space-y-2">
                    <Label className="text-xs">Jumlah / Amount</Label>
                    <div className="h-10 flex items-center px-3 bg-gray-50 rounded border">
                      <span className="text-sm font-medium">
                        {formatIDR(item.amount || 0)}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PPN Section */}
          <div className="border rounded-lg p-4 bg-blue-50/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Label htmlFor="usePPN" className="text-base font-semibold">
                  Gunakan PPN / Use VAT
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Tambahkan Pajak Pertambahan Nilai / Add Value Added Tax
                </p>
              </div>
              <Switch
                id="usePPN"
                checked={usePPN}
                onCheckedChange={setUsePPN}
              />
            </div>

            {usePPN && (
              <div className="space-y-2">
                <Label htmlFor="ppnRate">Tarif PPN (%) / VAT Rate (%)</Label>
                <Input
                  id="ppnRate"
                  type="number"
                  min="0"
                  max="100"
                  value={ppnRate}
                  onChange={(e) => setPpnRate(parseFloat(e.target.value) || 11)}
                  className="w-32"
                />
              </div>
            )}
          </div>

          {/* Payment Terms & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">
                Syarat Pembayaran / Payment Terms
              </Label>
              <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                <SelectTrigger id="paymentTerms">
                  <SelectValue placeholder="Pilih syarat pembayaran / Select terms" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_TERMS_PRESETS.map((term) => (
                    <SelectItem key={term} value={term}>
                      {term}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan / Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Terima kasih atas kepercayaan Anda / Thank you for your business"
                rows={2}
              />
            </div>
          </div>

          {/* Totals Summary */}
          <div className="border-t pt-4">
            <div className="max-w-md ml-auto space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  {formatIDR(totals.subtotal)}
                </span>
              </div>

              {usePPN && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">PPN ({ppnRate}%):</span>
                  <span className="font-medium">
                    {formatIDR(totals.ppnAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>{formatIDR(totals.total)}</span>
              </div>

              <div className="text-sm text-gray-600 italic border-t pt-2">
                <p className="font-medium">Terbilang:</p>
                <p>{totals.terbilangText}</p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/invoices")}
            disabled={createInvoiceMutation.isPending}
          >
            Batal / Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleSubmit("draft")}
            disabled={createInvoiceMutation.isPending}
          >
            Simpan Draft / Save Draft
          </Button>
          <Button
            type="button"
            onClick={() => handleSubmit("sent")}
            disabled={createInvoiceMutation.isPending}
          >
            {createInvoiceMutation.isPending
              ? "Membuat... / Creating..."
              : "Buat & Kirim / Create & Send"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
