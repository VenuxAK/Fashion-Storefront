export const useAuth = () => {
  const sanctum = useSanctumAuth()
  const user = sanctum.user as Ref<any>
  const isLoggedIn = computed(() => !!user.value)

  const login = async (credentials: any) => {
    await sanctum.login(credentials)
    await sanctum.refreshIdentity()
    return { customer: user.value }
  }

  const register = async (data: any) => {
    const api = useApi()
    const response: any = await api('/customer/register', { method: 'POST', body: data })
    user.value = response.customer
    return response
  }

  const logout = async () => {
    await sanctum.logout()
    navigateTo('/login')
  }

  const fetchUser = async () => {
    await sanctum.fetchUser()
  }

  return {
    user,
    login,
    register,
    logout,
    fetchUser,
    isLoggedIn,
  }
}
