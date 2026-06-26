export const useCheckout = () => {
  const api = useApi()

  const getAddresses = async () => {
    return await api('/addresses')
  }

  const createAddress = async (data: any) => {
    return await api('/addresses', {
      method: 'POST',
      body: data,
    })
  }

  const validateCheckout = async () => {
    return await api('/checkout/validate')
  }

  const createPaymentIntent = async (paymentMethod: string) => {
    return await api('/checkout/payment-intent', {
      method: 'POST',
      body: { payment_method: paymentMethod },
    })
  }

  const placeOrder = async (
    data: {
      address_id: number
      notes?: string
      payment_method?: string
      payment_intent_id?: string
      payment_transaction_id?: string
    },
    idempotencyKey?: string,
  ) => {
    return await api('/checkout', {
      method: 'POST',
      body: data,
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined,
    })
  }

  return {
    getAddresses,
    createAddress,
    validateCheckout,
    createPaymentIntent,
    placeOrder,
  }
}
