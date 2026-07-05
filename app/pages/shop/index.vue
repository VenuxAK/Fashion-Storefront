<script setup lang="ts">
import { ChevronDown, Grid, List } from 'lucide-vue-next'
import { refDebounced } from '@vueuse/core'

const { getProducts, getCategories, getBrands } = useProduct()
const route = useRoute()

const currentPage = ref(parseInt(route.query.page as string) || 1)
const selectedCategory = ref(route.query.category || '')
const searchQuery = ref(route.query.search || '')
const debouncedSearchQuery = refDebounced(searchQuery, 500)
const minPrice = ref<number | null>(null)
const maxPrice = ref<number | null>(null)
const debouncedMinPrice = refDebounced(minPrice, 500)
const debouncedMaxPrice = refDebounced(maxPrice, 500)
const sortBy = ref('created_at-desc')
const viewMode = ref<'grid' | 'list'>('grid')

// Filter states
const selectedBrands = ref<number[]>([])
const selectedSizes = ref<string[]>([])
const selectedColors = ref<string[]>([])
const openCategories = ref<number[]>([])

const toggleCategory = (id: number) => {
  if (openCategories.value.includes(id)) {
    openCategories.value = openCategories.value.filter(c => c !== id)
  } else {
    openCategories.value.push(id)
  }
}


const { data: productsData, refresh: refreshProducts, pending: productsPending } = await useAsyncData(
  'shop-products', 
  () => getProducts({ 
    page: currentPage.value, 
    category_slug: selectedCategory.value,
    brand_id: selectedBrands.value.length ? selectedBrands.value.join(',') : undefined,
    search: debouncedSearchQuery.value,
    min_price: debouncedMinPrice.value,
    max_price: debouncedMaxPrice.value,
    sort: sortBy.value,
    size: selectedSizes.value.length ? selectedSizes.value.join(',') : undefined,
    color: selectedColors.value.length ? selectedColors.value.join(',') : undefined,
  }),
  { 
    watch: [currentPage, selectedCategory, selectedBrands, debouncedSearchQuery, debouncedMinPrice, debouncedMaxPrice, sortBy, selectedSizes, selectedColors],
    getCachedData: (key) => useNuxtData(key).data.value,
  }
)

const { data: categoriesData, pending: categoriesPending } = await useAsyncData('shop-categories', () => getCategories(), {
  getCachedData: (key) => useNuxtData(key).data.value,
})
const { data: brandsData, pending: brandsPending } = await useAsyncData('shop-brands', () => getBrands(), {
  getCachedData: (key) => useNuxtData(key).data.value,
})

const products = computed(() => {
  const raw = (productsData.value as any)?.data || productsData.value || []
  return Array.isArray(raw) ? raw : []
})
const categories = computed(() => {
  const raw = (categoriesData.value as any)?.data || categoriesData.value || []
  return Array.isArray(raw) ? raw : []
})
const brands = computed(() => {
  const raw = (brandsData.value as any)?.data || brandsData.value || []
  return Array.isArray(raw) ? raw : []
})
const pagination = computed(() => (productsData.value as any)?.meta || {})

const availableSizes = computed(() => {
  const sizes = new Set<string>()
  allProducts.value.forEach((p: any) =>
    p.variants?.forEach((v: any) => v.size && sizes.add(v.size))
  )
  return [...sizes].sort()
})

const availableColors = computed(() => {
  const colors = new Set<string>()
  allProducts.value.forEach((p: any) =>
    p.variants?.forEach((v: any) => v.color && colors.add(v.color))
  )
  return [...colors].sort()
})

const allProducts = ref<any[]>([])
const isLoadingMore = ref(false)
const loadedPages = ref(1)

watch(products, (next) => {
  if (currentPage.value === 1) {
    allProducts.value = [...next]
    loadedPages.value = 1
  }
}, { immediate: true })

watch([selectedCategory, selectedBrands, debouncedSearchQuery, debouncedMinPrice, debouncedMaxPrice, sortBy, selectedSizes, selectedColors], () => {
  allProducts.value = []
  loadedPages.value = 1
})

const loadMore = async () => {
  if (isLoadingMore.value || !hasMore.value) return
  isLoadingMore.value = true
  const nextPage = loadedPages.value + 1
  try {
    const params: any = {
      page: nextPage,
      category_slug: selectedCategory.value,
      brand_id: selectedBrands.value.length ? selectedBrands.value.join(',') : undefined,
      search: debouncedSearchQuery.value,
      min_price: debouncedMinPrice.value,
      max_price: debouncedMaxPrice.value,
      sort: sortBy.value,
      size: selectedSizes.value.length ? selectedSizes.value.join(',') : undefined,
      color: selectedColors.value.length ? selectedColors.value.join(',') : undefined,
    }
    const res: any = await getProducts(params)
    const newItems = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []
    if (newItems.length) {
      allProducts.value = [...allProducts.value, ...newItems]
      loadedPages.value = nextPage
    }
  } catch {} finally {
    isLoadingMore.value = false
  }
}

