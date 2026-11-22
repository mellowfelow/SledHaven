import { NextRequest, NextResponse } from 'next/server';
import { SITE } from '@/config/site';
import { CATEGORIES, PRODUCTS, getProductBySlug, getStateShippingRule } from '@/config/catalog';
import { calculateOrderTotals } from '@/lib/order';

const TOOLS = [
  {
    name: 'list_products',
    description: 'List SledHaven snowmobiles and alpine gear currently for sale in the USA.',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Optional category slug (mountain, trail, touring, utility).' },
      },
    },
  },
  {
    name: 'get_product',
    description: 'Get full technical specifications and pricing for a single SledHaven snowmobile by slug.',
    inputSchema: {
      type: 'object',
      properties: { slug: { type: 'string' } },
      required: ['slug'],
    },
  },
  {
    name: 'search_products',
    description: 'Search SledHaven snowmobiles by model name, engine, track length, or category.',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string' } },
      required: ['query'],
    },
  },
  {
    name: 'list_categories',
    description: 'List all SledHaven product categories and subcategories.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'calculate_shipping',
    description: 'Calculate US state crated freight shipping, estimated state tax, and 10% crypto discount.',
    inputSchema: {
      type: 'object',
      properties: {
        state: { type: 'string', description: '2-letter US state code (e.g. CO, MT, NY).' },
        productSlug: { type: 'string' },
        paymentMethod: { type: 'string', description: 'crypto, bank_transfer, zelle, apple_pay, chime, or pay_in_4' },
      },
      required: ['state', 'productSlug'],
    },
  },
];

export async function GET() {
  return NextResponse.json({
    protocol: 'mcp',
    version: '2025-03-26',
    server: {
      name: `${SITE.name} Storefront MCP`,
      domain: SITE.domain,
    },
    tools: TOOLS,
  });
}

export async function POST(req: NextRequest) {
  try {
    const rpc = await req.json();
    const id = rpc?.id ?? null;
    const method = rpc?.method;
    const params = rpc?.params || {};

    if (method === 'initialize') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2025-03-26',
          capabilities: { tools: {} },
          serverInfo: { name: `${SITE.name} Storefront MCP`, version: '1.0.0' },
        },
      });
    }

    if (method === 'tools/list') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: { tools: TOOLS },
      });
    }

    if (method === 'tools/call') {
      const name = String(params?.name || '');
      const args = params?.arguments || {};

      if (name === 'list_products') {
        const cat = args.category ? String(args.category).toLowerCase() : '';
        const list = cat ? PRODUCTS.filter((p) => p.category === cat) : PRODUCTS;
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: { content: [{ type: 'text', text: JSON.stringify(list) }] },
        });
      }

      if (name === 'get_product') {
        const product = getProductBySlug(String(args.slug || ''));
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: JSON.stringify(product || { error: 'Not found' }) }],
          },
        });
      }

      if (name === 'search_products') {
        const q = String(args.query || '').toLowerCase().trim();
        const matches = PRODUCTS.filter((p) =>
          `${p.name} ${p.categoryName} ${p.subcategory} ${p.shortDescription}`
            .toLowerCase()
            .includes(q)
        );
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: { content: [{ type: 'text', text: JSON.stringify(matches) }] },
        });
      }

      if (name === 'list_categories') {
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: { content: [{ type: 'text', text: JSON.stringify(CATEGORIES) }] },
        });
      }

      if (name === 'calculate_shipping') {
        const state = String(args.state || 'CO').toUpperCase();
        const slug = String(args.productSlug || '');
        const paymentMethod = String(args.paymentMethod || 'bank_transfer');
        const product = getProductBySlug(slug);
        if (!product) {
          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            result: { content: [{ type: 'text', text: JSON.stringify({ error: 'Product not found' }) }] },
          });
        }
        const totals = calculateOrderTotals([{ id: product.id, quantity: 1 }], state, paymentMethod);
        const stateRule = getStateShippingRule(state);
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: JSON.stringify({ state: stateRule.name, totals }) }],
          },
        });
      }

      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Unknown tool: ${name}` },
      });
    }

    return NextResponse.json({
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Unsupported MCP method: ${String(method)}` },
    });
  } catch {
    return NextResponse.json(
      { jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } },
      { status: 400 }
    );
  }
}
