import { SITE } from '@/config/site';
import { money, parsePaymentDetail, paymentMethodParts } from '@/lib/order';

function cleanPhone(num: string): string {
  return String(num || '').replace(/[^\d]/g, '');
}

/**
 * Every customer-originated WhatsApp message carries the site name as a bold
 * header line first, so the dealer desk can see at a glance which business
 * the chat is about — regardless of which page/link the customer tapped.
 */
function customerMessage(lines: string[]): string {
  return [`*${SITE.name}*`, ...lines].join('\n');
}

export function waLink(message: string): string {
  const phone = cleanPhone(SITE.contact.whatsapp);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function waLinkTo(phoneNumber: string, message: string): string {
  const cleaned = cleanPhone(phoneNumber);
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

/**
 * Customer-originated WhatsApp links ALWAYS start with literal "Hi {SITE.name},"
 */
export function waGeneralInquiryLink(topic?: string): string {
  const text = customerMessage([
    topic
      ? `Hi, I have a question regarding ${topic}.`
      : `Hi, I would like assistance with selecting a snowmobile.`,
  ]);
  return waLink(text);
}

export function waOrderLink(orderNumber: string, customerName: string, total: number): string {
  const text = customerMessage([
    `Hi, I just placed order ${orderNumber} (${money(total)}).`,
    `Name: ${customerName}`,
    `Please let me know once payment instructions are ready.`,
  ]);
  return waLink(text);
}

export function waPaymentConfirmationLink(orderNumber: string): string {
  const text = customerMessage([
    `Hi, I have completed payment for order ${orderNumber}. Here is my confirmation screenshot.`,
  ]);
  return waLink(text);
}

export interface WhatsAppCheckoutItem {
  name: string;
  quantity: number;
  lineTotal: number;
}

/**
 * Pre-filled WhatsApp checkout message listing the customer's cart so a
 * human at the dealership desk can pick up the order and send payment
 * instructions, without the customer filling the web checkout form.
 */
export function waCheckoutLink(items: WhatsAppCheckoutItem[], total: number): string {
  const text = customerMessage([
    `Hi, I'd like to check out with the following:`,
    '',
    ...items.map((item) => `${item.quantity}x ${item.name} — ${money(item.lineTotal)}`),
    '',
    `Estimated Total: ${money(total)}`,
    `Please send me payment instructions to complete my order.`,
  ]);
  return waLink(text);
}

/**
 * Admin-originated WhatsApp messages keep the bold "*{SITE.name}*" header (never mixed with customer opener).
 */
export function waPaymentDetailsMessage(params: {
  orderNumber: string;
  customerName: string;
  paymentMethod: string;
  paymentPlan?: 'full' | 'pay_in_4';
  total: number;
  rawDetail: string;
  paymentPageUrl: string;
  confirmPageUrl: string;
}): string {
  const method = paymentMethodParts(params.paymentMethod);
  const fields = parsePaymentDetail(params.rawDetail);
  const isPayIn4 = params.paymentPlan === 'pay_in_4';
  const dueNow = isPayIn4
    ? `${money(Math.round((params.total / 4) * 100) / 100)} (Installment 1 of 4 — Total ${money(params.total)})`
    : money(params.total);

  const detailLines = fields.map((f) => `${f.label}: ${f.value}`).join('\n');

  return [
    `*${SITE.name}*`,
    `Hello ${params.customerName},`,
    '',
    method.opening,
    '',
    `Order Reference: ${params.orderNumber}`,
    `Method: ${method.label}`,
    `Plan: ${isPayIn4 ? 'Pay-in-4 Financing' : 'Pay in Full (100%)'}`,
    `Amount Due: ${dueNow}`,
    '',
    detailLines,
    '',
    method.closing,
  ].join('\n');
}

export function waPaymentDetailsLink(
  customerPhone: string,
  params: Parameters<typeof waPaymentDetailsMessage>[0]
): string {
  return waLinkTo(customerPhone, waPaymentDetailsMessage(params));
}
