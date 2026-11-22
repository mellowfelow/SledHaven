'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Send } from 'lucide-react';
import { SITE } from '@/config/site';
import type { StoredEnquiry } from '@/lib/enquiryStore';
import { useAdminPasscode } from '@/components/admin/AdminPasscodeContext';

function ReplyEnquiryInner() {
  const searchParams = useSearchParams();
  const id = (searchParams?.get('id') || '').trim().toUpperCase();
  const { adminFetch } = useAdminPasscode();

  const [enquiry, setEnquiry] = useState<StoredEnquiry | null>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(Boolean(id));
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sentInfo, setSentInfo] = useState<{ emailSent: boolean; reason?: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    adminFetch(`/api/admin/enquiries/${encodeURIComponent(id)}/`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.enquiry) {
          setEnquiry(data.enquiry);
          setSubject(`Re: ${data.enquiry.subject} — ${SITE.name}`);
          setBody(
            `Thank you for reaching out to ${SITE.name}.\n\nRegarding your inquiry:\n\nBest regards,\n${SITE.name} Concierge Desk\n${SITE.contact.phone}`
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, adminFetch]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!enquiry) return;
    setError('');
    setSentInfo(null);
    setSending(true);
    try {
      const res = await adminFetch('/api/admin/reply-enquiry/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiryId: enquiry.id,
          subject,
          body,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Failed to send reply.');
        setSending(false);
        return;
      }
      setSentInfo({ emailSent: Boolean(data.emailSent), reason: data.mailReason || undefined });
    } catch {
      setError('Network error sending reply.');
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center gap-2 text-sm text-[#5C636E]">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading enquiry...</span>
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="bg-white border border-[#E4E6E8] rounded-lg p-8 text-center space-y-3">
        <p className="text-sm text-[#5C636E]">Select an enquiry from the Enquiries list to compose a reply.</p>
        <Link href="/admin/enquiries/" className="text-xs font-medium text-[#9A6B3E] underline">
          Go to Enquiries
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Link
          href={`/admin/enquiries/${encodeURIComponent(enquiry.id)}/`}
          className="inline-flex items-center gap-1 text-xs text-[#5C636E] hover:text-[#111418]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Enquiry {enquiry.id}</span>
        </Link>
        <h1 className="font-serif text-2xl font-semibold text-[#111418]">
          Reply to {enquiry.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form
          onSubmit={handleSend}
          className="lg:col-span-6 bg-white border border-[#E4E6E8] rounded-lg p-6 space-y-4"
        >
          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {sentInfo && (
            <div className="p-3.5 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">
                  Reply recorded {sentInfo.emailSent ? '& emailed successfully!' : '(SMTP pending configuration)'}
                </p>
                {!sentInfo.emailSent && sentInfo.reason && (
                  <p className="text-emerald-800 mt-0.5">{sentInfo.reason}</p>
                )}
              </div>
            </div>
          )}

          <div className="p-3.5 rounded-md bg-[#F7F7F5] border border-[#E4E6E8] text-xs space-y-1">
            <p className="font-semibold text-[#111418]">Original Message from {enquiry.email}:</p>
            <p className="text-[#4F5863] whitespace-pre-wrap">{enquiry.message}</p>
          </div>

          <div>
            <label htmlFor="reply-subject" className="block text-xs font-medium text-[#111418] mb-1">
              Email Subject *
            </label>
            <input
              id="reply-subject"
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
            />
          </div>

          <div>
            <label htmlFor="reply-body" className="block text-xs font-medium text-[#111418] mb-1">
              Reply Message *
            </label>
            <textarea
              id="reply-body"
              rows={8}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full py-3 px-4 rounded-md text-sm font-medium text-white inline-flex items-center justify-center gap-2 cursor-pointer"
            style={{ backgroundColor: SITE.reply.brand.primary }}
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{sending ? 'Sending...' : 'Send Reply Email'}</span>
          </button>
        </form>

        {/* Live Light Email Preview */}
        <div className="lg:col-span-6 bg-white border border-[#E4E6E8] rounded-lg overflow-hidden">
          <div
            className="px-5 py-4 text-white border-b-2"
            style={{
              backgroundColor: SITE.reply.brand.headerDark,
              borderColor: SITE.reply.brand.primary,
            }}
          >
            <p className="font-serif text-lg font-semibold">{SITE.name}</p>
            <p className="text-[11px] text-[#C2C8D0]">{SITE.reply.headerTagline}</p>
          </div>
          <div className="p-6 bg-white text-[#111418] space-y-3 text-sm">
            <p className="text-xs text-[#646D78]">To: {enquiry.email}</p>
            <p className="font-semibold text-[#111418]">{subject}</p>
            <hr className="border-[#ECEEF0]" />
            <p className="text-xs text-[#334155]">Hello {enquiry.name},</p>
            <div className="whitespace-pre-wrap text-sm text-[#111418] leading-relaxed">
              {body}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReplyEnquiryPage() {
  return (
    <Suspense
      fallback={<div className="py-12 text-sm text-[#5C636E]">Loading reply composer...</div>}
    >
      <ReplyEnquiryInner />
    </Suspense>
  );
}
