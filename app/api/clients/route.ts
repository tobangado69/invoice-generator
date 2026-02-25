import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = { userId: session.user.id };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const clients = await prisma.client.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ success: true, data: clients });
  } catch (error) {
    console.error('GET /api/clients error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.name?.trim()) {
      return NextResponse.json({ success: false, error: 'Client name is required' }, { status: 400 });
    }

    const client = await prisma.client.create({
      data: {
        userId: session.user.id,
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        address: body.address || null,
        npwp: body.npwp || null,
        contactPerson: body.contactPerson || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json({ success: true, data: client }, { status: 201 });
  } catch (error) {
    console.error('POST /api/clients error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
