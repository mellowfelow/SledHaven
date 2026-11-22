# Auth.md

**Site:** SledHaven (https://sledhaven.com)
**Type:** Public e-commerce storefront — snowmobile dealership

## Agent Registration

No authentication, API key, or registration is required to read any public resource on this site. All catalog, search, policy, and MCP endpoints are open for agent retrieval and citation.

## Public Resources

| Resource | URL | Auth |
|---|---|---|
| Storefront (HTML) | https://sledhaven.com/ | None |
| Product catalog JSON | https://sledhaven.com/api/products/ | None |
| Categories JSON | https://sledhaven.com/api/categories/ | None |
| Search JSON | https://sledhaven.com/api/search/ | None |
| MCP server (Streamable HTTP) | https://sledhaven.com/api/mcp/ | None |
| ACP catalog | https://sledhaven.com/api/acp/catalog/ | None |
| UCP services | https://sledhaven.com/api/ucp/services/ | None |
| Order/enquiry submission | POST https://sledhaven.com/api/contact/ | None (public checkout) |
| Customer payment-details lookup | https://sledhaven.com/order/payment-details/?order=... | Order reference number (scoped token) |
| Staff Reply Portal | https://sledhaven.com/admin/* | `X-Admin-Passcode` header (staff-only, excluded from search indexing) |

## Ordering — human-in-the-loop

Agents may search the catalog, inspect products, and prepare a draft order via the MCP `search_products`/`get_product`/`get_policies` tools. A human must complete and submit the order through the storefront checkout — no endpoint accepts payment or card data from an agent.

## Age Restriction

None. Snowmobiles and alpine gear are general powersports retail products with no purchase age restriction at the point of sale (state vehicle registration requirements apply separately).

```json
{
  "agent_auth": {
    "register_uri": null,
    "identity_types_supported": ["none"],
    "credential_types_supported": ["none"],
    "notes": "No authentication required for any public resource. Order submission is open; the Reply Portal (/admin/*) requires a staff passcode and is not a public resource."
  }
}
```
