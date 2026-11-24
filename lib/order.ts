import { SITE, getPaymentMethodConfig, getPaymentPlanConfig } from '@/config/site';
import { PRODUCTS, getStateShippingRule } from '@/config/catalog';

export interface ParsedPaymentField {
  label: string;
  value: string;
}

export interface OrderItemInput {
  id: string;
  quantity: number;
}

export interface OrderItemSnapshot {
  id: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  isVehicle: boolean;
  lineTotal: number;
}

export interface CalculatedOrderTotals {
  items: OrderItemSnapshot[];
  subtotal: number;
  cryptoDiscount: number;
  shippingFee: number;
  shippingLabel: string;
  transitDays: string;
  regulatoryNote: string;
  estimatedTax: number;
  total: number;
  payIn4Installment: number | null;
  meetsMinOrder: boolean;
}

export function money(amount: number): string {
  const { code, locale } = SITE.reply.currency;
  return new Intl.NumberFormat(locale || 'en-US', {
    style: 'currency',
    currency: code || 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Flexible payment-detail parser (`parsePaymentDetail`):
 * Admin pastes one blob of real payment info (bank wire, crypto wallet, Zelle, Apple Pay, Chime, link)
 * and it auto-splits into individually copyable label/value rows for the customer payment page.
 */
export function parsePaymentDetail(raw: string): ParsedPaymentField[] {
  if (!raw || typeof raw !== 'string') return [];

  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const fields: ParsedPaymentField[] = [];

  for (const line of lines) {
    // Pattern 1: "Label: Value" or "Label - Value"
    const colonIdx = line.indexOf(':');
    if (colonIdx > 1 && colonIdx < 48 && !/^https?:/i.test(line)) {
      const label = line.slice(0, colonIdx).replace(/^[-•*]\s*/, '').trim();
      const value = line.slice(colonIdx + 1).trim();
      if (label && value) {
        fields.push({ label, value });
        continue;
      }
    }

    // Pattern 2: URL / payment link
    if (/^https?:\/\//i.test(line)) {
      fields.push({ label: 'Payment Link', value: line });
      continue;
    }

    // Pattern 3: Crypto wallet detection (BTC / ETH / USDT ERC-20 / TRC-20)
    if (/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(line)) {
      fields.push({ label: 'Bitcoin (BTC) Address', value: line });
      continue;
    }
    if (/^0x[a-fA-F0-9]{40}$/.test(line)) {
      fields.push({ label: 'USDT (ERC-20) Wallet Address', value: line });
      continue;
    }
    if (/^T[A-Za-z1-9]{33}$/.test(line)) {
      fields.push({ label: 'USDT (TRC-20) Wallet Address', value: line });
      continue;
    }

    // Pattern 4: Email / Zelle / Apple Pay identifier
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(line)) {
      fields.push({ label: 'Recipient Email', value: line });
      continue;
    }

    // Pattern 5: Chime $ChimeSign
    if (/^\$[a-zA-Z0-9._-]{2,32}$/.test(line)) {
      fields.push({ label: 'Chime Sign', value: line });
      continue;
    }

    // Pattern 6: Phone number
    if (/^\+?[\d\s().-]{10,18}$/.test(line)) {
      fields.push({ label: 'Recipient Phone', value: line });
      continue;
    }

    // Fallback: single detail row
    fields.push({
      label: fields.length === 0 ? 'Payment Detail' : `Detail ${fields.length + 1}`,
      value: line,
    });
  }

  return fields;
}

export function paymentMethodParts(methodId: string) {
  const cfg = getPaymentMethodConfig(methodId);
  return {
    id: cfg.id,
    label: cfg.label,
    opening: cfg.opening,
    closing: cfg.closing,
    discountPercent: cfg.discountPercent || 0,
  };
}

export function paymentTermsLines(
  methodId: string,
  orderTotal: number,
  orderNumber: string,
  paymentPlanId: string = 'full'
): string[] {
  const parts = paymentMethodParts(methodId);
  const plan = getPaymentPlanConfig(paymentPlanId);
  const isPayIn4 = plan.id === 'pay_in_4';
  const installment = Math.round((orderTotal / 4) * 100) / 100;
  const amountDueNow = isPayIn4 ? installment : orderTotal;

  const lines: string[] = [
    `Order Reference: ${orderNumber}`,
    `Payment Method: ${parts.label}`,
    `Payment Plan: ${plan.label}`,
    `Amount Due Today: ${money(amountDueNow)}`,
  ];

  if (methodId === 'crypto') {
    lines.push(`Includes ${SITE.orderRules.cryptoDiscountPercent}% Cryptocurrency Discount.`);
  }
  if (isPayIn4) {
    lines.push(`Order Total: ${money(orderTotal)} — 3 remaining installments of ${money(installment)} follow every 30 days at 0% interest.`);
  }

  lines.push(SITE.reply.dispatchLogisticsLine);
  return lines;
}

export function paymentTermsHtml(
  methodId: string,
  orderTotal: number,
  orderNumber: string,
  paymentPlanId: string = 'full'
): string {
  return paymentTermsLines(methodId, orderTotal, orderNumber, paymentPlanId)
    .map((line) => `<p style="margin:0 0 6px 0;color:#334155;font-size:13px;line-height:1.5;">${escapeHtml(line)}</p>`)
    .join('');
}

export function escapeHtml(input: string): string {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Server-authoritative order calculation from canonical catalog + US state shipping/tax rules.
 */
export function calculateOrderTotals(
  rawItems: OrderItemInput[],
  stateCode: string,
  paymentMethodId: string,
  paymentPlanId: string = 'full'
): CalculatedOrderTotals {
  const items: OrderItemSnapshot[] = [];

  for (const item of rawItems) {
    const product = PRODUCTS.find((p) => p.id === item.id || p.slug === item.id);
    if (!product) continue;
    const qty = Math.max(1, Math.min(10, Math.floor(Number(item.quantity) || 1)));
    items.push({
      id: product.id,
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: qty,
      isVehicle: product.isVehicle,
      lineTotal: product.price * qty,
    });
  }

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const cryptoDiscount =
    paymentMethodId === 'crypto'
      ? Math.round(subtotal * (SITE.orderRules.cryptoDiscountPercent / 100) * 100) / 100
      : 0;

  const discountedSubtotal = Math.max(0, subtotal - cryptoDiscount);
  const stateRule = getStateShippingRule(stateCode || 'CO');
  const vehicleCount = items.reduce((sum, i) => sum + (i.isVehicle ? i.quantity : 0), 0);

  let shippingFee = 0;
  let shippingLabel = 'Free Shipping';

  if (vehicleCount > 0) {
    shippingFee = stateRule.vehicleFreight * vehicleCount;
    shippingLabel = `Insured Crated Freight (${stateRule.name})`;
  } else if (subtotal >= SITE.orderRules.freeShippingThreshold) {
    shippingFee = 0;
    shippingLabel = `Free Insured Parcel Shipping ($${SITE.orderRules.freeShippingThreshold}+ threshold met)`;
  } else if (subtotal > 0) {
    shippingFee = stateRule.parcelFee;
    shippingLabel = `Insured Parcel Shipping (${stateRule.name})`;
  }

  const estimatedTax = Math.round(discountedSubtotal * stateRule.estimatedTaxRate * 100) / 100;
  const total = Math.round((discountedSubtotal + shippingFee + estimatedTax) * 100) / 100;
  const payIn4Installment =
    paymentPlanId === 'pay_in_4' ? Math.round((total / 4) * 100) / 100 : null;

  return {
    items,
    subtotal,
    cryptoDiscount,
    shippingFee,
    shippingLabel,
    transitDays: stateRule.transitDays,
    regulatoryNote: stateRule.regulatoryNote,
    estimatedTax,
    total,
    payIn4Installment,
    meetsMinOrder: subtotal >= SITE.orderRules.minOrder,
  };
}

export function generateOrderNumber(): string {
  const now = new Date();
  const y = String(now.getFullYear()).slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${SITE.reply.orderPrefix}-${y}${m}${d}-${rand}`;
}
