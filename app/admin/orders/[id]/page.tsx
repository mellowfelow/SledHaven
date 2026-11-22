'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Loader2, Send } from 'lucide-react';
import { money, paymentMethodParts } from '@/lib/order';
import type { OrderStatus, StoredOrder } from '@/lib/orderStore';
import { useAdminPasscode } from '@/components/admin/AdminPasscodeContext';
import StatusBadge from '@/components/admin/StatusBadge';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = String(params?.id || '');
  const { adminFetch } = useAdminPasscode();

  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!id) return;
    adminFetch(`/api/admin/orders/${encodeURIComponent(id)}/`)
      .then((res) => res.json())
      .then((data) => setOrder(data.order || null))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleStatusChange(nextStatus: OrderStatus) {
    if (!order) return;
    setUpdatingStatus(true);
    try {
      const res = await adminFetch(
        `/api/admin/orders/${encodeURIComponent(order.orderNumber)}/`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus }),
        }
      );
      const data = await res.json();
      if (data.order) setOrder(data.order);
    } finally {
      setUpdatingStatus(false);
    }
  }

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center gap-2 text-sm text-[#5C636E]">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading order...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white border border-[#E4E6E8] rounded-lg p-8 text-center space-y-3">
        <p className="text-sm text-[#5C636E]">Order not found.</p>
        <Link href="/admin/orders/" className="text-xs font-medium text-[#9A6B3E] underline">
          Return to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/admin/orders/"
            className="inline-flex items-center gap-1 text-xs text-[#5C636E] hover:text-[#111418]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Orders</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-2xl font-semibold text-[#111418]">
              {order.orderNumber}
            </h1>
            <StatusBadge status={order.status} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={order.status}
            disabled={updatingStatus}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            aria-label="Update order status"
            className="text-xs bg-white border border-[#D6DBE0] rounded-md px-3 py-2 text-[#111418]"
          >
            <option value="new">New</option>
            <option value="payment_sent">Payment Sent</option>
            <option value="payment_confirmed">Payment Confirmed</option>
            <option value="dispatched">Dispatched</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <Link
            href={`/admin/send-payment-email/?order=${encodeURIComponent(order.orderNumber)}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium text-white bg-[#9A6B3E] hover:bg-[#835931]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Payment Details</span>
          </Link>

          <Link
            href={`/order/payment-details/?order=${encodeURIComponent(order.orderNumber)}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium border border-[#D6DBE0] bg-white text-[#111418] hover:border-[#111418]"
          >
            <span>Customer Payment Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          {/* Items */}
          <div className="bg-white border border-[#E4E6E8] rounded-lg p-6 space-y-4">
            <h2 className="text-sm font-semibold text-[#111418]">Order Summary</h2>
            <ul className="divide-y divide-[#ECEEF0] text-sm">
              {order.items.map((item) => (
                <li key={item.sku} className="py-3 flex justify-between gap-4">
                  <div>
                    <div className="font-medium text-[#111418]">{item.name}</div>
                    <div className="text-xs text-[#646D78] font-mono">
                      {item.sku} &middot; Qty {item.quantity}
                    </div>
                  </div>
                  <div className="font-semibold text-[#111418] tabular-nums">
                    {money(item.lineTotal)}
                  </div>
                </li>
              ))}
            </ul>
            <div className="pt-3 border-t border-[#ECEEF0] text-xs space-y-1.5 tabular-nums">
              <div className="flex justify-between text-[#5C636E]">
                <span>Subtotal</span>
                <span>{money(order.subtotal)}</span>
              </div>
              {order.cryptoDiscount > 0 && (
                <div className="flex justify-between text-[#9A6B3E] font-medium">
                  <span>10% Crypto Discount</span>
                  <span>-{money(order.cryptoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#5C636E]">
                <span>{order.shippingLabel}</span>
                <span>{order.shippingFee === 0 ? 'Free' : money(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-[#5C636E]">
                <span>Estimated State Tax ({order.customer.state})</span>
                <span>{money(order.estimatedTax)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#111418] pt-2 border-t border-[#ECEEF0]">
                <span>Total</span>
                <span>{money(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Sent Payment Details Log */}
          {order.paymentDetails && (
            <div className="bg-white border border-[#E4E6E8] rounded-lg p-6 space-y-3">
              <h2 className="text-sm font-semibold text-[#111418]">
                Issued Payment Details
              </h2>
              <p className="text-xs text-[#5C636E]">
                Sent {new Date(order.paymentDetails.sentAt).toLocaleString()} &middot; Email delivered:{' '}
                {order.paymentDetails.emailSent ? 'Yes' : 'Pending SMTP'}
              </p>
              <dl className="divide-y divide-[#F0F1F3] text-xs">
                {order.paymentDetails.fields.map((f, idx) => (
                  <div key={idx} className="py-2 flex justify-between gap-4">
                    <dt className="text-[#646D78]">{f.label}</dt>
                    <dd className="font-mono font-medium text-[#111418] break-all text-right">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Customer Receipt Confirmation Log */}
          {order.paymentConfirmation && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 space-y-2 text-sm text-emerald-950">
              <h2 className="font-semibold">Customer Payment Confirmation</h2>
              <p className="text-xs text-emerald-800">
                Submitted: {new Date(order.paymentConfirmation.confirmedAt).toLocaleString()}
              </p>
              {order.paymentConfirmation.referenceNumber && (
                <p className="text-xs font-mono">
                  Reference: {order.paymentConfirmation.referenceNumber}
                </p>
              )}
              {order.paymentConfirmation.fileName && (
                <p className="text-xs">Receipt file: {order.paymentConfirmation.fileName}</p>
              )}
              {order.paymentConfirmation.note && (
                <p className="text-xs">Note: {order.paymentConfirmation.note}</p>
              )}
            </div>
          )}
        </div>

        {/* Customer & Freight Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E4E6E8] rounded-lg p-6 space-y-4 text-sm">
            <h2 className="text-sm font-semibold text-[#111418]">Buyer &amp; Delivery</h2>
            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-[#646D78] block">Name</span>
                <span className="font-medium text-[#111418]">{order.customer.name}</span>
              </div>
              <div>
                <span className="text-[#646D78] block">Email</span>
                <span className="font-medium text-[#111418]">{order.customer.email}</span>
              </div>
              <div>
                <span className="text-[#646D78] block">Phone</span>
                <span className="font-medium text-[#111418]">{order.customer.phone}</span>
              </div>
              <div>
                <span className="text-[#646D78] block">US Delivery Address</span>
                <span className="font-medium text-[#111418]">
                  {order.customer.address}, {order.customer.city}, {order.customer.state}{' '}
                  {order.customer.zip}
                </span>
              </div>
              <div>
                <span className="text-[#646D78] block">Selected Payment Method</span>
                <span className="font-medium text-[#9A6B3E]">
                  {paymentMethodParts(order.paymentMethod).label}
                </span>
              </div>
              {order.customer.notes && (
                <div>
                  <span className="text-[#646D78] block">Delivery Notes</span>
                  <span className="text-[#111418]">{order.customer.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
