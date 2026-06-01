<script setup lang="ts">
import { ShoppingBag, Trash2, Heart, ArrowRight } from 'lucide-vue-next'
import { useWishlistStore } from '~/stores/wishlist'
import { useCartStore } from '~/stores/cart'
import { useNotify } from '~/composables/useNotify'

const wishlistStore = useWishlistStore()
const cartStore = useCartStore()
const { notify } = useNotify()

const addToCart = (product: any) => {
  // Simple variant finding or default
  const variant = { id: product.id, price: product.price }
  cartStore.addToCart(product, variant, 1)
  notify(`Added ${product.name} to cart.`, 'success')
}

const { url } = useImage()
const getImageUrl = (image: string) => url(image)

onMounted(() => {
  wishlistStore.loadWishlist()
})

useSeoMeta({
  title: 'My Wishlist | SimpCommerce',
  description: 'View the products you love and save them for later.',
})
</script>

<template>
  <div class="container py-20">
    <div class="space-y-12">
      <!-- Header -->
      <div class="text-center space-y-4">
        <h1 class="text-4xl font-bold uppercase tracking-tighter">My Wishlist</h1>
        <p class="text-gray-500 text-xs uppercase tracking-[0.3em]">Products you love</p>
      </div>

      <div v-if="wishlistStore.items.length > 0" class="max-w-5xl mx-auto">
        <div class="grid grid-cols-1 gap-8">
          <div 
            v-for="item in wishlistStore.items" 
            :key="item.id"
            class="flex flex-col md:flex-row items-center justify-between p-8 border border-gray-100 hover:shadow-md transition-shadow gap-8"
          >
            <div class="flex items-center space-x-8 w-full md:w-auto">
              <div class="w-20 h-24 bg-gray-50 flex-shrink-0">
                <img :src="getImageUrl(item.image)" class="w-full h-full object-cover">
              </div>
              <div class="space-y-1">
                <p v-if="item.category" class="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{{ item.category }}</p>
                <h3 class="text-sm font-bold uppercase tracking-tight">
                  <NuxtLink :to="`/products/${item.slug}`" class="hover:text-accent transition-colors">
                    {{ item.name }}
                  </NuxtLink>
                </h3>
                <p class="text-sm font-bold">${{ parseFloat(String(item.price)).toFixed(2) }}</p>
              </div>
            </div>

            <div class="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
              <button 
                @click="addToCart(item)"
                class="btn btn-primary px-8 py-4 text-xs font-bold uppercase tracking-widest flex-grow md:flex-grow-0"
              >
                Add to Cart
              </button>
              <button 
                @click="wishlistStore.toggleWishlist(item)"
                class="w-14 h-14 border border-gray-100 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div class="pt-12 text-center">
          <NuxtLink to="/shop" class="text-xs font-bold uppercase tracking-widest border-b-2 border-primary pb-1 hover:text-accent hover:border-accent transition-all">
            Continue Shopping
          </NuxtLink>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="py-32 flex flex-col items-center justify-center text-center space-y-8">
        <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
          <Heart class="w-12 h-12" />
        </div>
        <div class="space-y-2">
          <h2 class="text-2xl font-bold uppercase tracking-tight">Your Wishlist is Empty</h2>
          <p class="text-gray-500 text-sm">Save your favorite items here to buy them later.</p>
        </div>
        <NuxtLink to="/shop" class="btn btn-primary px-10 py-4 uppercase text-xs tracking-widest font-bold">
          Explore Products
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
