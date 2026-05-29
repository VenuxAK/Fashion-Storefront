export const useAuth = () => {
  const api = useApi()
  const user = useState('user', () => null)
  const token = useCookie('token')

  const login = async (credentials: any) => {
    try {
      const response: any = await api('/customer/login', {
        method: 'POST',
        body: credentials
      })
      user.value = response.user
      token.value = response.token
      return response
    } catch (error) {
      throw error
    }
  }

  const register = async (data: any) => {
    try {
      const response: any = await api('/customer/register', {
        method: 'POST',
        body: data
      })
      user.value = response.user
      token.value = response.token
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await api('/customer/logout', { method: 'POST' })
    } finally {
      user.value = null
      token.value = null
      navigateTo('/login')
    }
  }

  const fetchUser = async () => {
    if (!token.value) return
    try {
      const response: any = await api('/customer/me')
      user.value = response.data
    } catch (error) {
      user.value = null
      token.value = null
    }
  }

  return {
    user,
    token,
    login,
    register,
    logout,
    fetchUser,
    isLoggedIn: computed(() => !!user.value)
  }
}
