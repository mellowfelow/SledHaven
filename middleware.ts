import { NextResponse, type NextRequest } from 'next/server';
import { SITE } from '@/config/site';

export function middleware(req: NextRequest) {
  const accept = req.headers.get('accept') || '';
  const isRsc = req.headers.get('rsc') === '1' || req.headers.has('next-router-prefetch');
  const pathname = req.nextUrl.pathname;

  // Serve concise Markdown summary ONLY to AI agents explicitly requesting text/markdown (never browsers or RSC)
  if (
    !isRsc &&
    accept.includes('text/markdown') &&
    !accept.includes('text/html') &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/_next')
  ) {
    const markdown = [
      `# ${SITE.name} — ${SITE.tagline}`,
      '',
      SITE.description,
      '',
      `- Full Agent Index: ${SITE.url}/llms.txt`,
      `- Products API: ${SITE.url}/api/products/`,
      `- MCP Server: ${SITE.url}/api/mcp/`,
      `- Phone: ${SITE.contact.phone}`,
    ].join('\n');

    return new NextResponse(markdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        Vary: 'Accept',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/shop/:path*',
    '/brands/:path*',
    '/compare/:path*',
    '/blog/:path*',
    '/financing/:path*',
    '/about/:path*',
    '/faq/:path*',
    '/contact/:path*',
  ],
};