const hasMore = computed(() => {
  return loadedPages.value < (pagination.value.last_page || 1)
})

const setCategory = (slug: string) => {
  selectedCategory.value = slug
  currentPage.value = 1
}

useSeoMeta({
  title: 'Shop All Products | SimpCommerce',
  description: 'Browse our full collection of modern minimalist fashion essentials.',
})
</script>

<template>
  <div class="bg-[#F6F9FC] min-h-screen py-8">
    <div class="container">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar -->
        <aside class="w-full lg:w-64 shrink-0">
          <div class="bg-white rounded-xl shadow-[0_1px_3px_rgba(3,0,71,0.09)] p-5 space-y-6">
            <!-- Categories -->
            <div class="space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-2">Categories</h3>
              <ul class="space-y-2">
                <li>
                  <button 
                    @click="setCategory('')"
                    class="text-sm w-full text-left transition-colors flex items-center gap-2 group"
                    :class="[selectedCategory === '' ? 'text-rose-500 font-semibold' : 'text-gray-600 hover:text-rose-500']"
                  >
                    <span class="w-1.5 h-1.5 rounded-full transition-colors" :class="[selectedCategory === '' ? 'bg-rose-500' : 'bg-transparent group-hover:bg-rose-500/50']"></span>
                    All Products
                  </button>
                </li>
                <li v-for="cat in categories" :key="cat.id" class="space-y-1">
                  <div class="flex items-center justify-between group">
                    <button 
                      @click="setCategory(cat.slug)"
                      class="text-sm grow text-left transition-colors flex items-center gap-2"
                      :class="[selectedCategory == cat.slug ? 'text-rose-500 font-semibold' : 'text-gray-600 hover:text-rose-500']"
                    >
                      <span class="w-1.5 h-1.5 rounded-full transition-colors" :class="[selectedCategory == cat.slug ? 'bg-rose-500' : 'bg-transparent group-hover:bg-rose-500/50']"></span>
                      <span>{{ cat.name }}</span>
                    </button>
                    
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-400">({{ cat.products_count || 0 }})</span>
                      <button 
                        v-if="cat.children && cat.children.length"
                        @click="toggleCategory(cat.id)" 
                        class="p-1 hover:bg-gray-100 rounded text-gray-500 transition-transform"
                        :class="{ 'rotate-180': openCategories.includes(cat.id) }"
                      >
                        <ChevronDown class="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div 
                    v-show="openCategories.includes(cat.id)" 
                    class="pl-4 pt-1 space-y-2 overflow-hidden transition-all duration-300"
                  >
                    <button 
                      v-for="sub in cat.children" :key="sub.id"
                      @click="setCategory(sub.slug)"
                      class="text-sm w-full text-left transition-colors flex justify-between items-center group"
                      :class="[selectedCategory == sub.slug ? 'text-rose-500 font-semibold' : 'text-gray-500 hover:text-rose-500']"
                    >
                      <div class="flex items-center gap-2">
                        <span class="w-1 h-1 rounded-full bg-gray-300 transition-colors" :class="[selectedCategory == sub.slug ? 'bg-rose-500' : 'group-hover:bg-rose-400']"></span>
                        <span>{{ sub.name }}</span>
                      </div>
                      <span class="text-xs text-gray-400">({{ sub.products_count || 0 }})</span>
                    </button>
                  </div>
                </li>
              </ul>
            </div>

            <hr class="border-gray-100" />

            <!-- Brands -->
            <div class="space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-2">Brands</h3>
              <div class="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                <label v-for="brand in brands" :key="brand.id" class="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" :value="brand.id" v-model="selectedBrands" class="w-4 h-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500 cursor-pointer">
                  <span class="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{{ brand.name }}</span>
                </label>
              </div>
            </div>

            <hr class="border-gray-100" />

            <!-- Filter by Price -->
            <div class="space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-2">Price Range</h3>
              <div class="flex gap-2">
                <input 
                  v-model="minPrice" 
                  type="number" 
                  placeholder="Min ($)"
                  class="w-full text-sm border-gray-200 rounded-lg focus:ring-rose-500 focus:border-rose-500" 
                  min="0"
                >
                <input 
                  v-model="maxPrice" 
                  type="number" 
                  placeholder="Max ($)"
                  class="w-full text-sm border-gray-200 rounded-lg focus:ring-rose-500 focus:border-rose-500" 
                  min="0"
                >
              </div>
            </div>

            <!-- Size -->
            <div v-if="availableSizes.length" class="space-y-4">
              <hr class="border-gray-100" />
              <h3 class="text-sm font-bold text-gray-900 mb-2">Size</h3>
              <div class="flex flex-wrap gap-2">
                <label
                  v-for="size in availableSizes" :key="size"
                  class="flex items-center gap-2 cursor-pointer px-3 py-1.5 border rounded-md text-xs font-medium transition-colors"
                  :class="selectedSizes.includes(size) ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'"
                >
                  <input type="checkbox" :value="size" v-model="selectedSizes" class="sr-only" />
                  {{ size }}
                </label>
              </div>
            </div>

            
            <!-- Color -->
            <div v-if="availableColors.length" class="space-y-4">
              <hr v-if="availableSizes.length" class="border-gray-100" />
              <h3 class="text-sm font-bold text-gray-900 mb-2">Color</h3>
              <div class="flex flex-wrap gap-2">
                <label
                  v-for="color in availableColors" :key="color"
                  class="flex items-center gap-2 cursor-pointer px-3 py-1.5 border rounded-md text-xs font-medium transition-colors"
                  :class="selectedColors.includes(color) ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'"
                >
                  <input type="checkbox" :value="color" v-model="selectedColors" class="sr-only" />
                  {{ color }}
                </label>
              </div>
            </div>

          </div>
        </aside>

        <!-- Main Content -->
        <main class="grow space-y-6">
          <!-- Toolbar -->
          <div class="bg-white rounded-xl shadow-[0_1px_3px_rgba(3,0,71,0.09)] flex flex-col sm:flex-row justify-between items-center px-5 py-4 gap-4">
            <div class="flex items-center w-full sm:w-auto text-sm text-gray-500">
              <span class="hidden sm:inline">Showing {{ allProducts.length || 0 }} of {{ pagination.total || 0 }} results</span>
              <span class="sm:hidden">{{ pagination.total || 0 }} results</span>
            </div>

            <div class="flex items-center gap-4 w-full sm:w-auto">
              <div class="relative w-full sm:w-48">
                <input 
                  v-model="searchQuery"
                  type="text" 
                  placeholder="Search..."
                  class="w-full bg-gray-50 border border-gray-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none rounded-lg text-sm px-4 py-2 transition-all"
                >
              </div>
              
              <div class="flex items-center gap-4">
                <div class="hidden sm:flex items-center gap-2 text-gray-400">
                  <span class="text-sm">Sort by:</span>
                  <div class="relative group">
                    <select 
                      v-model="sortBy"
                      class="appearance-none bg-transparent text-sm font-medium text-gray-700 cursor-pointer hover:text-rose-500 pr-6 outline-none"
                    >
                      <option value="created_at-desc">Newest</option>
                      <option value="base_price-asc">Price: Low to High</option>
                      <option value="base_price-desc">Price: High to Low</option>
                    </select>
                    <ChevronDown class="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                  </div>
                </div>

                <div class="flex items-center gap-1 text-gray-400">
                  <button 
                    @click="viewMode = 'grid'" 
                    class="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                    :class="[viewMode === 'grid' ? 'text-rose-500 bg-rose-50' : 'text-gray-400']"
                  >
                    <Grid class="w-5 h-5" />
                  </button>
                  <button 
                    @click="viewMode = 'list'"
                    class="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                    :class="[viewMode === 'list' ? 'text-rose-500 bg-rose-50' : 'text-gray-400']"
                  >
                    <List class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Product Listing -->
          <div v-if="productsPending && products.length === 0">
            <SkeletonProductGrid :count="9" :columns="viewMode === 'grid' ? 3 : 1" />
          </div>
          <div 
            v-else-if="products.length > 0" 
            :class="[viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-6']"
          >
            <ProductCard 
              v-for="product in allProducts" 
              :key="product.id" 
              :product="product" 
              :view="viewMode"
              v-memo="[product.id, product.base_price, product.is_sale, product.is_new]"
            />
          </div>
          <div v-else class="py-20 text-center bg-white rounded-xl shadow-[0_1px_3px_rgba(3,0,71,0.09)]">
            <p class="text-gray-500 text-lg">No products found.</p>
          </div>

          <!-- Load More -->
          <div v-if="hasMore" class="flex justify-center pt-8">
            <button
              @click="loadMore"
              :disabled="isLoadingMore"
              class="btn btn-outline px-16 py-4 text-xs font-bold uppercase tracking-widest"
            >
              <span v-if="isLoadingMore" class="flex items-center gap-2">
                <span class="w-4 h-4 border-2 border-gray-400 border-t-primary rounded-full animate-spin" />
                Loading...
              </span>
              <span v-else>Load More</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
