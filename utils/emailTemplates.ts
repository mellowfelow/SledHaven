import { SITE } from '@/config/site';
import {
  escapeHtml,
  money,
  paymentMethodParts,
  paymentTermsHtml,
  type ParsedPaymentField,
} from '@/lib/order';
import type { StoredOrder } from '@/lib/orderStore';
import type { StoredEnquiry } from '@/lib/enquiryStore';

const BRAND = SITE.reply.brand;

/**
 * STRICT LIGHT SHELL for all outbound HTML emails:
 * White card body, dark brand header band (SITE.reply.brand.headerDark),
 * near-black body typography, brand color (SITE.reply.brand.primary) as accent ONLY.
 * Never a dark body (prevents Zoho/Gmail dark-mode force inversion).
 */
export function emailShell(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111418;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F3F4F6;padding:28px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
          <!-- Dark Brand Header Band -->
          <tr>
            <td style="background-color:${BRAND.headerDark};padding:24px 28px;border-bottom:3px solid ${BRAND.primary};">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;letter-spacing:0.04em;color:#FFFFFF;">
                ${escapeHtml(SITE.name)}
              </div>
              <div style="font-size:12px;color:#CBD5E1;margin-top:4px;">
                ${escapeHtml(SITE.reply.headerTagline)}
              </div>
            </td>
          </tr>

          <!-- White Light Body -->
          <tr>
            <td style="padding:28px;background-color:#FFFFFF;color:#111418;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Quiet Light Footer -->
          <tr>
            <td style="padding:18px 28px;background-color:#F9FAFB;border-top:1px solid #E5E7EB;font-size:12px;color:#64748B;line-height:1.6;">
              <strong style="color:#111418;">${escapeHtml(SITE.name)}</strong> · ${escapeHtml(SITE.location.display)}<br />
              Phone: ${escapeHtml(SITE.contact.phone)} · Web: ${escapeHtml(SITE.domain)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function emailField(label: string, value: string): string {
  return `<div style="padding:10px 0;border-bottom:1px solid #F1F5F9;">
    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#64748B;margin-bottom:3px;">${escapeHtml(label)}</div>
    <div style="font-size:14px;font-weight:600;color:#111418;word-break:break-word;">${escapeHtml(value)}</div>
  </div>`;
}

export function emailDivider(): string {
  return `<hr style="border:none;border-top:1px solid #E5E7EB;margin:20px 0;" />`;
}

export function emailCallout(title: string, text: string): string {
  return `<div style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:6px;padding:16px;margin:18px 0;">
    <div style="font-size:12px;font-weight:700;color:${BRAND.primary};text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">${escapeHtml(title)}</div>
    <div style="font-size:13px;color:#334155;line-height:1.6;">${escapeHtml(text)}</div>
  </div>`;
}

export function emailButton(label: string, href: string): string {
  const safeHref = /^https?:\/\//i.test(href) ? href : '#';
  return `<div style="margin:22px 0;">
    <a href="${escapeHtml(safeHref)}" style="display:inline-block;background-color:${BRAND.primary};color:#FFFFFF;font-size:14px;font-weight:600;text-decoration:none;padding:12px 22px;border-radius:6px;">
      ${escapeHtml(label)}
    </a>
  </div>`;
}

function orderItemsTableHtml(order: StoredOrder): string {
  const rows = order.items
    .map(
      (item) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;color:#111418;">
          <strong>${escapeHtml(item.name)}</strong><br />
          <span style="font-size:12px;color:#64748B;">SKU: ${escapeHtml(item.sku)} · Qty ${item.quantity}</span>
        </td>
        <td align="right" style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:600;color:#111418;white-space:nowrap;">
          ${escapeHtml(money(item.lineTotal))}
        </td>
      </tr>`
    )
    .join('');

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:14px 0;">
    ${rows}
    <tr>
      <td style="padding:8px 0;font-size:13px;color:#475569;">Subtotal</td>
      <td align="right" style="padding:8px 0;font-size:13px;color:#111418;">${escapeHtml(money(order.subtotal))}</td>
    </tr>
    ${
      order.cryptoDiscount > 0
        ? `<tr>
            <td style="padding:6px 0;font-size:13px;color:${BRAND.primary};font-weight:600;">Crypto Discount (${SITE.orderRules.cryptoDiscountPercent}%)</td>
            <td align="right" style="padding:6px 0;font-size:13px;color:${BRAND.primary};font-weight:600;">-${escapeHtml(money(order.cryptoDiscount))}</td>
          </tr>`
        : ''
    }
    <tr>
      <td style="padding:6px 0;font-size:13px;color:#475569;">${escapeHtml(order.shippingLabel)}</td>
      <td align="right" style="padding:6px 0;font-size:13px;color:#111418;">${order.shippingFee === 0 ? 'FREE' : escapeHtml(money(order.shippingFee))}</td>
    </tr>
    <tr>
      <td style="padding:6px 0;font-size:13px;color:#475569;">Estimated State Tax (${escapeHtml(order.customer.state)})</td>
      <td align="right" style="padding:6px 0;font-size:13px;color:#111418;">${escapeHtml(money(order.estimatedTax))}</td>
    </tr>
    <tr>
      <td style="padding:12px 0 4px 0;border-top:2px solid #111418;font-size:15px;font-weight:700;color:#111418;">Order Total</td>
      <td align="right" style="padding:12px 0 4px 0;border-top:2px solid #111418;font-size:16px;font-weight:700;color:#111418;">${escapeHtml(money(order.total))}</td>
    </tr>
  </table>`;
}

/**
 * Unconditional customer confirmation email sent immediately when any order is placed.
 * Deliberately contains NO bank/wallet details — directs customer to watch for payment-details email.
 */
export function customerOrderConfirmationEmail(order: StoredOrder): {
  subject: string;
  html: string;
  text: string;
} {
  const method = paymentMethodParts(order.paymentMethod);
  const subject = `${SITE.name} Order Received — ${order.orderNumber}`;
  const body = `
    <h1 style="margin:0 0 10px 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#111418;">
      Thank you for your order, ${escapeHtml(order.customer.name)}
    </h1>
    <p style="margin:0 0 16px 0;font-size:14px;color:#334155;line-height:1.6;">
      We have received your SledHaven reservation <strong>${escapeHtml(order.orderNumber)}</strong>. Our dealership allocation desk is verifying inventory and preparing your personalized payment instructions for <strong>${escapeHtml(method.label)}</strong>.
    </p>
    ${emailCallout(
      'Next Step — Watch for Your Payment Instructions',
      'You will receive a follow-up email shortly containing your verified settlement details and a direct tap-to-copy payment page. No payment has been charged yet.'
    )}
    ${orderItemsTableHtml(order)}
    ${emailDivider()}
    ${emailField('Delivery Destination', `${order.customer.address}, ${order.customer.city}, ${order.customer.state} ${order.customer.zip}`)}
    ${emailField('Estimated Transit', order.transitDays)}
    ${emailField('Selected Payment Method', method.label)}
  `;

  return {
    subject,
    html: emailShell(subject, body),
    text: `Thank you for your ${SITE.name} order ${order.orderNumber}. Total: ${money(order.total)}. Payment method: ${method.label}. Watch for your payment-details email shortly.`,
  };
}

export function shopOrderNotificationEmail(
  order: StoredOrder,
  adminOrderUrl: string
): { subject: string; html: string; text: string } {
  const method = paymentMethodParts(order.paymentMethod);
  const subject = `[New Order] ${order.orderNumber} — ${money(order.total)} (${order.customer.state})`;
  const body = `
    <h1 style="margin:0 0 12px 0;font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#111418;">
      New Order Received: ${escapeHtml(order.orderNumber)}
    </h1>
    ${emailField('Customer', `${order.customer.name} (${order.customer.email})`)}
    ${emailField('Phone', order.customer.phone)}
    ${emailField('Shipping Address', `${order.customer.address}, ${order.customer.city}, ${order.customer.state} ${order.customer.zip}`)}
    ${emailField('Payment Method', method.label)}
    ${order.customer.notes ? emailField('Customer Notes', order.customer.notes) : ''}
    ${orderItemsTableHtml(order)}
    ${emailButton('Open in Reply Portal', adminOrderUrl)}
  `;

  return {
    subject,
    html: emailShell(subject, body),
    text: `New order ${order.orderNumber} from ${order.customer.name} (${order.customer.email}) for ${money(order.total)}. Open Reply Portal: ${adminOrderUrl}`,
  };
}

export function paymentDetailsEmail(params: {
  order: StoredOrder;
  fields: ParsedPaymentField[];
  customNote?: string;
  paymentPageUrl: string;
  confirmPageUrl: string;
}): { subject: string; html: string; text: string } {
  const { order, fields, customNote, paymentPageUrl, confirmPageUrl } = params;
  const method = paymentMethodParts(order.paymentMethod);
  const subject = `Payment Details for ${SITE.name} Order ${order.orderNumber}`;

  const fieldsHtml = fields.map((f) => emailField(f.label, f.value)).join('');

  const body = `
    <h1 style="margin:0 0 10px 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#111418;">
      Payment Instructions — ${escapeHtml(order.orderNumber)}
    </h1>
    <p style="margin:0 0 16px 0;font-size:14px;color:#334155;line-height:1.6;">
      Hello ${escapeHtml(order.customer.name)},<br /><br />
      ${escapeHtml(method.opening)}
    </p>
    ${customNote ? emailCallout('Dealership Desk Note', customNote) : ''}
    <div style="border:1px solid #E2E8F0;border-radius:8px;padding:16px 20px;margin:18px 0;background-color:#FFFFFF;">
      <div style="font-size:12px;font-weight:700;color:${BRAND.primary};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">
        Verified ${escapeHtml(method.label)} Details
      </div>
      ${fieldsHtml}
    </div>
    ${emailButton('Open Tap-to-Copy Payment Page', paymentPageUrl)}
    <p style="margin:0 0 14px 0;font-size:13px;color:#334155;line-height:1.6;">
      ${escapeHtml(method.closing)}
    </p>
    <p style="margin:0 0 16px 0;font-size:13px;">
      Already sent payment? <a href="${escapeHtml(confirmPageUrl)}" style="color:${BRAND.primary};font-weight:600;">Upload your payment confirmation screenshot</a>.
    </p>
    ${emailDivider()}
    ${paymentTermsHtml(order.paymentMethod, order.total, order.orderNumber)}
  `;

  return {
    subject,
    html: emailShell(subject, body),
    text: `Payment details for ${SITE.name} order ${order.orderNumber}. Open tap-to-copy page: ${paymentPageUrl}. Confirm payment: ${confirmPageUrl}.`,
  };
}

export function paymentScreenshotNotificationEmail(params: {
  order: StoredOrder;
  referenceNumber?: string;
  note?: string;
  fileName?: string;
}): { subject: string; html: string; text: string } {
  const { order, referenceNumber, note, fileName } = params;
  const subject = `[Payment Receipt Uploaded] ${order.orderNumber} — ${money(order.total)}`;
  const body = `
    <h1 style="margin:0 0 10px 0;font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#111418;">
      Customer Confirmed Payment — ${escapeHtml(order.orderNumber)}
    </h1>
    ${emailField('Customer', `${order.customer.name} (${order.customer.email})`)}
    ${emailField('Amount', money(order.total))}
    ${referenceNumber ? emailField('Transaction / Reference ID', referenceNumber) : ''}
    ${fileName ? emailField('Uploaded Screenshot', fileName) : ''}
    ${note ? emailField('Customer Note', note) : ''}
  `;
  return {
    subject,
    html: emailShell(subject, body),
    text: `Payment confirmation received for ${order.orderNumber} from ${order.customer.name}.`,
  };
}

export function shopEnquiryNotificationEmail(
  enquiry: StoredEnquiry,
  adminEnquiryUrl: string
): { subject: string; html: string; text: string } {
  const subject = `[Enquiry] ${enquiry.subject} — ${enquiry.name}`;
  const body = `
    <h1 style="margin:0 0 12px 0;font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#111418;">
      New Dealership Enquiry (${escapeHtml(enquiry.id)})
    </h1>
    ${emailField('From', `${enquiry.name} (${enquiry.email})`)}
    ${enquiry.phone ? emailField('Phone', enquiry.phone) : ''}
    ${emailField('Topic', enquiry.subject)}
    ${emailCallout('Message', enquiry.message)}
    ${emailButton('Reply in Portal', adminEnquiryUrl)}
  `;

  return {
    subject,
    html: emailShell(subject, body),
    text: `New enquiry ${enquiry.id} from ${enquiry.name}: ${enquiry.message}`,
  };
}

export function enquiryReplyEmail(params: {
  enquiry: StoredEnquiry;
  replySubject: string;
  replyBody: string;
}): { subject: string; html: string; text: string } {
  const { enquiry, replySubject, replyBody } = params;
  const formattedBody = replyBody
    .split(/\r?\n/)
    .map((line) => (line.trim() ? `<p style="margin:0 0 12px 0;font-size:14px;color:#111418;line-height:1.65;">${escapeHtml(line)}</p>` : '<br />'))
    .join('');

  const body = `
    <p style="margin:0 0 14px 0;font-size:14px;color:#334155;">Hello ${escapeHtml(enquiry.name)},</p>
    ${formattedBody}
    ${emailDivider()}
    <div style="font-size:12px;color:#64748B;">
      In reference to enquiry <strong>${escapeHtml(enquiry.id)}</strong> — "${escapeHtml(enquiry.subject)}"
    </div>
  `;

  return {
    subject: replySubject,
    html: emailShell(replySubject, body),
    text: `Hello ${enquiry.name},\n\n${replyBody}\n\n— ${SITE.name} (${SITE.contact.phone})`,
  };
}
