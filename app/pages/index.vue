<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

const { getProducts, getCategories } = useProduct()

const { data: productsData } = await useAsyncData('featured-products', () => 
  getProducts({ limit: 4 })
)

const { data: categoriesData } = await useAsyncData('categories', () => 
  getCategories()
)

const featuredProducts = computed(() => productsData.value?.data || [])
const categories = computed(() => categoriesData.value?.data || [])
</script>

<template>
  <div class="space-y-32 pb-32">
    <!-- Hero Slider -->
    <section class="relative h-[90vh] overflow-hidden bg-gray-50">
      <div class="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop" 
          alt="Hero" 
          class="w-full h-full object-cover opacity-90"
        >
        <!-- Subtle overlay for readability -->
        <div class="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent"></div>
      </div>
      <div class="container h-full flex items-center relative z-10">
        <div class="max-w-2xl space-y-8">
          <span class="text-xs font-bold uppercase tracking-[0.4em] text-accent">Summer Collection 2026</span>
          <h1 class="text-6xl md:text-8xl font-bold tracking-tighter leading-none text-primary">
            Style <br> Reimagined
          </h1>
          <p class="text-lg text-black max-w-md leading-relaxed font-medium">
            Discover our new collection featuring sustainable materials and timeless silhouettes designed for the modern individual.
          </p>
          <div class="flex space-x-4">
            <NuxtLink to="/shop" class="btn btn-primary px-10 py-4 uppercase text-xs tracking-widest font-bold">
              Shop Now
            </NuxtLink>
            <NuxtLink to="/about" class="btn btn-outline px-10 py-4 uppercase text-xs tracking-widest font-bold">
              Our Story
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Grid -->
    <section class="container">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <NuxtLink 
          v-for="cat in categories" 
          :key="cat.name" 
          to="/shop" 
          class="group relative aspect-[4/5] overflow-hidden bg-gray-100"
        >
          <img 
            :src="cat.image" 
            :alt="cat.name" 
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          >
          <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
          <div class="absolute bottom-10 left-10 text-white space-y-2">
            <h3 class="text-3xl font-bold uppercase tracking-tight">{{ cat.name }}</h3>
            <div class="flex items-center space-x-2 text-xs uppercase tracking-widest font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <span>View Collection</span>
              <ArrowRight class="w-4 h-4" />
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="container">
      <div class="flex flex-col md:flex-row justify-between items-end mb-16 space-y-4 md:space-y-0">
        <div class="space-y-4">
          <span class="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">Selection</span>
          <h2 class="text-4xl font-bold tracking-tight uppercase">Featured Products</h2>
        </div>
        <NuxtLink to="/shop" class="text-xs font-bold uppercase tracking-widest border-b-2 border-primary pb-1 hover:text-accent hover:border-accent transition-all">
          View All Products
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <ProductCard 
          v-for="product in featuredProducts" 
          :key="product.id" 
          :product="product" 
        />
      </div>
    </section>

    <!-- Promo Banner -->
    <section class="bg-gray-50 py-32 overflow-hidden">
      <div class="container grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div class="space-y-8">
          <h2 class="text-5xl font-bold tracking-tighter leading-none uppercase">
            Join the <br> Movement
          </h2>
          <p class="text-gray-500 leading-loose">
            Sign up for our newsletter and get 15% off your first order. Be the first to know about new arrivals, limited editions, and exclusive events.
          </p>
          <form @submit.prevent class="flex max-w-md">
            <input 
              type="email" 
              placeholder="Enter your email" 
              class="flex-grow bg-white border-none px-6 py-4 text-sm focus:ring-1 focus:ring-accent outline-none shadow-sm"
            >
            <button type="submit" class="bg-primary text-white px-8 py-4 text-xs uppercase font-bold tracking-widest hover:bg-black transition-colors">
              Subscribe
            </button>
          </form>
        </div>
        <div class="relative">
          <img 
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop" 
            alt="Promo" 
            class="w-full aspect-video object-cover shadow-2xl"
          >
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-accent rounded-full flex items-center justify-center text-white rotate-12 shadow-xl">
            <div class="text-center">
              <span class="block text-3xl font-bold">15%</span>
              <span class="text-[10px] uppercase font-bold tracking-widest">Off First Order</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
