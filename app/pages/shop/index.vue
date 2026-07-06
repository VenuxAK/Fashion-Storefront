<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import { ChevronDown, ChevronLeft, ChevronRight, Grid, List, SlidersHorizontal, X } from 'lucide-vue-next'

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
const showMobileFilters = ref(false)

const toggleCategory = (id: number) => {
  if (openCategories.value.includes(id)) {
    openCategories.value = openCategories.value.filter(c => c !== id)
  } else {
    openCategories.value.push(id)
  }
}


const productsData = ref<any>(null)
const productsPending = ref(true)
const routeKey = ref(Date.now())

const buildParams = () => {
  const params: any = {
    page: currentPage.value,
    sort: sortBy.value,
  }
  if (selectedCategory.value) params.category_slug = selectedCategory.value
  if (selectedBrands.value.length) params.brand_id = selectedBrands.value.join(',')
  if (debouncedSearchQuery.value) params.search = debouncedSearchQuery.value
  if (debouncedMinPrice.value !== null) params.min_price = debouncedMinPrice.value
  if (debouncedMaxPrice.value !== null) params.max_price = debouncedMaxPrice.value
  if (selectedSizes.value.length) params.size = selectedSizes.value.join(',')
  if (selectedColors.value.length) params.color = selectedColors.value.join(',')
  return params
}

const fetchProducts = async () => {
  productsPending.value = true
  try {
    const res = await getProducts(buildParams())
    productsData.value = res
  } catch {
    productsData.value = null
  } finally {
    productsPending.value = false
  }
}

await fetchProducts()

