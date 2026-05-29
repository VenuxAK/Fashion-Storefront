<script setup lang="ts">
import { ChevronDown, SlidersHorizontal, Grid, List } from 'lucide-vue-next'

const { getProducts, getCategories } = useProduct()
const route = useRoute()

const currentPage = ref(parseInt(route.query.page as string) || 1)
const selectedCategory = ref(route.query.category_id || '')
const searchQuery = ref(route.query.search || '')

const { data: productsData, refresh: refreshProducts } = await useAsyncData(
  'shop-products', 
  () => getProducts({ 
    page: currentPage.value, 
    category_id: selectedCategory.value,
    search: searchQuery.value
  }),
  { watch: [currentPage, selectedCategory, searchQuery] }
)

const { data: categoriesData } = await useAsyncData('shop-categories', () => getCategories())

const products = computed(() => productsData.value?.data || [])
const categories = computed(() => categoriesData.value?.data || [])
const pagination = computed(() => productsData.value?.meta || {})

const setCategory = (id: string | number) => {
  selectedCategory.value = id
  currentPage.value = 1
}
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

        <!-- Filter by Price (Placeholder) -->
        <div class="space-y-6">
          <h3 class="text-sm font-bold uppercase tracking-widest border-b border-gray-100 pb-4">
            Price Range
          </h3>
          <div class="space-y-4">
            <input type="range" class="w-full accent-accent" min="0" max="1000">
            <div class="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
              <span>$0</span>
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
            <button class="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-accent">
              <SlidersHorizontal class="w-4 h-4" />
              <span>Filter</span>
            </button>
            <div class="h-4 w-px bg-gray-200 hidden sm:block"></div>
            <p class="text-xs text-gray-400 uppercase tracking-widest">
              Showing {{ pagination.from }}-{{ pagination.to }} of {{ pagination.total }} results
            </p>
          </div>

          <div class="flex items-center space-x-6">
            <div class="flex items-center space-x-2">
              <button class="text-gray-400 hover:text-primary"><Grid class="w-4 h-4" /></button>
              <button class="text-gray-400 hover:text-primary"><List class="w-4 h-4" /></button>
            </div>
            <div class="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-500 cursor-pointer hover:text-accent">
              <span>Sort By Default</span>
              <ChevronDown class="w-4 h-4" />
            </div>
          </div>
        </div>

        <!-- Product Grid -->
        <div v-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <ProductCard 
            v-for="product in products" 
            :key="product.id" 
            :product="product" 
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
