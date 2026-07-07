<script setup lang="ts">
import { Bell, Package, User, MapPin, LogOut } from 'lucide-vue-next'

const { logout } = useAuth()
const route = useRoute()
const { unreadCount } = useNotifications()

const navLinks = [
  { name: 'Notifications', href: '/my/notifications', icon: Bell, badge: unreadCount },
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
          class="flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors rounded-none relative"
          :class="[route.path.startsWith(link.href) ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50']"
        >
          <component :is="link.icon" class="w-4 h-4" />
          <span>{{ link.name }}</span>
          <span
            v-if="link.badge && link.badge.value > 0"
            class="ml-auto bg-red-500 text-white text-[8px] min-w-[16px] h-4 rounded-full flex items-center justify-center px-1"
          >
            {{ link.badge.value > 99 ? '99+' : link.badge.value }}
          </span>
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
