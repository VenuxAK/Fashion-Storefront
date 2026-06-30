# SimpCommerce — Minimalist Boutique Storefront

A high-performance, modern storefront built with **Nuxt 4** and **Tailwind CSS v4**. This project is the primary e-commerce client for the SimpCommerce platform, specifically tailored for the "Clothing" store.

## ✨ Features

- **Nuxt 4 Engine:** Leveraging the latest SSR capabilities and directory structure.
- **Tailwind v4:** Using the high-speed `@tailwindcss/vite` engine for minimalist styling.
- **Advanced Search:** Full-screen search overlay with live API results.
- **Dynamic Catalog:** Multi-filter Shop page with Grid/List view toggles.
- **Smart Cart:** Pinia-based cart that syncs with the API and persists for guests.
- **Wishlist:** Client-side wishlist for saving favorite items.
- **Customer Portal:** Dedicated area for Order History, Address Book, and Profile management.
- **Global i18n:** Full support for English and Burmese (မြန်မာ) languages.
- **Mobile First:** Optimized for all devices with zero layout overflow.

## 🚀 Getting Started

### 1. Prerequisites
- **Bun** (Recommended) or Node.js 18+
- SimpCommerce API running at `http://localhost:8000`

### 2. Installation
```bash
bun install
```

### 3. Environment Setup
Create a `.env` file or use the default runtime configuration:
```env
NUXT_PUBLIC_API_URL=/api/v1
NUXT_PUBLIC_STORE_SLUG=clothing
NUXT_PUBLIC_BASE_URL=http://localhost:3000
NUXT_PROXY_TARGET=http://localhost:8000
NUXT_API_URL=http://localhost:8000/api/v1
```

### 4. Development
```bash
bun run dev
```
The storefront will be available at `http://localhost:3000`.

### 5. Production
```bash
bun run build
bun run preview
```

## 📄 Documentation

- [Detailed Specification](./SPECIFICATION.md) — Technical architecture and feature deep-dive.

## 🛠 Tech Stack

- **Framework:** [Nuxt 4](https://nuxt.com/)
- **State:** [Pinia](https://pinia.vuejs.org/)
- **Styles:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide](https://lucide.dev/)
- **Localization:** [Nuxt i18n](https://i18n.nuxtjs.org/)
