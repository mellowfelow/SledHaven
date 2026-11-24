import { SITE } from '@/config/site';
import { money, parsePaymentDetail, paymentMethodParts } from '@/lib/order';

function cleanPhone(num: string): string {
  return String(num || '').replace(/[^\d]/g, '');
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
  const text = topic
    ? `Hi ${SITE.name}, I have a question regarding ${topic}.`
    : `Hi ${SITE.name}, I would like assistance with selecting a snowmobile.`;
  return waLink(text);
}

export function waOrderLink(orderNumber: string, customerName: string, total: number): string {
  const text = [
    `Hi ${SITE.name}, I just placed order ${orderNumber} (${money(total)}).`,
    `Name: ${customerName}`,
    `Please let me know once payment instructions are ready.`,
  ].join('\n');
  return waLink(text);
}

export function waPaymentConfirmationLink(orderNumber: string): string {
  const text = `Hi ${SITE.name}, I have completed payment for order ${orderNumber} and uploaded my confirmation screenshot.`;
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
    `Tap-to-copy payment page: ${params.paymentPageUrl}`,
    `Upload payment receipt: ${params.confirmPageUrl}`,
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
