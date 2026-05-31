import { defineStore } from 'pinia'

export interface WishlistItem {
  id: number
  name: string
  slug: string
  price: number
  image: string
  category?: string
}

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<WishlistItem[]>([])

  const isInWishlist = (id: number) => {
    return items.value.some(item => item.id === id)
  }

  const toggleWishlist = (product: WishlistItem) => {
    const index = items.value.findIndex(item => item.id === product.id)
    if (index > -1) {
      items.value.splice(index, 1)
    } else {
      items.value.push(product)
    }
    saveWishlist()
  }

  const saveWishlist = () => {
    localStorage.setItem('wishlist', JSON.stringify(items.value))
  }

  const loadWishlist = () => {
    const saved = localStorage.getItem('wishlist')
    if (saved) {
      items.value = JSON.parse(saved)
    }
  }

  return {
    items,
    isInWishlist,
    toggleWishlist,
    loadWishlist
  }
})
