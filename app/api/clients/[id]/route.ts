import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const clientId = parseInt(id);
    const body = await request.json();

    const existing = await prisma.client.findFirst({
      where: { id: clientId, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const client = await prisma.client.update({
      where: { id: clientId },
      data: {
        name: body.name !== undefined ? body.name : undefined,
        email: body.email !== undefined ? (body.email || null) : undefined,
        phone: body.phone !== undefined ? (body.phone || null) : undefined,
        address: body.address !== undefined ? (body.address || null) : undefined,
        npwp: body.npwp !== undefined ? (body.npwp || null) : undefined,
        contactPerson: body.contactPerson !== undefined ? (body.contactPerson || null) : undefined,
        notes: body.notes !== undefined ? (body.notes || null) : undefined,
      },
    });

    return NextResponse.json({ success: true, data: client });
  } catch (error) {
    const { id } = await params;
    console.error(`PUT /api/clients/${id} error:`, error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const clientId = parseInt(id);

    const existing = await prisma.client.findFirst({
      where: { id: clientId, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    await prisma.client.delete({ where: { id: clientId } });

    return NextResponse.json({ success: true, data: { message: 'Client deleted' } });
  } catch (error) {
    const { id } = await params;
    console.error(`DELETE /api/clients/${id} error:`, error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
