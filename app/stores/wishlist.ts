import { defineStore } from 'pinia'

export interface WishlistItem {
  id: number
  product_id: number
  name: string
  slug: string
  price: number
  image: string
  category?: string
  variants?: any[]
}

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<WishlistItem[]>([])
  const api = useApi()
  const auth = useAuth()

  const isInWishlist = (productId: number) => {
    return items.value.some(item => item.product_id === productId)
  }

  const toggleWishlist = async (product: { id: number; name: string; slug: string; price: number; image: string; category?: string }) => {
    const productId = product.id

    if (auth.isLoggedIn.value) {
      try {
        const res: any = await api('/wishlist/toggle', {
          method: 'POST',
          body: { product_id: productId },
        })
        if (res.wishlisted) {
          const p = res.item.product
          items.value.push({
            id: res.item.id,
            product_id: p.id,
            name: p.name,
            slug: p.slug,
            price: parseFloat(String(p.base_price)),
            image: p.image || '',
            category: p.category,
            variants: p.variants,
          })
        } else {
          items.value = items.value.filter(i => i.product_id !== productId)
        }
      } catch {}
      return
    }

    const index = items.value.findIndex(item => item.product_id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
    } else {
      items.value.push({
        id: productId,
        product_id: productId,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.image,
        category: product.category,
      })
    }
    saveWishlist()
  }

  const fetchWishlist = async () => {
    if (!auth.isLoggedIn.value) return
    try {
      const res: any = await api('/wishlist')
      items.value = (res.data || []).map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        name: item.product.name,
        slug: item.product.slug,
        price: parseFloat(String(item.product.base_price)),
        image: item.product.image || '',
        category: item.product.category,
        variants: item.product.variants,
      }))
    } catch {}
  }

  const removeItem = async (productId: number) => {
    if (auth.isLoggedIn.value) {
      const wishlistItem = items.value.find(i => i.product_id === productId)
      if (wishlistItem) {
        try {
          await api(`/wishlist/${wishlistItem.id}`, { method: 'DELETE' })
        } catch {}
      }
    }
    items.value = items.value.filter(i => i.product_id !== productId)
    saveWishlist()
  }

  const syncWishlist = async () => {
    const saved = localStorage.getItem('wishlist')
    if (!saved) return
    try {
      const localItems = JSON.parse(saved)
      for (const item of localItems) {
        await api('/wishlist/toggle', {
          method: 'POST',
          body: { product_id: item.product_id },
        })
      }
    } catch {}
    localStorage.removeItem('wishlist')
    await fetchWishlist()
  }

  const clearWishlist = async () => {
    if (auth.isLoggedIn.value) {
      try {
        await api('/wishlist', { method: 'DELETE' })
      } catch {}
    }
    items.value = []
    localStorage.removeItem('wishlist')
  }

  const saveWishlist = () => {
    localStorage.setItem('wishlist', JSON.stringify(items.value))
  }

  const loadWishlist = async () => {
    const saved = localStorage.getItem('wishlist')
    if (auth.isLoggedIn.value) {
      localStorage.removeItem('wishlist')
      await fetchWishlist()
      return
    }
    if (saved) {
      try {
        items.value = JSON.parse(saved)
      } catch {
        items.value = []
      }
    }
  }

  return {
    items,
    isInWishlist,
    toggleWishlist,
    fetchWishlist,
    removeItem,
    syncWishlist,
    clearWishlist,
    loadWishlist,
  }
})
