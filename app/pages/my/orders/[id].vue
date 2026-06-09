<script setup lang="ts">
import { ChevronRight, ArrowLeft } from 'lucide-vue-next'

definePageMeta({
  middleware: 'sanctum:auth'
})

const route = useRoute()
const { getOrderDetails, cancelOrder } = useProfile()
const { notify } = useNotify()

const { data: orderData, pending, refresh } = await useAsyncData(`order-${route.params.id}`, () => getOrderDetails(route.params.id as string))

const order = computed(() => orderData.value?.data || null)
const { url } = useImage()

const isCancelling = ref(false)

const handleCancel = async () => {
  if (!confirm('Are you sure you want to cancel this order?')) return
  isCancelling.value = true
  try {
    await cancelOrder(route.params.id as string)
    notify('Order cancelled successfully.', 'success')
    await refresh()
  } catch (error: any) {
    notify(error.data?.message || 'Failed to cancel order.', 'error')
  } finally {
    isCancelling.value = false
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
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
        <div v-if="pending" class="py-20 text-center uppercase tracking-widest text-xs font-bold text-gray-400">
          Loading Order Details...
        </div>

        <div v-else-if="order" class="space-y-10">
          <div class="space-y-6 border-b border-gray-100 pb-8">
            <NuxtLink to="/my/orders" class="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">
              <ArrowLeft class="w-3 h-3 mr-2" /> Back to Orders
            </NuxtLink>
            
            <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
              <div class="space-y-2">
                <h1 class="text-3xl font-bold uppercase tracking-tighter">Order #{{ order.order_number }}</h1>
                <p class="text-gray-500 text-xs uppercase tracking-widest">Placed on {{ new Date(order.created_at).toLocaleString() }}</p>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-[10px] font-bold uppercase px-4 py-2 rounded-full" :class="getStatusColor(order.status)">
                  {{ order.status }}
                </span>
                <button 
                  v-if="order.status === 'processing' || order.status === 'pending'"
                  @click="handleCancel"
                  :disabled="isCancelling"
                  class="btn btn-outline py-2 px-6 text-[10px]"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>

          <!-- Items -->
          <div class="space-y-6">
            <h3 class="text-sm font-bold uppercase tracking-widest">Items Purchased</h3>
            <div class="border border-gray-100 divide-y divide-gray-100">
              <div v-for="item in order.items" :key="item.id" class="p-6 flex items-center justify-between gap-6">
                <div class="flex items-center gap-6">
                  <div class="w-20 h-24 bg-gray-50 flex-shrink-0">
                    <img v-if="item.variant?.image || item.variant?.product?.image" :src="url(item.variant?.image || item.variant?.product?.image)" class="w-full h-full object-cover">
                  </div>
                  <div>
                    <p class="text-sm font-bold uppercase">{{ item.variant?.product?.name || 'Unknown Product' }}</p>
                    <p class="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                      <span v-if="item.variant?.color">{{ item.variant.color }}</span>
                      <span v-if="item.variant?.size"> / {{ item.variant.size }}</span>
                    </p>
                    <p class="text-xs font-bold mt-2">${{ parseFloat(item.unit_price).toFixed(2) }} <span class="text-[10px] text-gray-400 font-normal ml-2">x{{ item.quantity }}</span></p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-bold">${{ (parseFloat(item.unit_price) * item.quantity).toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary & Address -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-gray-100 pt-10">
            <div class="space-y-6">
              <h3 class="text-sm font-bold uppercase tracking-widest border-b border-gray-100 pb-4">Shipping Address</h3>
              <div v-if="order.shipping_address" class="space-y-1 text-sm text-gray-600">
                <p class="font-bold uppercase">{{ order.shipping_address.name }}</p>
                <p>{{ order.shipping_address.phone }}</p>
                <p>{{ order.shipping_address.street }}</p>
                <p>{{ order.shipping_address.city }}, {{ order.shipping_address.state }} {{ order.shipping_address.postal_code }}</p>
              </div>
              <div v-else class="text-xs text-gray-400">No address provided.</div>
              
              <div v-if="order.notes" class="mt-6">
                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Order Notes</p>
                <p class="text-sm text-gray-600 bg-gray-50 p-4 border-l-2 border-accent">{{ order.notes }}</p>
              </div>
            </div>

            <div class="space-y-6">
              <h3 class="text-sm font-bold uppercase tracking-widest border-b border-gray-100 pb-4">Order Summary</h3>
              <div class="space-y-4">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Subtotal</span>
                  <span class="font-bold">${{ parseFloat(order.total_amount).toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Shipping</span>
                  <span class="font-bold text-green-600 text-[10px] uppercase">Free</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Payment Method</span>
                  <span class="font-bold uppercase text-[10px]">COD</span>
                </div>
                <div class="border-t border-gray-100 pt-4 mt-2 flex justify-between items-center text-xl font-bold uppercase">
                  <span>Total</span>
                  <span>${{ parseFloat(order.total_amount).toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div v-else class="py-32 text-center space-y-6">
          <h2 class="text-xl font-bold uppercase tracking-tight">Order Not Found</h2>
          <NuxtLink to="/my/orders" class="btn btn-outline">Return to Orders</NuxtLink>
        </div>
      </main>
    </div>
  </div>
</template>
