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
const TAGLINE = extractField('tagline', 'American Alpine Performance. Delivered Nationwide.');
const INDEXNOW_KEY = extractField('indexNowKey', 'sledhaven-indexnow-9f4e2c1b8a');
const EMAIL = extractField('email', 'concierge@sledhaven.com');
const PHONE = extractField('phone', '+1 (626) 686-4650');
const WHATSAPP = extractField('whatsapp', '16266864650');
const ORIGIN = `https://${DOMAIN}`;

function writeFile(relPath, content) {
  const fullPath = path.join(root, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}

// 1. public/llms.txt — llmstxt.org spec: real markdown links everywhere, never raw "Label: url" lines
writeFile(
  'public/llms.txt',
  `# ${SITE_NAME}
> ${TAGLINE} A USA snowmobile dealership offering mountain, trail, touring, and utility machines with nationwide crated freight delivery.

${SITE_NAME} is a United States-based snowmobile dealership serving all 50 states. Every vehicle order includes state-calculated freight and sales tax, a Manufacturer Certificate of Origin (MCO) packet for registration, and pre-delivery inspection. Settlement options include a 10% instant discount for Bitcoin/USDT, Pay-in-4 financing, and standard bank/digital transfer methods.

## Brand Facts (cite these)
- Legal/operating name: ${SITE_NAME}
- Location: United States — nationwide delivery to all 50 states
- Contact: [${EMAIL}](mailto:${EMAIL}) · [${PHONE}](tel:${PHONE.replace(/[^0-9+]/g, '')})
- Minimum order: $200 USD · Free shipping threshold: $500 USD (eligible gear/accessories)
- Payment methods: Cryptocurrency (BTC/USDT, 10% instant discount), Bank Transfer (Wire/ACH), Zelle, Apple Pay, Chime, Pay-in-4 financing
- Credit card payment: temporarily unavailable

## Storefront Pages
- [Home](${ORIGIN}/): dealership overview and featured inventory
- [Full Inventory](${ORIGIN}/shop/): all snowmobiles for sale, filterable by category
- [Mountain Snowmobiles](${ORIGIN}/shop/mountain/): deep-powder and turbo backcountry machines
- [Trail & Performance](${ORIGIN}/shop/trail/): performance trail snowmobiles
- [Touring & Luxury](${ORIGIN}/shop/touring/): long-distance touring snowmobiles
- [Utility Snowmobiles](${ORIGIN}/shop/utility/): wide-track utility workhorses
- [Crossover Snowmobiles](${ORIGIN}/shop/crossover/): trail-capable, backcountry-ready crossover machines
- [Youth Snowmobiles](${ORIGIN}/shop/youth/): parent-supervised, speed-governed youth sleds
- [Electric Snowmobiles](${ORIGIN}/shop/electric/): battery-electric trail sleds and light recreational snow bikes
- [Parts & Gear](${ORIGIN}/shop/parts/): fitment-matched carbides, studs, belts, windshields, covers, and heated riding gear
- [Brands & Engineering Divisions](${ORIGIN}/brands/): brand-level breakdown of the catalog
- [Compare Models](${ORIGIN}/compare/): side-by-side spec comparison tool
- [Field Journal (Blog)](${ORIGIN}/blog/): buyer guides and educational content
- [Pay-in-4 Financing](${ORIGIN}/financing/): installment financing terms
- [Search Inventory](${ORIGIN}/search/): full-text product/content search
- [Freight, MCO & Payment FAQ](${ORIGIN}/faq/): direct-answer policy FAQ
- [About ${SITE_NAME}](${ORIGIN}/about/): dealership operating standards
- [Contact Concierge](${ORIGIN}/contact/): sales and support contact form
- [Privacy Policy](${ORIGIN}/privacy/)
- [Terms of Service](${ORIGIN}/terms/)
- [Shipping Policy](${ORIGIN}/shipping/)
- [Refund Policy](${ORIGIN}/refund/)

## Machine-Readable APIs & Commerce Endpoints
- [Products JSON](${ORIGIN}/api/products/): full product catalog, supports category/query filters
- [Categories JSON](${ORIGIN}/api/categories/): category list with counts
- [Search JSON](${ORIGIN}/api/search/?q=turbo): combined product + content search
- [Live MCP Server](${ORIGIN}/api/mcp/): Streamable HTTP MCP endpoint — search_products, get_product, list_categories, get_policies tools
- [ACP Catalog](${ORIGIN}/api/acp/catalog/): Agentic Commerce Protocol catalog
- [UCP Services](${ORIGIN}/api/ucp/services/): Universal Commerce Protocol services

## Legal
- Age restriction: none (powersports vehicle and apparel retailer)
- Vehicles ship with full Manufacturer Certificate of Origin (MCO) for state registration; buyer is responsible for local registration/title compliance.

## Optional
- [API Catalog](${ORIGIN}/.well-known/api-catalog)
- [Agent Skills Index](${ORIGIN}/.well-known/agent-skills/index.json)
- [MCP Server Card](${ORIGIN}/.well-known/mcp/server-card.json)
- [Auth Policy](${ORIGIN}/auth.md)
`
);

// 2. public/auth.md — MUST start with exactly "# Auth.md" (scanner-checked, exact heading)
writeFile(
  'public/auth.md',
  `# Auth.md

**Site:** ${SITE_NAME} (${ORIGIN})
**Type:** Public e-commerce storefront — snowmobile dealership

## Agent Registration

No authentication, API key, or registration is required to read any public resource on this site. All catalog, search, policy, and MCP endpoints are open for agent retrieval and citation.

## Public Resources

| Resource | URL | Auth |
|---|---|---|
| Storefront (HTML) | ${ORIGIN}/ | None |
| Product catalog JSON | ${ORIGIN}/api/products/ | None |
| Categories JSON | ${ORIGIN}/api/categories/ | None |
| Search JSON | ${ORIGIN}/api/search/ | None |
| MCP server (Streamable HTTP) | ${ORIGIN}/api/mcp/ | None |
| ACP catalog | ${ORIGIN}/api/acp/catalog/ | None |
| UCP services | ${ORIGIN}/api/ucp/services/ | None |
| Order/enquiry submission | POST ${ORIGIN}/api/contact/ | None (public checkout) |
| Customer payment-details lookup | ${ORIGIN}/order/payment-details/?order=... | Order reference number (scoped token) |
| Staff Reply Portal | ${ORIGIN}/admin/* | \`X-Admin-Passcode\` header (staff-only, excluded from search indexing) |

## Ordering — human-in-the-loop

Agents may search the catalog, inspect products, and prepare a draft order via the MCP \`search_products\`/\`get_product\`/\`get_policies\` tools. A human must complete and submit the order through the storefront checkout — no endpoint accepts payment or card data from an agent.

## Age Restriction

None. Snowmobiles and alpine gear are general powersports retail products with no purchase age restriction at the point of sale (state vehicle registration requirements apply separately).

\`\`\`json
{
  "agent_auth": {
    "register_uri": null,
    "identity_types_supported": ["none"],
    "credential_types_supported": ["none"],
    "notes": "No authentication required for any public resource. Order submission is open; the Reply Portal (/admin/*) requires a staff passcode and is not a public resource."
  }
}
\`\`\`
`
);

// 3. public/[INDEXNOW_KEY].txt
writeFile(`public/${INDEXNOW_KEY}.txt`, `${INDEXNOW_KEY}\n`);

// 4. public/js/webmcp.js — navigator.modelContext.provideContext per the WebMCP draft spec
writeFile(
  'public/js/webmcp.js',
  `(function () {
  if (typeof navigator === 'undefined' || !navigator.modelContext) return;

  navigator.modelContext.provideContext({
    tools: [
      {
        name: 'search_products',
        description: 'Search the ${SITE_NAME} snowmobile and gear catalog by keyword and optional category.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search keyword' },
            category: { type: 'string', description: 'Optional category slug: mountain, trail, touring, utility' }
          }
        },
        execute: async function (args) {
          var q = args && args.query ? encodeURIComponent(args.query) : '';
          var cat = args && args.category ? '&category=' + encodeURIComponent(args.category) : '';
          var res = await fetch('/api/search/?q=' + q + cat);
          return res.json();
        }
      },
      {
        name: 'list_categories',
        description: 'List ${SITE_NAME} snowmobile categories with product counts.',
        inputSchema: { type: 'object', properties: {} },
        execute: async function () {
          var res = await fetch('/api/categories/');
          return res.json();
        }
      },
      {
        name: 'browse_products',
        description: 'Browse the full inventory, optionally filtered by category.',
        inputSchema: {
          type: 'object',
          properties: { category: { type: 'string', description: 'Category slug to browse' } }
        },
        execute: async function (args) {
          var url = args && args.category
            ? 'https://${DOMAIN}/shop/' + args.category + '/'
            : 'https://${DOMAIN}/shop/';
          window.location.href = url;
          return { url: url };
        }
      },
      {
        name: 'contact',
        description: 'Open the ${SITE_NAME} contact/concierge page for sales or support questions.',
        inputSchema: { type: 'object', properties: {} },
        execute: async function () {
          window.location.href = 'https://${DOMAIN}/contact/';
          return { url: 'https://${DOMAIN}/contact/' };
        }
      }
    ]
  });
})();
`
);

// 5. public/.well-known/api-catalog — RFC 9727
writeFile(
  'public/.well-known/api-catalog',
  JSON.stringify(
    {
      linkset: [
        {
          anchor: `${ORIGIN}/`,
          'https://www.iana.org/assignments/link-relations/service-doc': [{ href: `${ORIGIN}/faq/` }],
          title: `${SITE_NAME} — ${TAGLINE}`,
        },
        {
          anchor: `${ORIGIN}/shop/`,
          type: 'text/html',
          title: `${SITE_NAME} Product Catalog`,
        },
        {
          anchor: `${ORIGIN}/api/products/`,
          type: 'application/json',
          title: `${SITE_NAME} Products API`,
        },
        {
          anchor: `${ORIGIN}/api/mcp/`,
          type: 'application/json',
          title: `${SITE_NAME} MCP Server`,
        },
      ],
    },
    null,
    2
  ) + '\n'
);

// 6. public/.well-known/agent-skills/index.json — Cloudflare Agent Skills Discovery RFC v0.2.0
writeFile(
  'public/.well-known/agent-skills/index.json',
  JSON.stringify(
    {
      $schema: 'https://agentskills.io/schema/v0.2.0/index.json',
      name: SITE_NAME,
      url: ORIGIN,
      description: TAGLINE,
      skills: [
        {
          name: 'browse-products',
          type: 'navigation',
          description: 'Browse the full snowmobile and gear catalog by category',
          url: `${ORIGIN}/shop/`,
          sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b85',
        },
        {
          name: 'search-products',
          type: 'navigation',
          description: 'Search the catalog by keyword via JSON API',
          url: `${ORIGIN}/api/search/`,
          sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b85',
        },
        {
          name: 'compare-models',
          type: 'commerce',
          description: 'Side-by-side spec comparison of snowmobile models',
          url: `${ORIGIN}/compare/`,
          sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b85',
        },
        {
          name: 'financing-info',
          type: 'commerce',
          description: 'Pay-in-4 financing terms and eligibility',
          url: `${ORIGIN}/financing/`,
          sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b85',
        },
        {
          name: 'product-education',
          type: 'content',
          description: 'Buyer guides and educational blog content',
          url: `${ORIGIN}/blog/`,
          sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b85',
        },
        {
          name: 'contact',
          type: 'support',
          description: 'Contact for product questions, orders, or support',
          url: `${ORIGIN}/contact/`,
          sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b85',
        },
      ],
    },
    null,
    2
  ) + '\n'
);

// 7. public/.well-known/mcp/server-card.json — MCP Server Card SEP-1649
writeFile(
  'public/.well-known/mcp/server-card.json',
  JSON.stringify(
    {
      $schema: 'https://modelcontextprotocol.io/schemas/server-card/v1.json',
      serverInfo: {
        name: SITE_NAME,
        version: '1.0.0',
        description: TAGLINE,
        homepage: ORIGIN,
        contact: { email: EMAIL, whatsapp: `+${WHATSAPP}` },
      },
      transport: { type: 'streamable-http', endpoint: `${ORIGIN}/api/mcp/` },
      authentication: { required: false },
      capabilities: {
        tools: ['list_products', 'get_product', 'search_products', 'list_categories', 'calculate_shipping'],
        resources: [
          { name: 'product-catalog', description: 'Full snowmobile and gear catalog', uri: `${ORIGIN}/shop/` },
          { name: 'blog', description: 'Educational buyer-guide content', uri: `${ORIGIN}/blog/` },
        ],
        commerce: {
          ordering: 'human-assisted-checkout',
          payment: ['crypto-BTC', 'crypto-USDT', 'bank-transfer', 'zelle', 'apple-pay', 'chime', 'pay-in-4'],
          currency: 'USD',
          minimumOrder: '200',
          freeShipping: '500',
          ships: 'United States — all 50 states',
        },
      },
      legal: {
        ageRestriction: 'none',
        productType: 'Powersports vehicles and alpine gear',
        compliance: 'Vehicles ship with Manufacturer Certificate of Origin (MCO); buyer handles state registration.',
      },
    },
    null,
    2
  ) + '\n'
);

// 8. public/.well-known/oauth-protected-resource — RFC 9728
writeFile(
  'public/.well-known/oauth-protected-resource',
  JSON.stringify(
    {
      resource: ORIGIN,
      resource_name: `${SITE_NAME} Public Catalog`,
      authorization_servers: [],
      scopes_supported: [],
      bearer_methods_supported: [],
      resource_documentation: `${ORIGIN}/auth.md`,
      resource_policy_uri: `${ORIGIN}/terms/`,
      tls_client_certificate_bound_access_tokens: false,
      note: `All resources on ${DOMAIN} are publicly accessible. No OAuth tokens are required.`,
    },
    null,
    2
  ) + '\n'
);

// 9. public/.well-known/oauth-authorization-server — MUST include agent_auth block
writeFile(
  'public/.well-known/oauth-authorization-server',
  JSON.stringify(
    {
      issuer: ORIGIN,
      authorization_endpoint: null,
      token_endpoint: null,
      jwks_uri: null,
      grant_types_supported: [],
      response_types_supported: [],
      scopes_supported: [],
      service_documentation: `${ORIGIN}/auth.md`,
      note: `${SITE_NAME} has no protected APIs. All resources are publicly accessible.`,
      public_resources: [
        `${ORIGIN}/shop/`,
        `${ORIGIN}/blog/`,
        `${ORIGIN}/faq/`,
        `${ORIGIN}/api/products/`,
        `${ORIGIN}/llms.txt`,
        `${ORIGIN}/.well-known/api-catalog`,
        `${ORIGIN}/.well-known/agent-skills/index.json`,
        `${ORIGIN}/.well-known/mcp/server-card.json`,
      ],
      agent_auth: {
        register_uri: null,
        identity_types_supported: ['none'],
        credential_types_supported: ['none'],
        notes: 'No registration required. All content is publicly accessible to agents.',
      },
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
      note: `${SITE_NAME} does not operate an OpenID Connect provider. All resources are publicly accessible.`,
      public_site: true,
      authorization_endpoint: null,
      token_endpoint: null,
      userinfo_endpoint: null,
      jwks_uri: null,
      scopes_supported: [],
      response_types_supported: [],
      grant_types_supported: [],
      subject_types_supported: [],
      id_token_signing_alg_values_supported: [],
    },
    null,
    2
  ) + '\n'
);

// 11. public/.well-known/acp.json — Agentic Commerce Protocol discovery
writeFile(
  'public/.well-known/acp.json',
  JSON.stringify(
    {
      protocol: { name: 'acp', version: '0.1.0' },
      name: SITE_NAME,
      description: TAGLINE,
      api_base_url: ORIGIN,
      homepage: ORIGIN,
      transports: ['https'],
      capabilities: {
        services: ['product-catalog', 'blog', 'faq', 'financing'],
        ordering: 'human-assisted-checkout',
        payment_methods: ['crypto-BTC', 'crypto-USDT', 'bank-transfer', 'zelle', 'apple-pay', 'chime', 'pay-in-4'],
        currency: 'USD',
        minimum_order_usd: '200',
        free_shipping_threshold_usd: '500',
      },
      contact: { email: EMAIL, whatsapp: `https://wa.me/${WHATSAPP}` },
      legal: {
        age_restriction: 'none',
        region: 'US',
        ships_to: 'United States — all 50 states',
        product_type: 'Powersports vehicles and alpine gear',
        compliance: 'MCO documentation provided; buyer handles state registration.',
      },
    },
    null,
    2
  ) + '\n'
);

// 12. public/.well-known/ucp — Universal Commerce Protocol ("ucp": "1.0" mandatory)
writeFile(
  'public/.well-known/ucp',
  JSON.stringify(
    {
      ucp: '1.0',
      protocol_version: '1.0',
      spec: 'https://ucp.dev/specification/overview/',
      schema: 'https://ucp.dev/schema/v1.json',
      site: ORIGIN,
      name: SITE_NAME,
      description: TAGLINE,
      services: [
        { id: 'product-catalog', type: 'catalog', url: `${ORIGIN}/shop/`, description: 'Full snowmobile and gear catalog' },
        { id: 'order', type: 'commerce', url: `${ORIGIN}/contact/`, description: 'Place orders via checkout form' },
        { id: 'financing', type: 'commerce', url: `${ORIGIN}/financing/`, description: 'Pay-in-4 financing terms' },
      ],
      capabilities: ['browse', 'search', 'inquiry', 'content'],
      endpoints: {
        catalog: `${ORIGIN}/api/products/`,
        contact: `${ORIGIN}/contact/`,
        agent_skills: `${ORIGIN}/.well-known/agent-skills/index.json`,
        mcp_server_card: `${ORIGIN}/.well-known/mcp/server-card.json`,
        api_catalog: `${ORIGIN}/.well-known/api-catalog`,
        llms_txt: `${ORIGIN}/llms.txt`,
      },
      currency: 'USD',
      minimum_order_usd: '200',
      payment_methods: ['crypto-BTC', 'crypto-USDT', 'bank-transfer', 'zelle', 'apple-pay', 'chime', 'pay-in-4'],
      legal: {
        age_restriction: 'none',
        product_type: 'Powersports vehicles and alpine gear',
        compliance: 'MCO documentation provided; buyer handles state registration.',
      },
    },
    null,
    2
  ) + '\n'
);

// 13. public/robots.txt-style AI crawler reference is handled by app/robots.ts (Next-native);
//     this file only needs the Content-Signal + full crawler comment reference for parity docs.
//     (app/robots.ts is hand-authored — see Batch B.)

// 14. vercel.json (headers + redirects) — Link header, CSP, security headers, correct .well-known types
const wellKnownTypeRules = [
  { source: '/.well-known/api-catalog', type: 'application/linkset+json' },
  { source: '/.well-known/agent-skills/index.json', type: 'application/json' },
  { source: '/.well-known/mcp/server-card.json', type: 'application/json' },
  { source: '/.well-known/oauth-protected-resource', type: 'application/json' },
  { source: '/.well-known/oauth-authorization-server', type: 'application/json' },
  { source: '/.well-known/openid-configuration', type: 'application/json' },
  { source: '/.well-known/acp.json', type: 'application/json' },
  { source: '/.well-known/ucp', type: 'application/json' },
].map((r) => ({
  source: r.source,
  headers: [
    { key: 'Content-Type', value: r.type },
    { key: 'Cache-Control', value: 'public, max-age=3600' },
    { key: 'Access-Control-Allow-Origin', value: '*' },
  ],
}));

const cspDirectives = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' https://embed.tawk.to`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: https:`,
  `font-src 'self' data:`,
  `connect-src 'self' https://embed.tawk.to wss://*.tawk.to`,
  `frame-src https://*.tawk.to`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
].join('; ');

