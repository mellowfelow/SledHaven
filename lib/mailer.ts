import nodemailer, { type Transporter } from 'nodemailer';
import { Resend } from 'resend';
import { SITE } from '@/config/site';

let cachedTransporter: Transporter | null = null;

export interface MailAttachment {
  filename: string;
  content: Buffer;
  contentType?: string;
}

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  attachments?: MailAttachment[];
}

export interface SendMailResult {
  sent: boolean;
  provider: 'smtp' | 'resend' | 'none';
  messageId?: string;
  reason?: string;
}

function getSmtpTransporter(): Transporter | null {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!host || !user || !pass) {
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return cachedTransporter;
}

export function isMailerConfigured(): boolean {
  if (SITE.forms.provider === 'resend') {
    return Boolean(process.env.RESEND_API_KEY?.trim());
  }
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim()
  );
}

/**
 * Lazy singleton mailer. Never crashes when SMTP/Resend env vars are unconfigured —
 * cleanly returns { sent: false, provider: 'none', reason: 'SMTP not configured' }.
 */
export async function sendMail(options: SendMailOptions): Promise<SendMailResult> {
  const from =
    process.env.SMTP_FROM?.trim() || `${SITE.name} <${SITE.contact.orderEmail}>`;

  if (SITE.forms.provider === 'resend') {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) {
      return { sent: false, provider: 'none', reason: 'Resend API key not configured' };
    }
    try {
      const resend = new Resend(apiKey);
      const result = await resend.emails.send({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo,
      });
      return {
        sent: !result.error,
        provider: 'resend',
        messageId: result.data?.id,
        reason: result.error?.message,
      };
    } catch (err) {
      return {
        sent: false,
        provider: 'resend',
        reason: err instanceof Error ? err.message : 'Resend send failed',
      };
    }
  }

  const transporter = getSmtpTransporter();
  if (!transporter) {
    return { sent: false, provider: 'none', reason: 'SMTP credentials pending configuration' };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
      attachments: options.attachments,
    });
    return {
      sent: true,
      provider: 'smtp',
      messageId: info.messageId,
    };
  } catch (err) {
    return {
      sent: false,
      provider: 'smtp',
      reason: err instanceof Error ? err.message : 'SMTP send failed',
    };
  }
}
