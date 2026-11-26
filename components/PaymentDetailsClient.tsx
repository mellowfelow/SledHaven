'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowRight, CheckCircle2, Clock, Loader2, MessageCircle, Search } from 'lucide-react';
import { money } from '@/lib/order';
import CopyField from '@/components/CopyField';
import { waPaymentConfirmationLink } from '@/lib/whatsapp';

interface PublicOrderData {
  orderNumber: string;
  status: string;
  createdAt: string;
  customerFirstName: string;
  destinationState: string;
  paymentMethod: {
    id: string;
    label: string;
    opening: string;
    closing: string;
  };
  paymentPlan: 'full' | 'pay_in_4';
  items: { name: string; sku: string; quantity: number; lineTotal: number }[];
  subtotal: number;
  cryptoDiscount: number;
  shippingFee: number;
  shippingLabel: string;
  estimatedTax: number;
  total: number;
  payIn4Installment: number | null;
  paymentDetails: {
    fields: { label: string; value: string }[];
    customNote: string;
    sentAt: string;
  } | null;
  paymentConfirmation: {
    confirmedAt: string;
    referenceNumber: string;
  } | null;
}

export default function PaymentDetailsClient() {
  const searchParams = useSearchParams();
  const initialOrder = (searchParams?.get('order') || '').trim().toUpperCase();
  const [orderInput, setOrderInput] = useState(initialOrder);
  const [data, setData] = useState<PublicOrderData | null>(null);
  const [loading, setLoading] = useState(Boolean(initialOrder));
  const [error, setError] = useState('');

  const fetchOrder = useCallback(async (orderNumber: string) => {
    const clean = orderNumber.trim().toUpperCase();
    if (!clean) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `/api/order/payment-details/?order=${encodeURIComponent(clean)}`
      );
      const json = await res.json();
      if (!res.ok) {
        setData(null);
        setError(json?.error || 'Order reference not found.');
      } else {
        setData(json);
      }
    } catch {
      setError('Unable to load payment details right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialOrder) return;
    let active = true;
    fetch(`/api/order/payment-details/?order=${encodeURIComponent(initialOrder)}`)
      .then(async (res) => ({ ok: res.ok, json: await res.json() }))
      .then(({ ok, json }) => {
        if (!active) return;
        if (!ok) {
          setData(null);
          setError(json?.error || 'Order reference not found.');
        } else {
          setData(json);
          setError('');
        }
      })
      .catch(() => {
        if (active) setError('Unable to load payment details right now.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [initialOrder]);

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    fetchOrder(orderInput);
  }

  const amountDueNow = data
    ? data.paymentPlan === 'pay_in_4' && data.payIn4Installment
      ? data.payIn4Installment
      : data.total
    : 0;

  return (
    <div className="space-y-8">
      {/* Lookup bar if no order yet or switching */}
      <form
        onSubmit={handleLookup}
        className="bg-white border border-[#E4E6E8] rounded-lg p-5 flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#646D78] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={orderInput}
            onChange={(e) => setOrderInput(e.target.value.toUpperCase())}
            placeholder="Enter order reference (e.g. SH-261122-ABCD)"
            className="w-full pl-10 pr-4 py-2.5 text-sm font-mono border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-md text-sm font-medium text-white bg-[#111418] hover:bg-[#9A6B3E] transition-colors whitespace-nowrap cursor-pointer"
        >
          {loading ? 'Loading...' : 'Load Payment Details'}
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="py-12 flex items-center justify-center gap-2 text-sm text-[#5C636E]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Retrieving verified order details...</span>
        </div>
      )}

      {!loading && data && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white border border-[#E4E6E8] rounded-lg p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#ECEEF0]">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#646D78]">
                  Order Reference
                </p>
                <p className="font-mono text-xl font-semibold text-[#111418] mt-0.5">
                  {data.orderNumber}
                </p>
                <p className="text-xs text-[#5C636E] mt-1">
                  Prepared for {data.customerFirstName} &middot; Delivery State: {data.destinationState}
                </p>
              </div>
              <div className="text-left sm:text-right tabular-nums">
                <p className="text-xs uppercase tracking-wider text-[#646D78]">
                  {data.paymentPlan === 'pay_in_4'
                    ? 'Installment 1 of 4 Due'
                    : 'Amount Due'}
                </p>
                <p className="text-2xl font-semibold text-[#111418] mt-0.5">
                  {money(amountDueNow)}
                </p>
                <p className="text-xs text-[#9A6B3E] font-medium">
                  {data.paymentMethod.label}
                  {data.paymentPlan === 'pay_in_4' ? ' · Pay-in-4' : ''}
                </p>
              </div>
            </div>

            {/* Order Items Summary */}
            <ul className="divide-y divide-[#F0F1F3] text-sm">
              {data.items.map((item) => (
                <li key={item.sku} className="py-2.5 flex justify-between gap-4">
                  <span className="text-[#111418]">
                    {item.name} <span className="text-[#646D78]">&times; {item.quantity}</span>
                  </span>
                  <span className="font-medium text-[#111418] tabular-nums">
                    {money(item.lineTotal)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="pt-3 border-t border-[#ECEEF0] text-xs space-y-1 text-[#5C636E] tabular-nums">
              {data.cryptoDiscount > 0 && (
                <div className="flex justify-between text-[#9A6B3E] font-medium">
                  <span>10% Crypto Discount</span>
                  <span>-{money(data.cryptoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{data.shippingLabel}</span>
                <span>{data.shippingFee === 0 ? 'Free' : money(data.shippingFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated State Tax ({data.destinationState})</span>
                <span>{money(data.estimatedTax)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#111418] pt-1">
                <span>Order Total</span>
                <span>{money(data.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Confirmation Already Submitted */}
          {data.paymentConfirmation && (
            <div className="p-5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-sm text-emerald-950 space-y-1">
                <p className="font-semibold">Payment Confirmation Received</p>
                <p className="text-xs text-emerald-800">
                  We received your payment receipt on{' '}
                  {new Date(data.paymentConfirmation.confirmedAt).toLocaleString()}. Our logistics desk is finalizing pre-delivery inspection and crated dispatch.
                </p>
              </div>
            </div>
          )}

          {/* Tap-to-Copy Payment Details */}
          {!data.paymentDetails ? (
            <div className="bg-white border border-[#E4E6E8] rounded-lg p-7 text-center space-y-3">
              <Clock className="w-6 h-6 text-[#9A6B3E] mx-auto" />
              <h2 className="font-serif text-xl font-semibold text-[#111418]">
                Payment Details Being Prepared
              </h2>
              <p className="text-sm text-[#5C636E] max-w-md mx-auto leading-relaxed">
                Our dealership desk is verifying your allocation for order{' '}
                <strong className="font-mono text-[#111418]">{data.orderNumber}</strong>. As soon as your instructions are issued, they will appear here and arrive in your email inbox.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="font-serif text-xl font-semibold text-[#111418]">
                  Tap-to-Copy Settlement Details
                </h2>
                <p className="text-sm text-[#4F5863] mt-1">
                  {data.paymentMethod.opening}
                </p>
              </div>

              {data.paymentDetails.customNote && (
                <div className="p-4 rounded-lg bg-[#FAF6F1] border border-[#E8DACB] text-sm text-[#3F3123]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#9A6B3E] block mb-1">
                    Note from SledHaven Desk
                  </span>
                  {data.paymentDetails.customNote}
                </div>
              )}

              <div className="space-y-3">
                <CopyField label="Order Reference (Include in Memo)" value={data.orderNumber} />
                <CopyField label="Exact Amount Due (USD)" value={money(amountDueNow)} />
                {data.paymentDetails.fields.map((field, idx) => (
                  <CopyField key={`${field.label}-${idx}`} label={field.label} value={field.value} />
                ))}
              </div>

              <p className="text-xs text-[#5C636E] leading-relaxed">
                {data.paymentMethod.closing}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={waPaymentConfirmationLink(data.orderNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md text-sm font-medium text-white bg-[#25D366] hover:brightness-95 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Screenshot on WhatsApp</span>
                </a>
                <Link
                  href={`/order/confirm-payment/?order=${encodeURIComponent(data.orderNumber)}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md text-sm font-medium text-[#111418] border border-[#D6DBE0] hover:bg-[#F7F7F5] transition-colors"
                >
                  <span>Or Upload Receipt Here</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <p className="text-xs text-[#5C636E]">
                Easiest option: just reply to your payment-details email with a screenshot, or send it via WhatsApp above.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
