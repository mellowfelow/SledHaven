import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Mail } from 'lucide-react';
import { SITE, getPaymentMethodConfig } from '@/config/site';
import { money } from '@/lib/order';

export const metadata: Metadata = {
  title: 'Order Received',
  robots: { index: false, follow: true },
};

/**
 * Thank-you-order page:
 * Strictly NO bank details, NO payment deadline, NO WhatsApp screenshot request.
 * Only directs the buyer to watch for their payment-details email.
 */
export default async function ThankYouOrderPage(context: {
  searchParams: Promise<{ order?: string; total?: string; method?: string }>;
}) {
  const params = await context.searchParams;
  const orderNumber = (params?.order || '').trim();
  const totalNum = params?.total ? Number(params.total) : null;
  const methodId = (params?.method || '').trim();
  const methodLabel = methodId ? getPaymentMethodConfig(methodId).label : '';

  return (
    <main className="flex-1 max-w-xl w-full mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white border border-[#E4E6E8] rounded-lg p-7 sm:p-10 space-y-6">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-emerald-50 text-emerald-700">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-[#9A6B3E]">
            Reservation Confirmed
          </p>
          <h1 className="font-serif text-3xl font-semibold text-[#111418]">
            Your order has been received.
          </h1>
          <p className="text-sm text-[#4F5863] leading-relaxed">
            Thank you for ordering with {SITE.name}. We have emailed an immediate confirmation summary to your inbox.
          </p>
        </div>

        {orderNumber && (
          <div className="bg-[#F7F7F5] border border-[#E4E6E8] rounded-md p-4 flex flex-wrap items-center justify-between gap-4 text-sm">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#646D78] block">
                Order Reference
              </span>
              <span className="font-mono font-semibold text-[#111418]">{orderNumber}</span>
            </div>
            {methodLabel && (
              <div>
                <span className="text-xs uppercase tracking-wider text-[#646D78] block">
                  Payment Method
                </span>
                <span className="font-medium text-[#111418]">{methodLabel}</span>
              </div>
            )}
            {totalNum && Number.isFinite(totalNum) && (
              <div className="text-right">
                <span className="text-xs uppercase tracking-wider text-[#646D78] block">
                  Order Total
                </span>
                <span className="font-semibold text-[#111418] tabular-nums">
                  {money(totalNum)}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="bg-[#FAF6F1] border border-[#E8DACB] rounded-md p-4 flex items-start gap-3">
          <Mail className="w-5 h-5 text-[#9A6B3E] shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm text-[#3F3123]">
            <p className="font-semibold text-[#111418]">
              Next Step: Watch for Your Payment-Details Email
            </p>
            <p className="text-xs leading-relaxed text-[#544230]">
              Our dealership allocation desk is verifying inventory for your order and will email your personalized payment instructions shortly. Please check both your inbox and spam folder.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Link
            href="/shop/"
            className="px-5 py-2.5 rounded-md text-sm font-medium text-white bg-[#111418] hover:bg-[#9A6B3E] transition-colors"
          >
            Continue Browsing
          </Link>
          {orderNumber && (
            <Link
              href={`/order/payment-details/?order=${encodeURIComponent(orderNumber)}`}
              className="px-5 py-2.5 rounded-md text-sm font-medium text-[#111418] border border-[#D6DBE0] hover:border-[#111418] transition-colors"
            >
              Check Payment Details Page
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
