<script setup lang="ts">
import { ShoppingBag, Heart, Eye } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useWishlistStore } from '~/stores/wishlist'
import { useUiStore } from '~/stores/ui'
import { useNotify } from '~/composables/useNotify'

interface Product {
  id: number
  name: string
  description: string
  slug: string
  base_price: string | number
  image: string
  image_url?: string
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
const uiStore = useUiStore()
const { notify } = useNotify()
const { url } = useMedia()

const imageUrl = computed(() => url(props.product.image_url || props.product.image))

const {
  needsSelection: needsVariantSelection,
  selectedVariant,
  hasStock, adjustedPrice: price,
} = useVariantSelector(
  computed(() => Array.isArray(props.product.variants) ? props.product.variants : []),
  computed(() => props.product.base_price || 0)
)

const addToCart = async () => {
  if (!hasStock.value) return
  // If the product has size/color variants, redirect to product page for selection
  if (needsVariantSelection.value) {
    notify('This product has size/color options. Please choose the size and color on the product details page.', 'info')
    navigateTo(`/products/${props.product.slug}`)
    return
  }
  const variant = selectedVariant.value || { id: props.product.id, price_adjustment: 0, stock_quantity: 0 }
  try {
    await cartStore.addToCart(props.product, variant, 1)
    notify(`Added ${props.product.name} to cart.`, 'success')
  } catch (err: any) {
    notify(err.message || 'Failed to add to cart.', 'error')
  }
}

const toggleWishlist = () => {
  const wasInWishlist = wishlistStore.isInWishlist(props.product.id)
  wishlistStore.toggleWishlist({
    id: props.product.id,
    name: props.product.name,
    slug: props.product.slug,
    price: price.value,
    image: props.product.image_url || props.product.image,
    category: props.product.category?.name
  })
  const action = wasInWishlist ? 'removed from' : 'added to'
  notify(`Product ${action} wishlist.`, 'success')
}
</script>

<template>
  <div :class="[
    view === 'grid' 
      ? 'group bg-white rounded-xl shadow-[0_1px_3px_rgba(3,0,71,0.09)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_16px_rgba(3,0,71,0.09)] hover:-translate-y-1' 
      : 'flex gap-6 items-center bg-white rounded-xl shadow-[0_1px_3px_rgba(3,0,71,0.09)] p-4 transition-all duration-300 hover:shadow-[0_8px_16px_rgba(3,0,71,0.09)]'
  ]">
    <!-- Image Area -->
    <div 
      class="relative bg-white overflow-hidden flex items-center justify-center shrink-0"
      :class="[view === 'grid' ? 'aspect-4/3 w-full p-4' : 'w-48 aspect-4/3 rounded-lg p-2']"
    >
      <!-- Badges -->
      <div class="absolute top-3 left-3 z-10 flex flex-col gap-2">
        <span v-if="product.is_new" class="bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm shadow-sm">New</span>
        <span v-if="product.is_sale" class="bg-[#E94560] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm shadow-sm">Sale</span>
      </div>

      <!-- Image -->
      <NuxtLink :to="`/products/${product.slug}`" class="w-full h-full flex items-center justify-center">
        <NuxtImg 
          :src="imageUrl" 
          :alt="product.name" 
          loading="lazy"
          fetchpriority="low"
          format="webp"
          sizes="sm:320px md:400px lg:400px"
          class="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
        />
      </NuxtLink>

      <!-- Actions Overlay (Grid Only) -->
      <div v-if="view === 'grid'" class="absolute right-3 top-3 flex flex-col gap-2 z-20 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
        <button 
          @click="toggleWishlist" 
          class="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-rose-500 hover:text-white transition-colors shadow-sm text-gray-500"
          :class="[wishlistStore.isInWishlist(product.id) ? 'text-rose-500' : '']"
        >
          <Heart class="w-4 h-4" :class="{'fill-current text-rose-500': wishlistStore.isInWishlist(product.id)}" />
        </button>
        <button @click="uiStore.openQuickView(product)" class="bg-white/90 backdrop-blur-sm text-gray-500 p-2 rounded-full hover:bg-rose-500 hover:text-white transition-colors shadow-sm">
          <Eye class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Info Area -->
    <div :class="[view === 'grid' ? 'p-5 pt-2 flex flex-col' : 'grow flex flex-col justify-center py-2']">
      <div class="flex justify-between items-start gap-4">
        <div>
          <h3 class="text-sm font-semibold text-gray-800 line-clamp-1 mb-1">
            <NuxtLink :to="`/products/${product.slug}`" class="hover:text-rose-500 transition-colors">
              {{ product.name }}
            </NuxtLink>
          </h3>

        </div>
        <!-- Grid Add to Cart Button -->
        <button 
          v-if="view === 'grid'"
          @click="addToCart" 
          class="border border-gray-200 text-gray-500 p-1.5 rounded hover:border-rose-500 hover:bg-rose-500 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0" 
          :disabled="!hasStock"
        >
          <ShoppingBag class="w-4 h-4" />
        </button>
      </div>

      <div class="flex items-center gap-2 mt-auto">
        <p class="text-base font-bold text-rose-500">${{ price.toFixed(2) }}</p>
        <p v-if="product.is_sale" class="text-sm text-gray-400 line-through">${{ (price * 1.2).toFixed(2) }}</p>
      </div>

      <p v-if="view === 'list'" class="text-sm text-gray-500 line-clamp-2 mt-3 mb-4 max-w-2xl">{{ product.description }}</p>
      
      <!-- Actions (List Only) -->
      <div v-if="view === 'list'" class="flex items-center gap-4 mt-auto pt-2">
        <button 
          @click="addToCart" 
          class="bg-rose-500 text-white hover:bg-rose-600 px-6 py-2 text-sm rounded-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center transition-colors" 
          :disabled="!hasStock"
        >
          <ShoppingBag class="w-4 h-4 mr-2" />
          {{ !hasStock ? 'Out of Stock' : needsVariantSelection ? 'Select Options' : 'Add to Cart' }}
        </button>
        <button 
          @click="toggleWishlist" 
          class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500"
          :class="[wishlistStore.isInWishlist(product.id) ? 'text-rose-500' : '']"
        >
          <Heart class="w-5 h-5" :class="{'fill-current text-rose-500': wishlistStore.isInWishlist(product.id)}" />
        </button>
      </div>
    </div>
  </div>
</template>
