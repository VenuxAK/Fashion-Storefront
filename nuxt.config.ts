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
    '@nuxtjs/i18n',
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
    '/api/**': { proxy: 'https://simp-commerce-api.onrender.com/api/**' },
    '/sanctum/**': { proxy: 'https://simp-commerce-api.onrender.com/sanctum/**' },
    '/storage/**': { proxy: 'https://simp-commerce-api.onrender.com/storage/**' }
  },

  vite: {
    plugins: [
      tailwindcss()
    ],
    server: {
      proxy: {
        '/api': { target: process.env.NUXT_PROXY_TARGET || 'http://localhost:8000', changeOrigin: true },
        '/sanctum': { target: process.env.NUXT_PROXY_TARGET || 'http://localhost:8000', changeOrigin: true },
        '/storage': { target: process.env.NUXT_PROXY_TARGET || 'http://localhost:8000', changeOrigin: true },
      },
    },
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

  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'my', iso: 'my-MM', file: 'my.json', name: 'မြန်မာ' }
    ],
    defaultLocale: 'en',
    langDir: 'locales',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true
    }
  },

  runtimeConfig: {
    apiUrl: process.env.NUXT_API_URL || '/api/v1',
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || '/api/v1',
      storeSlug: process.env.NUXT_PUBLIC_STORE_SLUG || 'clothing',
      stripeKey: process.env.NUXT_PUBLIC_STRIPE_KEY || '',
    },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'SimpCommerce | Modern Minimalist Boutique',
      meta: [
        { name: 'description', content: 'Discover high-quality fashion essentials for the modern wardrobe.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://simp-commerce-api.onrender.com' },
        { rel: 'preconnect', href: 'https://placehold.co' },
      ]
    }
  },

  css: ['~/assets/css/main.css'],
  })
