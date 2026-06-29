<script setup lang="ts">
const route = useRoute()
const orderNumber = computed(() => route.query.number || 'N/A')
const paymentMethod = computed(() => {
  const method = route.query.method || 'cod'
  return method === 'stripe' ? 'Card Payment (Stripe)' : 'Cash on Delivery'
})
</script>

<template>
  <div class="container py-32">
    <div class="max-w-xl mx-auto text-center space-y-12">
      <div class="flex justify-center">
        <div class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        </div>
      </div>

      <div class="space-y-3">
        <h1 class="text-3xl font-bold uppercase tracking-tighter">Order Confirmed</h1>
        <p class="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
          Thank you for your purchase. We'll send you a confirmation once your items ship.
        </p>
      </div>

      <div class="bg-gray-50 p-8 border border-gray-100 space-y-4 text-left">
        <div class="flex justify-between items-center border-b border-gray-200 pb-4">
          <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Order Number</span>
          <span class="text-sm font-bold">{{ orderNumber }}</span>
        </div>
        <div class="flex justify-between items-center border-b border-gray-200 pb-4">
          <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Payment</span>
          <span class="text-sm font-bold">{{ paymentMethod }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</span>
          <span class="text-[10px] bg-blue-100 text-blue-700 px-3 py-1 font-bold uppercase tracking-wider rounded-full">Processing</span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row justify-center gap-3 pt-4">
        <NuxtLink to="/shop" class="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors">Continue Shopping</NuxtLink>
        <NuxtLink to="/" class="border-2 border-gray-200 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:border-gray-400 transition-colors">Home</NuxtLink>
      </div>

      <p class="text-[10px] text-gray-400 tracking-wider">
        Need help? <NuxtLink to="/contact" class="underline underline-offset-2">Contact support</NuxtLink>
      </p>
    </div>
  </div>
</template>
