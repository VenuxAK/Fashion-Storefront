<script setup lang="ts">


interface Product {
  id: number
  name: string
  slug: string
  base_price: string | number
  image: string
  category?: { name: string }
  variants?: any[]
}

const props = defineProps<{
  product: Product
}>()

const { url } = useImage()
const imageUrl = computed(() => url(props.product.image))

const defaultVariant = computed(() => {
  return (props.product.variants || []).find(v => (v.stock_quantity || 0) > 0)
    || props.product.variants?.[0]
    || { price_adjustment: 0 }
})

const price = computed(() => {
  const base = parseFloat(String(props.product.base_price || 0))
  const adjustment = parseFloat(String(defaultVariant.value?.price_adjustment || 0))
  return base + adjustment
})
</script>

<template>
  <div class="flex items-center gap-4 group">
    <!-- Image Area -->
    <NuxtLink :to="`/products/${product.slug}`" class="relative w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 rounded-sm overflow-hidden shrink-0 flex items-center justify-center p-2">
      <img 
        :src="imageUrl" 
        :alt="product.name" 
        loading="lazy"
        class="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
      >
    </NuxtLink>

    <!-- Info Area -->
    <div class="space-y-1">
      <h3 class="text-sm font-semibold text-gray-900 line-clamp-2">
        <NuxtLink :to="`/products/${product.slug}`" class="hover:text-accent transition-colors">
          {{ product.name }}
        </NuxtLink>
      </h3>
      


      <p class="text-sm font-bold text-primary">${{ price.toFixed(2) }}</p>
    </div>
  </div>
</template>
