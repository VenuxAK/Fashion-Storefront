<script setup lang="ts">
import { X, Heart, ShoppingBag, Plus, Minus, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useWishlistStore } from '~/stores/wishlist'
import { useUiStore } from '~/stores/ui'
import { useNotify } from '~/composables/useNotify'

const uiStore = useUiStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const { notify } = useNotify()
const { url } = useMedia()
const { getProductBySlug } = useProduct()

const product = ref<any>(null)
const loading = ref(false)
const quantity = ref(1)
const selectedImageIndex = ref(0)

// Watch for quickViewProduct changes and fetch full product data
watch(() => uiStore.quickViewProduct, async (newProduct) => {
  if (!newProduct) {
    product.value = null
    return
  }

  // Reset selections
  quantity.value = 1
  selectedSize.value = ''
  selectedColor.value = ''
  selectedImageIndex.value = 0

  // If we already have full data (variants present), use it directly
  if (newProduct.variants && newProduct.variants.length > 0) {
    product.value = newProduct
    return
  }

  // Otherwise, fetch the full product by slug
  loading.value = true
  try {
    const response: any = await getProductBySlug(newProduct.slug)
    product.value = response.data || response
  } catch {
    product.value = newProduct
  } finally {
    loading.value = false
  }
}, { immediate: true })

// Gallery images
const allImages = computed<string[]>(() => {
  const imgs: string[] = []
  if (product.value?.image_url || product.value?.image) imgs.push(url(product.value.image_url || product.value.image))
  const rawVariants = Array.isArray(product.value?.variants) ? product.value.variants : []
  rawVariants.forEach((v: any) => {
    const img = v.image_url || v.image ? url(v.image_url || v.image) : null
    if (img && !imgs.includes(img)) imgs.push(img)
  })
  return imgs.length ? imgs : ['https://placehold.co/800x1000/eee/999?text=No+Image']
})

const selectedImage = computed(() => allImages.value[selectedImageIndex.value] || allImages.value[0])

const {
  selectedSize, selectedColor,
  sizes, colors, needsSelection,
  selectedVariant, inStock,
  adjustedPrice: price,
} = useVariantSelector(
  computed(() => Array.isArray(product.value?.variants) ? product.value.variants : []),
  computed(() => product.value?.base_price || 0)
)

const increment = () => quantity.value++
const decrement = () => quantity.value > 1 && quantity.value--

const addToCart = async () => {
  if (!product.value || !selectedVariant.value) return
  try {
    await cartStore.addToCart(product.value, selectedVariant.value, quantity.value)
    notify(`Added ${quantity.value} ${product.value.name} to cart.`, 'success')
    uiStore.closeQuickView()
  } catch (err: any) {
    notify(err.message || 'Failed to add to cart.', 'error')
  }
}

const toggleWishlist = () => {
  if (!product.value) return
  const wasInWishlist = wishlistStore.isInWishlist(product.value.id)
  wishlistStore.toggleWishlist({
    id: product.value.id,
    name: product.value.name,
    slug: product.value.slug,
    price: price.value,
    image: product.value.image,
    category: product.value.category?.name
  })
  const action = wasInWishlist ? 'removed from' : 'added to'
  notify(`Product ${action} wishlist.`, 'success')
}

const goToProduct = () => {
  if (!product.value) return
  uiStore.closeQuickView()
  navigateTo(`/products/${product.value.slug}`)
}

