/**
 * Invoice API Routes
 * Handles listing and creating invoices
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { calculatePPN, terbilang, generateInvoiceNumber } from '@/lib/indonesian-utils';

// Force Node.js runtime (required for auth with bcrypt)
export const runtime = 'nodejs';

/**
 * GET /api/invoices
 * List all invoices for the authenticated user with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Get session
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      userId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    // Fetch invoices with items
    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          items: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: invoices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/invoices error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/invoices
 * Create a new invoice
 */
export async function POST(request: NextRequest) {
  try {
    // Get session
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();

    // Validate required fields
    if (!body.clientName || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate totals
    const items = body.items.map((item: any) => ({
      description: item.description,
      quantity: parseFloat(item.quantity),
      rate: parseFloat(item.rate),
      amount: parseFloat(item.quantity) * parseFloat(item.rate),
    }));

    const subtotal = items.reduce((sum: number, item: any) => sum + item.amount, 0);
    const ppnRate = body.ppnRate || 0;
    const ppnAmount = calculatePPN(subtotal, ppnRate);
    const totalAmount = subtotal + ppnAmount;

    // Generate invoice number if not provided
    let invoiceNumber = body.invoiceNumber;
    if (!invoiceNumber) {
      const lastInvoice = await prisma.invoice.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: { invoiceNumber: true },
      });
      invoiceNumber = generateInvoiceNumber(lastInvoice?.invoiceNumber || null);
    }

    // Generate terbilang
    const amountInWords = terbilang(Math.round(totalAmount)) + ' Rupiah';

    // Create invoice with items
    const invoice = await prisma.invoice.create({
      data: {
        userId,
        invoiceNumber,
        clientName: body.clientName,
        clientEmail: body.clientEmail || null,
        clientAddress: body.clientAddress || null,
        clientNpwp: body.clientNpwp || null,
        issueDate: new Date(body.issueDate),
        dueDate: new Date(body.dueDate),
        subtotal,
        ppnRate,
        ppnAmount,
        totalAmount,
        amountInWords,
        currency: 'IDR',
        notes: body.notes || null,
        paymentTerms: body.paymentTerms || null,
        status: body.status || 'draft',
        items: {
          create: items,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: invoice,
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/invoices error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

