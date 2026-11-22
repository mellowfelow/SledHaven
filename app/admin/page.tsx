'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { SITE } from '@/config/site';
import { money, paymentMethodParts } from '@/lib/order';
import type { StoredOrder } from '@/lib/orderStore';
import type { StoredEnquiry } from '@/lib/enquiryStore';
import { useAdminPasscode } from '@/components/admin/AdminPasscodeContext';
import StatusBadge from '@/components/admin/StatusBadge';

export default function AdminDashboardPage() {
  const { adminFetch } = useAdminPasscode();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [enquiries, setEnquiries] = useState<StoredEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    try {
      const [oRes, eRes] = await Promise.all([
        adminFetch('/api/admin/orders/'),
        adminFetch('/api/admin/enquiries/'),
      ]);
      const oData = await oRes.json();
      const eData = await eRes.json();
      setOrders(Array.isArray(oData.orders) ? oData.orders : []);
      setEnquiries(Array.isArray(eData.enquiries) ? eData.enquiries : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    Promise.all([
      adminFetch('/api/admin/orders/').then((r) => r.json()),
      adminFetch('/api/admin/enquiries/').then((r) => r.json()),
    ])
      .then(([oData, eData]) => {
        if (!active) return;
        setOrders(Array.isArray(oData.orders) ? oData.orders : []);
        setEnquiries(Array.isArray(eData.enquiries) ? eData.enquiries : []);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [adminFetch]);

  const newOrdersCount = orders.filter((o) => o.status === 'new').length;
  const confirmedOrdersCount = orders.filter((o) => o.status === 'payment_confirmed').length;
  const openEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;
  const pipelineTotal = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#111418]">
            {SITE.name} Reply Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#5C636E] mt-1">
            Manage incoming orders, issue parsed tap-to-copy payment instructions, and reply to enquiries.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-white border border-[#D6DBE0] text-xs font-medium text-[#111418] hover:border-[#9A6B3E] cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
        <div className="bg-white border border-[#E4E6E8] rounded-lg p-5">
          <p className="text-xs uppercase tracking-wider text-[#646D78]">Awaiting Payment Details</p>
          <p className="text-2xl font-semibold text-[#111418] mt-1.5">{newOrdersCount}</p>
        </div>
        <div className="bg-white border border-[#E4E6E8] rounded-lg p-5">
          <p className="text-xs uppercase tracking-wider text-[#646D78]">Receipts Confirmed</p>
          <p className="text-2xl font-semibold text-emerald-700 mt-1.5">{confirmedOrdersCount}</p>
        </div>
        <div className="bg-white border border-[#E4E6E8] rounded-lg p-5">
          <p className="text-xs uppercase tracking-wider text-[#646D78]">Open Enquiries</p>
          <p className="text-2xl font-semibold text-[#111418] mt-1.5">{openEnquiriesCount}</p>
        </div>
        <div className="bg-white border border-[#E4E6E8] rounded-lg p-5">
          <p className="text-xs uppercase tracking-wider text-[#646D78]">Active Order Volume</p>
          <p className="text-2xl font-semibold text-[#111418] mt-1.5">{money(pipelineTotal)}</p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex items-center justify-center gap-2 text-sm text-[#5C636E]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading orders and enquiries...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <section className="bg-white border border-[#E4E6E8] rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E4E6E8] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#111418]">Recent Orders</h2>
              <Link
                href="/admin/orders/"
                className="text-xs font-medium text-[#9A6B3E] hover:underline inline-flex items-center gap-1"
              >
                <span>All Orders ({orders.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {orders.length === 0 ? (
              <p className="p-6 text-sm text-[#5C636E]">
                No orders yet. Orders submitted through storefront checkout appear here immediately.
              </p>
            ) : (
              <ul className="divide-y divide-[#ECEEF0]">
                {orders.slice(0, 6).map((order) => (
                  <li key={order.orderNumber} className="p-4 hover:bg-[#FAFAFA] flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/orders/${encodeURIComponent(order.orderNumber)}/`}
                          className="font-mono text-sm font-semibold text-[#111418] hover:text-[#9A6B3E]"
                        >
                          {order.orderNumber}
                        </Link>
                        <span className="text-xs text-[#646D78]">&middot; {order.customer.state}</span>
                      </div>
                      <p className="text-xs text-[#5C636E] truncate mt-0.5">
                        {order.customer.name} &middot; {paymentMethodParts(order.paymentMethod).label}
                      </p>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <div className="text-sm font-semibold text-[#111418] tabular-nums">
                        {money(order.total)}
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Recent Enquiries */}
          <section className="bg-white border border-[#E4E6E8] rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E4E6E8] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#111418]">Recent Enquiries</h2>
              <Link
                href="/admin/enquiries/"
                className="text-xs font-medium text-[#9A6B3E] hover:underline inline-flex items-center gap-1"
              >
                <span>All Enquiries ({enquiries.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {enquiries.length === 0 ? (
              <p className="p-6 text-sm text-[#5C636E]">
                No enquiries yet. Messages submitted from the Contact page appear here.
              </p>
            ) : (
              <ul className="divide-y divide-[#ECEEF0]">
                {enquiries.slice(0, 6).map((enq) => (
                  <li key={enq.id} className="p-4 hover:bg-[#FAFAFA] flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <Link
                        href={`/admin/enquiries/${encodeURIComponent(enq.id)}/`}
                        className="text-sm font-semibold text-[#111418] hover:text-[#9A6B3E] block truncate"
                      >
                        {enq.subject}
                      </Link>
                      <p className="text-xs text-[#5C636E] truncate mt-0.5">
                        {enq.name} ({enq.email})
                      </p>
                    </div>
                    <StatusBadge status={enq.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