// Close on escape key
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') uiStore.closeQuickView()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="uiStore.quickViewProduct" class="fixed inset-0 z-80 flex items-center justify-center p-4 md:p-8">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="uiStore.closeQuickView()"></div>

        <!-- Modal -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div v-if="uiStore.quickViewProduct"
            class="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10 shadow-2xl"
          >
            <!-- Close Button -->
            <button
              @click="uiStore.closeQuickView()"
              class="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X class="w-5 h-5" />
            </button>

            <!-- Loading State -->
            <div v-if="loading" class="flex items-center justify-center py-32">
              <div class="inline-flex flex-col items-center gap-3">
                <div class="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Loading product...</span>
              </div>
            </div>

            <!-- Content -->
            <div v-else-if="product" class="grid grid-cols-1 md:grid-cols-2">
              <!-- Image Gallery -->
              <div class="relative bg-gray-50">
                <div class="aspect-square flex items-center justify-center overflow-hidden">
                  <NuxtImg
                    :src="selectedImage"
                    :alt="product.name"
                    format="webp"
                    loading="eager"
                    fetchpriority="high"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    class="w-full h-full object-cover"
                  />
                </div>

                <!-- Nav arrows -->
                <div v-if="allImages.length > 1" class="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
                  <button
                    @click="selectedImageIndex = Math.max(0, selectedImageIndex - 1)"
                    class="pointer-events-auto w-8 h-8 bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                    :class="{ 'opacity-30 cursor-not-allowed': selectedImageIndex === 0 }"
                  >
                    <ChevronLeft class="w-4 h-4" />
                  </button>
                  <button
                    @click="selectedImageIndex = Math.min(allImages.length - 1, selectedImageIndex + 1)"
                    class="pointer-events-auto w-8 h-8 bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                    :class="{ 'opacity-30 cursor-not-allowed': selectedImageIndex === allImages.length - 1 }"
                  >
                    <ChevronRight class="w-4 h-4" />
                  </button>
                </div>

                <!-- Thumbnails -->
                <div v-if="allImages.length > 1" class="flex gap-2 p-3">
                  <div
                    v-for="(img, i) in allImages" :key="i"
                    @click="selectedImageIndex = i"
                    class="w-14 h-14 bg-white cursor-pointer border-2 transition-colors overflow-hidden shrink-0"
                    :class="selectedImageIndex === i ? 'border-accent' : 'border-transparent hover:border-accent/50'"
                  >
                    <NuxtImg :src="img" format="webp" loading="lazy" fetchpriority="low" sizes="56px" class="w-full h-full object-cover" :class="selectedImageIndex !== i ? 'opacity-60 hover:opacity-100' : ''" />
                  </div>
                </div>
              </div>

              <!-- Product Info -->
              <div class="p-8 md:p-10 space-y-6 flex flex-col">
                <!-- Category & Name -->
                <div class="space-y-2">
                  <p v-if="product.category" class="text-[10px] text-accent font-bold uppercase tracking-[0.4em]">{{ product.category.name }}</p>
                  <h2 class="text-2xl font-bold uppercase tracking-tight leading-tight">{{ product.name }}</h2>
                  <span class="text-xl font-bold">${{ price.toFixed(2) }}</span>
                </div>

                <!-- Description -->
                <p v-if="product.description" class="text-gray-500 text-sm leading-relaxed line-clamp-3">
                  {{ product.description }}
                </p>

                <!-- Variants -->
                <div v-if="product.variants && product.variants.length > 0" class="space-y-5">
                  <!-- Size Selector -->
                  <div v-if="sizes.length" class="space-y-3">
                    <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Size: <span class="text-primary">{{ selectedSize || '—' }}</span>
                    </span>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="s in sizes" :key="s"
                        @click="selectedSize = s"
                        class="w-11 h-11 flex items-center justify-center border text-xs font-bold transition-all"
                        :class="[selectedSize === s ? 'bg-primary text-white border-primary' : 'border-gray-100 hover:border-primary']"
                      >
                        {{ s }}
                      </button>
                    </div>
                  </div>

                  <!-- Color Selector -->
                  <div v-if="colors.length" class="space-y-3">
                    <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Color: <span class="text-primary">{{ selectedColor || '—' }}</span>
                    </span>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="c in colors" :key="c"
                        @click="selectedColor = c"
                        class="px-4 h-10 flex items-center justify-center border text-xs font-bold transition-all"
                        :class="[selectedColor === c ? 'bg-primary text-white border-primary' : 'border-gray-100 hover:border-primary']"
                      >
                        {{ c }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Stock indicator -->
                <div v-if="selectedVariant" class="text-[10px] font-bold uppercase tracking-widest">
                  <span v-if="selectedVariant?.stock_quantity! > 0" class="text-green-600">
                    {{ selectedVariant?.stock_quantity }} in stock
                  </span>
                  <span v-else class="text-red-500">Out of stock</span>
                </div>

                <!-- Add to Cart -->
                <div class="flex gap-3 mt-auto pt-4">
                  <div class="flex items-center border border-gray-100 h-12 shrink-0">
                    <button @click="decrement" class="px-3 hover:text-accent transition-colors"><Minus class="w-3.5 h-3.5" /></button>
                    <span class="w-8 text-center text-sm font-bold">{{ quantity }}</span>
                    <button @click="increment" class="px-3 hover:text-accent transition-colors"><Plus class="w-3.5 h-3.5" /></button>
                  </div>
                  <button
                    @click="addToCart"
                    class="grow bg-primary text-white h-12 text-xs font-bold uppercase tracking-[0.15em] hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    :disabled="!inStock"
                  >
                    <ShoppingBag class="w-4 h-4" />
                    {{ !selectedVariant ? 'Select Options' : !inStock ? 'Out of Stock' : 'Add to Cart' }}
                  </button>
                  <button
                    @click="toggleWishlist"
                    class="w-12 h-12 border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
                    :class="[wishlistStore.isInWishlist(product.id) ? 'text-accent' : 'text-primary']"
                  >
                    <Heart class="w-4 h-4" :class="{'fill-current': wishlistStore.isInWishlist(product.id)}" />
                  </button>
                </div>

                <!-- View Full Details -->
                <button
                  @click="goToProduct"
                  class="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors flex items-center gap-1.5 self-start"
                >
                  View Full Details
                  <ExternalLink class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
