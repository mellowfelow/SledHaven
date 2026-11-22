export interface PaymentMethodConfig {
  id: string;
  label: string;
  available: boolean;
  discountPercent?: number;
  note?: string;
  opening: string;
  closing: string;
}

export const SITE = {
  name: 'SledHaven',
  slug: 'sledhaven',
  domain: 'sledhaven.com',
  url: 'https://sledhaven.com',
  tagline: 'American Alpine Performance. Delivered Nationwide.',
  description:
    'Premier USA snowmobile dealership offering mountain, trail, touring, and utility snowmobiles for sale with state-calculated nationwide freight delivery, Pay-in-4 financing, and 10% crypto savings.',
  location: {
    country: 'USA',
    countryCode: 'US',
    region: 'Nationwide United States',
    display: 'United States — Nationwide Delivery',
  },
  contact: {
    email: 'concierge@sledhaven.com',
    orderEmail: 'orders@sledhaven.com',
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
      'luxury snowmobiles USA',
      'mountain snowmobiles for sale',
      'trail snowmobiles for sale',
      'touring snowmobiles USA',
      'wide track utility snowmobiles',
      'snowmobile financing pay in 4',
      'buy snowmobile with crypto',
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
          'Once your transaction is broadcast on-chain, upload your confirmation screenshot using the link below so our dispatch desk can lock your build slot and freight crate.',
      },
      {
        id: 'bank_transfer',
        label: 'Bank Transfer (Wire / ACH)',
        available: true,
        note: 'Direct domestic wire or ACH settlement.',
        opening:
          'Your SledHaven allocation is reserved. Please initiate a domestic wire or ACH transfer using the verified dealership settlement details below and include your order reference in the memo.',
        closing:
          'Upload your transfer receipt via the confirmation link below to expedite freight scheduling and MCO title preparation.',
      },
      {
        id: 'apple_pay',
        label: 'Apple Pay',
        available: true,
        note: 'Direct Apple Pay transfer via dealership desk.',
        opening:
          'Your SledHaven order is ready for Apple Pay settlement. Use the verified Apple Pay recipient details below and include your order number in the payment note.',
        closing:
          'After completing your Apple Pay transfer, submit your confirmation screenshot below so we can immediately trigger fulfillment.',
      },
      {
        id: 'chime',
        label: 'Chime',
        available: true,
        note: 'Instant Chime member-to-member settlement.',
        opening:
          'Your SledHaven order is confirmed and ready for Chime transfer. Send the verified amount to the Chime tag listed below with your order number in the note.',
        closing:
          'Once sent, upload your Chime receipt screenshot using the button below to finalize dispatch.',
      },
      {
        id: 'zelle',
        label: 'Zelle',
        available: true,
        note: 'Fast US bank-to-bank settlement via Zelle.',
        opening:
          'Your SledHaven reservation is ready for Zelle settlement. Transfer the exact amount to the verified recipient below and include your order reference.',
        closing:
          'Upload your Zelle confirmation screenshot below so our logistics desk can schedule crated delivery.',
      },
      {
        id: 'pay_in_4',
        label: 'Pay in 4 Financing',
        available: true,
        note: '4 equal installments — 25% due today to reserve allocation.',
        opening:
          'Your Pay-in-4 reservation has been reviewed. To lock your snowmobile allocation and initiate crating, remit the first 25% installment using the verified details below.',
        closing:
          'Remaining three installments follow every 30 days with 0% interest. Upload your initial installment receipt below to begin pre-delivery inspection.',
      },
      {
        id: 'credit_card',
        label: 'Credit Card',
        available: false,
        note: 'Temporarily unavailable — select Crypto (10% off), Bank Transfer, Zelle, Apple Pay, Chime, or Pay in 4.',
        opening: 'Credit card processing is currently unavailable.',
        closing: 'Please select an active payment method.',
      },
    ] as PaymentMethodConfig[],
  },
} as const;

export function getPaymentMethodConfig(id: string): PaymentMethodConfig {
  return (
    SITE.reply.paymentMethods.find((m) => m.id === id) ||
    SITE.reply.paymentMethods.find((m) => m.id === 'bank_transfer')!
  );
}
