export default defineNuxtRouteMiddleware((to) => {
  if (process.client) {
    const sanctum = useSanctumAuth()
    if (!sanctum.isAuthenticated.value) {
      return navigateTo('/login', { query: { redirect: to.fullPath } })
    }
  }
})
