<script setup lang="ts">
import { Search, User, ShoppingBag, Menu, X, Heart, Bell } from 'lucide-vue-next'
import { useWindowScroll } from '@vueuse/core'
import { useUiStore } from '~/stores/ui'
import { useCartStore } from '~/stores/cart'
import { useWishlistStore } from '~/stores/wishlist'

const uiStore = useUiStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const { isLoggedIn, user } = useAuth()
const { y } = useWindowScroll()
const isScrolled = computed(() => y.value > 50)

const isMenuOpen = ref(false)
const { unreadCount } = useNotifications()

const navLinks = [
  // { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
]
</script>

<template>
  <header 
    class="fixed top-0 left-0 w-full z-50 transition-all duration-300"
    :class="[isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-6']"
  >
    <div class="container flex items-center justify-between">
      <!-- Mobile Menu Toggle -->
      <button class="lg:hidden" @click="isMenuOpen = true">
        <Menu class="w-6 h-6" />
      </button>

      <!-- Logo -->
       <!-- TODO: Change back to / when home page is ready -->
      <NuxtLink to="/shop" class="text-2xl font-bold tracking-tighter uppercase">
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
          {{ link.label }}
        </NuxtLink>
      </nav>

      <!-- Icons -->
      <div class="flex items-center space-x-3 md:space-x-5">
        <button 
          @click="uiStore.isSearchOpen = true"
          class="hover:text-accent transition-colors"
        >
          <Search class="w-4 h-4 md:w-5 md:h-5" />
        </button>
        
        <NuxtLink
          :to="isLoggedIn ? '/my/notifications' : '/login'"
          class="hover:text-accent transition-colors relative"
        >
          <Bell class="w-4 h-4 md:w-5 md:h-5" />
          <span
            v-if="unreadCount > 0"
            class="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] md:text-[10px] min-w-[16px] h-4 rounded-full flex items-center justify-center px-1"
          >
            {{ unreadCount > 99 ? '99+' : unreadCount }}
          </span>
        </NuxtLink>

        <NuxtLink 
          :to="isLoggedIn ? '/my/profile' : '/login'" 
          class="hover:text-accent transition-colors flex items-center space-x-2"
        >
          <User class="w-4 h-4 md:w-5 md:h-5" />
          <span v-if="isLoggedIn && user" class="hidden lg:block text-[10px] font-bold uppercase tracking-widest max-w-20 truncate">
            {{ user.name }}
          </span>
        </NuxtLink>
        
        <NuxtLink to="/wishlist" class="hover:text-accent transition-colors relative">
          <Heart class="w-4 h-4 md:w-5 md:h-5" />
          <span class="absolute -top-1.5 -right-1.5 bg-accent text-white text-[8px] md:text-[10px] w-3 h-3 md:w-4 md:h-4 rounded-full flex items-center justify-center">
            {{ wishlistStore.items.length }}
          </span>
        </NuxtLink>
        
        <button 
          class="hover:text-accent transition-colors relative"
          @click="uiStore.openMiniCart()"
        >
          <ShoppingBag class="w-4 h-4 md:w-5 md:h-5" />
          <span class="absolute -top-1.5 -right-1.5 bg-primary text-white text-[8px] md:text-[10px] w-3 h-3 md:w-4 md:h-4 rounded-full flex items-center justify-center">
            {{ cartStore.totalItems }}
          </span>
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
      <div v-if="isMenuOpen" class="fixed inset-0 bg-white z-60 lg:hidden">
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
              {{ link.label }}
            </NuxtLink>
          </nav>
        </div>
      </div>
    </Transition>
  </header>
  <LazySearchOverlay />
</template>
