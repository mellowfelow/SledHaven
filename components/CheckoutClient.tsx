'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Loader2, Lock, ShoppingBag, Truck } from 'lucide-react';
import { SITE } from '@/config/site';
import { US_STATES_SHIPPING } from '@/config/catalog';
import { calculateOrderTotals, money } from '@/lib/order';
import { useStore } from '@/components/StoreProvider';
import SmartImage from '@/components/SmartImage';

export default function CheckoutClient() {
  const router = useRouter();
  const { cartProducts, clearCart } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateCode, setStateCode] = useState('CO');
  const [zip, setZip] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [paymentPlan, setPaymentPlan] = useState<'full' | 'pay_in_4'>('full');
  const [website, setWebsite] = useState(''); // Honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const totals = useMemo(() => {
    return calculateOrderTotals(
      cartProducts.map((i) => ({ id: i.id, quantity: i.quantity })),
      stateCode,
      paymentMethod,
      paymentPlan
    );
  }, [cartProducts, stateCode, paymentMethod, paymentPlan]);

  function showFormError(msg: string) {
    setError(msg);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleCheckoutSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!totals.meetsMinOrder) {
      showFormError(`Minimum order value is $${SITE.orderRules.minOrder}.`);
      return;
    }

    if (
      !name.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !stateCode.trim() ||
      !zip.trim()
    ) {
      showFormError('Please fill in all required legal name, email, phone, and US delivery address fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formName: 'order',
          channel: 'email',
          name,
          email,
          phone,
          address,
          city,
          state: stateCode,
          zip,
          notes,
          paymentMethod,
          paymentPlan,
          website,
          items: cartProducts.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showFormError(data?.error || 'Could not place order. Please review your details.');
        setSubmitting(false);
        return;
      }

      const chosenMethod = paymentMethod;
      const chosenPlan = paymentPlan;
      clearCart();
      router.push(
        `/thank-you-order/?order=${encodeURIComponent(data.orderNumber)}&total=${encodeURIComponent(String(data.total))}&method=${encodeURIComponent(chosenMethod)}&plan=${encodeURIComponent(chosenPlan)}`
      );
    } catch {
      showFormError('Network error submitting order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (cartProducts.length === 0) {
    return (
      <div className="py-16 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#F3F1ED] flex items-center justify-center text-[#646D78]">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <h2 className="font-serif text-lg font-semibold text-[#111418]">
          Your bag is empty
        </h2>
        <p className="text-sm text-[#5C636E] max-w-xs mx-auto">
          Add a snowmobile or gear item to your bag before checking out.
        </p>
        <Link
          href="/shop/"
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-[#111418] hover:bg-[#9A6B3E] rounded-md transition-colors"
        >
          Browse Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
      {/* Form */}
      <form
        id="sledhaven-checkout-form"
        onSubmit={handleCheckoutSubmit}
        className="lg:col-span-7 space-y-5"
      >
        {/* Honeypot */}
        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        {error && (
          <div className="p-3.5 rounded-md bg-red-50 border border-red-200 text-sm text-red-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white border border-[#E4E6E8] rounded-lg p-5 sm:p-6 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#646D78]">
            Buyer Information
          </h2>
          <div>
            <label htmlFor="co-name" className="block text-xs font-medium text-[#111418] mb-1">
              Full Legal Name (for MCO Title) *
            </label>
            <input
              id="co-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jordan Vance"
              className="w-full px-3 py-2.5 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="co-email" className="block text-xs font-medium text-[#111418] mb-1">
                Email Address *
              </label>
              <input
                id="co-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full px-3 py-2.5 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
              />
            </div>
            <div>
              <label htmlFor="co-phone" className="block text-xs font-medium text-[#111418] mb-1">
                Phone Number *
              </label>
              <input
                id="co-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full px-3 py-2.5 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E4E6E8] rounded-lg p-5 sm:p-6 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#646D78]">
            US Delivery Address
          </h2>
          <div>
            <label htmlFor="co-address" className="block text-xs font-medium text-[#111418] mb-1">
              Street Address *
            </label>
            <input
              id="co-address"
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="742 Alpine Ridge Rd"
              className="w-full px-3 py-2.5 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="co-city" className="block text-xs font-medium text-[#111418] mb-1">
                City *
              </label>
              <input
                id="co-city"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Bozeman"
                className="w-full px-3 py-2.5 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
              />
            </div>
            <div>
              <label htmlFor="co-state" className="block text-xs font-medium text-[#111418] mb-1">
                State *
              </label>
              <select
                id="co-state"
                required
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                className="w-full px-2.5 py-2.5 text-sm bg-white border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
              >
                {US_STATES_SHIPPING.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.code} — {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="co-zip" className="block text-xs font-medium text-[#111418] mb-1">
                ZIP Code *
              </label>
              <input
                id="co-zip"
                type="text"
                required
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="59715"
                className="w-full px-3 py-2.5 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
              />
            </div>
          </div>
          <div>
            <label htmlFor="co-notes" className="block text-xs font-medium text-[#111418] mb-1">
              Delivery / Freight Access Notes (Optional)
            </label>
            <textarea
              id="co-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Liftgate needed, gate code, or preferred delivery window..."
              className="w-full px-3 py-2.5 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
            />
          </div>
        </div>

        <div className="bg-white border border-[#E4E6E8] rounded-lg p-5 sm:p-6 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#646D78]">
            Payment Method *
          </h2>
          <div className="space-y-2">
            {SITE.reply.paymentMethods
              .filter((method) => !method.hidden)
              .map((method) => {
                const selected = paymentMethod === method.id;
                return (
                  <label
                    key={method.id}
                    className={`flex items-start gap-3 p-3.5 rounded-md border text-left transition-colors ${
                      !method.available
                        ? 'bg-[#F8F9FA] border-[#E4E6E8] opacity-60 cursor-not-allowed'
                        : selected
                        ? 'bg-[#FAF6F1] border-[#9A6B3E] cursor-pointer'
                        : 'bg-white border-[#D6DBE0] hover:border-[#9AA2AE] cursor-pointer'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      disabled={!method.available}
                      checked={selected}
                      onChange={() => setPaymentMethod(method.id)}
                      className="mt-1 accent-[#9A6B3E]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-[#111418]">
                          {method.label}
                        </span>
                        {method.discountPercent ? (
                          <span className="text-xs font-semibold text-[#9A6B3E]">
                            Save {method.discountPercent}%
                          </span>
                        ) : !method.available ? (
                          <span className="text-xs text-[#646D78]">Unavailable</span>
                        ) : null}
                      </div>
                      {method.note && (
                        <p className="text-xs text-[#5C636E] mt-0.5 leading-snug">
                          {method.note}
                        </p>
                      )}
                    </div>
                  </label>
                );
              })}
          </div>
        </div>

        <div className="bg-white border border-[#E4E6E8] rounded-lg p-5 sm:p-6 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#646D78]">
            Payment Plan *
          </h2>
          <div className="space-y-2">
            {SITE.reply.paymentPlans.map((plan) => {
              const selected = paymentPlan === plan.id;
              return (
                <label
                  key={plan.id}
                  className={`flex items-start gap-3 p-3.5 rounded-md border text-left transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#FAF6F1] border-[#9A6B3E]'
                      : 'bg-white border-[#D6DBE0] hover:border-[#9AA2AE]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentPlan"
                    value={plan.id}
                    checked={selected}
                    onChange={() => setPaymentPlan(plan.id)}
                    className="mt-1 accent-[#9A6B3E]"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-[#111418]">{plan.label}</span>
                    <p className="text-xs text-[#5C636E] mt-0.5 leading-snug">{plan.note}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </form>

      {/* Order Summary */}
      <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-5">
        <div className="bg-white border border-[#E4E6E8] rounded-lg p-5 sm:p-6 space-y-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#646D78]">
            Order Summary
          </h2>

          <ul className="divide-y divide-[#ECEEF0]">
            {cartProducts.map(({ product, quantity }) => (
              <li key={product.id} className="py-3.5 first:pt-0 flex gap-3.5">
                <div className="relative w-16 h-14 rounded bg-[#F3F1ED] overflow-hidden shrink-0">
                  <SmartImage
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#111418] truncate">{product.name}</p>
                  <p className="text-xs text-[#646D78] mt-0.5">
                    Qty {quantity} &middot; {money(product.price)}
                  </p>
                </div>
                <span className="text-sm font-semibold text-[#111418] tabular-nums shrink-0">
                  {money(product.price * quantity)}
                </span>
              </li>
            ))}
          </ul>

          {!totals.meetsMinOrder && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Minimum order value is ${SITE.orderRules.minOrder}. Add{' '}
                <strong>{money(SITE.orderRules.minOrder - totals.subtotal)}</strong> more to proceed.
              </span>
            </div>
          )}

          <div className="flex items-center gap-2.5 p-3 rounded-md bg-[#F7F7F5] border border-[#E4E6E8] text-xs text-[#5C636E]">
            <Truck className="w-4 h-4 text-[#9A6B3E] shrink-0" />
            <span>
              {totals.regulatoryNote} Transit: <strong className="text-[#111418]">{totals.transitDays}</strong>.
            </span>
          </div>

          <div className="space-y-1.5 text-sm pt-3 border-t border-[#E4E6E8] tabular-nums">
            <div className="flex justify-between text-[#4F5863]">
              <span>Subtotal</span>
              <span className="text-[#111418]">{money(totals.subtotal)}</span>
            </div>
            {totals.cryptoDiscount > 0 && (
              <div className="flex justify-between text-[#9A6B3E] font-semibold">
                <span>Crypto Discount ({SITE.orderRules.cryptoDiscountPercent}%)</span>
                <span>-{money(totals.cryptoDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#4F5863]">
              <span>{totals.shippingLabel}</span>
              <span className="text-[#111418]">
                {totals.shippingFee === 0 ? 'Free' : money(totals.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-[#4F5863]">
              <span>Estimated {stateCode} Sales Tax</span>
              <span className="text-[#111418]">{money(totals.estimatedTax)}</span>
            </div>
            <div className="flex justify-between pt-2.5 mt-1 border-t border-[#DCE0E4] text-base font-semibold text-[#111418]">
              <span>Total</span>
              <span>{money(totals.total)}</span>
            </div>
            {totals.payIn4Installment && (
              <div className="flex justify-between text-xs text-[#9A6B3E] font-medium pt-1">
                <span>Pay-in-4 Initial Installment (25% due immediately)</span>
                <span>{money(totals.payIn4Installment)}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            form="sledhaven-checkout-form"
            disabled={submitting || !totals.meetsMinOrder}
            className="w-full py-3.5 px-4 rounded-md text-sm font-medium text-white bg-[#9A6B3E] hover:bg-[#835931] disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Placing Order...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Place Order &middot; {money(totals.total)}</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-center text-[#646D78]">
            No payment is taken on this form. Verified payment instructions arrive via email.
          </p>
        </div>
      </div>
    </div>
  );
}
