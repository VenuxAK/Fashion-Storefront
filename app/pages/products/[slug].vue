<script setup lang="ts">
import { Heart, ShoppingBag, Share2, Plus, Minus, ChevronRight, ChevronLeft } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useWishlistStore } from '~/stores/wishlist'
import { useNotify } from '~/composables/useNotify'

const route = useRoute()
const { getProductBySlug } = useProduct()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const { notify } = useNotify()

const { data: productData, error } = await useAsyncData(
  `product-${route.params.slug}`,
  () => getProductBySlug(route.params.slug as string)
)

const product = computed(() => productData.value?.data || null)

const quantity = ref(1)
const selectedSize = ref('')
const selectedColor = ref('')
const activeTab = ref('description')
const selectedImageIndex = ref(0)

const { url } = useImage()

// Gallery: collect unique images from product + variants
const allImages = computed<string[]>(() => {
  const imgs: string[] = []
  if (product.value?.image) imgs.push(url(product.value.image))
  product.value?.variants?.forEach(v => {
    const img = v.image ? url(v.image) : null
    if (img && !imgs.includes(img)) imgs.push(img)
  })
  return imgs.length ? imgs : ['https://placehold.co/800x1000/eee/999?text=No+Image']
})

const selectedImage = computed(() => allImages.value[selectedImageIndex.value] || allImages.value[0])

// Variant: extract real sizes/colors from API data
const sizes = computed(() => {
  const set = new Set(product.value?.variants?.map(v => v.size).filter(Boolean) as string[])
  return [...set]
})

const colors = computed(() => {
  const set = new Set(product.value?.variants?.map(v => v.color).filter(Boolean) as string[])
  return [...set]
})

const needsSelection = computed(() => {
  return !!(product.value?.variants?.some(v => v.size) || product.value?.variants?.some(v => v.color))
})

const selectedVariant = computed(() => {
  if (!product.value?.variants?.length) return null
  if (!needsSelection.value) return product.value.variants[0]
  return product.value.variants.find(v =>
    (!selectedSize.value || v.size === selectedSize.value) &&
    (!selectedColor.value || v.color === selectedColor.value)
  ) || null
})

const increment = () => quantity.value++
const decrement = () => quantity.value > 1 && quantity.value--

const addToCart = () => {
  if (!product.value || !selectedVariant.value) return
  cartStore.addToCart(product.value, selectedVariant.value, quantity.value)
  notify(`Added ${quantity.value} ${product.value.name} to cart.`, 'success')
}

const toggleWishlist = () => {
  if (!product.value) return
  wishlistStore.toggleWishlist({
    id: product.value.id,
    name: product.value.name,
    slug: product.value.slug,
    price: parseFloat(String(product.value.base_price)),
    image: allImages.value[0] || product.value.image,
    category: product.value.category?.name
  })
  const action = wishlistStore.isInWishlist(product.value.id) ? 'added to' : 'removed from'
  notify(`Product ${action} wishlist.`, 'success')
}

watch(product, (newVal) => {
  if (newVal) {
    useSeoMeta({
      title: `${newVal.name} | SimpCommerce`,
      description: newVal.description,
      ogTitle: newVal.name,
      ogDescription: newVal.description,
    })
  }
}, { immediate: true })
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
            :src="selectedImage"
            :alt="product.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div v-if="allImages.length > 1" class="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="selectedImageIndex = Math.max(0, selectedImageIndex - 1)" class="bg-white/80 p-3 hover:bg-white"><ChevronLeft class="w-5 h-5" /></button>
            <button @click="selectedImageIndex = Math.min(allImages.length - 1, selectedImageIndex + 1)" class="bg-white/80 p-3 hover:bg-white"><ChevronRight class="w-5 h-5" /></button>
          </div>
        </div>
        <div v-if="allImages.length > 1" class="grid grid-cols-4 gap-4">
          <div
            v-for="(img, i) in allImages" :key="i"
            @click="selectedImageIndex = i"
            class="aspect-square bg-gray-50 cursor-pointer border-2 transition-colors overflow-hidden"
            :class="selectedImageIndex === i ? 'border-accent' : 'border-transparent hover:border-accent/50'"
          >
            <img :src="img" class="w-full h-full object-cover" :class="selectedImageIndex !== i ? 'opacity-60 hover:opacity-100' : ''">
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

        <p class="text-gray-500 leading-loose text-sm">{{ product.description }}</p>

        <!-- Variants (from API data) -->
        <div v-if="product.variants && product.variants.length > 0" class="space-y-8">
          <!-- Size Selector -->
          <div v-if="sizes.length" class="space-y-4">
            <span class="text-xs font-bold uppercase tracking-widest">Size: {{ selectedSize || 'Select' }}</span>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="s in sizes" :key="s"
                @click="selectedSize = s"
                class="w-12 h-12 flex items-center justify-center border text-xs font-bold transition-all"
                :class="[selectedSize === s ? 'bg-primary text-white border-primary' : 'border-gray-100 hover:border-primary']"
              >
                {{ s }}
              </button>
            </div>
          </div>

          <!-- Color Selector -->
          <div v-if="colors.length" class="space-y-4">
            <span class="text-xs font-bold uppercase tracking-widest">Color: {{ selectedColor || 'Select' }}</span>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="c in colors" :key="c"
                @click="selectedColor = c"
                class="px-5 h-10 flex items-center justify-center border text-xs font-bold transition-all"
                :class="[selectedColor === c ? 'bg-primary text-white border-primary' : 'border-gray-100 hover:border-primary']"
              >
                {{ c }}
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
            class="flex-grow bg-primary text-white h-14 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="!selectedVariant && needsSelection"
          >
            {{ !selectedVariant && needsSelection ? 'Select Size / Color' : !selectedVariant ? 'Unavailable' : 'Add to Cart' }}
          </button>
          <button
            @click="toggleWishlist"
            class="w-14 h-14 border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
            :class="[wishlistStore.isInWishlist(product.id) ? 'text-accent' : 'text-primary']"
          >
            <Heart class="w-5 h-5" :class="{'fill-current': wishlistStore.isInWishlist(product.id)}" />
          </button>
        </div>

        <!-- Extra Info -->
        <div class="pt-10 border-t border-gray-100 space-y-4">
          <div class="flex items-center text-xs uppercase font-bold tracking-widest">
            <span class="text-gray-400 w-24">SKU:</span>
            <span>{{ selectedVariant?.sku || 'SIMP-' + product.id }}</span>
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
          v-for="tab in ['description', 'additional', 'reviews']" :key="tab"
          @click="activeTab = tab"
          class="text-sm font-bold uppercase tracking-[0.2em] transition-all relative pb-2"
          :class="[activeTab === tab ? 'text-primary' : 'text-gray-400 hover:text-primary']"
        >
          {{ tab }}
          <span v-if="activeTab === tab" class="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
        </button>
      </div>
      <div class="max-w-4xl mx-auto text-gray-500 leading-loose text-sm text-center">
        <div v-if="activeTab === 'description'">{{ product.description }}</div>
        <div v-else-if="activeTab === 'additional'">No additional information available at this time.</div>
        <div v-else-if="activeTab === 'reviews'">Currently there are no reviews for this product.</div>
      </div>
    </div>
  </div>
  <div v-else-if="error" class="container py-40 text-center">
    <h2 class="text-2xl font-bold uppercase tracking-tight mb-4">Product Not Found</h2>
    <NuxtLink to="/shop" class="btn btn-outline">Back to Shop</NuxtLink>
  </div>
</template>
