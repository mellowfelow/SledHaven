import { NextResponse } from 'next/server';
import { CATEGORIES, PRODUCTS } from '@/config/catalog';

export async function GET() {
  const categories = CATEGORIES.map((cat) => ({
    ...cat,
    productCount: PRODUCTS.filter((p) => p.category === cat.slug).length,
  }));

  return NextResponse.json({
    count: categories.length,
    categories,
  });
}
