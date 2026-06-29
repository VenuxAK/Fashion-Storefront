import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const isMiniCartOpen = ref(false)
  const isSearchOpen = ref(false)
  const quickViewProduct = ref<any>(null)

  const toggleMiniCart = () => {
    isMiniCartOpen.value = !isMiniCartOpen.value
  }

  const openMiniCart = () => {
    isMiniCartOpen.value = true
  }

  const closeMiniCart = () => {
    isMiniCartOpen.value = false
  }

  const openQuickView = (product: any) => {
    quickViewProduct.value = product
  }

  const closeQuickView = () => {
    quickViewProduct.value = null
  }

  return {
    isMiniCartOpen,
    isSearchOpen,
    quickViewProduct,
    toggleMiniCart,
    openMiniCart,
    closeMiniCart,
    openQuickView,
    closeQuickView
  }
})
