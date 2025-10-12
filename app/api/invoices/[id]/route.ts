/**
 * Individual Invoice API Routes
 * Handles get, update, and delete operations for a specific invoice
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { calculatePPN, terbilang } from '@/lib/indonesian-utils';

// Force Node.js runtime (required for auth with bcrypt)
export const runtime = 'nodejs';

/**
 * GET /api/invoices/[id]
 * Get a single invoice by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: parseInt(id),
        userId: session.user.id,
      },
      include: {
        items: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    const { id } = await params;
    console.error(`GET /api/invoices/${id} error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/invoices/[id]
 * Update an invoice
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const invoiceId = parseInt(id);
    const userId = session.user.id;

    // Check if invoice exists and belongs to user
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId,
      },
    });

    if (!existingInvoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Only update fields that are provided in the request
    let updateData: any = {};

    // Only update these fields if they are provided in the request
    if (body.clientName !== undefined) updateData.clientName = body.clientName;
    if (body.clientEmail !== undefined) updateData.clientEmail = body.clientEmail || null;
    if (body.clientAddress !== undefined) updateData.clientAddress = body.clientAddress || null;
    if (body.clientNpwp !== undefined) updateData.clientNpwp = body.clientNpwp || null;
    if (body.issueDate !== undefined) updateData.issueDate = body.issueDate ? new Date(body.issueDate) : undefined;
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate ? new Date(body.dueDate) : undefined;
    if (body.notes !== undefined) updateData.notes = body.notes || null;
    if (body.paymentTerms !== undefined) updateData.paymentTerms = body.paymentTerms || null;
    if (body.status !== undefined) updateData.status = body.status;

    if (body.items) {
      const items = body.items.map((item: any) => ({
        description: item.description,
        quantity: parseFloat(item.quantity),
        rate: parseFloat(item.rate),
        amount: parseFloat(item.quantity) * parseFloat(item.rate),
      }));

      const subtotal = items.reduce((sum: number, item: any) => sum + item.amount, 0);
      const ppnRate = body.ppnRate !== undefined ? body.ppnRate : existingInvoice.ppnRate;
      const ppnAmount = calculatePPN(subtotal, ppnRate);
      const totalAmount = subtotal + ppnAmount;
      const amountInWords = terbilang(Math.round(totalAmount)) + ' Rupiah';

      updateData = {
        ...updateData,
        subtotal,
        ppnRate,
        ppnAmount,
        totalAmount,
        amountInWords,
      };

      // Delete existing items and create new ones
      await prisma.invoiceItem.deleteMany({
        where: { invoiceId },
      });

      updateData.items = {
        create: items,
      };
    }

    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: updateData,
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    const { id } = await params;
    console.error(`PUT /api/invoices/${id} error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/invoices/[id]
 * Delete an invoice
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const invoiceId = parseInt(id);
    const userId = session.user.id;

    // Check if invoice exists and belongs to user
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Delete invoice (items will be cascade deleted)
    await prisma.invoice.delete({
      where: { id: invoiceId },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Invoice deleted successfully' },
    });
  } catch (error) {
    const { id } = await params;
    console.error(`DELETE /api/invoices/${id} error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

