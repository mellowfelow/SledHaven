export interface PaymentMethodConfig {
  id: string;
  label: string;
  available: boolean;
  discountPercent?: number;
  note?: string;
  opening: string;
  closing: string;
  /** Excluded from the selectable Payment Method list in checkout UI, but still resolvable
   *  (e.g. for legacy stored orders that reference it directly). */
  hidden?: boolean;
}

export interface PaymentPlanConfig {
  id: 'full' | 'pay_in_4';
  label: string;
  note: string;
}

export const SITE = {
  name: 'SledHaven',
  slug: 'sledhaven',
  domain: 'sledhaven.com',
  url: 'https://sledhaven.com',
  tagline: 'American Alpine Performance. Delivered Nationwide.',
  description:
    'USA snowmobile dealership: mountain, trail, touring & utility sleds for sale with nationwide freight, Pay-in-4 financing, and a 10% crypto discount.',
  location: {
    country: 'USA',
    countryCode: 'US',
    region: 'Nationwide United States',
    display: 'United States — Nationwide Delivery',
  },
  contact: {
    email: 'sales@sledhaven.com',
    orderEmail: 'sales@sledhaven.com',
    phone: '+1 (626) 686-4650',
    phoneHref: 'tel:+16266864650',
    whatsapp: '16266864650',
  },
  orderRules: {
    minOrder: 200,
    freeShippingThreshold: 500,
    cryptoDiscountPercent: 10,
    taxNote: 'State sales tax & state-regulated freight shipping calculated at checkout where applicable.',
  },
  checkout: {
    emailCheckout: true,
    whatsappCheckout: false,
    financingPage: true,
    financingTerms: 'Pay in 4',
  },
  features: {
    orderTracking: false,
    customerAccounts: false,
    wholesale: false,
    compareTool: true,
    financeCalculator: false,
    replyPortal: true,
  },
  forms: {
    provider: 'smtp' as 'smtp' | 'resend',
  },
  chat: {
    tawkPropertyId: process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || '',
    tawkWidgetId: process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || '',
  },
  indexNowKey: 'sledhaven-indexnow-9f4e2c1b8a',
  seo: {
    primaryKeyword: 'snowmobiles for sale',
    secondaryKeywords: [
      'snowmobile for sale',
      'snowmobile dealership',
      'mountain snowmobile',
      'utility snowmobile',
      'crossover snowmobile',
      '2 up snowmobile',
      'wide track snowmobile',
      'snowmobile financing',
      'nationwide snowmobile freight delivery',
    ],
  },
  reply: {
    enabled: true,
    brand: {
      primary: '#9A6B3E',
      primaryHover: '#835931',
      headerDark: '#111418',
      surfaceLight: '#F7F7F5',
    },
    currency: {
      code: 'USD',
      symbol: '$',
      locale: 'en-US',
    },
    orderPrefix: 'SH',
    headerTagline: 'American Alpine Performance · Nationwide USA Dealership',
    dispatchLogisticsLine:
      'Every machine ships crated and insured across the United States with full Manufacturer Certificate of Origin (MCO) documentation for your state registration.',
    paymentMethods: [
      {
        id: 'crypto',
        label: 'Cryptocurrency (BTC / USDT)',
        available: true,
        discountPercent: 10,
        note: 'Includes 10% instant crypto discount applied to subtotal.',
        opening:
          'Your SledHaven order has been verified with the 10% cryptocurrency discount applied. Please send the exact total below to the verified wallet address provided.',
        closing:
          'Once your transaction is broadcast on-chain, just reply to this message with a screenshot so our dispatch desk can lock your build slot and freight crate.',
      },
      {
        id: 'bank_transfer',
        label: 'Bank Transfer (Wire / ACH)',
        available: true,
        note: 'Direct domestic wire or ACH settlement.',
        opening:
          'Your SledHaven allocation is reserved. Please initiate a domestic wire or ACH transfer using the verified dealership settlement details below and include your order reference in the memo.',
        closing:
          'Just reply to this message with a screenshot of your transfer receipt to expedite freight scheduling and MCO title preparation.',
      },
      {
        id: 'apple_pay',
        label: 'Apple Pay',
        available: true,
        note: 'Direct Apple Pay transfer via dealership desk.',
        opening:
          'Your SledHaven order is ready for Apple Pay settlement. Use the verified Apple Pay recipient details below and include your order number in the payment note.',
        closing:
          'After completing your Apple Pay transfer, just reply to this message with a screenshot so we can immediately trigger fulfillment.',
      },
      {
        id: 'chime',
        label: 'Chime',
        available: true,
        note: 'Instant Chime member-to-member settlement.',
        opening:
          'Your SledHaven order is confirmed and ready for Chime transfer. Send the verified amount to the Chime tag listed below with your order number in the note.',
        closing:
          'Once sent, just reply to this message with a screenshot of your Chime receipt to finalize dispatch.',
      },
      {
        id: 'zelle',
        label: 'Zelle',
        available: true,
        note: 'Fast US bank-to-bank settlement via Zelle.',
        opening:
          'Your SledHaven reservation is ready for Zelle settlement. Transfer the exact amount to the verified recipient below and include your order reference.',
        closing:
          'Just reply to this message with a screenshot of your Zelle confirmation so our logistics desk can schedule crated delivery.',
      },
      {
        id: 'pay_in_4',
        label: 'Pay in 4 Financing',
        available: true,
        hidden: true,
        note: '4 equal installments — 25% due immediately to reserve allocation.',
        opening:
          'Your Pay-in-4 reservation has been reviewed. To lock your snowmobile allocation and initiate crating, remit the first 25% installment using the verified details below.',
        closing:
          'Remaining three installments follow every 4 weeks with 0% interest. Just reply to this message with a screenshot of your initial installment receipt to begin pre-delivery inspection.',
      },
      {
        id: 'credit_card',
        label: 'Credit Card',
        available: false,
        note: 'Temporarily unavailable — select Crypto (10% off), Bank Transfer, Zelle, Apple Pay, or Chime.',
        opening: 'Credit card processing is currently unavailable.',
        closing: 'Please select an active payment method.',
      },
    ] as PaymentMethodConfig[],
    paymentPlans: [
      {
        id: 'full',
        label: 'Pay in Full (100%)',
        note: 'Pay the full order total upfront via your selected payment method.',
      },
      {
        id: 'pay_in_4',
        label: 'Pay-in-4 Financing',
        note: '25% due immediately to reserve your allocation, then 3 equal interest-free installments every 4 weeks.',
      },
    ] as PaymentPlanConfig[],
  },
} as const;

export function getPaymentMethodConfig(id: string): PaymentMethodConfig {
  return (
    SITE.reply.paymentMethods.find((m) => m.id === id) ||
    SITE.reply.paymentMethods.find((m) => m.id === 'bank_transfer')!
  );
}

export function getPaymentPlanConfig(id: string): PaymentPlanConfig {
  return (
    SITE.reply.paymentPlans.find((p) => p.id === id) ||
    SITE.reply.paymentPlans.find((p) => p.id === 'full')!
  );
}
