<script setup lang="ts">
interface Category {
  id: number
  name: string
  slug: string
  image?: string
}

defineProps<{
  category: Category
}>()
</script>

<template>
  <NuxtLink 
    :to="`/shop?category=${category.slug}`" 
    class="group block relative w-full aspect-4/3 rounded-md overflow-hidden"
  >
    <!-- Background Image -->
    <div class="absolute inset-0 bg-gray-100">
      <img 
        v-if="category.image"
        :src="category.image" 
        :alt="category.name"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <!-- Fallback pattern if no image -->
      <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
        <span class="text-gray-400">No Image</span>
      </div>
    </div>

    <!-- Title Label -->
    <div class="absolute bottom-4 left-4 right-4 flex justify-center">
      <div class="bg-white/95 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm text-sm font-medium text-gray-900 transition-colors group-hover:text-primary">
        {{ category.name }}
      </div>
    </div>
  </NuxtLink>
</template>
