<script setup lang="ts">
import { Package, User, MapPin, LogOut } from 'lucide-vue-next'

const { logout } = useAuth()
const route = useRoute()

const navLinks = [
  { name: 'My Orders', href: '/my/orders', icon: Package },
  { name: 'Profile', href: '/my/profile', icon: User },
  { name: 'Address Book', href: '/my/addresses', icon: MapPin }
]
</script>

<template>
  <aside class="w-full lg:w-64 space-y-8">
    <div class="space-y-2">
      <h3 class="text-sm font-bold uppercase tracking-widest text-gray-400">Account</h3>
      <nav class="flex flex-col space-y-1">
        <NuxtLink 
          v-for="link in navLinks" 
          :key="link.href" 
          :to="link.href"
          class="flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors rounded-none"
          :class="[route.path.startsWith(link.href) ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50']"
        >
          <component :is="link.icon" class="w-4 h-4" />
          <span>{{ link.name }}</span>
        </NuxtLink>
      </nav>
    </div>

    <div class="pt-8 border-t border-gray-100">
      <button 
        @click="logout"
        class="flex items-center space-x-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 w-full transition-colors"
      >
        <LogOut class="w-4 h-4" />
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>
