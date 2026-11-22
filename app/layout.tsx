import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Playfair_Display, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SITE } from '@/config/site';
import { StoreProvider } from '@/components/StoreProvider';
import AnnouncementBar from '@/components/AnnouncementBar';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ChatHub from '@/components/ChatHub';
import JsonLd from '@/components/JsonLd';
import { REVIEW_SUMMARY } from '@/config/reviews';
import { CATEGORIES, PRODUCTS } from '@/config/catalog';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#111418',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Luxury Snowmobiles for Sale in the USA`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [SITE.seo.primaryKeyword, ...SITE.seo.secondaryKeywords],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Luxury Snowmobiles for Sale in the USA`,
    description: SITE.description,
    images: [
      {
        url: '/images/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: `${SITE.name} luxury alpine snowmobile on snow ridge`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — Luxury Snowmobiles for Sale in the USA`,
    description: SITE.description,
    images: ['/images/og-cover.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['AutoDealer', 'Store', 'Organization'],
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    telephone: SITE.contact.phone,
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    priceRange: '$649 - $19,899',
    numberOfItems: PRODUCTS.length,
    knowsAbout: CATEGORIES.map((c) => c.name),
    makesOffer: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      offerCount: PRODUCTS.length,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: REVIEW_SUMMARY.averageRating,
      reviewCount: REVIEW_SUMMARY.totalReviews,
      bestRating: 5,
      worstRating: 1,
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE.url}/search/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} ${jetbrains.variable}`}
    >
      <body
        suppressHydrationWarning
        className="font-sans bg-[#F7F7F5] text-[#111418] min-h-screen flex flex-col"
      >
        <JsonLd data={[organizationSchema, websiteSchema]} />
        <StoreProvider>
          <AnnouncementBar />
          <Nav />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
          <CartDrawer />
          <ChatHub />
        </StoreProvider>
        <Script src="/js/webmcp.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
