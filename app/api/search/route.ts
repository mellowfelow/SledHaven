import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS } from '@/config/catalog';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim().toLowerCase().slice(0, 100);

  if (!q) {
    return NextResponse.json({ query: '', count: PRODUCTS.length, results: PRODUCTS });
  }

  const terms = q.split(/\s+/).filter(Boolean);
  const results = PRODUCTS.filter((p) => {
    const haystack = [
      p.name,
      p.brand,
      p.categoryName,
      p.subcategory,
      p.shortDescription,
      p.description,
      p.sku,
      ...Object.values(p.specs),
    ]
      .join(' ')
      .toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });

  return NextResponse.json({
    query: q,
    count: results.length,
    results,
  });
}
