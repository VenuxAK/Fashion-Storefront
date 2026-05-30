<script setup lang="ts">
import { ShoppingBag, Heart, Eye } from 'lucide-vue-next'

interface Product {
  id: number
  name: string
  slug: string
  base_price: string | number
  image: string
  category?: { name: string }
  is_new?: boolean
  is_sale?: boolean
}

const props = defineProps<{
  product: Product
}>()

const config = useRuntimeConfig()
const imageUrl = computed(() => {
  if (!props.product.image) return 'https://placehold.co/800x1000'
  if (props.product.image.startsWith('http')) return props.product.image
  const baseUrl = config.public.apiUrl.replace('/api', '')
  return `${baseUrl}/storage/${props.product.image}`
})
</script>

<template>
  <div class="group">
    <div class="relative aspect-[3/4] bg-gray-50 overflow-hidden mb-6">
      <!-- Badges -->
      <div class="absolute top-4 left-4 z-10 flex flex-col space-y-2">
        <span v-if="product.is_new" class="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1">New</span>
        <span v-if="product.is_sale" class="bg-accent text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1">Sale</span>
      </div>

      <!-- Image -->
      <NuxtLink :to="`/products/${product.slug}`">
        <img 
          :src="imageUrl" 
          :alt="product.name" 
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        >
      </NuxtLink>

      <!-- Actions Overlay -->
      <div class="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center space-x-2 z-20">
        <button class="bg-white text-primary p-3 hover:bg-primary hover:text-white transition-colors shadow-sm">
          <ShoppingBag class="w-4 h-4" />
        </button>
        <button class="bg-white text-primary p-3 hover:bg-primary hover:text-white transition-colors shadow-sm">
          <Heart class="w-4 h-4" />
        </button>
        <button class="bg-white text-primary p-3 hover:bg-primary hover:text-white transition-colors shadow-sm">
          <Eye class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Info -->
    <div class="text-center space-y-1">
      <p v-if="product.category" class="text-[10px] text-gray-400 uppercase tracking-[0.2em]">{{ product.category.name }}</p>
      <h3 class="text-sm font-medium uppercase tracking-widest">
        <NuxtLink :to="`/products/${product.slug}`" class="hover:text-accent transition-colors">
          {{ product.name }}
        </NuxtLink>
      </h3>
      <p class="text-sm font-bold text-gray-700">${{ parseFloat(String(product.base_price)).toFixed(2) }}</p>
    </div>
  </div>
</template>
