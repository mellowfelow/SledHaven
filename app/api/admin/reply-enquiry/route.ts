import { NextRequest, NextResponse } from 'next/server';
import { SITE } from '@/config/site';
import { checkAdminPasscode } from '@/lib/adminAuth';
import { getEnquiry, markEnquiryReplied } from '@/lib/enquiryStore';
import { sendMail } from '@/lib/mailer';
import { enquiryReplyEmail } from '@/utils/emailTemplates';

export async function POST(req: NextRequest) {
  if (!(await checkAdminPasscode(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const enquiryId = String(body?.enquiryId || '').trim().toUpperCase();
    const replySubject = String(body?.subject || '').trim().slice(0, 180);
    const replyBody = String(body?.body || '').trim().slice(0, 4000);

    if (!enquiryId || !replySubject || !replyBody) {
      return NextResponse.json(
        { error: 'Enquiry ID, subject, and reply body are required.' },
        { status: 400 }
      );
    }

    const enquiry = await getEnquiry(enquiryId);
    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found.' }, { status: 404 });
    }

    const mail = enquiryReplyEmail({
      enquiry,
      replySubject,
      replyBody,
    });

    const replyTo = process.env.CONTACT_EMAIL?.trim() || SITE.contact.email;
    const mailRes = await sendMail({
      to: enquiry.email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      replyTo,
    });

    const updated = await markEnquiryReplied(enquiryId, {
      subject: replySubject,
      body: replyBody,
      emailSent: mailRes.sent,
    });

    return NextResponse.json({
      ok: true,
      enquiry: updated,
      emailSent: mailRes.sent,
      mailReason: mailRes.reason || null,
    });
  } catch (err) {
    console.error('POST /api/admin/reply-enquiry error:', err);
    return NextResponse.json(
      { error: 'Failed to send reply.' },
      { status: 500 }
    );
  }
}
