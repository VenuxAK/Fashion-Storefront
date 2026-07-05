<script setup lang="ts">
withDefaults(defineProps<{
  count?: number
  columns?: number
}>(), {
  count: 8,
  columns: 4,
})
</script>

<template>
  <div
    class="grid gap-6"
    :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }"
  >
    <SkeletonProductCard v-for="i in count" :key="i" />
  </div>
</template>
