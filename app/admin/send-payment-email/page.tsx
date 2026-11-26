'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Send,
} from 'lucide-react';
import { SITE } from '@/config/site';
import { money, parsePaymentDetail, paymentMethodParts, paymentTermsLines } from '@/lib/order';
import type { StoredOrder } from '@/lib/orderStore';
import { useAdminPasscode } from '@/components/admin/AdminPasscodeContext';
import WhatsAppSendPanel from '@/components/admin/WhatsAppSendPanel';

function SendPaymentComposerInner() {
  const searchParams = useSearchParams();
  const initialOrderNum = (searchParams?.get('order') || '').trim().toUpperCase();
  const { adminFetch } = useAdminPasscode();

  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [selectedOrderNum, setSelectedOrderNum] = useState(initialOrderNum);
  const [rawDetail, setRawDetail] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    emailSent: boolean;
    mailReason: string | null;
    paymentPageUrl: string;
    confirmPageUrl: string;
  } | null>(null);

  useEffect(() => {
    adminFetch('/api/admin/orders/')
      .then((res) => res.json())
      .then((data) => {
        const list: StoredOrder[] = Array.isArray(data.orders) ? data.orders : [];
        setOrders(list);
        const match =
          list.find((o) => o.orderNumber === initialOrderNum) || list[0] || null;
        if (match) {
          setSelectedOrderNum(match.orderNumber);
          if (match.paymentDetails?.rawDetail) {
            setRawDetail(match.paymentDetails.rawDetail);
          }
          if (match.paymentDetails?.customNote) {
            setCustomNote(match.paymentDetails.customNote);
          }
        }
      })
      .finally(() => setLoadingOrders(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialOrderNum]);

  const activeOrder = useMemo(
    () => orders.find((o) => o.orderNumber === selectedOrderNum) || null,
    [orders, selectedOrderNum]
  );

  const parsedFields = useMemo(() => parsePaymentDetail(rawDetail), [rawDetail]);

  const origin =
    typeof window !== 'undefined' ? window.location.origin : SITE.url;

  const previewPaymentUrl = activeOrder
    ? `${origin}/order/payment-details/?order=${encodeURIComponent(activeOrder.orderNumber)}`
    : '';
  const previewConfirmUrl = activeOrder
    ? `${origin}/order/confirm-payment/?order=${encodeURIComponent(activeOrder.orderNumber)}`
    : '';

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!activeOrder) {
      setError('Select an order first.');
      return;
    }
    if (!rawDetail.trim()) {
      setError('Paste the payment details to send.');
      return;
    }

    setSending(true);
    try {
      const res = await adminFetch('/api/admin/send-payment-email/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: activeOrder.orderNumber,
          rawDetail,
          customNote,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Could not send payment details.');
        setSending(false);
        return;
      }
      setResult({
        emailSent: Boolean(data.emailSent),
        mailReason: data.mailReason || null,
        paymentPageUrl: data.paymentPageUrl,
        confirmPageUrl: data.confirmPageUrl,
      });
    } catch {
      setError('Network error sending payment details.');
    } finally {
      setSending(false);
    }
  }

  if (loadingOrders) {
    return (
      <div className="py-12 flex items-center justify-center gap-2 text-sm text-[#5C636E]">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading orders...</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-[#E4E6E8] rounded-lg p-10 text-center space-y-3">
        <p className="text-sm text-[#5C636E]">
          No orders exist yet. Place a test order from the storefront to test the payment-details composer.
        </p>
        <Link href="/shop/" className="text-xs font-medium text-[#9A6B3E] underline">
          Go to Storefront
        </Link>
      </div>
    );
  }

  const methodParts = activeOrder
    ? paymentMethodParts(activeOrder.paymentMethod)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-[#111418]">
          Send Payment Details
        </h1>
        <p className="text-xs sm:text-sm text-[#5C636E] mt-1">
          Paste any payment detail blob once (bank wire, BTC/USDT address, Zelle, Apple Pay, Chime, or link). It automatically splits into tap-to-copy fields for the buyer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Composer Form */}
        <form
          onSubmit={handleSend}
          className="lg:col-span-6 bg-white border border-[#E4E6E8] rounded-lg p-6 space-y-5"
        >
          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="p-4 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>
                  Payment details saved &amp; published to customer page
                  {result.emailSent ? ' + email sent!' : ' (SMTP pending — use WhatsApp panel or link below)'}
                </span>
              </div>
              {!result.emailSent && result.mailReason && (
                <p className="text-emerald-800">Mailer note: {result.mailReason}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="select-order" className="block text-xs font-medium text-[#111418] mb-1.5">
              Select Order *
            </label>
            <select
              id="select-order"
              value={selectedOrderNum}
              onChange={(e) => {
                setSelectedOrderNum(e.target.value);
                const found = orders.find((o) => o.orderNumber === e.target.value);
                setRawDetail(found?.paymentDetails?.rawDetail || '');
                setCustomNote(found?.paymentDetails?.customNote || '');
                setResult(null);
              }}
              className="w-full px-3 py-2.5 text-sm bg-white border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
            >
              {orders.map((o) => (
                <option key={o.orderNumber} value={o.orderNumber}>
                  {o.orderNumber} — {o.customer.name} ({money(o.total)} · {paymentMethodParts(o.paymentMethod).label}{o.paymentPlan === 'pay_in_4' ? ' · Pay-in-4' : ''})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="raw-detail" className="block text-xs font-medium text-[#111418] mb-1.5">
              Paste Real Payment Details (auto-parsed line by line) *
            </label>
            <textarea
              id="raw-detail"
              rows={6}
              required
              value={rawDetail}
              onChange={(e) => setRawDetail(e.target.value)}
              placeholder={`Examples:\nBank Name: First Alpine Bank\nAccount Name: SledHaven Motors LLC\nRouting Number: 021000021\nAccount Number: 4920018842\n\nOr paste a BTC/USDT address, Zelle email, or $ChimeSign directly.`}
              className="w-full px-3.5 py-2.5 text-sm font-mono border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
            />
          </div>

          <div>
            <label htmlFor="custom-note" className="block text-xs font-medium text-[#111418] mb-1.5">
              Optional Desk Note to Buyer
            </label>
            <textarea
              id="custom-note"
              rows={2}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. Your unit passed inspection today and is staged for Colorado freight dispatch."
              className="w-full px-3.5 py-2.5 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
            />
          </div>

          <button
            type="submit"
            disabled={sending || parsedFields.length === 0}
            className="w-full py-3 px-5 rounded-md text-sm font-medium text-white disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            style={{ backgroundColor: SITE.reply.brand.primary }}
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{sending ? 'Sending...' : 'Publish & Email Payment Details'}</span>
          </button>
        </form>

        {/* Right: Live Parsed Preview + Light Email Shell Preview */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-[#E4E6E8] rounded-lg overflow-hidden">
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

            <div className="p-5 space-y-4 bg-white text-[#111418]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#835931]">
                Live Light-Email &amp; CopyField Preview
              </p>

              {activeOrder && methodParts && (
                <>
                  <p className="text-xs text-[#47505B] leading-relaxed">
                    Hello {activeOrder.customer.name}, {methodParts.opening}
                  </p>

                  {parsedFields.length === 0 ? (
                    <div className="p-4 rounded border border-dashed border-[#D6DBE0] text-xs text-[#646D78]">
                      Start pasting payment details on the left to preview auto-split copyable fields.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {parsedFields.map((field, idx) => (
                        <div
                          key={`${field.label}-${idx}`}
                          className="p-3 rounded border border-[#E4E6E8] bg-[#F9FAFB] flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase tracking-wider text-[#646D78] block">
                              {field.label}
                            </span>
                            <span className="text-xs font-mono font-semibold text-[#111418] break-all">
                              {field.value}
                            </span>
                          </div>
                          <span className="text-[11px] font-medium text-[#9A6B3E] shrink-0">
                            Copyable
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="p-3 rounded border border-[#E4E6E8] bg-[#F9FAFB] text-xs text-[#334155] leading-relaxed space-y-2">
                    <div>
                      <span className="font-semibold text-[#111418]">Once You&apos;ve Paid: </span>
                      Send a screenshot any way that&apos;s easiest — reply to this email, WhatsApp, or tap a button below.
                    </div>
                    <div className="flex gap-2">
                      <span className="inline-flex items-center px-3 py-1.5 rounded text-[11px] font-semibold text-white" style={{ backgroundColor: '#25D366' }}>
                        Send on WhatsApp
                      </span>
                      <span className="inline-flex items-center px-3 py-1.5 rounded text-[11px] font-semibold text-white" style={{ backgroundColor: SITE.reply.brand.headerDark }}>
                        Email Screenshot
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#ECEEF0] space-y-1 text-[11px] text-[#5C636E]">
                    {paymentTermsLines(
                      activeOrder.paymentMethod,
                      activeOrder.total,
                      activeOrder.orderNumber,
                      activeOrder.paymentPlan
                    ).map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {activeOrder && rawDetail.trim() && (
            <WhatsAppSendPanel
              customerPhone={activeOrder.customer.phone}
              orderNumber={activeOrder.orderNumber}
              customerName={activeOrder.customer.name}
              paymentMethod={activeOrder.paymentMethod}
              paymentPlan={activeOrder.paymentPlan}
              total={activeOrder.total}
              rawDetail={rawDetail}
              paymentPageUrl={result?.paymentPageUrl || previewPaymentUrl}
              confirmPageUrl={result?.confirmPageUrl || previewConfirmUrl}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function SendPaymentEmailPage() {
  return (
    <Suspense
      fallback={<div className="py-12 text-sm text-[#5C636E]">Loading composer...</div>}
    >
      <SendPaymentComposerInner />
    </Suspense>
  );
}
