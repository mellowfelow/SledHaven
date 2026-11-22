import { NextResponse } from 'next/server';
import { SITE } from '@/config/site';
import { PRODUCTS } from '@/config/catalog';

export async function GET() {
  return NextResponse.json({
    protocol: 'acp',
    version: '1.0',
    merchant: {
      name: SITE.name,
      domain: SITE.domain,
      country: SITE.location.countryCode,
      currency: SITE.reply.currency.code,
      minOrderAmount: SITE.orderRules.minOrder,
      freeShippingThreshold: SITE.orderRules.freeShippingThreshold,
      cryptoDiscountPercent: SITE.orderRules.cryptoDiscountPercent,
    },
    items: PRODUCTS.map((p) => ({
      id: p.id,
      sku: p.sku,
      title: p.name,
      category: p.categoryName,
      subcategory: p.subcategory,
      price: p.price,
      currency: 'USD',
      availability: p.inStock ? 'in_stock' : 'out_of_stock',
      url: `${SITE.url}/shop/${p.category}/${p.slug}/`,
      image: `${SITE.url}${p.image}`,
      description: p.shortDescription,
    })),
  });
}
