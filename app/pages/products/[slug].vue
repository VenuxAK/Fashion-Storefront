<script setup lang="ts">
import { Heart, ShoppingBag, Share2, Plus, Minus, ChevronRight, ChevronLeft } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const { getProductBySlug } = useProduct()
const cartStore = useCartStore()
const { notify } = useNotify()

const { data: productData, error } = await useAsyncData(
  `product-${route.params.slug}`,
  () => getProductBySlug(route.params.slug as string)
)

const product = computed(() => productData.value?.data || null)

// UI State
const quantity = ref(1)
const selectedSize = ref('')
const selectedColor = ref('')
const activeTab = ref('description')

const config = useRuntimeConfig()
const imageUrl = computed(() => {
  if (!product.value?.image) return 'https://placehold.co/800x1000'
  if (product.value.image.startsWith('http')) return product.value.image
  const baseUrl = config.public.apiUrl.replace('/api', '')
  return `${baseUrl}/storage/${product.value.image}`
})

const increment = () => quantity.value++
const decrement = () => quantity.value > 1 && quantity.value--

const addToCart = () => {
  if (!product.value) return
  
  // Find a suitable variant if multiple exist, or just use the first one for now
  const variant = product.value.variants?.[0] || { id: product.value.id, price: product.value.base_price }
  
  cartStore.addToCart(product.value, variant, quantity.value)
  notify(`Added ${quantity.value} ${product.value.name} to cart.`, 'success')
}
</script>

<template>
  <div v-if="product" class="container py-20">
    <!-- Breadcrumbs -->
    <nav class="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-12">
      <NuxtLink to="/" class="hover:text-primary transition-colors">Home</NuxtLink>
      <ChevronRight class="w-3 h-3" />
      <NuxtLink to="/shop" class="hover:text-primary transition-colors">Shop</NuxtLink>
      <ChevronRight class="w-3 h-3" />
      <span class="text-primary">{{ product.name }}</span>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">
      <!-- Gallery -->
      <div class="space-y-6">
        <div class="aspect-[3/4] bg-gray-50 overflow-hidden relative group">
          <img 
            :src="imageUrl" 
            :alt="product.name" 
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          >
          <div class="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="bg-white/80 p-3 hover:bg-white"><ChevronLeft class="w-5 h-5" /></button>
            <button class="bg-white/80 p-3 hover:bg-white"><ChevronRight class="w-5 h-5" /></button>
          </div>
        </div>
        <div class="grid grid-cols-4 gap-4">
          <div v-for="i in 4" :key="i" class="aspect-square bg-gray-50 cursor-pointer border-2 transition-colors border-transparent hover:border-accent overflow-hidden">
            <img :src="imageUrl" class="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity">
          </div>
        </div>
      </div>

      <!-- Info -->
      <div class="space-y-10">
        <div class="space-y-4">
          <p v-if="product.category" class="text-xs text-accent font-bold uppercase tracking-[0.4em]">{{ product.category.name }}</p>
          <h1 class="text-4xl font-bold uppercase tracking-tight">{{ product.name }}</h1>
          <div class="flex items-center space-x-4">
            <span class="text-2xl font-bold">${{ parseFloat(product.base_price).toFixed(2) }}</span>
            <div class="flex items-center text-yellow-400">
              <span v-for="i in 5" :key="i">★</span>
              <span class="text-xs text-gray-400 ml-2 font-bold uppercase tracking-widest">(24 Reviews)</span>
            </div>
          </div>
        </div>

        <p class="text-gray-500 leading-loose text-sm">
          {{ product.description }}
        </p>

        <!-- Variants -->
        <div class="space-y-8">
          <!-- Size Selector -->
          <div v-if="product.variants && product.variants.length > 0" class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold uppercase tracking-widest">Size: {{ selectedSize || 'Select' }}</span>
              <button class="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200">Size Guide</button>
            </div>
            <div class="flex flex-wrap gap-3">
              <button 
                v-for="size in ['XS', 'S', 'M', 'L', 'XL']" 
                :key="size"
                @click="selectedSize = size"
                class="w-12 h-12 flex items-center justify-center border text-xs font-bold transition-all"
                :class="[selectedSize === size ? 'bg-primary text-white border-primary' : 'border-gray-100 hover:border-primary']"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Color Selector -->
          <div v-if="product.variants && product.variants.length > 0" class="space-y-4">
            <span class="text-xs font-bold uppercase tracking-widest">Color: {{ selectedColor || 'Select' }}</span>
            <div class="flex flex-wrap gap-4">
              <button 
                v-for="color in ['White', 'Black', 'Blue']" 
                :key="color"
                @click="selectedColor = color"
                class="w-10 h-10 rounded-full border-2 p-1 transition-all"
                :class="[selectedColor === color ? 'border-accent' : 'border-transparent']"
              >
                <div 
                  class="w-full h-full rounded-full" 
                  :class="[color === 'White' ? 'bg-white border border-gray-100' : color === 'Black' ? 'bg-black' : 'bg-blue-600']"
                ></div>
              </button>
            </div>
          </div>
        </div>

        <!-- Add to Cart -->
        <div class="flex space-x-4">
          <div class="flex items-center border border-gray-100 h-14">
            <button @click="decrement" class="px-4 hover:text-accent"><Minus class="w-4 h-4" /></button>
            <span class="w-10 text-center font-bold">{{ quantity }}</span>
            <button @click="increment" class="px-4 hover:text-accent"><Plus class="w-4 h-4" /></button>
          </div>
          <button 
            @click="addToCart" 
            class="flex-grow bg-primary text-white h-14 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors"
          >
            Add to Cart
          </button>
          <button class="w-14 h-14 border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Heart class="w-5 h-5" />
          </button>
        </div>

        <!-- Extra Info -->
        <div class="pt-10 border-t border-gray-100 space-y-4">
          <div class="flex items-center text-xs uppercase font-bold tracking-widest">
            <span class="text-gray-400 w-24">SKU:</span>
            <span>SIMP-{{ product.id }}</span>
          </div>
          <div class="flex items-center text-xs uppercase font-bold tracking-widest">
            <span class="text-gray-400 w-24">Categories:</span>
            <span>{{ product.category?.name || 'Uncategorized' }}</span>
          </div>
          <div class="flex items-center text-xs uppercase font-bold tracking-widest">
            <span class="text-gray-400 w-24">Share:</span>
            <div class="flex space-x-4">
              <button class="hover:text-accent transition-colors"><Share2 class="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="mt-32 border-t border-gray-100 pt-20">
      <div class="flex justify-center space-x-12 mb-12">
        <button 
          v-for="tab in ['description', 'additional', 'reviews']" 
          :key="tab"
          @click="activeTab = tab"
          class="text-sm font-bold uppercase tracking-[0.2em] transition-all relative pb-2"
          :class="[activeTab === tab ? 'text-primary' : 'text-gray-400 hover:text-primary']"
        >
          {{ tab }}
          <span v-if="activeTab === tab" class="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
        </button>
      </div>
      
      <div class="max-w-4xl mx-auto text-gray-500 leading-loose text-sm text-center">
        <div v-if="activeTab === 'description'">
          {{ product.description }}
        </div>
        <div v-else-if="activeTab === 'additional'">
          No additional information available at this time.
        </div>
        <div v-else-if="activeTab === 'reviews'">
          Currently there are no reviews for this product.
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="error" class="container py-40 text-center">
    <h2 class="text-2xl font-bold uppercase tracking-tight mb-4">Product Not Found</h2>
    <NuxtLink to="/shop" class="btn btn-outline">Back to Shop</NuxtLink>
  </div>
</template>
