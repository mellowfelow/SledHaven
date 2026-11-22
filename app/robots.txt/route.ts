import { SITE } from '@/config/site';

// Full AI crawler allowlist — every major AI assistant/search crawler explicitly
// welcomed, not just assumed via '*'. Plus the IETF-draft Content-Signal directive
// and the agent-readable resource comment block the Agent-Ready standard requires.
const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'MistralAI-User',
  'MistralAI-Index',
  'Applebot',
  'Amazonbot',
  'Bytespider',
  'CCBot',
  'Google-Extended',
  'Meta-ExternalAgent',
  'Meta-WebIndexer',
  'cohere-ai',
];

export async function GET() {
  const crawlerBlock = AI_CRAWLERS.map((agent) => `User-agent: ${agent}\nAllow: /\n`).join('\n');

  const body = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /order/
Disallow: /thank-you-order/
Disallow: /thank-you-contact/

Content-Signal: search=yes, ai-input=yes, ai-train=yes

# AI crawlers — welcome to index product & content pages
${crawlerBlock}
# Agent-readable resources
# llms.txt: ${SITE.url}/llms.txt
# Auth policy: ${SITE.url}/auth.md
# API Catalog: ${SITE.url}/.well-known/api-catalog
# Agent Skills: ${SITE.url}/.well-known/agent-skills/index.json
# MCP Server Card: ${SITE.url}/.well-known/mcp/server-card.json

Sitemap: ${SITE.url}/sitemap.xml
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
