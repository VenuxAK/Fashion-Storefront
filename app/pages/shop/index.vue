<script setup lang="ts">
import { ChevronDown, Grid, List } from 'lucide-vue-next'
import { refDebounced } from '@vueuse/core'

const { getProducts, getCategories, getBrands } = useProduct()
const route = useRoute()

const currentPage = ref(parseInt(route.query.page as string) || 1)
const selectedCategory = ref(route.query.category || '')
const searchQuery = ref(route.query.search || '')
const debouncedSearchQuery = refDebounced(searchQuery, 500)
const priceRange = ref(1000)
const debouncedPriceRange = refDebounced(priceRange, 500)
const sortBy = ref('created_at-desc')
const viewMode = ref<'grid' | 'list'>('grid')

// Filter states
const selectedBrands = ref<number[]>([])
const openCategories = ref<number[]>([])

const toggleCategory = (id: number) => {
  if (openCategories.value.includes(id)) {
    openCategories.value = openCategories.value.filter(c => c !== id)
  } else {
    openCategories.value.push(id)
  }
}


const { data: productsData, refresh: refreshProducts } = await useAsyncData(
  'shop-products', 
  () => getProducts({ 
    page: currentPage.value, 
    category_slug: selectedCategory.value,
    brand_id: selectedBrands.value.length ? selectedBrands.value.join(',') : undefined,
    search: debouncedSearchQuery.value,
    max_price: debouncedPriceRange.value,
    sort: sortBy.value
  }),
  { watch: [currentPage, selectedCategory, selectedBrands, debouncedSearchQuery, debouncedPriceRange, sortBy] }
)

const { data: categoriesData } = await useAsyncData('shop-categories', () => getCategories())
const { data: brandsData } = await useAsyncData('shop-brands', () => getBrands())

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
                  <!-- Parent Category -->
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

                  <!-- Sub Categories (Accordion) -->
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

            <!-- Filter by Price -->
            <div class="space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-2">Price Range</h3>
              <div class="space-y-4">
                <input 
                  v-model="priceRange" 
                  type="range" 
                  class="w-full accent-rose-500 cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none" 
                  min="0" 
                  max="1000"
                  step="10"
                >
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-500 font-medium">$0</span>
                  <span class="text-rose-500 font-bold">${{ priceRange }}</span>
                  <span class="text-gray-500 font-medium">$1000</span>
                </div>
              </div>
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


          </div>
        </aside>

        <!-- Main Content -->
        <main class="grow space-y-6">
          <!-- Toolbar -->
          <div class="bg-white rounded-xl shadow-[0_1px_3px_rgba(3,0,71,0.09)] flex flex-col sm:flex-row justify-between items-center px-5 py-4 gap-4">
            <div class="flex items-center w-full sm:w-auto text-sm text-gray-500">
              <span class="hidden sm:inline">Showing {{ pagination.from || 0 }}-{{ pagination.to || 0 }} of {{ pagination.total || 0 }} results</span>
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
          <div 
            v-if="products.length > 0" 
            :class="[viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-6']"
          >
            <ProductCard 
              v-for="product in products" 
              :key="product.id" 
              :product="product" 
              :view="viewMode"
            />
          </div>
          <div v-else class="py-20 text-center bg-white rounded-xl shadow-[0_1px_3px_rgba(3,0,71,0.09)]">
            <p class="text-gray-500 text-lg">No products found.</p>
          </div>

          <!-- Pagination -->
          <div v-if="pagination.last_page > 1" class="flex justify-center gap-2 pt-6">
            <button 
              v-for="page in pagination.last_page" 
              :key="page"
              @click="currentPage = page"
              class="w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all"
              :class="[currentPage === page ? 'bg-rose-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-rose-500 hover:text-rose-500']"
            >
              {{ page }}
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
