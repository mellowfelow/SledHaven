import fs from 'fs';
import path from 'path';

const root = process.cwd();
const siteConfigPath = path.join(root, 'config', 'site.ts');
const siteSource = fs.readFileSync(siteConfigPath, 'utf8');

function extractField(key, fallback) {
  const match = siteSource.match(new RegExp(`${key}:\\s*'([^']+)'`));
  return match ? match[1] : fallback;
}

const DOMAIN = extractField('domain', 'sledhaven.com');
const SITE_NAME = extractField('name', 'SledHaven');
const INDEXNOW_KEY = extractField('indexNowKey', 'sledhaven-indexnow-9f4e2c1b8a');
const ORIGIN = `https://${DOMAIN}`;

function writeFile(relPath, content) {
  const fullPath = path.join(root, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}

// 1. public/llms.txt
writeFile(
  'public/llms.txt',
  `# ${SITE_NAME}
> Luxury American snowmobile dealership delivering mountain, trail, touring, and utility snowmobiles nationwide across all 50 US states.

## Storefront Pages
- [Home](${ORIGIN}/)
- [Snowmobiles for Sale — Full Inventory](${ORIGIN}/shop/)
- [Brands & Engineering Divisions](${ORIGIN}/brands/)
- [Mountain Snowmobiles](${ORIGIN}/shop/mountain/)
- [Trail & Performance Snowmobiles](${ORIGIN}/shop/trail/)
- [Touring & Luxury Snowmobiles](${ORIGIN}/shop/touring/)
- [Utility & Alpine Gear](${ORIGIN}/shop/utility/)
- [Side-by-Side Comparison Tool](${ORIGIN}/compare/)
- [Field Journal & Buyer Guides (Blog)](${ORIGIN}/blog/)
- [Pay-in-4 Snowmobile Financing](${ORIGIN}/financing/)
- [Search Inventory](${ORIGIN}/search/)
- [Freight, MCO & Payment FAQ](${ORIGIN}/faq/)
- [About ${SITE_NAME}](${ORIGIN}/about/)
- [Contact Concierge](${ORIGIN}/contact/)

## Machine-Readable APIs & Commerce Endpoints
- Products JSON: ${ORIGIN}/api/products/
- Categories JSON: ${ORIGIN}/api/categories/
- Search JSON: ${ORIGIN}/api/search/?q=turbo
- Live MCP Streamable HTTP Server: ${ORIGIN}/api/mcp/
- ACP Catalog: ${ORIGIN}/api/acp/catalog/
- UCP Services: ${ORIGIN}/api/ucp/services/

## Order & Settlement Rules
- Minimum order: $200 USD
- Free shipping threshold: $500 USD (eligible gear & accessories)
- Snowmobile crated freight & applicable state tax: calculated at checkout by destination US state
- Cryptocurrency (BTC / USDT): 10% instant subtotal discount
- Active payment methods: Crypto (BTC/USDT), Bank Transfer (Wire/ACH), Zelle, Apple Pay, Chime, Pay in 4
- Temporarily unavailable: Credit Card
`
);

// 2. public/auth.md
writeFile(
  'public/auth.md',
  `# ${SITE_NAME} Authentication & Agent Access Policy

- Public storefront, catalog APIs (\`/api/products/\`, \`/api/categories/\`, \`/api/search/\`), and read-only MCP tools (\`/api/mcp/\`) require **no authentication**.
- Order submission (\`POST /api/contact/\`) is publicly accessible for customer checkout and enquiries.
- Customer payment details (\`/order/payment-details/?order=...\`) use the order reference number as a scoped lookup token.
- Staff Reply Portal routes (\`/admin/*\` and \`/api/admin/*\`) require a server-verified \`X-Admin-Passcode\` header and are excluded from search indexing.
`
);

// 3. public/[INDEXNOW_KEY].txt
writeFile(`public/${INDEXNOW_KEY}.txt`, `${INDEXNOW_KEY}\n`);

// 4. public/js/webmcp.js
writeFile(
  'public/js/webmcp.js',
  `(function () {
  if (typeof window === 'undefined') return;
  var tools = [
    {
      name: 'list_snowmobiles',
      description: 'Fetch in-stock ${SITE_NAME} snowmobiles and alpine gear.',
      execute: function (args) {
        var cat = args && args.category ? '?category=' + encodeURIComponent(args.category) : '';
        return fetch('/api/products/' + cat).then(function (r) { return r.json(); });
      }
    },
    {
      name: 'search_snowmobiles',
      description: 'Search ${SITE_NAME} inventory by keyword.',
      execute: function (args) {
        var q = args && args.query ? encodeURIComponent(args.query) : '';
        return fetch('/api/search/?q=' + q).then(function (r) { return r.json(); });
      }
    }
  ];
  window.__WEBMCP_TOOLS__ = tools;
  if (navigator && navigator.modelContext && typeof navigator.modelContext.registerTool === 'function') {
    tools.forEach(function (t) {
      try { navigator.modelContext.registerTool(t); } catch (e) {}
    });
  }
})();
`
);

// 5. public/.well-known/api-catalog
writeFile(
  'public/.well-known/api-catalog',
  JSON.stringify(
    {
      linkset: [
        {
          anchor: `${ORIGIN}/api/products/`,
          'service-desc': [{ href: `${ORIGIN}/api/mcp/`, type: 'application/json' }],
          'service-doc': [{ href: `${ORIGIN}/llms.txt`, type: 'text/plain' }],
        },
        {
          anchor: `${ORIGIN}/api/categories/`,
          'service-doc': [{ href: `${ORIGIN}/llms.txt`, type: 'text/plain' }],
        },
        {
          anchor: `${ORIGIN}/api/search/`,
          'service-doc': [{ href: `${ORIGIN}/llms.txt`, type: 'text/plain' }],
        },
      ],
    },
    null,
    2
  ) + '\n'
);

// 6. public/.well-known/agent-skills/index.json
writeFile(
  'public/.well-known/agent-skills/index.json',
  JSON.stringify(
    {
      schema_version: '1.0',
      site: ORIGIN,
      name: SITE_NAME,
      skills: [
        {
          id: 'browse-snowmobiles',
          name: 'Browse & Filter Snowmobiles',
          endpoint: `${ORIGIN}/api/products/`,
          method: 'GET',
        },
        {
          id: 'search-snowmobiles',
          name: 'Search Snowmobile Catalog',
          endpoint: `${ORIGIN}/api/search/`,
          method: 'GET',
        },
        {
          id: 'mcp-tools',
          name: 'MCP Commerce Tools',
          endpoint: `${ORIGIN}/api/mcp/`,
          method: 'POST',
        },
      ],
    },
    null,
    2
  ) + '\n'
);

// 7. public/.well-known/mcp/server-card.json (Vercel live MCP server)
writeFile(
  'public/.well-known/mcp/server-card.json',
  JSON.stringify(
    {
      serverInfo: {
        name: `${SITE_NAME} Storefront MCP`,
        version: '1.0.0',
      },
      transport: {
        type: 'streamable-http',
        endpoint: `${ORIGIN}/api/mcp/`,
      },
      authentication: {
        required: false,
      },
      capabilities: {
        tools: [
          'list_products',
          'get_product',
          'search_products',
          'list_categories',
          'calculate_shipping',
        ],
      },
    },
    null,
    2
  ) + '\n'
);

// 8. public/.well-known/oauth-protected-resource
writeFile(
  'public/.well-known/oauth-protected-resource',
  JSON.stringify(
    {
      resource: ORIGIN,
      bearer_methods_supported: ['header'],
      resource_documentation: `${ORIGIN}/auth.md`,
    },
    null,
    2
  ) + '\n'
);

// 9. public/.well-known/oauth-authorization-server
writeFile(
  'public/.well-known/oauth-authorization-server',
  JSON.stringify(
    {
      issuer: ORIGIN,
      service_documentation: `${ORIGIN}/auth.md`,
      grant_types_supported: [],
      response_types_supported: [],
    },
    null,
    2
  ) + '\n'
);

// 10. public/.well-known/openid-configuration
writeFile(
  'public/.well-known/openid-configuration',
  JSON.stringify(
    {
      issuer: ORIGIN,
      service_documentation: `${ORIGIN}/auth.md`,
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['RS256'],
    },
    null,
    2
  ) + '\n'
);

// 11. public/.well-known/acp.json
writeFile(
  'public/.well-known/acp.json',
  JSON.stringify(
    {
      acp_version: '1.0',
      merchant: SITE_NAME,
      domain: DOMAIN,
      catalog_url: `${ORIGIN}/api/acp/catalog/`,
      checkout_url: `${ORIGIN}/api/contact/`,
      currency: 'USD',
      country: 'US',
    },
    null,
    2
  ) + '\n'
);

// 12. public/.well-known/ucp ("ucp": "1.0" mandatory)
writeFile(
  'public/.well-known/ucp',
  JSON.stringify(
    {
      ucp: '1.0',
      merchant: SITE_NAME,
      domain: DOMAIN,
      services_url: `${ORIGIN}/api/ucp/services/`,
    },
    null,
    2
  ) + '\n'
);

// 13. vercel.json (headers + www -> apex redirect)
writeFile(
  'vercel.json',
  JSON.stringify(
    {
      redirects: [
        {
          source: '/:path*',
          has: [{ type: 'host', value: `www.${DOMAIN}` }],
          destination: `${ORIGIN}/:path*`,
          permanent: true,
        },
      ],
      headers: [
        {
          source: '/(.*)',
          headers: [
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          ],
        },
        {
          source: '/.well-known/(.*)',
          headers: [
            { key: 'Content-Type', value: 'application/json; charset=utf-8' },
            { key: 'Cache-Control', value: 'public, max-age=3600' },
          ],
        },
      ],
    },
    null,
    2
  ) + '\n'
);

console.log(`[gen-agent-files] Generated all Agent-Ready files and vercel.json for ${DOMAIN}`);
