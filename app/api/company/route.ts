/**
 * Company Profile API Routes
 * Handles get and update operations for company profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Force Node.js runtime (required for auth with bcrypt)
export const runtime = 'nodejs';

/**
 * GET /api/company
 * Get company profile for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const company = await prisma.company.findUnique({
      where: { userId },
    });

    if (!company) {
      // Return empty company data if not yet created
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    return NextResponse.json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error('GET /api/company error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/company
 * Create or update company profile
 */
export async function PUT(request: NextRequest) {
  try {
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
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Company name is required' },
        { status: 400 }
      );
    }

    // Prepare data
    const data = {
      name: body.name,
      businessEntity: body.businessEntity || null,
      address: body.address || null,
      phone: body.phone || null,
      email: body.email || null,
      npwp: body.npwp || null,
      isPkp: body.isPkp ?? false,
      bankName: body.bankName || null,
      bankAccountNumber: body.bankAccountNumber || null,
      bankAccountHolder: body.bankAccountHolder || null,
      logoUrl: body.logoUrl || null,
      defaultPpnRate: body.defaultPpnRate ?? 11.0,
    };

    // Upsert company profile
    const company = await prisma.company.upsert({
      where: { userId },
      create: {
        userId,
        ...data,
      },
      update: data,
    });

    return NextResponse.json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error('PUT /api/company error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

