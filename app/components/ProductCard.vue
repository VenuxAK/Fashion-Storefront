<script setup lang="ts">
import { ShoppingBag, Heart, Eye } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useWishlistStore } from '~/stores/wishlist'
import { useNotify } from '~/composables/useNotify'

interface Product {
  id: number
  name: string
  slug: string
  base_price: string | number
  image: string
  category?: { name: string }
  is_new?: boolean
  is_sale?: boolean
  variants?: any[]
}

const props = withDefaults(defineProps<{
  product: Product
  view?: 'grid' | 'list'
}>(), {
  view: 'grid'
})

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const { notify } = useNotify()
const { url } = useImage()

const imageUrl = computed(() => url(props.product.image))

const price = computed(() => {
  const base = parseFloat(String(props.product.base_price || 0))
  const adjustment = parseFloat(String(props.product.variants?.[0]?.price_adjustment || 0))
  return base + adjustment
})

const addToCart = () => {
  const variant = props.product.variants?.[0] || { id: props.product.id, price: props.product.base_price }
  cartStore.addToCart(props.product, variant, 1)
  notify(`Added ${props.product.name} to cart.`, 'success')
}

const toggleWishlist = () => {
  wishlistStore.toggleWishlist({
    id: props.product.id,
    name: props.product.name,
    slug: props.product.slug,
    price: price.value,
    image: props.product.image,
    category: props.product.category?.name
  })
  const action = wishlistStore.isInWishlist(props.product.id) ? 'added to' : 'removed from'
  notify(`Product ${action} wishlist.`, 'success')
}
</script>

<template>
  <div :class="[view === 'grid' ? 'group' : 'flex gap-10 items-center border-b border-gray-100 pb-10 last:border-none']">
    <!-- Image Area -->
    <div 
      class="relative bg-gray-50 overflow-hidden"
      :class="[view === 'grid' ? 'aspect-[3/4] mb-6' : 'w-48 aspect-[3/4] flex-shrink-0']"
    >
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
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        >
      </NuxtLink>

      <!-- Actions Overlay (Grid Only) -->
      <div v-if="view === 'grid'" class="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center space-x-2 z-20">
        <button @click="addToCart" class="bg-white text-primary p-3 hover:bg-primary hover:text-white transition-colors shadow-sm">
          <ShoppingBag class="w-4 h-4" />
        </button>
        <button 
          @click="toggleWishlist" 
          class="bg-white p-3 hover:bg-primary hover:text-white transition-colors shadow-sm"
          :class="[wishlistStore.isInWishlist(product.id) ? 'text-accent' : 'text-primary']"
        >
          <Heart class="w-4 h-4" :class="{'fill-current': wishlistStore.isInWishlist(product.id)}" />
        </button>
        <NuxtLink :to="`/products/${product.slug}`" class="bg-white text-primary p-3 hover:bg-primary hover:text-white transition-colors shadow-sm">
          <Eye class="w-4 h-4" />
        </NuxtLink>
      </div>
    </div>

    <!-- Info Area -->
    <div :class="[view === 'grid' ? 'text-center space-y-1' : 'flex-grow space-y-4 text-left']">
      <p v-if="product.category" class="text-[10px] text-gray-400 uppercase tracking-[0.2em]">{{ product.category.name }}</p>
      <h3 class="text-sm font-medium uppercase tracking-widest">
        <NuxtLink :to="`/products/${product.slug}`" class="hover:text-accent transition-colors">
          {{ product.name }}
        </NuxtLink>
      </h3>
      <p v-if="view === 'list'" class="text-sm text-gray-500 line-clamp-2 max-w-xl">{{ product.description }}</p>
      <p class="text-sm font-bold text-gray-700">${{ price.toFixed(2) }}</p>
      
      <!-- Actions (List Only) -->
      <div v-if="view === 'list'" class="flex items-center space-x-4 pt-4">
        <button @click="addToCart" class="btn btn-primary px-8 py-3 text-xs font-bold uppercase tracking-widest">Add to Cart</button>
        <button 
          @click="toggleWishlist" 
          class="w-12 h-12 border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
          :class="[wishlistStore.isInWishlist(product.id) ? 'text-accent' : 'text-gray-400']"
        >
          <Heart class="w-5 h-5" :class="{'fill-current': wishlistStore.isInWishlist(product.id)}" />
        </button>
      </div>
    </div>
  </div>
</template>
