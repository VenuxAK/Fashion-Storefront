<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()

const isTransparentHeaderPage = computed(() => {
  return route.path === localePath('/') || route.path === localePath('/') + '/'
})
</script>

<template>
  <div class="flex flex-col min-h-screen overflow-x-hidden">
    <AppHeader />
    
    <main 
      class="flex-grow transition-all duration-300" 
      :class="[isTransparentHeaderPage ? 'pt-0' : 'pt-[80px] lg:pt-[100px]']"
    >
      <slot />
    </main>
    
    <AppFooter />
    <MiniCart />
    <NotificationToast />
    <BackToTop />
  </div>
</template>
