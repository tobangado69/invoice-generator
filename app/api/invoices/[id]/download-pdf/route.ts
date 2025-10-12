/**
 * PDF Download API Route
 * Returns invoice as downloadable PDF file using pdf-lib
 */

import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { formatIDR } from '@/lib/indonesian-utils';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

// Force Node.js runtime (required for auth with bcrypt)
export const runtime = 'nodejs';

/**
 * GET /api/invoices/[id]/download-pdf
 * Returns PDF file for download
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

    // Create PDF document using pdf-lib
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size in points
    const { width, height } = page.getSize();
    
    // Load fonts
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    let yPosition = height - 60;
    const leftMargin = 50;
    const rightMargin = width - 50;
    
    // Header - INVOICE title (properly centered)
    const invoiceTextWidth = boldFont.widthOfTextAtSize('INVOICE', 24);
    page.drawText('INVOICE', {
      x: (width - invoiceTextWidth) / 2,
      y: yPosition,
      size: 24,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 25;
    
    // Invoice Number (properly centered)
    const invoiceNumberTextWidth = boldFont.widthOfTextAtSize(invoice.invoiceNumber, 16);
    page.drawText(invoice.invoiceNumber, {
      x: (width - invoiceNumberTextWidth) / 2,
      y: yPosition,
      size: 16,
      font: boldFont,
      color: rgb(0.15, 0.39, 0.92), // #2563eb
    });
    yPosition -= 40;
    
    // FROM section
    page.drawText('FROM:', {
      x: leftMargin,
      y: yPosition,
      size: 10,
      font: boldFont,
      color: rgb(0.4, 0.4, 0.4),
    });
    yPosition -= 15;
    
    page.drawText(company.name, {
      x: leftMargin,
      y: yPosition,
      size: 12,
      font: boldFont,
    });
    yPosition -= 15;
    
    if (company.businessEntity) {
      page.drawText(company.businessEntity, {
        x: leftMargin,
        y: yPosition,
        size: 9,
        font: regularFont,
      });
      yPosition -= 12;
    }
    
    if (company.address) {
      const addressLines = company.address.match(/.{1,40}/g) || [company.address];
      addressLines.forEach(line => {
        page.drawText(line, {
          x: leftMargin,
          y: yPosition,
          size: 9,
          font: regularFont,
        });
        yPosition -= 12;
      });
    }
    
    if (company.email) {
      page.drawText(`Email: ${company.email}`, {
        x: leftMargin,
        y: yPosition,
        size: 9,
        font: regularFont,
      });
      yPosition -= 12;
    }
    
    if (company.phone) {
      page.drawText(`Phone: ${company.phone}`, {
        x: leftMargin,
        y: yPosition,
        size: 9,
        font: regularFont,
      });
      yPosition -= 12;
    }
    
    if (company.npwp) {
      page.drawText(`NPWP: ${company.npwp}`, {
        x: leftMargin,
        y: yPosition,
        size: 9,
        font: regularFont,
      });
    }
    
    // BILL TO section (right side)
    let billToY = height - 125;
    page.drawText('BILL TO:', {
      x: 320,
      y: billToY,
      size: 10,
      font: boldFont,
      color: rgb(0.4, 0.4, 0.4),
    });
    billToY -= 15;
    
    page.drawText(invoice.clientName, {
      x: 320,
      y: billToY,
      size: 12,
      font: boldFont,
    });
    billToY -= 15;
    
    if (invoice.clientEmail) {
      page.drawText(invoice.clientEmail, {
        x: 320,
        y: billToY,
        size: 9,
        font: regularFont,
      });
      billToY -= 12;
    }
    
    if (invoice.clientAddress) {
      const clientAddressLines = invoice.clientAddress.match(/.{1,35}/g) || [invoice.clientAddress];
      clientAddressLines.forEach(line => {
        page.drawText(line, {
          x: 320,
          y: billToY,
          size: 9,
          font: regularFont,
        });
        billToY -= 12;
      });
    }
    
    if (invoice.clientNpwp) {
      page.drawText(`NPWP: ${invoice.clientNpwp}`, {
        x: 320,
        y: billToY,
        size: 9,
        font: regularFont,
      });
    }
    
    // Invoice dates
    yPosition = height - 280;
    page.drawText(`Issue Date: ${format(new Date(invoice.issueDate), 'dd MMMM yyyy', { locale: idLocale })}`, {
      x: leftMargin,
      y: yPosition,
      size: 9,
      font: regularFont,
    });
    yPosition -= 15;
    
    page.drawText(`Due Date: ${format(new Date(invoice.dueDate), 'dd MMMM yyyy', { locale: idLocale })}`, {
      x: leftMargin,
      y: yPosition,
      size: 9,
      font: regularFont,
    });
    yPosition -= 30;
    
    // Table header
    page.drawRectangle({
      x: leftMargin,
      y: yPosition - 20,
      width: rightMargin - leftMargin,
      height: 25,
      color: rgb(0.95, 0.95, 0.96),
    });
    
    page.drawText('Description', {
      x: leftMargin + 10,
      y: yPosition - 12,
      size: 9,
      font: boldFont,
    });
    
    page.drawText('Qty', {
      x: 360,
      y: yPosition - 12,
      size: 9,
      font: boldFont,
    });
    
    page.drawText('Rate', {
      x: 410,
      y: yPosition - 12,
      size: 9,
      font: boldFont,
    });
    
    page.drawText('Amount', {
      x: 480,
      y: yPosition - 12,
      size: 9,
      font: boldFont,
    });
    
    yPosition -= 30;
    
    // Table rows
    invoice.items.forEach((item: any, index: number) => {
      if (yPosition < 150) {
        const newPage = pdfDoc.addPage([595, 842]);
        yPosition = height - 60;
      }
      
      if (index % 2 === 1) {
        page.drawRectangle({
          x: leftMargin,
          y: yPosition - 12,
          width: rightMargin - leftMargin,
          height: 20,
          color: rgb(0.98, 0.98, 0.99),
        });
      }
      
      const desc = item.description.length > 35 ? item.description.substring(0, 32) + '...' : item.description;
      page.drawText(desc, {
        x: leftMargin + 10,
        y: yPosition,
        size: 9,
        font: regularFont,
      });
      
      page.drawText(item.quantity.toString(), {
        x: 365,
        y: yPosition,
        size: 9,
        font: regularFont,
      });
      
      page.drawText(formatIDR(item.rate), {
        x: 410,
        y: yPosition,
        size: 9,
        font: regularFont,
      });
      
      page.drawText(formatIDR(item.amount), {
        x: 480,
        y: yPosition,
        size: 9,
        font: regularFont,
      });
      
      yPosition -= 20;
    });
    
    yPosition -= 20;
    
    // Totals section
    const totalsX = 350;
    page.drawText('Subtotal:', {
      x: totalsX,
      y: yPosition,
      size: 10,
      font: regularFont,
    });
    
    page.drawText(formatIDR(invoice.subtotal), {
      x: 480,
      y: yPosition,
      size: 10,
      font: regularFont,
    });
    yPosition -= 15;
    
    if (invoice.ppnRate > 0) {
      page.drawText(`PPN (${invoice.ppnRate}%):`, {
        x: totalsX,
        y: yPosition,
        size: 10,
        font: regularFont,
      });
      
      page.drawText(formatIDR(invoice.ppnAmount), {
        x: 480,
        y: yPosition,
        size: 10,
        font: regularFont,
      });
      yPosition -= 20;
    }
    
    // Draw line above total
    page.drawLine({
      start: { x: totalsX, y: yPosition + 5 },
      end: { x: rightMargin, y: yPosition + 5 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    yPosition -= 15;
    
    page.drawText('TOTAL:', {
      x: totalsX,
      y: yPosition,
      size: 12,
      font: boldFont,
    });
    
    page.drawText(formatIDR(invoice.totalAmount), {
      x: 480,
      y: yPosition,
      size: 12,
      font: boldFont,
    });
    yPosition -= 30;
    
    // Terbilang
    if (invoice.amountInWords) {
      page.drawText('Terbilang:', {
        x: leftMargin,
        y: yPosition,
        size: 9,
        font: boldFont,
      });
      yPosition -= 12;
      
      const words = invoice.amountInWords.match(/.{1,70}/g) || [invoice.amountInWords];
      words.forEach(line => {
        page.drawText(line, {
          x: leftMargin,
          y: yPosition,
          size: 9,
          font: regularFont,
          color: rgb(0.4, 0.4, 0.4),
        });
        yPosition -= 12;
      });
      yPosition -= 10;
    }
    
    // Payment Information
    if (company.bankName && yPosition > 100) {
      page.drawText('Payment Information:', {
        x: leftMargin,
        y: yPosition,
        size: 10,
        font: boldFont,
      });
      yPosition -= 15;
      
      page.drawText(`Bank: ${company.bankName}`, {
        x: leftMargin,
        y: yPosition,
        size: 9,
        font: regularFont,
      });
      yPosition -= 12;
      
      if (company.bankAccountNumber) {
        page.drawText(`Account Number: ${company.bankAccountNumber}`, {
          x: leftMargin,
          y: yPosition,
          size: 9,
          font: regularFont,
        });
        yPosition -= 12;
      }
      
      if (company.bankAccountHolder) {
        page.drawText(`Account Holder: ${company.bankAccountHolder}`, {
          x: leftMargin,
          y: yPosition,
          size: 9,
          font: regularFont,
        });
        yPosition -= 12;
      }
    }
    
    // Footer (properly centered)
    const footerText = 'Generated by InvoiceFlow - Invoice Generator untuk UMKM Indonesia';
    const footerTextWidth = regularFont.widthOfTextAtSize(footerText, 8);
    page.drawText(footerText, {
      x: (width - footerTextWidth) / 2,
      y: 30,
      size: 8,
      font: regularFont,
      color: rgb(0.6, 0.6, 0.6),
    });
    
    const pdfBuffer = await pdfDoc.save();

    // Return PDF as downloadable file
    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber.replace(/\//g, '-')}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    const { id } = await params;
    console.error(`PDF download error for invoice ${id}:`, error);
    return new NextResponse(`PDF download failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}
