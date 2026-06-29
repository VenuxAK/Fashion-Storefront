<script setup lang="ts">
import { X, Search, ArrowRight } from 'lucide-vue-next'
import { useUiStore } from '~/stores/ui'
import { useProduct } from '~/composables/useProduct'

const uiStore = useUiStore()
const { getProducts } = useProduct()

const query = ref('')
const results = ref([])
const isLoading = ref(false)

const handleSearch = async () => {
  if (query.value.length < 2) {
    results.value = []
    return
  }

  isLoading.value = true
  try {
    const response: any = await getProducts({ search: query.value, limit: 5 })
    results.value = response.data
  } catch (error) {
    console.error('Search failed', error)
  } finally {
    isLoading.value = false
  }
}

// Debounced search
watch(query, (newQuery, _, onCleanup) => {
  const timer = setTimeout(() => {
    handleSearch()
  }, 300)
  onCleanup(() => clearTimeout(timer))
})

const close = () => {
  uiStore.isSearchOpen = false
  query.value = ''
  results.value = []
}

const { url } = useImage()
const getImageUrl = (image: string) => url(image)
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
      <div v-if="uiStore.isSearchOpen" class="fixed inset-0 bg-white z-150 flex flex-col">
        <!-- Close Button -->
        <button @click="close" class="absolute top-10 right-10 hover:text-accent transition-colors p-2">
          <X class="w-8 h-8" />
        </button>

        <div class="container mt-32 max-w-4xl mx-auto space-y-12">
          <!-- Input -->
          <div class="relative">
            <Search class="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-300" />
            <input 
              v-model="query"
              type="text" 
              placeholder="Search for products..."
              class="w-full border-b-2 border-gray-100 focus:border-primary outline-none py-6 pl-16 text-3xl md:text-5xl font-bold tracking-tighter uppercase transition-all"
              autoFocus
            >
          </div>

          <!-- Results -->
          <div class="space-y-8 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
            <div v-if="isLoading" class="text-center py-10 uppercase tracking-widest text-xs font-bold text-gray-400">
              Searching...
            </div>
            
            <div v-else-if="results.length > 0" class="space-y-6">
              <NuxtLink 
                v-for="product in results" 
                :key="product.id"
                :to="`/products/${product.slug}`"
                @click="close"
                class="flex items-center justify-between group p-4 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center space-x-6">
                  <div class="w-16 h-20 bg-gray-50 shrink-0">
                    <img :src="getImageUrl(product.image)" class="w-full h-full object-cover">
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm font-bold uppercase tracking-tight">{{ product.name }}</p>
                    <p class="text-xs text-gray-400 uppercase tracking-widest">{{ product.category?.name }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <p class="text-sm font-bold">${{ parseFloat(String(product.base_price)).toFixed(2) }}</p>
                  <ArrowRight class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </NuxtLink>
            </div>

            <div v-else-if="query.length >= 2" class="text-center py-10">
              <p class="text-gray-400 uppercase tracking-widest text-xs font-bold">No results found for "{{ query }}"</p>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="pt-8 border-t border-gray-100">
            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Popular Categories</p>
            <div class="flex flex-wrap gap-4">
              <NuxtLink 
                v-for="cat in ['Men', 'Women', 'Accessories', 'Shoes']" 
                :key="cat"
                to="/shop"
                @click="close"
                class="px-6 py-2 border border-gray-100 text-[10px] font-bold uppercase tracking-widest hover:border-primary transition-all"
              >
                {{ cat }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #333;
}
</style>
