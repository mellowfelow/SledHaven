import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS } from '@/config/catalog';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category')?.trim().toLowerCase();
  const subcategory = searchParams.get('subcategory')?.trim().toLowerCase();

  let list = PRODUCTS;
  if (category) {
    list = list.filter((p) => p.category.toLowerCase() === category);
  }
  if (subcategory) {
    list = list.filter((p) => p.subcategorySlug.toLowerCase() === subcategory);
  }

  return NextResponse.json({
    count: list.length,
    currency: 'USD',
    products: list,
  });
}
