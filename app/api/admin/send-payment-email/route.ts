import { NextRequest, NextResponse } from 'next/server';
import { SITE } from '@/config/site';
import { checkAdminPasscode } from '@/lib/adminAuth';
import { getOrder, markOrderSent } from '@/lib/orderStore';
import { parsePaymentDetail } from '@/lib/order';
import { sendMail } from '@/lib/mailer';
import { paymentDetailsEmail } from '@/utils/emailTemplates';

function getOrigin(req: NextRequest): string {
  const appUrl = process.env.APP_URL?.trim();
  if (appUrl && /^https?:\/\//i.test(appUrl)) return appUrl.replace(/\/$/, '');
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  const proto = req.headers.get('x-forwarded-proto') || 'https';
  if (host) return `${proto}://${host}`;
  return SITE.url;
}

export async function POST(req: NextRequest) {
  if (!(await checkAdminPasscode(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const orderNumber = String(body?.orderNumber || '').trim().toUpperCase();
    const rawDetail = String(body?.rawDetail || '').trim().slice(0, 2000);
    const customNote = String(body?.customNote || '').trim().slice(0, 800);

    if (!orderNumber || !rawDetail) {
      return NextResponse.json(
        { error: 'Order number and payment details are required.' },
        { status: 400 }
      );
    }

    const order = await getOrder(orderNumber);
    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    const fields = parsePaymentDetail(rawDetail);
    if (fields.length === 0) {
      return NextResponse.json(
        { error: 'Unable to parse payment detail fields.' },
        { status: 400 }
      );
    }

    const origin = getOrigin(req);
    const paymentPageUrl = `${origin}/order/payment-details/?order=${encodeURIComponent(order.orderNumber)}`;
    const confirmPageUrl = `${origin}/order/confirm-payment/?order=${encodeURIComponent(order.orderNumber)}`;

    const email = paymentDetailsEmail({
      order,
      fields,
      customNote: customNote || undefined,
    });

    const replyTo = process.env.ORDER_EMAIL?.trim() || SITE.contact.orderEmail;
    const mailRes = await sendMail({
      to: order.customer.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
      replyTo,
    });

    const updated = await markOrderSent(order.orderNumber, {
      rawDetail,
      fields,
      customNote: customNote || undefined,
      emailSent: mailRes.sent,
    });

    return NextResponse.json({
      ok: true,
      order: updated,
      fields,
      paymentPageUrl,
      confirmPageUrl,
      emailSent: mailRes.sent,
      mailReason: mailRes.reason || null,
    });
  } catch (err) {
    console.error('POST /api/admin/send-payment-email error:', err);
    return NextResponse.json(
      { error: 'Failed to send payment details.' },
      { status: 500 }
    );
  }
}
