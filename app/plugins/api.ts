let csrfFetched = false

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  let apiBase = import.meta.server ? (config.apiUrl as string) : (config.public.apiUrl as string)
  if (!apiBase.includes('/v1')) {
    apiBase = apiBase.replace(/\/api\/?$/, '/api/v1')
  }

  const storeSlug = config.public.storeSlug as string

  // Extract base target URL for Sanctum operations (e.g. CSRF cookies)
  let baseTarget = ''
  try {
    // If apiBase is absolute, extract its origin. If relative (like /api/v1), it resolves relative to storefront domain.
    baseTarget = apiBase.startsWith('http') ? new URL(apiBase).origin : ''
  } catch (e) {}

  const api = $fetch.create({
    baseURL: apiBase,
    credentials: 'include',
    timeout: 15000, // 15 seconds to match backend
    async onRequest({ request, options }) {
      const method = (options.method || 'GET').toUpperCase()

      // Always send X-Store header for store scoping.
      options.headers = { ...options.headers, 'X-Store': storeSlug } as any

      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        if (!csrfFetched) {
          await $fetch(`${baseTarget}/sanctum/csrf-cookie`, {
            credentials: 'include',
          })
          csrfFetched = true
        }
        const xsrfToken = useCookie('XSRF-TOKEN')
        if (xsrfToken.value) {
          options.headers = {
            ...options.headers,
            'X-XSRF-TOKEN': xsrfToken.value,
          } as any
        }
      }
    },
    onRequestError({ error }) {
      if (error.name === 'AbortError' || error.message?.includes('timeout')) {
        const { notify } = useNotify()
        notify('The server took too long to respond. Please try again.', 'error')
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        navigateTo('/login')
      } else if (response.status === 404 && response._data?.message?.includes('inactive')) {
        showError({ statusCode: 503, statusMessage: 'Store Currently Unavailable', fatal: true })
      } else if (response.status === 503 || response.status === 504) {
        const { notify } = useNotify()
        notify('Service temporarily unavailable. Please try again later.', 'error')
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})
