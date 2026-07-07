---
name: nuxt-storefront
description: Nuxt 4 SSR storefront conventions — hybrid cart/wishlist, Sanctum SPA auth, Tailwind v4, ISR/SSR route rules, $api plugin, and Pinia store patterns.
---

# Nuxt Storefront Skill

Use when working in `storefront/clothing-storefront/`. Nuxt 4 SSR e-commerce storefront for the "clothing" store.

## Directory Structure

```
app/
├── app.vue                    # Root: loading, NuxtLayout/NuxtPage, page transitions
├── assets/css/main.css        # Tailwind v4 @import + @theme + @layer
├── components/                # PascalCase: AppHeader, ProductCard, SearchOverlay, MiniCart, etc.
├── composables/               # camelCase: useApi, useAuth, useCheckout, useProduct, useNotify, etc.
├── layouts/default.vue        # AppHeader + slot + AppFooter + global overlays
├── middleware/
│   ├── 01.store-status.global.ts  # Fetches store settings, aborts 503 if inactive
│   └── auth.ts                # Named: checks isAuthenticated, redirects to /login
├── pages/                     # kebab-case routes: shop/index, products/[slug], my/orders/index, etc.
├── plugins/
│   └── api.ts                 # Creates $fetch instance, injects $api, X-Store, CSRF
├── stores/                    # Pinia: cart.ts, wishlist.ts, ui.ts
└── types/index.ts             # TypeScript interfaces
```

No `server/` directory — all API calls proxy to Laravel backend.

## API Client (`plugins/api.ts`)

```ts
// Creates $fetch instance once, injects as $api
const api = $fetch.create({
  baseURL: apiBase,            // NUXT_API_URL or NUXT_PUBLIC_API_URL (/api/v1)
  credentials: 'include',
  timeout: 15000,
})
```

- `X-Store` header auto-attached on every request from `runtimeConfig.public.storeSlug`
- CSRF cookie fetched automatically before first mutating request (POST/PUT/PATCH/DELETE)
- 401 → redirect to `/login`; 404 + "inactive" → fatal 503

Consumed via `useApi()` composable: `const { $api } = useNuxtApp(); return $api`
Domain composables expose thin wrappers: `useProduct().getProducts(params)` → `$api('/storefront/products', { params })`

## Auth (nuxt-auth-sanctum)

Configured in `nuxt.config.ts`:
```ts
sanctum: {
  endpoints: {
    login: '/api/v1/customer/login',
    logout: '/api/v1/customer/logout',
    user: '/api/v1/customer/me',
  },
  redirect: { onLogin: '/', onLogout: '/login', onAuthOnly: '/login' }
}
```

- `useSanctumAuth()` from module provides `login`, `logout`, `refreshIdentity`
- `useAuth` composable wraps it: `login()` → `sanctum.login()` + `refreshIdentity()`
- After login/register → sync guest cart + wishlist to API
- Google OAuth: `/auth/oauth/google/redirect` → `/auth/callback.vue` → `refreshIdentity()` + sync
- Protected pages: `definePageMeta({ middleware: 'sanctum:auth' })`

## Cart & Wishlist (Hybrid Guest/Auth)

Both stores use the same Pinia Composition API pattern with localStorage fallback:

| Operation | Guest | Auth |
|-----------|-------|------|
| Load | `localStorage.getItem('cart')` | `GET /cart` |
| Add | Reactive array + localStorage | Optimistic → `POST /cart` → re-fetch; rollback on error |
| Update | Array mutation + localStorage | `PUT /cart/:id` → re-fetch |
| Remove | Array filter + localStorage | `DELETE /cart/:id` → re-fetch |
| Sync | — | `POST /cart/sync` (batches all localStorage items) |

Same pattern for wishlist with `/wishlist` endpoints. After auth, call `syncCart()` and `syncWishlist()`.

## Route Rules (`nuxt.config.ts`)

| Route pattern | Strategy |
|---------------|----------|
| `/products/**`, `/shop/**`, `/categories/**` | ISR 60s |
| `/brands/**` | SWR 3600s |
| `/about`, `/contact`, `/faq`, `/shipping`, `/terms` | Prerendered |
| `/my/**` | SPA-only (`ssr: false`) |
| `/api/**`, `/sanctum/**`, `/storage/**` | Proxy to backend |

## Tailwind v4

- Entry: `app/assets/css/main.css` — `@import "tailwindcss"`
- `@theme` block: `--font-sans`, `--color-primary`, `--color-accent`
- `@layer base` for HTML defaults, `@layer components` for `.btn`, `.btn-primary`, `.container`
- Vite plugin: `@tailwindcss/vite` (not `@nuxtjs/tailwindcss` module)
- Custom keyframe animations: `.animate-fade-in`

## NuxtImg

All product images use `<NuxtImg format="webp" loading="lazy" fetchpriority="high">` with configured `screens` breakpoints and `ipx: { maxAge: '30d' }`.

## Key Conventions

- Components: PascalCase, Composables: camelCase, Pages: kebab-case
- All page setups call `useSeoMeta({ title, description })` for SEO
- `useNotify()` for toast notifications (success/error, auto-dismiss 5s)
- No i18n module installed — strings are hardcoded English in templates
- `lucide-vue-next` icons imported individually
- Page transitions: `pageTransition: { name: 'page', mode: 'out-in' }`

## Build / Dev

```bash
bun install
bun run dev                           # http://localhost:3000
bun run build && bun run preview
```

Dev server proxies `/api`, `/sanctum`, `/storage` to `NUXT_PROXY_TARGET` (defaults `http://localhost:8000`).

## Cross-Project Awareness

**Depends on**: API backend (`api/`) for all data. Auth via Sanctum SPA session cookies (CSRF + cookie-based). Scoped by `X-Store` header (set to `clothing` via `NUXT_PUBLIC_STORE_SLUG`).

**Sibling project**: Admin Dashboard (`admin/`) shares the same API backend but uses `Bearer` token auth (staff). Both projects consume the same `/storefront/*` public endpoints but admin also accesses staff-only endpoints. Types in `app/types/index.ts` should match API resource shapes.
