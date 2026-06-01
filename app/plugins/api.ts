let csrfFetched = false

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiUrl as string

  const api = $fetch.create({
    baseURL: apiBase,
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'X-Store': config.public.storeSlug as string,
    },
    async onRequest({ request, options }) {
      const method = (options.method || 'GET').toUpperCase()
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        if (!csrfFetched) {
          await $fetch(`${apiBase.replace('/api', '')}/sanctum/csrf-cookie`, {
            credentials: 'include',
          })
          csrfFetched = true
        }
        const xsrfToken = useCookie('XSRF-TOKEN')
        if (xsrfToken.value) {
          options.headers = {
            ...options.headers,
            'X-XSRF-TOKEN': xsrfToken.value,
          }
        }
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        navigateTo('/login')
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})
