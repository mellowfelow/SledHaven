import { NextRequest, NextResponse } from 'next/server';
import { checkAdminPasscode } from '@/lib/adminAuth';
import {
  deleteOrder,
  getOrder,
  updateOrderStatus,
  type OrderStatus,
} from '@/lib/orderStore';

const VALID_STATUSES = new Set<OrderStatus>([
  'new',
  'payment_sent',
  'payment_confirmed',
  'dispatched',
  'cancelled',
]);

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdminPasscode(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await context.params;
  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  return NextResponse.json({ order });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdminPasscode(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await context.params;
  const body = await req.json();
  const status = String(body?.status || '') as OrderStatus;
  if (!VALID_STATUSES.has(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }
  const updated = await updateOrderStatus(id, status);
  if (!updated) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, order: updated });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdminPasscode(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await context.params;
  await deleteOrder(id);
  return NextResponse.json({ ok: true });
}
