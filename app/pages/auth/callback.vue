<script setup lang="ts">
import { onMounted } from 'vue'

const { refreshIdentity } = useSanctumAuth()
const wishlistStore = useWishlistStore()
const cartStore = useCartStore()

onMounted(async () => {
  try {
    // Refresh the user identity from the API using the newly set Sanctum cookie
    await refreshIdentity()
    
    // Sync the cart and wishlist
    await wishlistStore.syncWishlist()
    await cartStore.syncCart()

    // Redirect to home page
    navigateTo('/')
  } catch (err) {
    console.error('OAuth Callback Error:', err)
    // If it fails, go back to login
    navigateTo('/login')
  }
})
</script>

<template>
  <div class="container py-32 flex flex-col items-center justify-center space-y-6">
    <div class="w-16 h-16 border-4 border-gray-100 border-t-primary rounded-full animate-spin"></div>
    <div class="text-center space-y-2">
      <h1 class="text-xl font-bold uppercase tracking-widest">Authenticating...</h1>
      <p class="text-xs text-gray-400 uppercase tracking-widest">Please wait while we log you in</p>
    </div>
  </div>
</template>
