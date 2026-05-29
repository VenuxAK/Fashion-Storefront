<script setup lang="ts">
import { Search, User, ShoppingBag, Menu, X, Heart } from 'lucide-vue-next'
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()
const isScrolled = computed(() => y.value > 50)

const isMenuOpen = ref(false)
const { locale, setLocale } = useI18n()

const navLinks = [
  { name: 'common.home', href: '/' },
  { name: 'common.shop', href: '/shop' },
  { name: 'common.about', href: '/about' },
  { name: 'common.contact', href: '/contact' }
]

const toggleLocale = () => {
  setLocale(locale.value === 'en' ? 'my' : 'en')
}
</script>

<template>
  <header 
    class="fixed top-0 left-0 w-full z-50 transition-all duration-300"
    :class="[isScrolled ? 'bg-white shadow-sm py-3' : 'bg-transparent py-6']"
  >
    <div class="container flex items-center justify-between">
      <!-- Mobile Menu Toggle -->
      <button class="lg:hidden" @click="isMenuOpen = true">
        <Menu class="w-6 h-6" />
      </button>

      <!-- Logo -->
      <NuxtLink to="/" class="text-2xl font-bold tracking-tighter uppercase">
        SimpCommerce
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden lg:flex items-center space-x-8">
        <NuxtLink 
          v-for="link in navLinks" 
          :key="link.href" 
          :to="link.href"
          class="text-sm font-medium uppercase tracking-widest hover:text-accent transition-colors"
        >
          {{ $t(link.name) }}
        </NuxtLink>
      </nav>

      <!-- Icons -->
      <div class="flex items-center space-x-5">
        <button @click="toggleLocale" class="text-xs font-bold uppercase hover:text-accent">
          {{ locale === 'en' ? 'MY' : 'EN' }}
        </button>
        
        <button class="hover:text-accent transition-colors">
          <Search class="w-5 h-5" />
        </button>
        
        <NuxtLink to="/login" class="hover:text-accent transition-colors">
          <User class="w-5 h-5" />
        </NuxtLink>
        
        <button class="hover:text-accent transition-colors relative">
          <Heart class="w-5 h-5" />
          <span class="absolute -top-2 -right-2 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
        </button>
        
        <button 
          class="hover:text-accent transition-colors relative"
          @click="uiStore.openMiniCart()"
        >
          <ShoppingBag class="w-5 h-5" />
          <span class="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-x-full"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 -translate-x-full"
    >
      <div v-if="isMenuOpen" class="fixed inset-0 bg-white z-[60] lg:hidden">
        <div class="p-6">
          <div class="flex justify-between items-center mb-10">
            <span class="text-xl font-bold uppercase">Menu</span>
            <button @click="isMenuOpen = false">
              <X class="w-6 h-6" />
            </button>
          </div>
          
          <nav class="flex flex-col space-y-6">
            <NuxtLink 
              v-for="link in navLinks" 
              :key="link.href" 
              :to="link.href"
              class="text-lg font-medium uppercase tracking-widest border-b border-gray-100 pb-2"
              @click="isMenuOpen = false"
            >
              {{ $t(link.name) }}
            </NuxtLink>
          </nav>
        </div>
      </div>
    </Transition>
  </header>
  
  <!-- Spacer to prevent content from going under fixed header -->
  <div class="h-[80px]"></div>
</template>
mplate>
