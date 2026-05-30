export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth()

  if (!auth.isLoggedIn.value) {
    return navigateTo('/login', {
      query: {
        redirect: to.fullPath
      }
    })
  }
})
