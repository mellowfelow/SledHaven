import { SITE } from '@/config/site';

// Served as a Route Handler (not a public/ static file) so Vercel sends a
// real application/json Content-Type -- extensionless static files under
// public/.well-known/ were being served as application/octet-stream, which
// made UCP-aware agents treat the body as unparsed and report the mandatory
// "ucp" field missing even though it's present.
export async function GET() {
  const body = {
    ucp: '1.0',
    protocol_version: '1.0',
    spec: 'https://ucp.dev/specification/overview/',
    schema: 'https://ucp.dev/schema/v1.json',
    site: SITE.url,
    name: SITE.name,
    description: SITE.description,
    services: [
      { id: 'product-catalog', type: 'catalog', url: `${SITE.url}/shop/`, description: 'Full snowmobile and gear catalog' },
      { id: 'order', type: 'commerce', url: `${SITE.url}/contact/`, description: 'Place orders via checkout form' },
      { id: 'financing', type: 'commerce', url: `${SITE.url}/financing/`, description: 'Pay-in-4 financing terms' },
    ],
    capabilities: ['browse', 'search', 'inquiry', 'content'],
    endpoints: {
      catalog: `${SITE.url}/api/products/`,
      contact: `${SITE.url}/contact/`,
      agent_skills: `${SITE.url}/.well-known/agent-skills/index.json`,
      mcp_server_card: `${SITE.url}/.well-known/mcp/server-card.json`,
      api_catalog: `${SITE.url}/.well-known/api-catalog`,
      llms_txt: `${SITE.url}/llms.txt`,
    },
    currency: 'USD',
    minimum_order_usd: '200',
    payment_methods: ['crypto-BTC', 'crypto-USDT', 'bank-transfer', 'zelle', 'apple-pay', 'chime', 'pay-in-4'],
    legal: {
      age_restriction: 'none',
      product_type: 'Powersports vehicles and alpine gear',
      compliance: 'MCO documentation provided; buyer handles state registration.',
    },
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
