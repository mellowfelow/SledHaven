'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Loader2, Upload } from 'lucide-react';

export default function ConfirmPaymentClient() {
  const searchParams = useSearchParams();
  const initialOrder = (searchParams?.get('order') || '').trim().toUpperCase();

  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [note, setNote] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successOrder, setSuccessOrder] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!orderNumber.trim()) {
      setError('Enter your SledHaven order reference.');
      return;
    }
    if (!file && !referenceNumber.trim()) {
      setError('Upload a payment screenshot or provide your transaction reference ID.');
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('orderNumber', orderNumber.trim().toUpperCase());
      fd.append('referenceNumber', referenceNumber.trim());
      fd.append('note', note.trim());
      if (file) {
        fd.append('screenshot', file);
      }

      const res = await fetch('/api/order/confirm-payment/', {
        method: 'POST',
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error || 'Could not submit payment confirmation.');
        setSubmitting(false);
        return;
      }
      setSuccessOrder(json.orderNumber);
    } catch {
      setError('Network error submitting confirmation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (successOrder) {
    return (
      <div className="bg-white border border-[#E4E6E8] rounded-lg p-8 space-y-5">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-emerald-50 text-emerald-700">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-[#111418]">
          Payment Receipt Submitted
        </h2>
        <p className="text-sm text-[#4F5863] leading-relaxed">
          Thank you. We have logged your payment confirmation for order{' '}
          <strong className="font-mono text-[#111418]">{successOrder}</strong> and alerted our dispatch desk. We will email you with freight scheduling and MCO tracking details once funds clear.
        </p>
        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            href={`/order/payment-details/?order=${encodeURIComponent(successOrder)}`}
            className="px-5 py-2.5 rounded-md text-sm font-medium text-white bg-[#111418] hover:bg-[#9A6B3E] transition-colors"
          >
            View Order Status
          </Link>
          <Link
            href="/shop/"
            className="px-5 py-2.5 rounded-md text-sm font-medium text-[#111418] border border-[#D6DBE0] hover:border-[#111418] transition-colors"
          >
            Return to Inventory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#E4E6E8] rounded-lg p-6 sm:p-8 space-y-5"
    >
      {error && (
        <div className="p-3.5 rounded-md bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="cp-order" className="block text-xs font-medium text-[#111418] mb-1.5">
          Order Number *
        </label>
        <input
          id="cp-order"
          type="text"
          required
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
          placeholder="SH-261122-ABCD"
          className="w-full px-3.5 py-2.5 text-sm font-mono border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
        />
      </div>

      <div>
        <label htmlFor="cp-ref" className="block text-xs font-medium text-[#111418] mb-1.5">
          Transaction Hash / Wire Confirmation / Transfer Reference
        </label>
        <input
          id="cp-ref"
          type="text"
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value)}
          placeholder="TxID, wire confirmation code, or Zelle reference"
          className="w-full px-3.5 py-2.5 text-sm font-mono border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
        />
      </div>

      <div>
        <label htmlFor="cp-file" className="block text-xs font-medium text-[#111418] mb-1.5">
          Payment Receipt Screenshot (JPG, PNG, WebP, or PDF — max 5 MB)
        </label>
        <label
          htmlFor="cp-file"
          className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-[#D6DBE0] hover:border-[#9A6B3E] rounded-lg bg-[#F7F7F5] cursor-pointer transition-colors"
        >
          <Upload className="w-5 h-5 text-[#9A6B3E]" />
          <span className="text-xs font-medium text-[#111418]">
            {file ? file.name : 'Click to select payment confirmation screenshot'}
          </span>
          <span className="text-[11px] text-[#646D78]">
            {file ? `${Math.round(file.size / 1024)} KB selected` : 'JPG, PNG, WebP, or PDF'}
          </span>
          <input
            id="cp-file"
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="sr-only"
          />
        </label>
      </div>

      <div>
        <label htmlFor="cp-note" className="block text-xs font-medium text-[#111418] mb-1.5">
          Additional Note (Optional)
        </label>
        <textarea
          id="cp-note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Name on sending bank account, preferred freight delivery window, etc."
          className="w-full px-3.5 py-2.5 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 px-5 rounded-md text-sm font-medium text-white bg-[#9A6B3E] hover:bg-[#835931] disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Submitting Confirmation...</span>
          </>
        ) : (
          <span>Submit Payment Confirmation</span>
        )}
      </button>
    </form>
  );
}
