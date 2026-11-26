import fs from 'fs';
import path from 'path';

const root = process.cwd();
const errors = [];

function mustExist(relPath) {
  const full = path.join(root, relPath);
  if (!fs.existsSync(full)) {
    errors.push(`Missing required file: ${relPath}`);
    return null;
  }
  return fs.readFileSync(full, 'utf8');
}

function mustBeValidJson(relPath) {
  const content = mustExist(relPath);
  if (content === null) return null;
  try {
    return JSON.parse(content);
  } catch (e) {
    errors.push(`Invalid JSON in ${relPath}: ${e.message}`);
    return null;
  }
}

// 1. Verify Agent-Ready files A-N exist and parse cleanly
mustExist('public/llms.txt');
mustExist('public/auth.md');
mustExist('public/js/webmcp.js');
mustBeValidJson('public/.well-known/api-catalog');
mustBeValidJson('public/.well-known/agent-skills/index.json');
mustBeValidJson('public/.well-known/mcp/server-card.json');
mustBeValidJson('public/.well-known/oauth-protected-resource');
mustBeValidJson('public/.well-known/oauth-authorization-server');
mustBeValidJson('public/.well-known/openid-configuration');
mustBeValidJson('public/.well-known/acp.json');
// /.well-known/ucp is served by a Route Handler (not a public/ static file)
// so Vercel sends a real application/json Content-Type -- see
// app/.well-known/ucp/route.ts for why.
const ucpRouteSrc = mustExist('app/.well-known/ucp/route.ts');
if (ucpRouteSrc && !ucpRouteSrc.includes("ucp: '1.0'")) {
  errors.push(`app/.well-known/ucp/route.ts must declare ucp: '1.0'`);
}
mustBeValidJson('vercel.json');

// 2. Verify strategy docs stay in docs/ and never leak into public/
mustExist('docs/PROJECT.md');
mustExist('docs/keyword-map.md');
if (fs.existsSync(path.join(root, 'public/PROJECT.md')) || fs.existsSync(path.join(root, 'public/keyword-map.md'))) {
  errors.push('Strategy docs must never exist in public/');
}

// 3. Verify next.config.ts does NOT use output: 'export' and HAS trailingSlash: true
const nextConfig = mustExist('next.config.ts');
if (nextConfig) {
  if (/output:\s*['"]export['"]/.test(nextConfig)) {
    errors.push('next.config.ts must never set output: "export" on Vercel');
  }
  if (!/trailingSlash:\s*true/.test(nextConfig)) {
    errors.push('next.config.ts must enable trailingSlash: true');
  }
}

// 4. Verify no render-blocking @import Google Fonts inside CSS
const css = mustExist('app/globals.css');
if (css && /@import\s+url\([^)]*fonts\.googleapis\.com/i.test(css)) {
  errors.push('app/globals.css must not use render-blocking Google Fonts @import');
}

// 5. Verify Reply Portal and Order routes exist
[
  'app/admin/layout.tsx',
  'app/admin/page.tsx',
  'app/admin/orders/page.tsx',
  'app/admin/orders/[id]/page.tsx',
  'app/admin/enquiries/page.tsx',
  'app/admin/enquiries/[id]/page.tsx',
  'app/admin/send-payment-email/page.tsx',
  'app/admin/reply-enquiry/page.tsx',
  'app/order/payment-details/page.tsx',
  'app/order/confirm-payment/page.tsx',
  'app/thank-you-order/page.tsx',
  'app/search/page.tsx',
  'app/compare/page.tsx',
  'app/financing/page.tsx',
  'app/brands/page.tsx',
  'app/blog/page.tsx',
  'app/blog/[slug]/page.tsx',
  'app/icon.tsx',
  'app/apple-icon.tsx',
  'public/images/logo.jpg',
].forEach(mustExist);

// 6. Verify /thank-you-order/ contains NO bank details or WA screenshot prompt
const tyOrder = mustExist('app/thank-you-order/page.tsx');
if (tyOrder && /(routing number|iban|swift|send screenshot on whatsapp)/i.test(tyOrder)) {
  errors.push('app/thank-you-order/page.tsx must not display bank details or WhatsApp screenshot prompts');
}

// 7. Verify robots.txt route disallows /admin/, lists AI crawlers, and carries the agent-resource comment block
const robotsRoute = mustExist('app/robots.txt/route.ts');
if (robotsRoute) {
  if (!robotsRoute.includes('/admin/')) {
    errors.push('app/robots.txt/route.ts must disallow /admin/');
  }
  if (!robotsRoute.includes('GPTBot') || !robotsRoute.includes('ClaudeBot') || !robotsRoute.includes('PerplexityBot')) {
    errors.push('app/robots.txt/route.ts must list the major AI crawlers');
  }
  if (!robotsRoute.includes('llms.txt')) {
    errors.push('app/robots.txt/route.ts must include the agent-readable resource comment block');
  }
}

// 8. Verify no NEXT_PUBLIC_ADMIN_PASSCODE leakage anywhere
function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) files.push(full);
  }
  return files;
}

for (const file of walk(root)) {
  const txt = fs.readFileSync(file, 'utf8');
  if (txt.includes('NEXT_PUBLIC_ADMIN_PASSCODE') && !file.endsWith('crosscheck.mjs')) {
    errors.push(`Forbidden NEXT_PUBLIC_ADMIN_PASSCODE reference in ${path.relative(root, file)}`);
  }
}

if (errors.length > 0) {
  console.error('\n[crosscheck] FAILED with errors:');
  for (const err of errors) {
    console.error('  -', err);
  }
  process.exit(1);
}

console.log('[crosscheck] PASSED — all SledHaven SEO, Agent-Ready, Reply Portal, and security checks verified.');
