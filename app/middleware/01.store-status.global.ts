export default defineNuxtRouteMiddleware(async (to, from) => {
  const { getStoreSettings } = useProduct()

  const { error } = await useAsyncData('store-settings-check', () => getStoreSettings(), {
    getCachedData: (key) => {
      const cached = useNuxtData(key).data.value
      if (cached) return cached
    },
  })

  if (error.value) {
    return abortNavigation(createError({
      statusCode: 503,
      statusMessage: 'Store Currently Unavailable',
      fatal: true
    }))
  }
})
