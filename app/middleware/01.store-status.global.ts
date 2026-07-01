export default defineNuxtRouteMiddleware(async (to, from) => {
  const { getStoreSettings } = useProduct()

  // During SSR or first load, fetch the settings to verify the store exists and is active.
  // We use useAsyncData to cache it across route navigations on the client.
  const { error } = await useAsyncData('store-settings-check', () => getStoreSettings())

  if (error.value) {
    // If the error is 404 (or the interceptor caught it and it's a fatal error),
    // we must abort navigation immediately to prevent Nuxt from rendering any page content.
    return abortNavigation(createError({
      statusCode: 503,
      statusMessage: 'Store Currently Unavailable',
      fatal: true
    }))
  }
})
