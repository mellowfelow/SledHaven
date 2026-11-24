import { hashDelete, hashGet, hashGetAll, hashSet } from '@/lib/redis';
import type { OrderItemSnapshot, ParsedPaymentField } from '@/lib/order';

export type OrderStatus =
  | 'new'
  | 'payment_sent'
  | 'payment_confirmed'
  | 'dispatched'
  | 'cancelled';

export interface StoredOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  channel: 'email' | 'whatsapp';
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    notes?: string;
  };
  paymentMethod: string;
  /** 'full' (pay 100% upfront) or 'pay_in_4' (25% today + 3 installments). Older orders predating
   *  this field had Pay-in-4 selected as if it were a payment method — treat a missing value as 'full'. */
  paymentPlan: 'full' | 'pay_in_4';
  items: OrderItemSnapshot[];
  subtotal: number;
  cryptoDiscount: number;
  shippingFee: number;
  shippingLabel: string;
  transitDays: string;
  estimatedTax: number;
  total: number;
  payIn4Installment: number | null;
  paymentDetails?: {
    rawDetail: string;
    fields: ParsedPaymentField[];
    customNote?: string;
    sentAt: string;
    emailSent: boolean;
  };
  paymentConfirmation?: {
    confirmedAt: string;
    fileName?: string;
    note?: string;
    referenceNumber?: string;
  };
}

const ORDERS_HASH = 'sledhaven:orders';

export async function saveOrder(order: StoredOrder): Promise<StoredOrder> {
  await hashSet(ORDERS_HASH, order.orderNumber, order);
  return order;
}

export async function getOrder(orderNumber: string): Promise<StoredOrder | null> {
  if (!orderNumber) return null;
  return hashGet<StoredOrder>(ORDERS_HASH, orderNumber.trim().toUpperCase());
}

export async function listOrders(): Promise<StoredOrder[]> {
  const all = await hashGetAll<StoredOrder>(ORDERS_HASH);
  return all.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function markOrderSent(
  orderNumber: string,
  payload: {
    rawDetail: string;
    fields: ParsedPaymentField[];
    customNote?: string;
    emailSent: boolean;
  }
): Promise<StoredOrder | null> {
  const existing = await getOrder(orderNumber);
  if (!existing) return null;
  const now = new Date().toISOString();
  const updated: StoredOrder = {
    ...existing,
    status: 'payment_sent',
    updatedAt: now,
    paymentDetails: {
      rawDetail: payload.rawDetail,
      fields: payload.fields,
      customNote: payload.customNote,
      sentAt: now,
      emailSent: payload.emailSent,
    },
  };
  await saveOrder(updated);
  return updated;
}

export async function markPaymentConfirmed(
  orderNumber: string,
  payload: {
    fileName?: string;
    note?: string;
    referenceNumber?: string;
  }
): Promise<StoredOrder | null> {
  const existing = await getOrder(orderNumber);
  if (!existing) return null;
  const now = new Date().toISOString();
  const updated: StoredOrder = {
    ...existing,
    status: 'payment_confirmed',
    updatedAt: now,
    paymentConfirmation: {
      confirmedAt: now,
      fileName: payload.fileName,
      note: payload.note,
      referenceNumber: payload.referenceNumber,
    },
  };
  await saveOrder(updated);
  return updated;
}

export async function updateOrderStatus(
  orderNumber: string,
  status: OrderStatus
): Promise<StoredOrder | null> {
  const existing = await getOrder(orderNumber);
  if (!existing) return null;
  const updated: StoredOrder = {
    ...existing,
    status,
    updatedAt: new Date().toISOString(),
  };
  await saveOrder(updated);
  return updated;
}

export async function deleteOrder(orderNumber: string): Promise<void> {
  await hashDelete(ORDERS_HASH, orderNumber.trim().toUpperCase());
}
