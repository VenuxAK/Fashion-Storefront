<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay as SwiperAutoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'

definePageMeta({
  middleware: [
    function (to, from) {
      return navigateTo('/shop')
    }
  ]
})

const { getProducts, getCategories, getBrands } = useProduct()

const { data: productsData, pending: productsPending } = await useAsyncData('products', () => getProducts({ limit: 8 }), {
  getCachedData: (key) => useNuxtData(key).data.value,
})
const { data: categoriesData, pending: categoriesPending } = await useAsyncData('categories', () => getCategories(), {
  getCachedData: (key) => useNuxtData(key).data.value,
})
const { data: brandsData, pending: brandsPending } = await useAsyncData('brands', () => getBrands(), {
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

const childCategories = computed(() => {
  const allCategories = categories.value || []
  const placeholders = [
    'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=400&auto=format&fit=crop', // Men
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop', // Women
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop', // Accessories
    'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=400&auto=format&fit=crop', // Shoes
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=400&auto=format&fit=crop'  // Bags
  ]
  return allCategories.map((cat: any, index: number) => ({
    ...cat,
    image: cat.image_url || placeholders[index % placeholders.length]
  }))
})

const brands = computed(() => {
  const raw = (brandsData.value as any)?.data || brandsData.value || []
  return Array.isArray(raw) ? raw : []
})

useSeoMeta({
  title: 'Home | Bazaar Fashion Clone',
})
</script>

<template>
  <div class="space-y-20 pb-32">
    <!-- Hero Slider -->
    <section class="relative h-screen overflow-hidden bg-gray-50">
      <div class="absolute inset-0">
        <NuxtImg 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop" 
          alt="Hero" 
          format="webp"
          loading="eager"
          fetchpriority="high"
          :preload="{ fetchPriority: 'high' }"
          sizes="100vw"
          class="w-full h-full object-cover opacity-90"
        />
        <!-- Subtle overlay for readability -->
        <div class="absolute inset-0 bg-linear-to-r from-white/40 to-transparent"></div>
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
            <NuxtLink to="/about" class="btn border-2 border-black px-10 py-4 uppercase text-xs tracking-widest font-bold hover:bg-black hover:text-white transition-colors">
              Our Story
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

 <!-- 6. Top Brands -->
    <section class="container space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">Top Brands</h2>
        <NuxtLink to="/brands" class="text-sm font-semibold text-gray-600 hover:text-primary transition-colors flex items-center">
          View All <ArrowRight class="w-4 h-4 ml-1" />
        </NuxtLink>
      </div>
      <ClientOnly>
        <Swiper
          :modules="[SwiperAutoplay]"
          :slides-per-view="2"
          :space-between="16"
          :breakpoints="{
            '640': { slidesPerView: 3 },
            '768': { slidesPerView: 4 },
            '1024': { slidesPerView: 5 },
            '1280': { slidesPerView: 6 },
          }"
          :loop="brands.length >= 12"
          :autoplay="{ delay: 2500, disableOnInteraction: false }"
          class="pb-4"
        >
          <SwiperSlide v-for="brand in brands" :key="brand.id">
            <div class="w-full h-20 md:h-24 bg-white border border-gray-100 rounded-sm flex items-center justify-center p-4 hover:border-gray-300 transition-colors cursor-pointer">
              <NuxtImg :src="brand.logo_url || 'https://placehold.co/400x200?text='+brand.name" format="webp" loading="lazy" fetchpriority="low" sizes="150px" class="max-h-full max-w-full object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" :alt="brand.name" />
            </div>
          </SwiperSlide>
        </Swiper>
      </ClientOnly>
    </section>

    <!-- 2. Flash Sale -->
    <section class="container space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">Flash Sale</h2>
      </div>
      <ClientOnly>
        <Swiper
          :modules="[SwiperAutoplay]"
          :slides-per-view="2"
          :space-between="16"
          :breakpoints="{
            '768': { slidesPerView: 3, spaceBetween: 24 },
            '1024': { slidesPerView: 4, spaceBetween: 24 },
          }"
          :autoplay="{ delay: 3000, disableOnInteraction: false }"
          class="pb-4!"
        >
          <SwiperSlide v-for="product in products" :key="'flash-'+product.id" class="h-auto">
            <ProductCard :product="product" class="h-full" />
          </SwiperSlide>
        </Swiper>
      </ClientOnly>
    </section>

    <!-- 3. Shop By Category -->
    <section class="container space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">Shop By Category</h2>
        <NuxtLink to="/categories" class="text-sm font-semibold text-gray-600 hover:text-primary transition-colors flex items-center">
          View All <ArrowRight class="w-4 h-4 ml-1" />
        </NuxtLink>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <CategoryCard 
          v-for="cat in childCategories.slice(0, 4)" 
          :key="cat.id" 
          :category="cat" 
        />
      </div>
    </section>

    <!-- 4. Featured Product -->
    <section class="container space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">Featured Product</h2>
        <NuxtLink to="/shop" class="text-sm font-semibold text-gray-600 hover:text-primary transition-colors flex items-center">
          View All <ArrowRight class="w-4 h-4 ml-1" />
        </NuxtLink>
      </div>
      <ClientOnly>
        <Swiper
          :modules="[SwiperAutoplay]"
          :slides-per-view="2"
          :space-between="16"
          :breakpoints="{
            '768': { slidesPerView: 3, spaceBetween: 24 },
            '1024': { slidesPerView: 4, spaceBetween: 24 },
          }"
          :autoplay="{ delay: 3500, disableOnInteraction: false }"
          class="pb-4!"
        >
          <SwiperSlide v-for="product in [...products].reverse()" :key="'feat-'+product.id" class="h-auto">
            <ProductCard :product="product" class="h-full" />
          </SwiperSlide>
        </Swiper>
      </ClientOnly>
    </section>

    <!-- 5. Wide Promo Banner 1 -->
    <section class="">
      <PromoBanner 
        :banner="{
          title: '25% OFF',
          subtitle: 'UP TO',
          image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1600&auto=format&fit=crop',
          link: '/shop',
          buttonText: 'SHOP NOW',
          align: 'center',
          overlay: true
        }"
        heightClass="h-[400px]"
      />
    </section>

    <!-- 8. Selling Products (Split Layout) -->
    <section class="container space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">Selling Products</h2>
        <NuxtLink to="/shop" class="text-sm font-semibold text-gray-600 hover:text-primary transition-colors flex items-center">
          View All <ArrowRight class="w-4 h-4 ml-1" />
        </NuxtLink>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Left Banner -->
        <div class="lg:col-span-1">
          <PromoBanner 
            :banner="{
              title: '50% OFF',
              subtitle: 'LIMITED TIME OFFER!',
              image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=400&auto=format&fit=crop',
              link: '/shop',
              align: 'center',
              overlay: true
            }"
            heightClass="h-full min-h-[400px]"
          />
        </div>
        <!-- Right Product Grid -->
        <div class="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 content-start">
           <HorizontalProductCard 
             v-for="product in products.slice(0, 6)" 
             :key="'selling-'+product.id" 
             :product="product" 
           />
        </div>
      </div>
    </section>

    <!-- 10. New Arrivals -->
    <section class="container space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">New Arrival</h2>
        <NuxtLink to="/shop" class="text-sm font-semibold text-gray-600 hover:text-primary transition-colors flex items-center">
          View All <ArrowRight class="w-4 h-4 ml-1" />
        </NuxtLink>
      </div>
      <ClientOnly>
        <Swiper
          :modules="[SwiperAutoplay]"
          :slides-per-view="2"
          :space-between="16"
          :breakpoints="{
            '768': { slidesPerView: 3, spaceBetween: 24 },
            '1024': { slidesPerView: 4, spaceBetween: 24 },
          }"
          :autoplay="{ delay: 4000, disableOnInteraction: false }"
          class="pb-4!"
        >
          <SwiperSlide v-for="product in products" :key="'new-'+product.id" class="h-auto">
            <ProductCard :product="product" class="h-full" />
          </SwiperSlide>
        </Swiper>
      </ClientOnly>
    </section>

    <!-- Newsletter Promo Banner -->
    <section class="bg-gray-50 py-24 overflow-hidden">
      <div class="container grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div class="space-y-8">
          <h2 class="text-4xl md:text-5xl font-bold tracking-tighter leading-none uppercase">
            Join the <br> Movement
          </h2>
          <p class="text-gray-500 leading-loose max-w-md">
            Sign up for our newsletter and get 15% off your first order. Be the first to know about new arrivals, limited editions, and exclusive events.
          </p>
          <form @submit.prevent class="flex max-w-md">
            <input 
              type="email" 
              autocomplete="email"
              placeholder="Enter your email" 
              class="grow bg-white border border-gray-200 px-6 py-4 text-sm focus:ring-1 focus:ring-accent outline-none shadow-sm"
            >
            <button type="submit" class="bg-primary text-white px-8 py-4 text-xs uppercase font-bold tracking-widest hover:bg-black transition-colors">
              Subscribe
            </button>
          </form>
        </div>
        <div class="relative">
          <NuxtImg 
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop" 
            alt="Promo" 
            format="webp"
            loading="lazy"
            fetchpriority="low"
            sizes="(max-width: 1024px) 100vw, 50vw"
            class="w-full aspect-video object-cover shadow-xl rounded-sm"
          />
          <div class="absolute -top-10 -right-10 w-32 h-32 md:w-40 md:h-40 bg-accent rounded-full flex items-center justify-center text-white rotate-12 shadow-xl">
            <div class="text-center">
              <span class="block text-2xl md:text-3xl font-bold">15%</span>
              <span class="text-[10px] uppercase font-bold tracking-widest">Off First Order</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
