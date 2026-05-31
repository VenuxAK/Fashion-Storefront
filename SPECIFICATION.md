# SimpCommerce Storefront Specification

## 1. Overview
The **SimpCommerce Storefront** is a high-performance, minimalist e-commerce client built with **Nuxt 4**. It is designed to provide a premium shopping experience inspired by high-end boutique templates like Lezada, while consuming the SimpCommerce Modular Laravel API.

## 2. Technical Stack
- **Framework:** Nuxt 4 (SSR enabled)
- **Styling:** Tailwind CSS v4 (using `@tailwindcss/vite`)
- **State Management:** Pinia (Modules: `cart`, `wishlist`, `ui`, `auth`)
- **Internationalization:** `@nuxtjs/i18n` (Supported: English, Burmese)
- **Icons:** `lucide-vue-next`
- **Utilities:** `@vueuse/core`

## 3. Core Architecture

### API Integration Layer
- **Base URL:** `http://localhost:8000/api` (Configurable via `NUXT_PUBLIC_API_URL`)
- **Header Scoping:** Every request includes the `X-Store: clothing` header to ensure multi-tenant isolation at the API level.
- **Request Interceptor:** Dynamically injects the `Authorization: Bearer {token}` header from cookies if the user is authenticated.
- **Error Handling:** Centralized response error handling for 401 Unauthorized (auto-logout) and validation errors (toast notifications).

### State Management Strategy
- **`useCartStore`:** 
    - Synchronizes with `/api/cart` for authenticated customers.
    - Uses `localStorage` persistence for guest users.
    - Handles unit price calculation (Product Base + Variant Adjustment).
- **`useWishlistStore`:** 
    - Client-side persistence via `localStorage`.
    - Real-time "Liked" state across all product cards and detail pages.
- **`useAuthStore`:** 
    - Manages customer session and profile data.
    - Persists JWT tokens via HttpOnly-friendly cookies.

## 4. Key Features

### Product Discovery
- **Homepage:** Full-screen lifestyle hero, circular minimalist category navigation, and curated featured row.
- **Search:** Full-screen overlay with live, debounced API results as the user types.
- **Shop:** Advanced filtering by category and price range, sorting (Newest, Price), and view toggle (Grid/List).

### Shopping Experience
- **Mini-Cart:** Slide-out drawer accessible from any page for quick adjustments.
- **Product Detail:** Dynamic variant selection (Size/Color) and tabbed content for descriptions and reviews.
- **Checkout:** Integrated shipping address management and Cash on Delivery (COD) order placement.

### Customer Portal
- **Order History:** Visual list of previous orders with real-time status tracking.
- **Profile Management:** Secure updates for personal info and password.
- **Address Book:** Primary/Default address management and CRUD operations.

## 5. UI/UX Standards
- **Responsive Design:** Mobile-first approach with zero horizontal scrolling.
- **Visual Polish:** Global page transitions (`fade/blur`) and interactive hover states.
- **Performance:** Native lazy-loading for images and optimized asset delivery via Vite.
- **Feedback:** Non-blocking toast notifications for all system actions.

## 6. Project Structure
```text
app/
├── assets/css/      # Tailwind v4 configuration and base styles
├── components/      # Reusable UI (Header, Footer, MiniCart, Search, Toasts)
├── composables/     # Business logic (useApi, useAuth, useProduct, useNotify)
├── layouts/         # Global layout wrappers
├── middleware/      # Route guards (auth)
├── pages/           # Route-based views
├── plugins/         # API and third-party initializations
└── stores/          # Pinia global state
i18n/                # Localization JSON files (EN, MY)
```
