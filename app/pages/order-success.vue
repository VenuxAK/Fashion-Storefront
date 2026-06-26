<script setup lang="ts">
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-vue-next'

const route = useRoute()
const orderNumber = computed(() => route.query.number || 'N/A')
const paymentMethod = computed(() => {
  const method = route.query.method || 'cod'
  switch (method) {
    case 'mmpay': return 'MyanMyanPay (Wallet)'
    case 'stripe': return 'Card Payment'
    default: return 'Cash on Delivery'
  }
})
</script>

<template>
  <div class="container py-40">
    <div class="max-w-2xl mx-auto text-center space-y-12">
      <!-- Success Icon -->
      <div class="flex justify-center">
        <div class="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 animate-bounce-slow">
          <CheckCircle class="w-12 h-12" />
        </div>
      </div>

      <!-- Success Message -->
      <div class="space-y-4">
        <h1 class="text-4xl font-bold uppercase tracking-tighter">Order Placed Successfully!</h1>
        <p class="text-gray-500 text-sm leading-relaxed">
          Thank you for your purchase. Your order has been received and is now being processed. We'll send you an update as soon as your items are on their way.
        </p>
      </div>

      <!-- Order Details Card -->
      <div class="bg-gray-50 p-10 border border-gray-100 space-y-6">
        <div class="flex justify-between items-center border-b border-gray-200 pb-4">
          <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Order Number</span>
          <span class="text-sm font-bold uppercase">{{ orderNumber }}</span>
        </div>
        <div class="flex justify-between items-center border-b border-gray-200 pb-4">
          <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Payment Method</span>
          <span class="text-sm font-bold uppercase">{{ paymentMethod }}</span>
        </div>
        <div class="flex justify-between items-center pb-4">
          <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</span>
          <span class="text-[10px] bg-blue-100 text-blue-600 px-3 py-1 font-bold uppercase rounded-full">Processing</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row justify-center gap-4 pt-8">
        <NuxtLink to="/shop" class="btn btn-primary px-10 py-5 text-xs font-bold uppercase tracking-widest flex items-center justify-center">
          <span>Continue Shopping</span>
          <ArrowRight class="ml-2 w-4 h-4" />
        </NuxtLink>
        <NuxtLink to="/" class="btn btn-outline px-10 py-5 text-xs font-bold uppercase tracking-widest flex items-center justify-center">
          <Home class="mr-2 w-4 h-4" />
          <span>Go to Home</span>
        </NuxtLink>
      </div>

      <p class="text-[10px] text-gray-400 uppercase tracking-widest">
        Need help? <NuxtLink to="/contact" class="text-accent underline">Contact our support team</NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce-slow {
  animation: bounce-slow 2s infinite ease-in-out;
}
</style>
