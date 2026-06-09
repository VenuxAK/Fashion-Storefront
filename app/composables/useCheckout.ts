export const useCheckout = () => {
  const api = useApi()
  
  const getAddresses = async () => {
    return await api('/addresses')
  }

  const createAddress = async (data: any) => {
    return await api('/addresses', {
      method: 'POST',
      body: data
    })
  }

  const validateCheckout = async () => {
    return await api('/checkout/validate')
  }

  const placeOrder = async (data: { address_id: number, notes?: string }, idempotencyKey?: string) => {
    return await api('/checkout', {
      method: 'POST',
      body: data,
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined
    })
  }

  return {
    getAddresses,
    createAddress,
    validateCheckout,
    placeOrder
  }
}
