<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

const { getCategories } = useProduct()

const { data: categoriesData, pending } = await useAsyncData('all-categories', () => getCategories())

const categories = computed(() => {
  const raw = (categoriesData.value as any)?.data || categoriesData.value || []
  return Array.isArray(raw) ? raw : []
})

const childCategories = computed(() => {
  const allCategories = categories.value || []
  const placeholders = [
    'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=400&auto=format&fit=crop', // Men
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop', // Women
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop', // Accessories
    'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=400&auto=format&fit=crop', // Shoes
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=400&auto=format&fit=crop'  // Bags
  ]
  return allCategories.map((cat: any, index: number) => ({
    ...cat,
    image: cat.image_url || placeholders[index % placeholders.length]
  }))
})

useSeoMeta({
  title: 'All Categories | SimpCommerce',
})
</script>

<template>
  <div class="bg-[#F6F9FC] min-h-screen py-12">
    <div class="container space-y-10">
      <!-- Header -->
      <div class="text-center space-y-4">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900">All Categories</h1>
        <p class="text-gray-500 max-w-2xl mx-auto">Explore our wide range of fashion collections carefully curated for you.</p>
      </div>

      <!-- Categories Grid -->
      <div v-if="pending" class="flex justify-center py-20">
        <div class="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <div v-else-if="childCategories.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <CategoryCard 
          v-for="cat in childCategories" 
          :key="cat.id" 
          :category="cat" 
        />
      </div>

      <div v-else class="text-center py-20 bg-white rounded-xl shadow-[0_1px_3px_rgba(3,0,71,0.09)]">
        <p class="text-gray-500 text-lg">No categories found.</p>
      </div>
    </div>
  </div>
</template>