watch(
  [currentPage, selectedCategory, selectedBrands, debouncedSearchQuery, debouncedMinPrice, debouncedMaxPrice, sortBy, selectedSizes, selectedColors],
  () => { fetchProducts() }
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
const paginationLinks = computed(() => (productsData.value as any)?.links || {})

const availableSizes = computed(() => {
  const sizes = new Set<string>()
  products.value.forEach((p: any) =>
    p.variants?.forEach((v: any) => v.size && sizes.add(v.size))
  )
  return [...sizes].sort()
})

const availableColors = computed(() => {
  const colors = new Set<string>()
  products.value.forEach((p: any) =>
    p.variants?.forEach((v: any) => v.color && colors.add(v.color))
  )
  return [...colors].sort()
})

onMounted(() => {
  if (products.value.length === 0) {
    fetchProducts()
  }
})

const initialProducts = (productsData.value as any)?.data || productsData.value
const maxValidPage = ref(Array.isArray(initialProducts) && initialProducts.length > 0 ? currentPage.value : 1)

watch(products, (next) => {
  if (Array.isArray(next)) {
    if (next.length > 0 && currentPage.value > maxValidPage.value) {
      maxValidPage.value = currentPage.value
    }
    if (next.length === 0 && currentPage.value > maxValidPage.value && currentPage.value > 1) {
      currentPage.value = maxValidPage.value || 1
    }
  }
}, { immediate: true })

const hasPrevPage = computed(() => currentPage.value > 1)
const hasNextPage = computed(() => {
  if (currentPage.value < maxValidPage.value) return true
  return !!paginationLinks.value.next
})

const pageNumbers = computed(() => {
  const pages: number[] = []
  const current = currentPage.value
  const start = Math.max(1, current - 2)
  const end = Math.min(maxValidPage.value, current + 2)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const goToPage = (page: number) => {
  if (page < 1) return
  if (page > maxValidPage.value && !paginationLinks.value.next) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

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
        <!-- Sidebar backdrop (mobile only) -->
        <Transition
          enter-active-class="transition-opacity duration-200"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="showMobileFilters"
            class="fixed inset-0 bg-black/50 z-50 lg:hidden"
            @click="showMobileFilters = false"
          />
        </Transition>

        <!-- Sidebar -->
        <aside
          class="fixed inset-y-0 left-0 z-60 w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 overflow-y-auto lg:static lg:inset-auto lg:z-auto lg:w-64 lg:shadow-none lg:transform-none lg:overflow-y-visible"
          :class="showMobileFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
        >
          <div class="bg-white rounded-xl shadow-[0_1px_3px_rgba(3,0,71,0.09)] p-5 space-y-6 min-h-full lg:min-h-0">
            <!-- Mobile header -->
            <div class="flex items-center justify-between lg:hidden">
              <span class="text-sm font-bold uppercase tracking-widest">Filters</span>
              <button @click="showMobileFilters = false" class="p-1 hover:text-rose-500 transition-colors">
                <X class="w-5 h-5" />
              </button>
            </div>
            <hr class="border-gray-100 lg:hidden" />

            <!-- Categories -->
            <div class="space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-2">Categories</h3>
              <ul class="space-y-2">
                <li>
                  <button 
                    @click="setCategory(''); showMobileFilters = false"
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
                      @click="setCategory(cat.slug); showMobileFilters = false"
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
                      @click="setCategory(sub.slug); showMobileFilters = false"
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
              <hr class="border-gray-100" />
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
            <div class="flex items-center gap-3 w-full sm:w-auto text-sm text-gray-500">
              <button
                @click="showMobileFilters = true"
                class="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest border border-gray-200 rounded-lg hover:border-rose-500 hover:text-rose-500 transition-colors"
              >
                <SlidersHorizontal class="w-3.5 h-3.5" />
                Filters
              </button>
              <span class="text-sm">Page {{ currentPage }}</span>
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
          <template v-else-if="products.length > 0">
            <!-- Top Pagination -->
            <div class="flex items-center justify-between bg-white rounded-xl shadow-[0_1px_3px_rgba(3,0,71,0.09)] px-5 py-3">
              <span class="text-xs text-gray-500 font-medium">Page {{ currentPage }}</span>
              <div class="flex items-center gap-1">
                <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="!hasPrevPage"
                  class="flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors rounded-md"
                  :class="hasPrevPage ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'"
                >
                  <ChevronLeft class="w-3.5 h-3.5" />
                  <span class="hidden sm:inline">Previous</span>
                </button>

                <button
                  v-for="page in pageNumbers"
                  :key="page"
                  @click="goToPage(page)"
                  class="w-8 h-8 flex items-center justify-center text-xs font-bold rounded-md transition-colors select-none"
                  :class="page === currentPage ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'"
                >
                  {{ page }}
                </button>

                <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="!hasNextPage"
                  class="flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors rounded-md min-w-24 justify-center"
                  :class="hasNextPage ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'"
                >
                  <span class="hidden sm:inline">Next</span>
                  <ChevronRight class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div 
              :class="[viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-6']"
            >
              <ProductCard 
                v-for="product in products" 
                :key="product.id" 
                :product="product" 
                :view="viewMode"
                v-memo="[product.id, product.base_price, product.is_sale, product.is_new]"
              />
            </div>

            <!-- Bottom Pagination -->
            <div class="flex items-center justify-between bg-white rounded-xl shadow-[0_1px_3px_rgba(3,0,71,0.09)] px-5 py-3">
              <span class="text-xs text-gray-500 font-medium">Page {{ currentPage }}</span>
              <div class="flex items-center gap-1">
                <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="!hasPrevPage"
                  class="flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors rounded-md min-w-24 justify-center"
                  :class="hasPrevPage ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'"
                >
                  <ChevronLeft class="w-3.5 h-3.5" />
                  <span class="hidden sm:inline">Previous</span>
                </button>

                <button
                  v-for="page in pageNumbers"
                  :key="page"
                  @click="goToPage(page)"
                  class="w-8 h-8 flex items-center justify-center text-xs font-bold rounded-md transition-colors select-none"
                  :class="page === currentPage ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'"
                >
                  {{ page }}
                </button>

                <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="!hasNextPage"
                  class="flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors rounded-md min-w-24 justify-center"
                  :class="hasNextPage ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'"
                >
                  <span class="hidden sm:inline">Next</span>
                  <ChevronRight class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </template>
          <div v-else class="py-20 text-center bg-white rounded-xl shadow-[0_1px_3px_rgba(3,0,71,0.09)]">
            <p class="text-gray-500 text-lg">No products found.</p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
