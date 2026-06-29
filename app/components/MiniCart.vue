<script setup lang="ts">
import { X, ShoppingBag, Trash2 } from 'lucide-vue-next'
import { useUiStore } from '~/stores/ui'
import { useCartStore } from '~/stores/cart'

const uiStore = useUiStore()
const cartStore = useCartStore()

const { url } = useImage()
const getImageUrl = (image: string) => url(image)

onMounted(() => {
  cartStore.fetchCart()
})
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="uiStore.isMiniCartOpen" 
        class="fixed inset-0 bg-black/50 z-100"
        @click="uiStore.closeMiniCart"
      ></div>
    </Transition>

    <!-- Drawer -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div 
        v-if="uiStore.isMiniCartOpen" 
        class="fixed top-0 right-0 h-full w-full max-w-md bg-white z-110 shadow-2xl flex flex-col"
      >
        <!-- Header -->
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 class="text-xl font-bold uppercase tracking-tight">{{ $t('common.cart') }}</h2>
          <button @click="uiStore.closeMiniCart" class="hover:text-accent transition-colors">
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- Content -->
        <div class="grow overflow-y-auto p-6 space-y-6">
          <div v-if="cartStore.items.length === 0" class="h-full flex flex-col items-center justify-center text-center space-y-4">
            <ShoppingBag class="w-16 h-16 text-gray-200" />
            <p class="text-gray-500 uppercase tracking-widest text-sm">{{ $t('common.empty_cart') }}</p>
            <NuxtLink 
              to="/shop" 
              class="btn btn-outline"
              @click="uiStore.closeMiniCart"
            >
              {{ $t('common.shop') }}
            </NuxtLink>
          </div>

          <div v-else v-for="item in cartStore.items" :key="item.id" class="flex space-x-4 border-b border-gray-50 pb-6">
            <div class="w-24 h-24 shrink-0 bg-gray-50">
              <img :src="getImageUrl(item.image || '')" :alt="item.name" class="w-full h-full object-cover">
            </div>
            <div class="grow space-y-1">
              <div class="flex justify-between items-start">
                <h3 class="text-sm font-bold uppercase">{{ item.name }}</h3>
                <button @click="cartStore.removeItem(item.id)" class="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
              <p class="text-xs text-gray-500">{{ item.color }} / {{ item.size }}</p>
              <div class="flex justify-between items-end mt-4">
                <span class="text-sm font-medium text-gray-500">{{ item.quantity }} x ${{ parseFloat(String(item.price || 0)).toFixed(2) }}</span>
                <span class="text-sm font-bold">${{ (parseFloat(String(item.price || 0)) * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="cartStore.items.length > 0" class="p-6 border-t border-gray-100 space-y-4">
          <div class="flex justify-between items-center text-lg font-bold uppercase">
            <span>{{ $t('common.subtotal') }}</span>
            <span>${{ cartStore.subtotal.toFixed(2) }}</span>
          </div>
          <p class="text-xs text-gray-400 text-center uppercase tracking-widest">
            Shipping & taxes calculated at checkout
          </p>
          <div class="grid grid-cols-1 gap-3">
            <NuxtLink 
              to="/cart" 
              class="btn btn-outline w-full py-4 text-xs font-bold tracking-widest uppercase"
              @click="uiStore.closeMiniCart"
            >
              {{ $t('common.view_cart') }}
            </NuxtLink>
            <NuxtLink 
              to="/checkout" 
              class="btn btn-primary w-full py-4 text-xs font-bold tracking-widest uppercase"
              @click="uiStore.closeMiniCart"
            >
              {{ $t('common.checkout') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
