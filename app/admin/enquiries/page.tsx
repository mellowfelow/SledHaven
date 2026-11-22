'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Reply, Trash2 } from 'lucide-react';
import type { StoredEnquiry } from '@/lib/enquiryStore';
import { useAdminPasscode } from '@/components/admin/AdminPasscodeContext';
import StatusBadge from '@/components/admin/StatusBadge';

export default function AdminEnquiriesPage() {
  const { adminFetch } = useAdminPasscode();
  const [enquiries, setEnquiries] = useState<StoredEnquiry[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch('/api/admin/enquiries/')
      .then((res) => res.json())
      .then((data) => setEnquiries(Array.isArray(data.enquiries) ? data.enquiries : []))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: string) {
    await adminFetch(`/api/admin/enquiries/${encodeURIComponent(id)}/`, {
      method: 'DELETE',
    });
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
  }

  const filtered = enquiries.filter((e) => {
    if (filter === 'all') return true;
    if (filter === 'new' || filter === 'replied') return e.status === filter;
    return e.type === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#111418]">Enquiries</h1>
          <p className="text-xs text-[#5C636E] mt-0.5">
            {enquiries.length} customer messages received
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            ['all', 'All'],
            ['contact', 'Contact'],
            ['financing', 'Financing'],
            ['new', 'New'],
            ['replied', 'Replied'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                filter === key
                  ? 'bg-[#111418] text-white'
                  : 'bg-white border border-[#D6DBE0] text-[#47505B] hover:border-[#111418]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex items-center justify-center gap-2 text-sm text-[#5C636E]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading enquiries...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#E4E6E8] rounded-lg p-10 text-center text-sm text-[#5C636E]">
          No enquiries match this filter.
        </div>
      ) : (
        <div className="bg-white border border-[#E4E6E8] rounded-lg divide-y divide-[#ECEEF0]">
          {filtered.map((enq) => (
            <div
              key={enq.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAFAFA]"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#646D78]">
                  <span className="font-mono text-[#111418] font-medium">{enq.id}</span>
                  <span>&middot;</span>
                  <span className="capitalize">{enq.type}</span>
                  <span>&middot;</span>
                  <span>{new Date(enq.createdAt).toLocaleString()}</span>
                </div>
                <Link
                  href={`/admin/enquiries/${encodeURIComponent(enq.id)}/`}
                  className="text-base font-semibold text-[#111418] hover:text-[#9A6B3E] block"
                >
                  {enq.subject}
                </Link>
                <p className="text-xs text-[#5C636E]">
                  {enq.name} ({enq.email}){enq.phone ? ` · ${enq.phone}` : ''}
                </p>
                <p className="text-xs text-[#4F5863] line-clamp-2 pt-1">{enq.message}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={enq.status} />
                <Link
                  href={`/admin/reply-enquiry/?id=${encodeURIComponent(enq.id)}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium text-white bg-[#9A6B3E] hover:bg-[#835931]"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(enq.id)}
                  className="p-1.5 text-[#88919E] hover:text-red-600 cursor-pointer"
                  aria-label={`Delete enquiry ${enq.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
