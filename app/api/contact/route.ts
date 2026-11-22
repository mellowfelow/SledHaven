import { NextRequest, NextResponse } from 'next/server';
import { SITE } from '@/config/site';
import { calculateOrderTotals, generateOrderNumber } from '@/lib/order';
import { saveOrder, type StoredOrder } from '@/lib/orderStore';
import { generateEnquiryId, saveEnquiry, type StoredEnquiry } from '@/lib/enquiryStore';
import { sendMail } from '@/lib/mailer';
import {
  customerOrderConfirmationEmail,
  shopEnquiryNotificationEmail,
  shopOrderNotificationEmail,
} from '@/utils/emailTemplates';

function getOrigin(req: NextRequest): string {
  const appUrl = process.env.APP_URL?.trim();
  if (appUrl && /^https?:\/\//i.test(appUrl)) return appUrl.replace(/\/$/, '');
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  const proto = req.headers.get('x-forwarded-proto') || 'https';
  if (host) return `${proto}://${host}`;
  return SITE.url;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 160;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic honeypot anti-spam check
    if (body?.website && String(body.website).trim() !== '') {
      return NextResponse.json({ ok: true });
    }

    const formName = String(body?.formName || 'contact').toLowerCase();
    const origin = getOrigin(req);

    if (formName === 'order') {
      const name = String(body?.name || '').trim().slice(0, 120);
      const email = String(body?.email || '').trim().slice(0, 160);
      const phone = String(body?.phone || '').trim().slice(0, 40);
      const address = String(body?.address || '').trim().slice(0, 200);
      const city = String(body?.city || '').trim().slice(0, 80);
      const state = String(body?.state || '').trim().toUpperCase().slice(0, 2);
      const zip = String(body?.zip || '').trim().slice(0, 16);
      const notes = String(body?.notes || '').trim().slice(0, 600);
      const paymentMethod = String(body?.paymentMethod || '').trim().slice(0, 40);
      const channel = body?.channel === 'whatsapp' ? 'whatsapp' : 'email';
      const rawItems = Array.isArray(body?.items) ? body.items : [];

      if (!name || !isValidEmail(email) || !phone || !address || !city || !state || !zip) {
        return NextResponse.json(
          { error: 'Please complete all required contact and US delivery address fields.' },
          { status: 400 }
        );
      }

      if (paymentMethod === 'credit_card') {
        return NextResponse.json(
          { error: 'Credit card payments are temporarily unavailable. Please choose another payment method.' },
          { status: 400 }
        );
      }

      const validMethod = SITE.reply.paymentMethods.find(
        (m) => m.id === paymentMethod && m.available
      );
      if (!validMethod) {
        return NextResponse.json(
          { error: 'Please select a valid available payment method.' },
          { status: 400 }
        );
      }

      const calc = calculateOrderTotals(rawItems, state, paymentMethod);
      if (calc.items.length === 0) {
        return NextResponse.json(
          { error: 'Your bag contains no valid inventory items.' },
          { status: 400 }
        );
      }

      if (!calc.meetsMinOrder) {
        return NextResponse.json(
          { error: `Minimum order value is $${SITE.orderRules.minOrder}.` },
          { status: 400 }
        );
      }

      const orderNumber = generateOrderNumber();
      const now = new Date().toISOString();

      const order: StoredOrder = {
        id: orderNumber,
        orderNumber,
        createdAt: now,
        updatedAt: now,
        status: 'new',
        channel,
        customer: { name, email, phone, address, city, state, zip, notes: notes || undefined },
        paymentMethod,
        items: calc.items,
        subtotal: calc.subtotal,
        cryptoDiscount: calc.cryptoDiscount,
        shippingFee: calc.shippingFee,
        shippingLabel: calc.shippingLabel,
        transitDays: calc.transitDays,
        estimatedTax: calc.estimatedTax,
        total: calc.total,
        payIn4Installment: calc.payIn4Installment,
      };

      await saveOrder(order);

      const orderDest = process.env.ORDER_EMAIL?.trim() || SITE.contact.orderEmail;
      const adminUrl = `${origin}/admin/orders/${encodeURIComponent(orderNumber)}/`;

      // Unconditional customer confirmation email + shop notification (never gated on channel)
      const custMail = customerOrderConfirmationEmail(order);
      const shopMail = shopOrderNotificationEmail(order, adminUrl);

      const [customerMailResult, shopMailResult] = await Promise.all([
        sendMail({
          to: email,
          subject: custMail.subject,
          html: custMail.html,
          text: custMail.text,
          replyTo: orderDest,
        }),
        sendMail({
          to: orderDest,
          subject: shopMail.subject,
          html: shopMail.html,
          text: shopMail.text,
          replyTo: email,
        }),
      ]);

      return NextResponse.json({
        ok: true,
        orderNumber,
        total: order.total,
        subtotal: order.subtotal,
        cryptoDiscount: order.cryptoDiscount,
        shippingFee: order.shippingFee,
        estimatedTax: order.estimatedTax,
        payIn4Installment: order.payIn4Installment,
        customerEmailSent: customerMailResult.sent,
        shopEmailSent: shopMailResult.sent,
      });
    }

    // Contact / Financing Enquiry handler
    const name = String(body?.name || '').trim().slice(0, 120);
    const email = String(body?.email || '').trim().slice(0, 160);
    const phone = String(body?.phone || '').trim().slice(0, 40);
    const subject = String(body?.subject || 'Dealership Inquiry').trim().slice(0, 160);
    const message = String(body?.message || '').trim().slice(0, 2000);
    const type =
      formName === 'financing' ? 'financing' : formName === 'general' ? 'general' : 'contact';

    if (!name || !isValidEmail(email) || !message) {
      return NextResponse.json(
        { error: 'Please provide your name, a valid email address, and your message.' },
        { status: 400 }
      );
    }

    const id = generateEnquiryId();
    const now = new Date().toISOString();

    const enquiry: StoredEnquiry = {
      id,
      createdAt: now,
      updatedAt: now,
      type,
      status: 'new',
      name,
      email,
      phone: phone || undefined,
      subject,
      message,
    };

    await saveEnquiry(enquiry);

    const contactDest = process.env.CONTACT_EMAIL?.trim() || SITE.contact.email;
    const adminUrl = `${origin}/admin/enquiries/${encodeURIComponent(id)}/`;
    const mail = shopEnquiryNotificationEmail(enquiry, adminUrl);

    const mailRes = await sendMail({
      to: contactDest,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      replyTo: email,
    });

    return NextResponse.json({
      ok: true,
      enquiryId: id,
      emailSent: mailRes.sent,
    });
  } catch (err) {
    console.error('POST /api/contact error:', err);
    return NextResponse.json(
      { error: 'Unable to process your submission right now. Please try again.' },
      { status: 500 }
    );
  }
}
