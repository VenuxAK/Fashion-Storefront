<script setup lang="ts">
import { Search, ChevronRight } from 'lucide-vue-next'

definePageMeta({
  middleware: 'sanctum:auth'
})

const { getOrders } = useProfile()
const { data: ordersData, pending } = await useAsyncData('my-orders', () => getOrders(), {
  getCachedData: (key) => useNuxtData(key).data.value,
  timeout: 10000,
})

const orders = computed(() => (ordersData.value as any)?.data || [])
const { url } = useMedia()

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-700'
    case 'processing': return 'bg-blue-100 text-blue-600'
    case 'shipped': return 'bg-purple-100 text-purple-600'
    case 'delivered': return 'bg-green-100 text-green-600'
    case 'cancelled': return 'bg-red-100 text-red-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}
</script>

<template>
  <div class="container py-20">
    <div class="flex flex-col lg:flex-row gap-16">
      <UserNav />

      <main class="flex-grow space-y-12">
        <div class="space-y-4 border-b border-gray-100 pb-8">
          <h1 class="text-3xl font-bold uppercase tracking-tighter">My Orders</h1>
          <p class="text-gray-500 text-xs uppercase tracking-[0.3em]">Track and manage your purchases</p>
        </div>

        <div v-if="pending" class="py-20 text-center uppercase tracking-widest text-xs font-bold text-gray-400">
          Loading Orders...
        </div>

        <div v-else-if="orders.length > 0" class="space-y-6">
          <NuxtLink
            v-for="order in orders"
            :key="order.id"
            :to="`/my/orders/${order.id}`"
            class="block border border-gray-100 p-8 flex flex-col md:flex-row justify-between items-center gap-8 hover:shadow-md transition-shadow group"
          >
            <div class="flex items-center space-x-8 w-full md:w-auto">
              <div class="w-16 h-20 bg-gray-50 flex-shrink-0">
                <NuxtImg v-if="order.items?.[0]?.variant?.product?.image" :src="url(order.items[0].variant.product.image)" format="webp" loading="lazy" fetchpriority="low" sizes="64px" class="w-full h-full object-cover" />
              </div>
              <div class="space-y-1">
                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">{{ order.order_number }}</p>
                <p class="text-sm font-bold uppercase">{{ order.items?.[0]?.variant?.product?.name || 'Multiple Items' }}</p>
                <p class="text-xs text-gray-500">Ordered on {{ new Date(order.created_at).toLocaleDateString() }}</p>
              </div>
            </div>

            <div class="flex items-center justify-between md:justify-end w-full md:w-auto md:space-x-12">
              <div class="text-right">
                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total</p>
                <p class="text-sm font-bold">${{ parseFloat(order.total_amount).toFixed(2) }}</p>
              </div>

              <div class="text-center">
                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Status</p>
                <span class="text-[8px] font-bold uppercase px-3 py-1 rounded-full" :class="getStatusColor(order.status)">
                  {{ order.status }}
                </span>
              </div>

              <ChevronRight class="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
            </div>
          </NuxtLink>
        </div>

        <div v-else class="py-32 flex flex-col items-center justify-center text-center space-y-8 bg-gray-50 border border-dashed border-gray-200">
          <div class="space-y-2">
            <h2 class="text-xl font-bold uppercase tracking-tight">No orders yet</h2>
            <p class="text-gray-500 text-xs uppercase tracking-widest">You haven't made any purchases in this store.</p>
          </div>
          <NuxtLink to="/shop" class="btn btn-primary px-10 py-4 uppercase text-xs tracking-widest font-bold">
            Start Shopping
          </NuxtLink>
        </div>
      </main>
    </div>
  </div>
</template>
