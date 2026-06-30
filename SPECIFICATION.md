# Clothing Storefront — Specification

> Nuxt 4 SSR e-commerce storefront consuming the SimpCommerce API.

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 4 (SSR, auto-imports, file-based routing) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| State | Pinia (cart, wishlist, ui) |
| Auth | Sanctum SPA via `nuxt-auth-sanctum` |
| i18n | `@nuxtjs/i18n` (EN + MY, prefix_except_default) |
| Fonts | `@nuxtjs/google-fonts` (Poppins, Inter) |
| Icons | `lucide-vue-next` |
| Utilities | `@vueuse/core` |

---

## 2. API Integration

| Config | Value |
|---|---|
| Base URL | `NUXT_PUBLIC_API_URL` → fallback `/api/v1` |
| Server API URL | `NUXT_API_URL` → fallback `http://localhost:8000/api/v1` |
| Store Header | `X-Store` → `NUXT_PUBLIC_STORE_SLUG` → fallback `clothing` |
| Auth Header | Sanctum `laravel_session` cookie handled automatically |
| 401 Handler | Redirects to `/login` via `nuxt-auth-sanctum` |

The API client is created in `plugins/api.ts` as `$fetch.create()` and injected as `$api`. All composables access it via `useApi()` which calls `useNuxtApp().$api`.

### Endpoints Used

| Endpoint | Method | Composables |
|---|---|---|
| `/storefront/products` | GET | `useProduct.getProducts` (home, shop, search) |
| `/storefront/products/{slug}` | GET | `useProduct.getProductBySlug` |
| `/storefront/categories` | GET | `useProduct.getCategories` |
| `/customer/login` | POST | `useAuth.login` |
| `/customer/register` | POST | `useAuth.register` |
| `/customer/logout` | POST | `useAuth.logout` |
| `/customer/me` | GET | `useAuth.fetchUser` |
| `/customer/profile` | PUT | `useProfile.updateProfile` |
| `/cart` | GET/POST/DELETE | `cartStore.fetchCart/addToCart/removeItem` |
| `/cart/{id}` | PUT/DELETE | `cartStore.updateQuantity/removeItem` |
| `/addresses` | GET/POST | `useCheckout.getAddresses/createAddress` |
| `/addresses/{id}` | DELETE | `my/addresses.vue` |
| `/addresses/{id}/default` | PUT | `my/addresses.vue` |
| `/checkout` | POST | `useCheckout.placeOrder` |
| `/my/orders` | GET | `useProfile.getOrders` |

---

## 3. Pages

| Route | Page | Auth | Status |
|---|---|---|---|
| `/` | Home | — | ✅ |
| `/shop` | Shop (filters, pagination) | — | ✅ |
| `/products/{slug}` | Product Detail | — | ⚠️ Variant selector hardcoded |
| `/cart` | Cart | — | ✅ |
| `/checkout` | Checkout | auth | ✅ |
| `/order-success` | Confirmation | — | ✅ |
| `/login` | Login | guest | ✅ |
| `/register` | Register | guest | ✅ |
| `/wishlist` | Wishlist | — | ✅ |
| `/my/orders` | Order History | auth | ✅ |
| `/my/profile` | Profile | auth | ✅ |
| `/my/addresses` | Address Book | auth | ✅ |
| `/search` | Search Overlay | — | ✅ (component, not page) |
| `/about` | About | — | ✅ |
| `/contact` | Contact | — | ✅ |
| `/faq` | FAQ | — | ✅ |
| `/shipping` | Shipping | — | ✅ |
| `/terms` | Terms | — | ✅ |

---

## 4. State Management

### Cart Store (`stores/cart.ts`)
- **Hybrid** guest (localStorage) + authenticated (API `/cart`)
- Methods: `fetchCart`, `addToCart`, `updateQuantity`, `removeItem`
- Getters: `subtotal`, `totalItems`
- ⚠️ No `clearCart` method (array reassign doesn't call API)

### Wishlist Store (`stores/wishlist.ts`)
- Client-side only (localStorage)
- Methods: `toggleWishlist`, `loadWishlist`, `isInWishlist`

### UI Store (`stores/ui.ts`)
- `isMiniCartOpen`, `isSearchOpen` toggles

### Auth (`nuxt-auth-sanctum`)
- Stateful session using Laravel Sanctum and `laravel_session` cookie
- Use `useSanctumAuth()` for state and `refreshIdentity()`
- Endpoints: `/sanctum/csrf-cookie`, `/api/customer/login`, `/api/customer/logout`, `/api/customer/me`

---

## 5. Components

| Component | Type | Description |
|---|---|---|
| `AppHeader.vue` | Layout | Fixed header, nav, search/cart/wishlist badges, locale toggle, mobile menu |
| `AppFooter.vue` | Layout | 4-column footer, newsletter form, social links |
| `UserNav.vue` | Layout | Account sidebar (Orders, Profile, Addresses) |
| `ProductCard.vue` | Product | Grid/list modes, hover zoom, wishlist toggle, add to cart |
| `MiniCart.vue` | Cart | Slide-out drawer with items, subtotal, checkout link |
| `SearchOverlay.vue` | Search | Full-screen overlay with debounced API search |
| `NotificationToast.vue` | UI | Teleported toast stack, auto-dismiss 5s |
| `BackToTop.vue` | UI | Fixed button, appears after scroll |

---

## 6. Known Issues Summary

| # | Issue | Severity |
|---|---|---|
| 1 | No `.env` file — hardcoded fallbacks only | High |
| 3 | Hardcoded variant selectors on product detail | High |
| 4 | Fake thumbnail gallery (same image repeated) | Medium |
| 5 | Image URL resolution copied in 7+ files | Medium |
| 8 | Clear Cart directly mutates array (API leak) | Medium |
| 10 | No TypeScript types (all `any`) | Low |

