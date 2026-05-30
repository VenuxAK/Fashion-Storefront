export const useProfile = () => {
  const api = useApi()

  const getOrders = async (params: any = {}) => {
    return await api('/my/orders', { params })
  }

  const getOrderDetails = async (id: string | number) => {
    return await api(`/my/orders/${id}`)
  }

  const cancelOrder = async (id: string | number) => {
    return await api(`/my/orders/${id}/cancel`, { method: 'POST' })
  }

  const updateProfile = async (data: { name: string, email: string, password?: string }) => {
    return await api('/customer/profile', {
      method: 'PUT',
      body: data
    })
  }

  return {
    getOrders,
    getOrderDetails,
    cancelOrder,
    updateProfile
  }
}
