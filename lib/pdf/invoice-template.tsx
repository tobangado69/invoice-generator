/**
 * Indonesian Invoice PDF Template
 * Professional invoice layout with NPWP, PPN, terbilang, and bank details
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Invoice, CompanyProfile } from "@/types/invoice";
import { formatIDR, formatIndonesianDate } from "@/lib/indonesian-utils";

// Register fonts (optional - using default for MVP)
// Font.register({
//   family: 'Roboto',
//   src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf'
// });

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: "2 solid #000",
  },
  companySection: {
    width: "50%",
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  companyDetails: {
    fontSize: 9,
    color: "#555",
    lineHeight: 1.4,
  },
  invoiceSection: {
    width: "50%",
    alignItems: "flex-end",
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  invoiceNumber: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 5,
  },
  invoiceDate: {
    fontSize: 9,
    color: "#555",
  },
  clientSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  clientDetails: {
    fontSize: 9,
    color: "#333",
    lineHeight: 1.4,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 8,
    fontWeight: "bold",
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #e5e7eb",
    padding: 8,
    fontSize: 9,
  },
  tableColDescription: {
    width: "45%",
  },
  tableColQty: {
    width: "15%",
    textAlign: "center",
  },
  tableColRate: {
    width: "20%",
    textAlign: "right",
  },
  tableColAmount: {
    width: "20%",
    textAlign: "right",
  },
  totalsSection: {
    marginTop: 20,
    marginLeft: "auto",
    width: "50%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    fontSize: 10,
  },
  totalLabel: {
    color: "#555",
  },
  totalValue: {
    fontWeight: "bold",
  },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginTop: 8,
    borderTop: "2 solid #000",
    fontSize: 12,
    fontWeight: "bold",
  },
  terbilangSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
  },
  terbilangText: {
    fontSize: 9,
    fontStyle: "italic",
    color: "#374151",
  },
  paymentSection: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#eff6ff",
    borderRadius: 4,
  },
  paymentTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
  },
  paymentDetails: {
    fontSize: 9,
    lineHeight: 1.5,
  },
  notesSection: {
    marginTop: 20,
  },
  notesText: {
    fontSize: 9,
    color: "#555",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#999",
    borderTop: "1 solid #e5e7eb",
    paddingTop: 10,
  },
});

interface InvoicePDFProps {
  invoice: Invoice;
  company: CompanyProfile;
}

export function InvoicePDF({ invoice, company }: InvoicePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.companySection}>
            <Text style={styles.companyName}>{company.name}</Text>
            {company.businessEntity && (
              <Text style={styles.companyDetails}>
                {company.businessEntity}
              </Text>
            )}
            {company.address && (
              <Text style={styles.companyDetails}>{company.address}</Text>
            )}
            {company.phone && (
              <Text style={styles.companyDetails}>Telp: {company.phone}</Text>
            )}
            {company.email && (
              <Text style={styles.companyDetails}>Email: {company.email}</Text>
            )}
            {company.npwp && (
              <Text style={styles.companyDetails}>NPWP: {company.npwp}</Text>
            )}
            {company.isPkp && (
              <Text style={[styles.companyDetails, { fontWeight: "bold" }]}>
                PKP (Pengusaha Kena Pajak)
              </Text>
            )}
          </View>

          <View style={styles.invoiceSection}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
            <Text style={styles.invoiceDate}>
              Tanggal: {formatIndonesianDate(new Date(invoice.issueDate))}
            </Text>
            <Text style={styles.invoiceDate}>
              Jatuh Tempo: {formatIndonesianDate(new Date(invoice.dueDate))}
            </Text>
          </View>
        </View>

        {/* Client Section */}
        <View style={styles.clientSection}>
          <Text style={styles.sectionTitle}>KEPADA / BILL TO:</Text>
          <Text style={styles.clientDetails}>{invoice.clientName}</Text>
          {invoice.clientAddress && (
            <Text style={styles.clientDetails}>{invoice.clientAddress}</Text>
          )}
          {invoice.clientEmail && (
            <Text style={styles.clientDetails}>
              Email: {invoice.clientEmail}
            </Text>
          )}
          {invoice.clientNpwp && (
            <Text style={styles.clientDetails}>NPWP: {invoice.clientNpwp}</Text>
          )}
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableColDescription}>
              DESKRIPSI / DESCRIPTION
            </Text>
            <Text style={styles.tableColQty}>QTY</Text>
            <Text style={styles.tableColRate}>HARGA / RATE</Text>
            <Text style={styles.tableColAmount}>JUMLAH / AMOUNT</Text>
          </View>

          {/* Table Rows */}
          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableColDescription}>{item.description}</Text>
              <Text style={styles.tableColQty}>{item.quantity}</Text>
              <Text style={styles.tableColRate}>{formatIDR(item.rate)}</Text>
              <Text style={styles.tableColAmount}>
                {formatIDR(item.amount)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals Section */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatIDR(invoice.subtotal)}</Text>
          </View>

          {invoice.ppnRate > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>PPN ({invoice.ppnRate}%):</Text>
              <Text style={styles.totalValue}>
                {formatIDR(invoice.ppnAmount)}
              </Text>
            </View>
          )}

          <View style={styles.grandTotal}>
            <Text>TOTAL:</Text>
            <Text>{formatIDR(invoice.totalAmount)}</Text>
          </View>

          {/* Terbilang */}
          {invoice.amountInWords && (
            <View style={styles.terbilangSection}>
              <Text style={styles.terbilangText}>
                Terbilang: {invoice.amountInWords}
              </Text>
            </View>
          )}
        </View>

        {/* Payment Instructions */}
        {(company.bankName || company.bankAccountNumber) && (
          <View style={styles.paymentSection}>
            <Text style={styles.paymentTitle}>
              INSTRUKSI PEMBAYARAN / PAYMENT INSTRUCTIONS
            </Text>
            {company.bankName && (
              <Text style={styles.paymentDetails}>
                Bank: {company.bankName}
              </Text>
            )}
            {company.bankAccountNumber && (
              <Text style={styles.paymentDetails}>
                Nomor Rekening / Account Number: {company.bankAccountNumber}
              </Text>
            )}
            {company.bankAccountHolder && (
              <Text style={styles.paymentDetails}>
                Atas Nama / Account Holder: {company.bankAccountHolder}
              </Text>
            )}
          </View>
        )}

        {/* Payment Terms & Notes */}
        {(invoice.paymentTerms || invoice.notes) && (
          <View style={styles.notesSection}>
            {invoice.paymentTerms && (
              <>
                <Text style={styles.sectionTitle}>
                  SYARAT PEMBAYARAN / PAYMENT TERMS:
                </Text>
                <Text style={styles.notesText}>{invoice.paymentTerms}</Text>
              </>
            )}
            {invoice.notes && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
                  CATATAN / NOTES:
                </Text>
                <Text style={styles.notesText}>{invoice.notes}</Text>
              </>
            )}
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Generated by InvoiceFlow - Invoice Generator untuk UMKM Indonesia
        </Text>
      </Page>
    </Document>
  );
}
