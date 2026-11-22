import { NextResponse } from 'next/server';
import { SITE } from '@/config/site';

export async function GET() {
  return NextResponse.json({
    ucp: '1.0',
    merchant: SITE.name,
    domain: SITE.domain,
    services: [
      {
        id: 'catalog',
        name: 'Snowmobile Inventory Catalog',
        endpoint: `${SITE.url}/api/products/`,
        method: 'GET',
      },
      {
        id: 'search',
        name: 'Inventory Search',
        endpoint: `${SITE.url}/api/search/`,
        method: 'GET',
      },
      {
        id: 'order',
        name: 'Order & Allocation Request',
        endpoint: `${SITE.url}/api/contact/`,
        method: 'POST',
      },
      {
        id: 'financing',
        name: 'Pay-in-4 Snowmobile Financing',
        url: `${SITE.url}/financing/`,
      },
    ],
  });
}
