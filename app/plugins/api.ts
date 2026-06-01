export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiUrl,
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'X-Store': config.public.storeSlug,
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        const auth = useAuth()
        auth.logout()
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
