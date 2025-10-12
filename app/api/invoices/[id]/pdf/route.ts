/**
 * PDF Generation API Route
 * Returns invoice data for client-side PDF generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { formatIDR } from '@/lib/indonesian-utils';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

// Force Node.js runtime (required for auth with bcrypt)
export const runtime = 'nodejs';

/**
 * GET /api/invoices/[id]/pdf
 * Returns HTML template for browser to print as PDF
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get session
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userId = session.user.id;
    const { id } = await params;
    const invoiceId = parseInt(id);

    // Fetch invoice with items
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!invoice) {
      return new NextResponse('Invoice not found', { status: 404 });
    }

    // Fetch company profile
    const company = await prisma.company.findUnique({
      where: { userId },
    });

    if (!company) {
      return new NextResponse('Company profile not found. Please complete your profile first.', { 
        status: 400 
      });
    }

    // Generate HTML template for PDF
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; font-size: 12px; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { font-size: 24px; margin-bottom: 10px; }
    .invoice-number { color: #2563eb; font-size: 18px; font-weight: bold; }
    .company-client { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .section { flex: 1; }
    .section h3 { font-size: 10px; font-weight: bold; margin-bottom: 8px; color: #666; }
    .section p { margin: 4px 0; font-size: 11px; }
    .info-row { display: flex; justify-content: space-between; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    thead { background: #f3f4f6; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { font-size: 11px; font-weight: bold; }
    td { font-size: 11px; }
    .text-right { text-align: right; }
    .totals { margin-left: auto; width: 300px; margin-top: 20px; }
    .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .total-row { font-size: 14px; font-weight: bold; border-top: 2px solid #000; padding-top: 10px; }
    .terbilang { margin: 20px 0; padding: 15px; background: #f9fafb; border-left: 4px solid #2563eb; }
    .terbilang-label { font-size: 10px; font-weight: bold; margin-bottom: 5px; }
    .terbilang-text { font-size: 11px; font-style: italic; }
    .payment-info { margin: 30px 0; padding: 20px; border: 1px solid #e5e7eb; }
    .payment-info h3 { font-size: 12px; margin-bottom: 10px; }
    .notes { margin: 20px 0; }
    .notes h4 { font-size: 11px; font-weight: bold; margin-bottom: 5px; }
    .notes p { font-size: 10px; color: #666; }
    .footer { text-align: center; margin-top: 50px; font-size: 9px; color: #999; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>INVOICE</h1>
    <div class="invoice-number">${invoice.invoiceNumber}</div>
  </div>

  <div class="company-client">
    <div class="section">
      <h3>FROM:</h3>
      <p><strong>${company.name}</strong></p>
      ${company.businessEntity ? `<p>${company.businessEntity}</p>` : ''}
      ${company.address ? `<p>${company.address}</p>` : ''}
      ${company.email ? `<p>Email: ${company.email}</p>` : ''}
      ${company.phone ? `<p>Phone: ${company.phone}</p>` : ''}
      ${company.npwp ? `<p>NPWP: ${company.npwp}</p>` : ''}
    </div>
    <div class="section">
      <h3>BILL TO:</h3>
      <p><strong>${invoice.clientName}</strong></p>
      ${invoice.clientEmail ? `<p>${invoice.clientEmail}</p>` : ''}
      ${invoice.clientAddress ? `<p>${invoice.clientAddress}</p>` : ''}
      ${invoice.clientNpwp ? `<p>NPWP: ${invoice.clientNpwp}</p>` : ''}
    </div>
  </div>

  <div class="info-row">
    <div>
      <strong>Issue Date:</strong> ${format(new Date(invoice.issueDate), 'dd MMMM yyyy', { locale: idLocale })}
    </div>
    <div>
      <strong>Due Date:</strong> ${format(new Date(invoice.dueDate), 'dd MMMM yyyy', { locale: idLocale })}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th class="text-right">Qty</th>
        <th class="text-right">Rate</th>
        <th class="text-right">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.items.map((item: any) => `
        <tr>
          <td>${item.description}</td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right">${formatIDR(item.rate)}</td>
          <td class="text-right">${formatIDR(item.amount)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <span>Subtotal:</span>
      <span>${formatIDR(invoice.subtotal)}</span>
    </div>
    ${invoice.ppnRate > 0 ? `
    <div class="totals-row">
      <span>PPN (${invoice.ppnRate}%):</span>
      <span>${formatIDR(invoice.ppnAmount)}</span>
    </div>
    ` : ''}
    <div class="totals-row total-row">
      <span>TOTAL:</span>
      <span>${formatIDR(invoice.totalAmount)}</span>
    </div>
  </div>

  ${invoice.amountInWords ? `
  <div class="terbilang">
    <div class="terbilang-label">Terbilang:</div>
    <div class="terbilang-text">${invoice.amountInWords}</div>
  </div>
  ` : ''}

  ${company.bankName ? `
  <div class="payment-info">
    <h3>Payment Information</h3>
    <p><strong>Bank:</strong> ${company.bankName}</p>
    ${company.bankAccountNumber ? `<p><strong>Account Number:</strong> ${company.bankAccountNumber}</p>` : ''}
    ${company.bankAccountHolder ? `<p><strong>Account Holder:</strong> ${company.bankAccountHolder}</p>` : ''}
  </div>
  ` : ''}

  ${invoice.paymentTerms || invoice.notes ? `
  <div class="notes">
    ${invoice.paymentTerms ? `
      <h4>Payment Terms:</h4>
      <p>${invoice.paymentTerms}</p>
    ` : ''}
    ${invoice.notes ? `
      <h4>Notes:</h4>
      <p>${invoice.notes}</p>
    ` : ''}
  </div>
  ` : ''}

  <div class="footer">
    Generated by InvoiceFlow - Invoice Generator untuk UMKM Indonesia
  </div>

  <script>
    // Auto-trigger print dialog
    window.onload = () => window.print();
  </script>
</body>
</html>
    `;

    // Return HTML that browser can print as PDF
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    const { id } = await params;
    console.error(`PDF generation error for invoice ${id}:`, error);
    return new NextResponse(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}
