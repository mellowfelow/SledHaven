'use client';

import React, { createContext, useCallback, useContext, useState, useSyncExternalStore } from 'react';
import { PRODUCTS, type Product } from '@/config/catalog';

export interface CartItem {
  id: string;
  quantity: number;
}

interface StoreContextValue {
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartProducts: (CartItem & { product: Product })[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  compareIds: string[];
  toggleCompare: (productId: string) => void;
  replaceCompare: (oldId: string, newId: string) => void;
  clearCompare: () => void;
}

const CART_STORAGE_KEY = 'sledhaven_cart_v1';
const CART_EVENT = 'sledhaven-cart-change';
const EMPTY_CART_JSON = '[]';

function subscribeCart(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const onStorage = (e: StorageEvent) => {
    if (!e.key || e.key === CART_STORAGE_KEY) callback();
  };
  window.addEventListener(CART_EVENT, callback);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CART_EVENT, callback);
    window.removeEventListener('storage', onStorage);
  };
}

function getCartSnapshot(): string {
  if (typeof window === 'undefined') return EMPTY_CART_JSON;
  try {
    return window.localStorage.getItem(CART_STORAGE_KEY) || EMPTY_CART_JSON;
  } catch {
    return EMPTY_CART_JSON;
  }
}

function getCartServerSnapshot(): string {
  return EMPTY_CART_JSON;
}

function parseCart(raw: string): CartItem[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        Boolean(item) &&
        typeof item.id === 'string' &&
        typeof item.quantity === 'number' &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0
    );
  } catch {
    return [];
  }
}

function writeCart(next: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CART_EVENT));
  } catch {
    // Ignore storage quota / private mode failures
  }
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const rawCart = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getCartServerSnapshot
  );
  const cart = parseCart(rawCart);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([
    'sh-mtn-850tr',
    'sh-trl-900gt',
  ]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addToCart = useCallback((productId: string, quantity = 1) => {
    const prev = parseCart(getCartSnapshot());
    const existing = prev.find((i) => i.id === productId);
    const next = existing
      ? prev.map((i) =>
          i.id === productId ? { ...i, quantity: Math.min(10, i.quantity + quantity) } : i
        )
      : [...prev, { id: productId, quantity: Math.min(10, Math.max(1, quantity)) }];
    writeCart(next);
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    const prev = parseCart(getCartSnapshot());
    writeCart(prev.filter((i) => i.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    const prev = parseCart(getCartSnapshot());
    if (quantity <= 0) {
      writeCart(prev.filter((i) => i.id !== productId));
      return;
    }
    writeCart(
      prev.map((i) => (i.id === productId ? { ...i, quantity: Math.min(10, quantity) } : i))
    );
  }, []);

  const clearCart = useCallback(() => writeCart([]), []);

  const toggleCompare = useCallback((productId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), productId];
      }
      return [...prev, productId];
    });
  }, []);

  const replaceCompare = useCallback((oldId: string, newId: string) => {
    setCompareIds((prev) => {
      if (oldId === newId || prev.includes(newId)) return prev;
      return prev.map((id) => (id === oldId ? newId : id));
    });
  }, []);

  const clearCompare = useCallback(() => setCompareIds([]), []);

  const cartProducts = cart
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.id);
      return product ? { ...item, product } : null;
    })
    .filter((entry): entry is CartItem & { product: Product } => entry !== null);

  const cartCount = cartProducts.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = cartProducts.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <StoreContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        cartProducts,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        compareIds,
        toggleCompare,
        replaceCompare,
        clearCompare,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return ctx;
}
