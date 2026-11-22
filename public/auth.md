# SledHaven Authentication & Agent Access Policy

- Public storefront, catalog APIs (`/api/products/`, `/api/categories/`, `/api/search/`), and read-only MCP tools (`/api/mcp/`) require **no authentication**.
- Order submission (`POST /api/contact/`) is publicly accessible for customer checkout and enquiries.
- Customer payment details (`/order/payment-details/?order=...`) use the order reference number as a scoped lookup token.
- Staff Reply Portal routes (`/admin/*` and `/api/admin/*`) require a server-verified `X-Admin-Passcode` header and are excluded from search indexing.
