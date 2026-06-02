import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const api = useApi()
  const auth = useAuth()

  const subtotal = computed(() => {
    return items.value.reduce((acc, item) => {
      const price = parseFloat(String(item.price || 0))
      const qty = parseInt(String(item.quantity || 0))
      const sum = acc + (isNaN(price * qty) ? 0 : (price * qty))
      return sum
    }, 0)
  })

  const totalItems = computed(() => {
    return items.value.reduce((acc, item) => {
      const qty = parseInt(String(item.quantity || 0))
      return acc + (isNaN(qty) ? 0 : qty)
    }, 0)
  })

  const fetchCart = async () => {
    if (!auth.isLoggedIn.value) {
      // Load from local storage for guests
      const saved = localStorage.getItem('cart')
      if (saved) items.value = JSON.parse(saved)
      return
    }

    try {
      const response: any = await api('/cart')
      items.value = response.data.map((item: any) => {
        const rawBasePrice = item.variant?.product?.base_price
        const rawAdjustment = item.variant?.price_adjustment
        
        const basePrice = (rawBasePrice !== undefined && rawBasePrice !== null) ? parseFloat(String(rawBasePrice)) : 0
        const adjustment = (rawAdjustment !== undefined && rawAdjustment !== null) ? parseFloat(String(rawAdjustment)) : 0
        const price = isNaN(basePrice + adjustment) ? 0 : (basePrice + adjustment)
        
        return {
          id: item.id,
          variant_id: item.product_variant_id,
          name: item.variant?.product?.name || 'Unknown Product',
          price: price,
          quantity: item.quantity,
          image: item.variant?.image || item.variant?.product?.image,
          color: item.variant?.color,
          size: item.variant?.size
        }
      })
    } catch (error) {
      console.error('Failed to fetch cart', error)
    }
  }

  const addToCart = async (product: any, variant: any, quantity: number = 1) => {
    if (!auth.isLoggedIn.value) {
      const existing = items.value.find((item: any) => item.variant_id === variant.id)
      const basePrice = parseFloat(String(product?.base_price || 0))
      const adjustment = parseFloat(String(variant?.price_adjustment || 0))
      const price = isNaN(basePrice + adjustment) ? 0 : (basePrice + adjustment)
      const available = variant?.stock_quantity ?? 99
      const currentQty = existing?.quantity || 0

      if (currentQty + quantity > available) {
        throw new Error(`Insufficient stock. Available: ${available}.`)
      }

      if (existing) {
        existing.quantity = currentQty + quantity
      } else {
        items.value.push({
          variant_id: variant.id,
          name: product?.name || 'Unknown Product',
          price: price,
          quantity,
          image: variant?.image || product?.image,
          color: variant?.color,
          size: variant?.size
        })
      }
      localStorage.setItem('cart', JSON.stringify(items.value))
      return
    }

    try {
      await api('/cart', {
        method: 'POST',
        body: {
          product_variant_id: variant.id,
          quantity
        }
      })
      await fetchCart()
    } catch (error: any) {
      const message = error?.data?.message || error?.message || 'Failed to add to cart'
      throw new Error(message)
    }
  }

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (!auth.isLoggedIn.value) {
      const item = items.value.find((i: any) => i.variant_id === itemId) // local storage uses variant_id as 'id' for simplicity or consistent keys
      if (item) {
        item.quantity = quantity
        if (item.quantity <= 0) {
          items.value = items.value.filter((i: any) => i.variant_id !== itemId)
        }
      }
      localStorage.setItem('cart', JSON.stringify(items.value))
      return
    }

    try {
      await api(`/cart/${itemId}`, {
        method: 'PUT',
        body: { quantity }
      })
      await fetchCart()
    } catch (error) {
      console.error('Failed to update quantity', error)
    }
  }

  const removeItem = async (itemId: number) => {
    if (!auth.isLoggedIn.value) {
      items.value = items.value.filter((i: any) => i.variant_id !== itemId)
      localStorage.setItem('cart', JSON.stringify(items.value))
      return
    }

    try {
      await api(`/cart/${itemId}`, { method: 'DELETE' })
      await fetchCart()
    } catch (error) {
      console.error('Failed to remove item', error)
    }
  }

  const clearCart = async () => {
    if (!auth.isLoggedIn.value) {
      items.value = []
      localStorage.removeItem('cart')
      return
    }

    try {
      await api('/cart', { method: 'DELETE' })
      items.value = []
    } catch (error) {
      console.error('Failed to clear cart', error)
    }
  }

  const syncCart = async () => {
    const saved = localStorage.getItem('cart')
    if (!saved) return
    try {
      const localItems = JSON.parse(saved)
      for (const item of localItems) {
        await api('/cart', {
          method: 'POST',
          body: { product_variant_id: item.variant_id, quantity: item.quantity },
        }).catch(() => {})
      }
    } catch {}
    localStorage.removeItem('cart')
    await fetchCart()
  }

  return {
    items,
    subtotal,
    totalItems,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    syncCart,
  }
})
