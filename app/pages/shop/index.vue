<script setup lang="ts">
import { ChevronDown, SlidersHorizontal, Grid, List } from 'lucide-vue-next'

const { getProducts, getCategories } = useProduct()
const route = useRoute()

const currentPage = ref(parseInt(route.query.page as string) || 1)
const selectedCategory = ref(route.query.category_id || '')
const searchQuery = ref(route.query.search || '')
const priceRange = ref(1000)
const sortBy = ref('created_at-desc')
const viewMode = ref<'grid' | 'list'>('grid')

const { data: productsData, refresh: refreshProducts } = await useAsyncData(
  'shop-products', 
  () => getProducts({ 
    page: currentPage.value, 
    category_id: selectedCategory.value,
    search: searchQuery.value,
    max_price: priceRange.value,
    sort: sortBy.value
  }),
  { watch: [currentPage, selectedCategory, searchQuery, priceRange, sortBy] }
)

const { data: categoriesData } = await useAsyncData('shop-categories', () => getCategories())

const products = computed(() => productsData.value?.data || [])
const categories = computed(() => categoriesData.value?.data || [])
const pagination = computed(() => productsData.value?.meta || {})

const setCategory = (id: string | number) => {
  selectedCategory.value = id
  currentPage.value = 1
}

useSeoMeta({
  title: 'Shop All Products | SimpCommerce',
  description: 'Browse our full collection of modern minimalist fashion essentials.',
})
</script>

<template>
  <div class="container py-20">
    <div class="flex flex-col lg:flex-row gap-16">
      <!-- Sidebar -->
      <aside class="w-full lg:w-64 space-y-12">
        <!-- Categories -->
        <div class="space-y-6">
          <h3 class="text-sm font-bold uppercase tracking-widest border-b border-gray-100 pb-4">
            Categories
          </h3>
          <ul class="space-y-4">
            <li>
              <button 
                @click="setCategory('')"
                class="text-sm uppercase tracking-widest transition-colors"
                :class="[selectedCategory === '' ? 'text-accent font-bold' : 'text-gray-500 hover:text-accent']"
              >
                All Products
              </button>
            </li>
            <li v-for="cat in categories" :key="cat.id">
              <button 
                @click="setCategory(cat.id)"
                class="text-sm uppercase tracking-widest transition-colors flex justify-between w-full"
                :class="[selectedCategory == cat.id ? 'text-accent font-bold' : 'text-gray-500 hover:text-accent']"
              >
                <span>{{ cat.name }}</span>
                <span class="text-[10px] text-gray-300">({{ cat.products_count || 0 }})</span>
              </button>
            </li>
          </ul>
        </div>

        <!-- Filter by Price -->
        <div class="space-y-6">
          <h3 class="text-sm font-bold uppercase tracking-widest border-b border-gray-100 pb-4">
            Price Range
          </h3>
          <div class="space-y-4">
            <input 
              v-model="priceRange" 
              type="range" 
              class="w-full accent-accent cursor-pointer" 
              min="0" 
              max="1000"
              step="10"
            >
            <div class="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
              <span>$0</span>
              <span class="text-primary">${{ priceRange }}</span>
              <span>$1000</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-grow space-y-12">
        <!-- Toolbar -->
        <div class="flex flex-col sm:flex-row justify-between items-center bg-gray-50 px-6 py-4 space-y-4 sm:space-y-0">
          <div class="flex items-center space-x-4">
            <div class="relative group">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search products..."
                class="bg-transparent border-b border-gray-200 focus:border-accent outline-none text-xs py-1 transition-all w-32 md:w-48"
              >
            </div>
            <div class="h-4 w-px bg-gray-200 hidden sm:block"></div>
            <p class="text-xs text-gray-400 uppercase tracking-widest">
              Showing {{ pagination.from || 0 }}-{{ pagination.to || 0 }} of {{ pagination.total || 0 }} results
            </p>
          </div>

          <div class="flex items-center space-x-6">
            <div class="flex items-center space-x-2">
              <button 
                @click="viewMode = 'grid'" 
                :class="[viewMode === 'grid' ? 'text-primary' : 'text-gray-300']"
              >
                <Grid class="w-4 h-4" />
              </button>
              <button 
                @click="viewMode = 'list'"
                :class="[viewMode === 'list' ? 'text-primary' : 'text-gray-300']"
              >
                <List class="w-4 h-4" />
              </button>
            </div>
            
            <div class="relative group">
              <select 
                v-model="sortBy"
                class="appearance-none bg-transparent text-[10px] font-bold uppercase tracking-widest text-gray-500 cursor-pointer hover:text-accent pr-6 outline-none"
              >
                <option value="created_at-desc">Newest</option>
                <option value="base_price-asc">Price: Low-High</option>
                <option value="base_price-desc">Price: High-Low</option>
              </select>
              <ChevronDown class="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>
        </div>

        <!-- Product Listing -->
        <div 
          v-if="products.length > 0" 
          :class="[viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10' : 'flex flex-col gap-12']"
        >
          <ProductCard 
            v-for="product in products" 
            :key="product.id" 
            :product="product" 
            :view="viewMode"
          />
        </div>
        <div v-else class="py-20 text-center">
          <p class="text-gray-500 uppercase tracking-widest">No products found.</p>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.last_page > 1" class="flex justify-center space-x-2 pt-10">
          <button 
            v-for="page in pagination.last_page" 
            :key="page"
            @click="currentPage = page"
            class="w-10 h-10 flex items-center justify-center border text-xs font-bold transition-all"
            :class="[currentPage === page ? 'bg-primary text-white border-primary' : 'border-gray-100 hover:border-primary text-gray-500']"
          >
            {{ page }}
          </button>
        </div>
      </main>
    </div>
  </div>
</template>
