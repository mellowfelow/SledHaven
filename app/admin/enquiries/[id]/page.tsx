'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Reply } from 'lucide-react';
import type { StoredEnquiry } from '@/lib/enquiryStore';
import { useAdminPasscode } from '@/components/admin/AdminPasscodeContext';
import StatusBadge from '@/components/admin/StatusBadge';

export default function AdminEnquiryDetailPage() {
  const params = useParams();
  const id = String(params?.id || '');
  const { adminFetch } = useAdminPasscode();

  const [enquiry, setEnquiry] = useState<StoredEnquiry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    adminFetch(`/api/admin/enquiries/${encodeURIComponent(id)}/`)
      .then((res) => res.json())
      .then((data) => setEnquiry(data.enquiry || null))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
        <p className="text-sm text-[#5C636E]">Enquiry not found.</p>
        <Link href="/admin/enquiries/" className="text-xs font-medium text-[#9A6B3E] underline">
          Return to Enquiries
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/admin/enquiries/"
            className="inline-flex items-center gap-1 text-xs text-[#5C636E] hover:text-[#111418]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Enquiries</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl font-semibold text-[#111418]">
              {enquiry.subject}
            </h1>
            <StatusBadge status={enquiry.status} />
          </div>
        </div>

        <Link
          href={`/admin/reply-enquiry/?id=${encodeURIComponent(enquiry.id)}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium text-white bg-[#9A6B3E] hover:bg-[#835931]"
        >
          <Reply className="w-3.5 h-3.5" />
          <span>Compose Reply</span>
        </Link>
      </div>

      <div className="bg-white border border-[#E4E6E8] rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-[#ECEEF0] text-xs">
          <div>
            <span className="text-[#646D78] block">From</span>
            <span className="font-semibold text-[#111418]">{enquiry.name}</span>
          </div>
          <div>
            <span className="text-[#646D78] block">Email</span>
            <span className="font-medium text-[#111418]">{enquiry.email}</span>
          </div>
          <div>
            <span className="text-[#646D78] block">Phone</span>
            <span className="font-medium text-[#111418]">{enquiry.phone || 'Not provided'}</span>
          </div>
        </div>

        <div className="text-sm text-[#111418] whitespace-pre-wrap leading-relaxed">
          {enquiry.message}
        </div>
      </div>

      {enquiry.reply && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 space-y-2 text-sm text-emerald-950">
          <div className="flex items-center justify-between text-xs text-emerald-800">
            <span className="font-semibold">Reply Sent: {enquiry.reply.subject}</span>
            <span>{new Date(enquiry.reply.sentAt).toLocaleString()}</span>
          </div>
          <p className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
            {enquiry.reply.body}
          </p>
        </div>
      )}
    </div>
  );
}
