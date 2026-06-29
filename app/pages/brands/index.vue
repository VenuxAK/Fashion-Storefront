<script setup lang="ts">
const { getBrands } = useProduct()

const { data: brandsData, pending } = await useAsyncData('all-brands', () => getBrands())

const brands = computed(() => {
  const raw = (brandsData.value as any)?.data || brandsData.value || []
  return Array.isArray(raw) ? raw : []
})

useSeoMeta({
  title: 'All Brands | SimpCommerce',
})
</script>

<template>
  <div class="bg-[#F6F9FC] min-h-screen py-12">
    <div class="container space-y-10">
      <!-- Header -->
      <div class="text-center space-y-4">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900">Our Brands</h1>
        <p class="text-gray-500 max-w-2xl mx-auto">Discover top-tier fashion from our globally recognized partner brands.</p>
      </div>

      <!-- Brands Grid -->
      <div v-if="pending" class="flex justify-center py-20">
        <div class="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <div v-else-if="brands.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <NuxtLink 
          v-for="brand in brands" 
          :key="brand.id"
          :to="`/shop?brand_id=${brand.id}`"
          class="bg-white rounded-xl shadow-[0_1px_3px_rgba(3,0,71,0.09)] hover:shadow-lg p-6 flex items-center justify-center transition-all duration-300 group border border-transparent hover:border-rose-100 aspect-4/3"
        >
          <img 
            :src="brand.logo_url || 'https://placehold.co/400x200?text='+brand.name" 
            :alt="brand.name"
            class="max-h-full max-w-full object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
          />
        </NuxtLink>
      </div>

      <div v-else class="text-center py-20 bg-white rounded-xl shadow-[0_1px_3px_rgba(3,0,71,0.09)]">
        <p class="text-gray-500 text-lg">No brands found.</p>
      </div>
    </div>
  </div>
</template>
