import { NextRequest, NextResponse } from 'next/server';
import { checkAdminPasscode } from '@/lib/adminAuth';
import { listOrders } from '@/lib/orderStore';

export async function GET(req: NextRequest) {
  if (!(await checkAdminPasscode(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const orders = await listOrders();
  return NextResponse.json({ count: orders.length, orders });
}
