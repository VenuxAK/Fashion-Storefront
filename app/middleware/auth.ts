export default defineNuxtRouteMiddleware((to) => {
  const sanctum = useSanctumAuth()
  if (!sanctum.isAuthenticated.value) {
    return navigateTo('/login', { query: { redirect: to.fullPath } })
  }
})
