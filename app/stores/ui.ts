import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const isMiniCartOpen = ref(false)
  const isSearchOpen = ref(false)

  const toggleMiniCart = () => {
    isMiniCartOpen.value = !isMiniCartOpen.value
  }

  const openMiniCart = () => {
    isMiniCartOpen.value = true
  }

  const closeMiniCart = () => {
    isMiniCartOpen.value = false
  }

  return {
    isMiniCartOpen,
    isSearchOpen,
    toggleMiniCart,
    openMiniCart,
    closeMiniCart
  }
})
