import { NextRequest, NextResponse } from 'next/server';
import { SITE } from '@/config/site';
import { getOrder, markPaymentConfirmed } from '@/lib/orderStore';
import { sendMail } from '@/lib/mailer';
import { paymentScreenshotNotificationEmail } from '@/utils/emailTemplates';

const ORDER_ID_RE = /^[A-Z0-9-]{4,32}$/;
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'application/pdf',
]);
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const orderNumber = String(formData.get('orderNumber') || '').trim().toUpperCase();
    const referenceNumber = String(formData.get('referenceNumber') || '').trim().slice(0, 120);
    const note = String(formData.get('note') || '').trim().slice(0, 600);
    const file = formData.get('screenshot');

    if (!orderNumber || !ORDER_ID_RE.test(orderNumber)) {
      return NextResponse.json({ error: 'Please provide a valid order number.' }, { status: 400 });
    }

    const order = await getOrder(orderNumber);
    if (!order) {
      return NextResponse.json({ error: 'Order reference not found.' }, { status: 404 });
    }

    let safeFileName: string | undefined;
    let attachmentBuffer: Buffer | undefined;
    let attachmentMime: string | undefined;

    if (file && typeof file === 'object' && 'arrayBuffer' in file && file.size > 0) {
      if (file.size > MAX_BYTES) {
        return NextResponse.json(
          { error: 'Screenshot file must be 5 MB or smaller.' },
          { status: 400 }
        );
      }
      if (!ALLOWED_MIME.has(file.type)) {
        return NextResponse.json(
          { error: 'Unsupported file type. Upload a JPG, PNG, WebP, or PDF receipt.' },
          { status: 400 }
        );
      }
      const rawName = (file.name || 'receipt').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
      safeFileName = `${orderNumber}-${rawName}`;
      attachmentMime = file.type;
      attachmentBuffer = Buffer.from(await file.arrayBuffer());
    }

    if (!safeFileName && !referenceNumber) {
      return NextResponse.json(
        { error: 'Please upload a payment screenshot or enter your transaction reference ID.' },
        { status: 400 }
      );
    }

    const updated = await markPaymentConfirmed(orderNumber, {
      fileName: safeFileName,
      note: note || undefined,
      referenceNumber: referenceNumber || undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Unable to update order.' }, { status: 500 });
    }

    const orderDest = process.env.ORDER_EMAIL?.trim() || SITE.contact.orderEmail;
    const mail = paymentScreenshotNotificationEmail({
      order: updated,
      referenceNumber: referenceNumber || undefined,
      note: note || undefined,
      fileName: safeFileName,
    });

    const mailRes = await sendMail({
      to: orderDest,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      replyTo: updated.customer.email,
      attachments:
        attachmentBuffer && safeFileName
          ? [
              {
                filename: safeFileName,
                content: attachmentBuffer,
                contentType: attachmentMime,
              },
            ]
          : undefined,
    });

    return NextResponse.json({
      ok: true,
      orderNumber: updated.orderNumber,
      status: updated.status,
      emailSent: mailRes.sent,
    });
  } catch (err) {
    console.error('POST /api/order/confirm-payment error:', err);
    return NextResponse.json(
      { error: 'Failed to submit payment confirmation. Please try again.' },
      { status: 500 }
    );
  }
}
