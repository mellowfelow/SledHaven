import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SmartImage from '@/components/SmartImage';
import type { BlogPost } from '@/config/blog';

export default function BlogPostGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {posts.map((post) => (
        <article
          key={post.slug}
          className="group flex flex-col bg-white border border-[#E4E6E8] rounded-lg overflow-hidden hover:border-[#9A6B3E] transition-colors"
        >
          <Link
            href={`/blog/${post.slug}/`}
            className="relative aspect-[16/9] w-full bg-[#F3F1ED] overflow-hidden block"
          >
            <SmartImage
              src={post.coverImage}
              alt={post.coverAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </Link>
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center gap-2 text-xs text-[#646D78] mb-2">
              <span className="text-[#835931] font-medium">{post.category}</span>
              <span aria-hidden="true">&middot;</span>
              <span>{post.publishedAt}</span>
              <span aria-hidden="true">&middot;</span>
              <span>{post.readTime}</span>
            </div>
            <Link
              href={`/blog/${post.slug}/`}
              className="font-serif text-xl font-semibold text-[#111418] group-hover:text-[#9A6B3E] transition-colors leading-snug"
            >
              {post.title}
            </Link>
            <p className="mt-3 text-sm text-[#4F5863] leading-relaxed flex-1">
              {post.excerpt}
            </p>
            <Link
              href={`/blog/${post.slug}/`}
              className="mt-5 pt-4 border-t border-[#ECEEF0] inline-flex items-center gap-1.5 text-xs font-medium text-[#111418] group-hover:text-[#9A6B3E] transition-colors"
            >
              <span>Read Article</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
