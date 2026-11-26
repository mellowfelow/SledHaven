'use client';

import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, MessageCircle, Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import { SITE } from '@/config/site';
import { calculateOrderTotals, money } from '@/lib/order';
import { waCheckoutLink } from '@/lib/whatsapp';
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
  } = useStore();

  const totals = useMemo(() => {
    return calculateOrderTotals(
      cartProducts.map((i) => ({ id: i.id, quantity: i.quantity })),
      'CO',
      'bank_transfer'
    );
  }, [cartProducts]);

  useEffect(() => {
    if (!isCartOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCart();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={closeCart} aria-hidden="true" />

      {/* Drawer Panel */}
      <div className="w-full max-w-[480px] bg-white h-full flex flex-col shadow-2xl border-l border-[#E4E6E8]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E4E6E8] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-semibold text-[#111418]">
              Your Allocation Bag
            </h2>
            <p className="text-xs text-[#646D78]">
              Review your items, then proceed to checkout.
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
        <div className="flex-1 overflow-y-auto px-6 py-5">
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
          ) : (
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
                  <span className="text-[#111418] font-medium">{money(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#4F5863]">
                  <span>{totals.shippingLabel}</span>
                  <span className="text-[#111418] font-medium">
                    {totals.shippingFee === 0 ? 'Free' : money(totals.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#ECEEF0] text-sm font-semibold text-[#111418]">
                  <span>Estimated Total</span>
                  <span>{money(totals.total)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#9A6B3E] pt-0.5">
                  <span>Save 10% with BTC / USDT at checkout</span>
                  <span>-{money(Math.round(totals.subtotal * 0.1 * 100) / 100)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#5C636E]">
                <Truck className="w-3.5 h-3.5 text-[#9A6B3E] shrink-0" />
                <span>Exact freight &amp; state tax calculated at checkout by delivery state.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {cartProducts.length > 0 && (
          <div className="px-6 py-4 border-t border-[#E4E6E8] bg-white space-y-2.5">
            <button
              type="button"
              disabled={!totals.meetsMinOrder}
              onClick={() => {
                closeCart();
                router.push('/checkout/');
              }}
              className="w-full py-3 px-4 rounded-md text-sm font-medium text-white bg-[#111418] hover:bg-[#9A6B3E] disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Proceed to Checkout &middot; {money(totals.total)}
            </button>
            {SITE.checkout.whatsappCheckout && (
              <a
                href={
                  totals.meetsMinOrder
                    ? waCheckoutLink(
                        totals.items.map((i) => ({
                          name: i.name,
                          quantity: i.quantity,
                          lineTotal: i.lineTotal,
                        })),
                        totals.total
                      )
                    : undefined
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!totals.meetsMinOrder}
                onClick={(e) => {
                  if (!totals.meetsMinOrder) {
                    e.preventDefault();
                    return;
                  }
                  closeCart();
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium text-white transition-colors cursor-pointer disabled:opacity-45"
                style={{
                  backgroundColor: totals.meetsMinOrder ? '#25D366' : '#9CA3AF',
                  pointerEvents: totals.meetsMinOrder ? 'auto' : 'none',
                }}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Checkout via WhatsApp</span>
              </a>
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
