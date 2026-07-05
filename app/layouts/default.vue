<script setup lang="ts">
const route = useRoute()

const isTransparentHeaderPage = computed(() => {
  return route.path === '/'
})
</script>

<template>
  <div class="flex flex-col min-h-screen overflow-x-hidden">
    <AppHeader />
    
    <main 
      class="grow transition-all duration-300" 
      :class="[isTransparentHeaderPage ? 'pt-0' : 'pt-[80px] lg:pt-[100px]']"
    >
      <slot />
    </main>
    
    <AppFooter />
    <ClientOnly>
      <LazyMiniCart />
    </ClientOnly>
    <ClientOnly>
      <LazyNotificationToast />
    </ClientOnly>
    <LazyBackToTop />
    <ClientOnly>
      <LazyProductQuickView />
    </ClientOnly>
  </div>
</template>
