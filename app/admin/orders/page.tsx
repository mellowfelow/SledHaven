'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Send, Trash2 } from 'lucide-react';
import { money, paymentMethodParts } from '@/lib/order';
import type { StoredOrder } from '@/lib/orderStore';
import { useAdminPasscode } from '@/components/admin/AdminPasscodeContext';
import StatusBadge from '@/components/admin/StatusBadge';

export default function AdminOrdersPage() {
  const { adminFetch } = useAdminPasscode();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    adminFetch('/api/admin/orders/')
      .then((res) => res.json())
      .then((data) => {
        if (active) setOrders(Array.isArray(data.orders) ? data.orders : []);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [adminFetch]);

  async function handleDelete(orderNumber: string) {
    await adminFetch(`/api/admin/orders/${encodeURIComponent(orderNumber)}/`, {
      method: 'DELETE',
    });
    setOrders((prev) => prev.filter((o) => o.orderNumber !== orderNumber));
  }

  const filtered =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#111418]">Orders</h1>
          <p className="text-xs text-[#5C636E] mt-0.5">
            {orders.length} total orders recorded
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            ['all', 'All'],
            ['new', 'New'],
            ['payment_sent', 'Payment Sent'],
            ['payment_confirmed', 'Confirmed'],
            ['dispatched', 'Dispatched'],
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
          <span>Loading orders...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#E4E6E8] rounded-lg p-10 text-center text-sm text-[#5C636E]">
          No orders match this status filter.
        </div>
      ) : (
        <div className="bg-white border border-[#E4E6E8] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#F7F7F5] border-b border-[#E4E6E8] text-xs uppercase tracking-wider text-[#646D78]">
                  <th className="py-3 px-4 font-semibold">Order</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Method</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Total</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEEF0]">
                {filtered.map((order) => (
                  <tr key={order.orderNumber} className="hover:bg-[#FAFAFA]">
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/admin/orders/${encodeURIComponent(order.orderNumber)}/`}
                        className="font-mono font-semibold text-[#111418] hover:text-[#9A6B3E]"
                      >
                        {order.orderNumber}
                      </Link>
                      <div className="text-[11px] text-[#646D78] mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()} &middot; {order.channel}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#111418]">{order.customer.name}</div>
                      <div className="text-xs text-[#5C636E]">
                        {order.customer.city}, {order.customer.state}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#47505B]">
                      {paymentMethodParts(order.paymentMethod).label}
                      {order.paymentPlan === 'pay_in_4' && (
                        <span className="block text-[#9A6B3E] font-medium">Pay-in-4</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-[#111418] tabular-nums">
                      {money(order.total)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                      <Link
                        href={`/admin/send-payment-email/?order=${encodeURIComponent(order.orderNumber)}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium text-white bg-[#9A6B3E] hover:bg-[#835931]"
                      >
                        <Send className="w-3 h-3" />
                        <span>Payment</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(order.orderNumber)}
                        className="inline-flex items-center p-1.5 rounded text-[#88919E] hover:text-red-600 cursor-pointer"
                        aria-label={`Delete ${order.orderNumber}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