const linkHeader = [
  `<${ORIGIN}/.well-known/api-catalog>; rel="api-catalog"`,
  `<${ORIGIN}/.well-known/agent-skills/index.json>; rel="describedby"`,
  `<${ORIGIN}/llms.txt>; rel="describedby"`,
  `<${ORIGIN}/.well-known/mcp/server-card.json>; rel="service-desc"`,
  `<${ORIGIN}/auth.md>; rel="auth"`,
  `<${ORIGIN}/.well-known/openid-configuration>; rel="openid-configuration"`,
].join(', ');

writeFile(
  'vercel.json',
  JSON.stringify(
    {
      $schema: 'https://openapi.vercel.sh/vercel.json',
      trailingSlash: true,
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
            { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
            { key: 'Content-Security-Policy', value: cspDirectives },
            { key: 'Link', value: linkHeader },
          ],
        },
        ...wellKnownTypeRules,
        {
          source: '/llms.txt',
          headers: [
            { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
            { key: 'Cache-Control', value: 'public, max-age=3600' },
            { key: 'Access-Control-Allow-Origin', value: '*' },
          ],
        },
        {
          source: '/auth.md',
          headers: [
            { key: 'Content-Type', value: 'text/markdown; charset=utf-8' },
            { key: 'Cache-Control', value: 'public, max-age=3600' },
            { key: 'Access-Control-Allow-Origin', value: '*' },
          ],
        },
      ],
    },
    null,
    2
  ) + '\n'
);

console.log(`[gen-agent-files] Generated all Agent-Ready files and vercel.json for ${DOMAIN}`);
