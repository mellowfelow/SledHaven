'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AlertCircle,
  Loader2,
  Lock,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { SITE } from '@/config/site';
import { US_STATES_SHIPPING } from '@/config/catalog';
import { calculateOrderTotals, money } from '@/lib/order';
import { useStore } from '@/components/StoreProvider';
import SmartImage from '@/components/SmartImage';

export default function CartDrawer() {
  const router = useRouter();
  const {
    cartProducts,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useStore();

  const [step, setStep] = useState<'bag' | 'checkout'>('bag');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateCode, setStateCode] = useState('CO');
  const [zip, setZip] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [website, setWebsite] = useState(''); // Honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const drawerBodyRef = useRef<HTMLDivElement>(null);

  const totals = useMemo(() => {
    return calculateOrderTotals(
      cartProducts.map((i) => ({ id: i.id, quantity: i.quantity })),
      stateCode,
      paymentMethod
    );
  }, [cartProducts, stateCode, paymentMethod]);

  const bagPreviewTotals = useMemo(() => {
    return calculateOrderTotals(
      cartProducts.map((i) => ({ id: i.id, quantity: i.quantity })),
      stateCode,
      'bank_transfer'
    );
  }, [cartProducts, stateCode]);

  useEffect(() => {
    if (!isCartOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCart();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const activeStep = cartProducts.length === 0 ? 'bag' : step;

  function showFormError(msg: string) {
    setError(msg);
    drawerBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
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
      clearCart();
      setStep('bag');
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setCity('');
      setZip('');
      setNotes('');
      closeCart();
      router.push(
        `/thank-you-order/?order=${encodeURIComponent(data.orderNumber)}&total=${encodeURIComponent(String(data.total))}&method=${encodeURIComponent(chosenMethod)}`
      );
    } catch {
      showFormError('Network error submitting order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag and Checkout"
    >
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={closeCart} aria-hidden="true" />

      {/* Drawer Panel */}
      <div className="w-full max-w-[480px] bg-white h-full flex flex-col shadow-2xl border-l border-[#E4E6E8]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E4E6E8] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-semibold text-[#111418]">
              {activeStep === 'bag' ? 'Your Allocation Bag' : 'Email Order Checkout'}
            </h2>
            <p className="text-xs text-[#646D78]">
              {activeStep === 'bag'
                ? 'State freight & taxes calculated before submission'
                : 'Confirmation email sent immediately upon reservation'}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="w-9 h-9 inline-flex items-center justify-center rounded-md text-[#47505B] hover:bg-[#F7F7F5] cursor-pointer"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div ref={drawerBodyRef} className="flex-1 overflow-y-auto px-6 py-5">
          {cartProducts.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F3F1ED] flex items-center justify-center text-[#646D78]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#111418]">
                Your bag is empty
              </h3>
              <p className="text-sm text-[#5C636E] max-w-xs mx-auto">
                Explore mountain, trail, touring, and utility snowmobiles ready for nationwide US delivery.
              </p>
              <Link
                href="/shop/"
                onClick={closeCart}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-[#111418] hover:bg-[#9A6B3E] rounded-md transition-colors"
              >
                Browse Inventory
              </Link>
            </div>
          ) : activeStep === 'bag' ? (
            <div className="space-y-5">
              {/* Items */}
              <ul className="divide-y divide-[#ECEEF0]">
                {cartProducts.map(({ product, quantity }) => (
                  <li key={product.id} className="py-4 first:pt-0 flex gap-4">
                    <div className="relative w-20 h-16 rounded bg-[#F3F1ED] overflow-hidden shrink-0">
                      <SmartImage
                        src={product.image}
                        alt={product.imageAlt}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/shop/${product.category}/${product.slug}/`}
                          onClick={closeCart}
                          className="text-sm font-semibold text-[#111418] hover:text-[#9A6B3E] truncate"
                        >
                          {product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="text-[#88919E] hover:text-red-600 p-1 cursor-pointer"
                          aria-label={`Remove ${product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#646D78] mt-0.5">
                        {product.sku} &middot; {money(product.price)}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="inline-flex items-center border border-[#D6DBE0] rounded">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="w-7 h-7 inline-flex items-center justify-center text-[#47505B] hover:bg-[#F7F7F5] cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-medium tabular-nums">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="w-7 h-7 inline-flex items-center justify-center text-[#47505B] hover:bg-[#F7F7F5] cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-[#111418] tabular-nums">
                          {money(product.price * quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Quick State Freight Estimator */}
              <div className="bg-[#F7F7F5] border border-[#E4E6E8] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="bag-state" className="text-xs font-semibold text-[#111418] flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#9A6B3E]" />
                    <span>Delivery State (US)</span>
                  </label>
                  <select
                    id="bag-state"
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value)}
                    className="text-xs bg-white border border-[#D6DBE0] rounded px-2.5 py-1.5 text-[#111418]"
                  >
                    {US_STATES_SHIPPING.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-[#5C636E] leading-relaxed">
                  {totals.regulatoryNote} Transit: <strong className="text-[#111418]">{totals.transitDays}</strong>.
                </p>
              </div>

              {/* Minimum order check */}
              {!totals.meetsMinOrder && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Minimum order value is ${SITE.orderRules.minOrder}. Add{' '}
                    <strong>{money(SITE.orderRules.minOrder - totals.subtotal)}</strong> more to proceed.
                  </span>
                </div>
              )}

              {/* Totals Preview */}
              <div className="space-y-2 text-sm pt-2 border-t border-[#E4E6E8] tabular-nums">
                <div className="flex justify-between text-[#4F5863]">
                  <span>Subtotal</span>
                  <span className="text-[#111418] font-medium">{money(bagPreviewTotals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#4F5863]">
                  <span>{bagPreviewTotals.shippingLabel}</span>
                  <span className="text-[#111418] font-medium">
                    {bagPreviewTotals.shippingFee === 0 ? 'Free' : money(bagPreviewTotals.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-[#4F5863]">
                  <span>Estimated State Tax ({stateCode})</span>
                  <span className="text-[#111418] font-medium">{money(bagPreviewTotals.estimatedTax)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#ECEEF0] text-sm font-semibold text-[#111418]">
                  <span>Estimated Total</span>
                  <span>{money(bagPreviewTotals.total)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#9A6B3E] pt-0.5">
                  <span>Save 10% with BTC / USDT at checkout</span>
                  <span>-{money(Math.round(bagPreviewTotals.subtotal * 0.1 * 100) / 100)}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Step 2: Full Email Order Checkout Form */
            <form id="sledhaven-checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
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

              <button
                type="button"
                onClick={() => setStep('bag')}
                className="text-xs font-medium text-[#9A6B3E] hover:underline cursor-pointer"
              >
                &larr; Edit items in bag
              </button>

              {error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#646D78]">
                  Buyer Information
                </h3>
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
                    className="w-full px-3 py-2 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      className="w-full px-3 py-2 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
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
                      className="w-full px-3 py-2 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-[#ECEEF0]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#646D78]">
                  US Delivery Address
                </h3>
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
                    className="w-full px-3 py-2 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                      className="w-full px-3 py-2 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
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
                      className="w-full px-2.5 py-2 text-sm bg-white border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
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
                      className="w-full px-3 py-2 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2.5 pt-2 border-t border-[#ECEEF0]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#646D78]">
                  Payment Method *
                </h3>
                <div className="space-y-2">
                  {SITE.reply.paymentMethods.map((method) => {
                    const selected = paymentMethod === method.id;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-start gap-3 p-3 rounded-md border text-left transition-colors ${
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
                  className="w-full px-3 py-2 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
                />
              </div>

              {/* Final Calculated Breakdown */}
              <div className="bg-[#F7F7F5] border border-[#E4E6E8] rounded-lg p-4 space-y-1.5 text-xs tabular-nums">
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
                <div className="flex justify-between pt-2 mt-1 border-t border-[#DCE0E4] text-sm font-semibold text-[#111418]">
                  <span>Total</span>
                  <span>{money(totals.total)}</span>
                </div>
                {totals.payIn4Installment && (
                  <div className="flex justify-between text-xs text-[#9A6B3E] font-medium pt-1">
                    <span>Pay-in-4 Initial Installment (25% due)</span>
                    <span>{money(totals.payIn4Installment)}</span>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Footer CTA */}
        {cartProducts.length > 0 && (
          <div className="px-6 py-4 border-t border-[#E4E6E8] bg-white space-y-2.5">
            {activeStep === 'bag' ? (
              <button
                type="button"
                disabled={!bagPreviewTotals.meetsMinOrder}
                onClick={() => {
                  setError('');
                  setStep('checkout');
                  drawerBodyRef.current?.scrollTo({ top: 0 });
                }}
                className="w-full py-3 px-4 rounded-md text-sm font-medium text-white bg-[#111418] hover:bg-[#9A6B3E] disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Proceed to Checkout &middot; {money(bagPreviewTotals.total)}
              </button>
            ) : (
              <button
                type="submit"
                form="sledhaven-checkout-form"
                disabled={submitting || !totals.meetsMinOrder}
                className="w-full py-3 px-4 rounded-md text-sm font-medium text-white bg-[#9A6B3E] hover:bg-[#835931] disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
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
            )}
            <p className="text-[11px] text-center text-[#646D78]">
              No payment is taken on this form. Verified payment instructions arrive via email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
