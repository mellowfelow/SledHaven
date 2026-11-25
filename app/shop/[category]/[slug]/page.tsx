import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE } from '@/config/site';
import { PRODUCTS, getProductBySlug, getCategoryBySlug } from '@/config/catalog';
import ProductDetailClient from '@/components/ProductDetailClient';
import ProductCard from '@/components/ProductCard';
import JsonLd from '@/components/JsonLd';

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata(context: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await context.params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Listing Not Found' };
  const shortCat = getCategoryBySlug(product.category)?.shortTitle || product.categoryName;

  return {
    title: `${product.name} — ${shortCat}`,
    description: product.shortDescription,
    alternates: { canonical: `/shop/${product.category}/${product.slug}/` },
    openGraph: {
      title: `${product.name} | ${SITE.name}`,
      description: product.shortDescription,
      images: [{ url: product.image, alt: product.imageAlt }],
    },
  };
}

export default async function ProductPage(context: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await context.params;
  const product = getProductBySlug(slug);
  if (!product || product.category !== category) notFound();

  const related = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.isVehicle)
  ).slice(0, 3);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku,
    description: product.description,
    image: `${SITE.url}${product.image}`,
    category: `${product.categoryName} > ${product.subcategory}`,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE.url}/shop/${product.category}/${product.slug}/`,
      priceCurrency: 'USD',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Inventory', item: `${SITE.url}/shop/` },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.categoryName,
        item: `${SITE.url}/shop/${product.category}/`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: `${SITE.url}/shop/${product.category}/${product.slug}/`,
      },
    ],
  };

  return (
    <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <JsonLd data={[productSchema, breadcrumbSchema]} />

      <nav
        aria-label="Breadcrumb"
        className="text-xs text-[#646D78] flex flex-wrap items-center gap-2 mb-8"
      >
        <Link href="/" className="hover:text-[#111418]">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/shop/" className="hover:text-[#111418]">
          Inventory
        </Link>
        <span aria-hidden="true">/</span>
        <Link href={`/shop/${product.category}/`} className="hover:text-[#111418]">
          {product.categoryName}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-[#111418] font-medium">{product.name}</span>
      </nav>

      <ProductDetailClient product={product} />

      {related.length > 0 && (
        <section className="mt-20 pt-12 border-t border-[#E4E6E8]">
          <h2 className="font-serif text-2xl font-semibold text-[#111418] mb-8">
            Related Snowmobiles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
