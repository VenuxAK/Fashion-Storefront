# SimpCommerce Clothing Storefront

Nuxt 4 SSR e-commerce storefront — customer-facing product catalog, cart, checkout, and portal.

See `AGENTS.md` at the repo root for the full monorepo structure — this project is one of three (api backend, admin dashboard, clothing storefront).

## Agent

This project has a dedicated subagent and skill:

- **`@storefront-engineer`** — invoke for storefront work. Loads the `nuxt-storefront` skill for detailed conventions.
- **`nuxt-storefront` skill** — Nuxt 4 directory structure, $api plugin, auth flow, hybrid cart/wishlist, route rules, Tailwind v4.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Nuxt 4 (SSR) + Vue 3 + TypeScript |
| UI | Tailwind v4, lucide-vue-next |
| State | Pinia |
| Auth | nuxt-auth-sanctum (Sanctum SPA session) |
| Images | NuxtImg (WebP, ipx) |
| Gallery | Swiper |
| Fonts | Poppins + Inter (via @nuxtjs/google-fonts) |
| PM | Bun |

## Quick Commands

```bash
bun install
bun run dev                           # http://localhost:3000
bun run build && bun run preview
```

Dev server proxies `/api`, `/sanctum`, `/storage` to `NUXT_PROXY_TARGET` (defaults `http://localhost:8000`).

Store slug is set via `NUXT_PUBLIC_STORE_SLUG=clothing` — sent as `X-Store` header on every API request.

## Route Strategies

| Pattern | Strategy |
|---------|----------|
| `/products/**`, `/shop/**`, `/categories/**` | ISR 60s |
| `/brands/**` | SWR 3600s |
| `/about`, `/contact`, `/faq`, `/shipping`, `/terms` | Prerendered |
| `/my/**` | SPA-only (`ssr: false`) |
| `/api/**`, `/sanctum/**`, `/storage/**` | Proxy to backend |

## Cross-Project

- **Depends on**: API (`api/`) — Sanctum SPA session auth (CSRF cookies), `X-Store: clothing` header, same `{ data, meta }` response format
- **Sibling**: Admin (`admin/`) — same API, different auth (staff `Bearer` token), manages the products/inventory displayed here

## Verification

```bash
bun run build                         # Nuxt build
```
