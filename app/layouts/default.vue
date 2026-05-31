<script setup lang="ts">
// Default layout
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
    
    <main class="flex-grow">
      <slot />
    </main>
    
    <AppFooter />
    <MiniCart />
    <NotificationToast />
  </div>
</template>
