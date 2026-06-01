# Clothing Storefront — Specification

> Nuxt 4 SSR e-commerce storefront consuming the SimpCommerce API.  
> See `MD/PLAN.md` for the improvement roadmap.

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 4 (SSR, auto-imports, file-based routing) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| State | Pinia (cart, wishlist, ui) |
| Auth | Custom Bearer token via `useCookie('token')` |
| i18n | `@nuxtjs/i18n` (EN + MY, prefix_except_default) |
| Fonts | `@nuxtjs/google-fonts` (Poppins, Inter) |
| Icons | `lucide-vue-next` |
| Utilities | `@vueuse/core` |

---

## 2. API Integration

| Config | Value |
|---|---|
| Base URL | `NUXT_PUBLIC_API_URL` → fallback `http://localhost:8000/api` |
| Store Header | `X-Store` → `NUXT_PUBLIC_STORE_SLUG` → fallback `clothing` |
| Auth Header | `Authorization: Bearer <token>` from `useCookie('token')` |
| 401 Handler | Clears token cookie, no auto-redirect |

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
| `/my/orders` | Order History | auth | ⚠️ No detail page |
| `/my/profile` | Profile | auth | ✅ |
| `/my/addresses` | Address Book | auth | ✅ |
| `/search` | Search Overlay | — | ✅ (component, not page) |
| `/about` | About | — | ❌ "Coming Soon" |
| `/contact` | Contact | — | ❌ "Coming Soon" |
| `/faq` | FAQ | — | ❌ "Coming Soon" |
| `/shipping` | Shipping | — | ❌ "Coming Soon" |
| `/terms` | Terms | — | ❌ "Coming Soon" |

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

### Auth (`composables/useAuth.ts`)
- Token in `useCookie('token')` (NOT HttpOnly)
- `useState('user')` for SSR-safe user state
- Methods: `login`, `register`, `logout`, `fetchUser`
- ⚠️ Plain cookie, XSS-vulnerable. Plan: migrate to `nuxt-auth-sanctum`

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
| 2 | Auth token in plain cookie (XSS-vulnerable) | High |
| 3 | Hardcoded variant selectors on product detail | High |
| 4 | Fake thumbnail gallery (same image repeated) | Medium |
| 5 | Image URL resolution copied in 7+ files | Medium |
| 6 | 5 placeholder pages linked from footer | Medium |
| 7 | No order detail page | Medium |
| 8 | Clear Cart directly mutates array (API leak) | Medium |
| 9 | OAuth buttons decorative only | Low |
| 10 | No TypeScript types (all `any`) | Low |

Full fix plan: `MD/PLAN.md`
