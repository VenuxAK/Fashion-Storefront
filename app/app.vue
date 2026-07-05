<script setup lang="ts">
const wishlistStore = useWishlistStore()

const { progress, isLoading, start, finish, clear } = useLoadingIndicator({
  duration: 3000,
  throttle: 0,
})

onMounted(() => {
  wishlistStore.loadWishlist()
})
</script>

<template>
  <div
    v-show="isLoading"
    class="fixed top-0 left-0 w-full h-1 z-[999] bg-accent/20 transition-opacity duration-200"
    :class="[isLoading ? 'opacity-100' : 'opacity-0']"
  >
    <div
      class="h-full bg-accent transition-all duration-300 ease-out"
      :style="{ width: progress + '%' }"
    />
  </div>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
