export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const token = useCookie('token')
  
  const api = $fetch.create({
    baseURL: config.public.apiUrl,
    headers: {
      'Accept': 'application/json',
      'X-Store': config.public.storeSlug
    },
    async onRequest({ options }) {
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`
        }
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        token.value = null
      }
    }
  })

  return {
    provide: {
      api
    }
  }
})
