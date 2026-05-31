import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxtjs/google-fonts',
    '@nuxtjs/i18n',
    '@pinia/nuxt'
  ],

  vite: {
    plugins: [
      tailwindcss()
    ]
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
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:8000/api',
      storeSlug: process.env.NUXT_PUBLIC_STORE_SLUG || 'clothing'
    }
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'SimpCommerce | Modern Minimalist Boutique',
      meta: [
        { name: 'description', content: 'Discover high-quality fashion essentials for the modern wardrobe.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],
  })