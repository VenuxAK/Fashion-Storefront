import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/image',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    'nuxt-auth-sanctum',
    'nuxt-swiper'
  ],

  image: {
    format: ['webp'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    ipx: {
      maxAge: 60 * 60 * 24 * 30,
    },
  },

  routeRules: {
    '/products/**': { isr: 60 },
    '/shop/**': { isr: 60 },
    '/categories/**': { isr: 60 },
    '/brands/**': { swr: 3600 },
    '/about': { prerender: true },
    '/contact': { prerender: true },
    '/faq': { prerender: true },
    '/shipping': { prerender: true },
    '/terms': { prerender: true },
    // Dashboard/My profile pages are dynamic
    '/my/**': { ssr: false },
    // Production API Proxies (Vite proxy overrides these locally)
    '/api/**': { proxy: 'https://api.simpcommerce.shop/api/**' },
    '/sanctum/**': { proxy: 'https://api.simpcommerce.shop/sanctum/**' },
    '/storage/**': { proxy: 'https://api.simpcommerce.shop/storage/**' }
  },

  vite: {
    plugins: [
      tailwindcss()
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            swiper: ['swiper'],
          },
        },
      },
    },
    server: {
      proxy: {
        '/api': { target: process.env.NUXT_PROXY_TARGET || 'http://localhost:8000', changeOrigin: true },
        '/sanctum': { target: process.env.NUXT_PROXY_TARGET || 'http://localhost:8000', changeOrigin: true },
        '/storage': { target: process.env.NUXT_PROXY_TARGET || 'http://localhost:8000', changeOrigin: true },
      },
    },
  },

  nitro: {
    preset: 'vercel'
  },

  sanctum: {
    baseUrl: process.env.NUXT_PUBLIC_BASE_URL || '',
    endpoints: {
      csrf: '/sanctum/csrf-cookie',
      login: '/api/v1/customer/login',
      logout: '/api/v1/customer/logout',
      user: '/api/v1/customer/me',
    },
    redirect: {
      onLogin: '/',
      onLogout: '/login',
      onAuthOnly: '/login',
    },
  },

  googleFonts: {
    families: {
      Poppins: [300, 400, 500, 600, 700],
      Inter: [400, 500, 600]
    },
    display: 'swap'
  },

  runtimeConfig: {
    apiUrl: process.env.NUXT_API_URL || '/api/v1',
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || '/api/v1',
      storeSlug: process.env.NUXT_PUBLIC_STORE_SLUG || 'clothing',
      stripeKey: process.env.NUXT_PUBLIC_STRIPE_KEY || '',
      reverbKey: process.env.NUXT_PUBLIC_REVERB_APP_KEY || '',
      reverbHost: process.env.NUXT_PUBLIC_REVERB_HOST || 'localhost',
      reverbPort: process.env.NUXT_PUBLIC_REVERB_PORT || '',
    },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'SimpCommerce | Modern Minimalist Boutique',
      meta: [
        { name: 'description', content: 'Discover high-quality fashion essentials for the modern wardrobe.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
        { 'http-equiv': 'Content-Security-Policy', content: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: http://localhost:8000 https://api.simpcommerce.shop https://images.unsplash.com https://placehold.co https://*.r2.dev; connect-src 'self' http://localhost:8000 ws://localhost:8080 wss://localhost:8080 wss://api.simpcommerce.shop https://api.simpcommerce.shop; object-src 'none'" },
      ],
      link: [
        { rel: 'preconnect', href: 'https://api.simpcommerce.shop' },
        { rel: 'preconnect', href: 'https://placehold.co' },
      ]
    }
  },

  css: ['~/assets/css/main.css'],
  })
