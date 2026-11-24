import { NextRequest, NextResponse } from 'next/server';
import { getOrder } from '@/lib/orderStore';
import { paymentMethodParts } from '@/lib/order';

const ORDER_ID_RE = /^[A-Z0-9-]{4,32}$/;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawOrder = (searchParams.get('order') || '').trim().toUpperCase();

  if (!rawOrder || !ORDER_ID_RE.test(rawOrder)) {
    return NextResponse.json({ error: 'Invalid order reference.' }, { status: 400 });
  }

  const order = await getOrder(rawOrder);
  if (!order) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  }

  const method = paymentMethodParts(order.paymentMethod);

  // Return sanitized order summary + copyable payment fields (no full address PII exposure)
  return NextResponse.json({
    orderNumber: order.orderNumber,
    status: order.status,
    createdAt: order.createdAt,
    customerFirstName: order.customer.name.split(' ')[0] || 'Customer',
    destinationState: order.customer.state,
    paymentMethod: {
      id: method.id,
      label: method.label,
      opening: method.opening,
      closing: method.closing,
    },
    paymentPlan: order.paymentPlan || 'full',
    items: order.items.map((i) => ({
      name: i.name,
      sku: i.sku,
      quantity: i.quantity,
      lineTotal: i.lineTotal,
    })),
    subtotal: order.subtotal,
    cryptoDiscount: order.cryptoDiscount,
    shippingFee: order.shippingFee,
    shippingLabel: order.shippingLabel,
    estimatedTax: order.estimatedTax,
    total: order.total,
    payIn4Installment: order.payIn4Installment,
    paymentDetails: order.paymentDetails
      ? {
          fields: order.paymentDetails.fields,
          customNote: order.paymentDetails.customNote || '',
          sentAt: order.paymentDetails.sentAt,
        }
      : null,
    paymentConfirmation: order.paymentConfirmation
      ? {
          confirmedAt: order.paymentConfirmation.confirmedAt,
          referenceNumber: order.paymentConfirmation.referenceNumber || '',
        }
      : null,
  });
}
