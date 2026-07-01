export default defineNuxtRouteMiddleware((to) => {
  const sanctum = useSanctumAuth()
  if (!sanctum.isAuthenticated.value) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
