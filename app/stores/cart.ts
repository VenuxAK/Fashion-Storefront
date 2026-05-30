import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const api = useApi()
  const auth = useAuth()

  const subtotal = computed(() => {
    return items.value.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  })

  const totalItems = computed(() => {
    return items.value.reduce((acc, item) => acc + item.quantity, 0)
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
        const basePrice = parseFloat(String(item.variant.product.base_price || 0))
        const adjustment = parseFloat(String(item.variant.price_adjustment || 0))
        return {
          id: item.id,
          variant_id: item.product_variant_id,
          name: item.variant.product.name,
          price: basePrice + adjustment,
          quantity: item.quantity,
          image: item.variant.image || item.variant.product.image,
          color: item.variant.color,
          size: item.variant.size
        }
      })
    } catch (error) {
      console.error('Failed to fetch cart', error)
    }
  }

  const addToCart = async (product: any, variant: any, quantity: number = 1) => {
    if (!auth.isLoggedIn.value) {
      const existing = items.value.find((item: any) => item.variant_id === variant.id)
      const basePrice = parseFloat(String(product.base_price || 0))
      const adjustment = parseFloat(String(variant.price_adjustment || 0))
      const price = basePrice + adjustment

      if (existing) {
        existing.quantity += quantity
      } else {
        items.value.push({
          variant_id: variant.id,
          name: product.name,
          price: price,
          quantity,
          image: variant.image || product.image,
          color: variant.color,
          size: variant.size
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
    } catch (error) {
      console.error('Failed to add to cart', error)
    }
  }

  const updateQuantity = async (variantId: number, quantity: number) => {
    if (!auth.isLoggedIn.value) {
      const item = items.value.find(i => i.variant_id === variantId)
      if (item) {
        item.quantity = quantity
        if (item.quantity <= 0) {
          items.value = items.value.filter(i => i.variant_id !== variantId)
        }
      }
      localStorage.setItem('cart', JSON.stringify(items.value))
      return
    }

    try {
      await api(`/cart/${variantId}`, {
        method: 'PUT',
        body: { quantity }
      })
      await fetchCart()
    } catch (error) {
      console.error('Failed to update quantity', error)
    }
  }

  const removeItem = async (variantId: number) => {
    if (!auth.isLoggedIn.value) {
      items.value = items.value.filter(i => i.variant_id !== variantId)
      localStorage.setItem('cart', JSON.stringify(items.value))
      return
    }

    try {
      await api(`/cart/${variantId}`, { method: 'DELETE' })
      await fetchCart()
    } catch (error) {
      console.error('Failed to remove item', error)
    }
  }

  return {
    items,
    subtotal,
    totalItems,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem
  }
})
