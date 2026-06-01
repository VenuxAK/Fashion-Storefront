<script setup lang="ts">
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

const { url } = useImage()
const getImageUrl = (image: string) => url(image)

onMounted(() => {
  cartStore.fetchCart()
})

useSeoMeta({
  title: 'Your Shopping Cart | SimpCommerce',
  description: 'View and manage the items in your shopping bag.',
})
</script>

<template>
  <div class="container py-20">
    <div class="space-y-12">
      <!-- Header -->
      <div class="text-center space-y-4">
        <h1 class="text-4xl font-bold uppercase tracking-tighter">Your Shopping Cart</h1>
        <p class="text-gray-500 text-xs uppercase tracking-[0.3em]">Items ready for checkout</p>
      </div>

      <div v-if="cartStore.items.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-8">
          <table class="w-full text-left border-collapse">
            <thead class="hidden md:table-header-group">
              <tr class="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100">
                <th class="pb-6">Product</th>
                <th class="pb-6 text-center">Price</th>
                <th class="pb-6 text-center">Quantity</th>
                <th class="pb-6 text-right">Total</th>
                <th class="pb-6"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="item in cartStore.items" :key="item.id" class="flex flex-col md:table-row py-8 md:py-0">
                <td class="py-8">
                  <div class="flex items-center space-x-6">
                    <div class="w-24 h-24 bg-gray-50 flex-shrink-0">
                      <img :src="getImageUrl(item.image)" :alt="item.name" class="w-full h-full object-cover">
                    </div>
                    <div class="space-y-1">
                      <h3 class="text-sm font-bold uppercase">{{ item.name }}</h3>
                      <p class="text-xs text-gray-400 uppercase tracking-widest">{{ item.color }} / {{ item.size }}</p>
                    </div>
                  </div>
                </td>
                <td class="md:text-center py-4 md:py-8">
                  <span class="md:hidden text-xs font-bold uppercase tracking-widest text-gray-400 mr-2">Price:</span>
                  <span class="text-sm font-medium">${{ parseFloat(String(item.price || 0)).toFixed(2) }}</span>
                </td>
                <td class="md:text-center py-4 md:py-8">
                  <div class="flex items-center justify-start md:justify-center">
                    <div class="flex items-center border border-gray-100 h-10">
                      <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)" class="px-3 hover:text-accent"><Minus class="w-3 h-3" /></button>
                      <span class="w-8 text-center text-xs font-bold">{{ item.quantity }}</span>
                      <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)" class="px-3 hover:text-accent"><Plus class="w-3 h-3" /></button>
                    </div>
                  </div>
                </td>
                <td class="text-right py-4 md:py-8">
                  <span class="md:hidden text-xs font-bold uppercase tracking-widest text-gray-400 mr-2 float-left">Total:</span>
                  <span class="text-sm font-bold">${{ (parseFloat(String(item.price || 0)) * item.quantity).toFixed(2) }}</span>
                </td>
                <td class="text-right py-4 md:py-8 pl-6">
                  <button @click="cartStore.removeItem(item.id)" class="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="flex flex-col sm:flex-row justify-between items-center pt-10 border-t border-gray-100 space-y-6 sm:space-y-0">
            <NuxtLink to="/shop" class="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors">
              <ArrowLeft class="w-4 h-4" />
              <span>Continue Shopping</span>
            </NuxtLink>
            <button @click="cartStore.clearCart()" class="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors">
              Clear Shopping Cart
            </button>
          </div>
        </div>

        <!-- Summary -->
        <div class="space-y-10">
          <div class="bg-gray-50 p-10 space-y-8">
            <h3 class="text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-4">Order Summary</h3>
            <div class="space-y-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Subtotal</span>
                <span class="font-bold">${{ cartStore.subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Shipping</span>
                <span class="font-bold">Calculated at next step</span>
              </div>
            </div>
            <div class="border-t border-gray-200 pt-6 flex justify-between items-center text-xl font-bold uppercase">
              <span>Total</span>
              <span>${{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            <NuxtLink 
              to="/checkout" 
              class="btn btn-primary w-full py-5 text-xs font-bold tracking-widest uppercase"
            >
              Proceed to Checkout
            </NuxtLink>
          </div>
          
          <div class="border border-gray-100 p-10 space-y-4">
            <h4 class="text-xs font-bold uppercase tracking-widest">Apply Discount Code</h4>
            <form @submit.prevent class="flex">
              <input 
                type="text" 
                placeholder="Enter code" 
                class="flex-grow border-b border-gray-200 focus:border-accent outline-none py-3 text-sm"
              >
              <button class="text-[10px] font-bold uppercase tracking-widest text-accent ml-4">Apply</button>
            </form>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="py-32 flex flex-col items-center justify-center text-center space-y-8">
        <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
          <ShoppingBag class="w-12 h-12" />
        </div>
        <div class="space-y-2">
          <h2 class="text-2xl font-bold uppercase tracking-tight">Your Cart is Empty</h2>
          <p class="text-gray-500 text-sm">Looks like you haven't added anything to your cart yet.</p>
        </div>
        <NuxtLink to="/shop" class="btn btn-primary px-10 py-4 uppercase text-xs tracking-widest font-bold">
          Start Shopping
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
