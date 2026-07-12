<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
  label?: string
}>(), {
  size: 32,
  label: 'Loading...'
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
    <div class="relative flex items-center justify-center">
      <!-- Outer track ring -->
      <div
        class="rounded-full border-2 border-gray-100 shrink-0"
        :style="{ width: size + 'px', height: size + 'px' }"
      />
      <!-- Active spinning arc -->
      <div
        class="absolute animate-spin rounded-full border-2 border-black border-t-transparent shrink-0"
        :style="{ width: size + 'px', height: size + 'px' }"
      />
    </div>
    <span class="text-[9px] font-bold tracking-widest uppercase animate-pulse">{{ label }}</span>
  </div>
</template>
