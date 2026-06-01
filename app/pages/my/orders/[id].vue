<script setup lang="ts">
import { ChevronLeft, Package, Truck, CheckCircle, XCircle } from 'lucide-vue-next'
import { useNotify } from '~/composables/useNotify'

definePageMeta({ middleware: 'sanctum:auth' })

const route = useRoute()
const { getOrderDetails, cancelOrder } = useProfile()
const { notify } = useNotify()
const { url } = useImage()

const { data: orderData, refresh } = await useAsyncData(
  `order-${route.params.id}`,
  () => getOrderDetails(route.params.id as string)
)

const order = computed(() => orderData.value?.data || orderData.value || null)

const getStatusColor = (status: string) => {
  switch (status) {
    case 'processing': return 'text-blue-600 bg-blue-50'
    case 'shipped': return 'text-purple-600 bg-purple-50'
    case 'delivered': return 'text-green-600 bg-green-50'
    case 'cancelled': return 'text-red-600 bg-red-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'processing': return Package
    case 'shipped': return Truck
    case 'delivered': return CheckCircle
    case 'cancelled': return XCircle
    default: return Package
  }
}

const timeline = computed(() => {
  if (!order.value) return []
  const steps = [
    { label: 'Order Placed', date: order.value.created_at, done: true },
    { label: 'Processing', date: order.value.created_at, done: order.value.status !== 'cancelled' },
    { label: 'Shipped', date: order.value.shipment?.shipped_at, done: !!order.value.shipment?.shipped_at },
    { label: 'Delivered', date: order.value.shipment?.delivered_at, done: !!order.value.shipment?.delivered_at },
  ]
  if (order.value.status === 'cancelled') {
    steps.push({ label: 'Cancelled', date: order.value.updated_at, done: true })
  }
  return steps
})

async function handleCancel() {
  if (!confirm('Are you sure you want to cancel this order?')) return
  try {
    await cancelOrder(route.params.id as string)
    notify('Order cancelled successfully.', 'success')
    refresh()
  } catch {
    notify('Failed to cancel order.', 'error')
  }
}
</script>

<template>
  <div class="container py-20">
    <div class="flex flex-col lg:flex-row gap-16">
      <UserNav />

      <main v-if="order" class="flex-grow space-y-12">
        <!-- Header -->
        <div class="space-y-4 border-b border-gray-100 pb-8">
          <NuxtLink to="/my/orders" class="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">
            <ChevronLeft class="w-4 h-4" /> Back to Orders
          </NuxtLink>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 class="text-2xl font-bold uppercase tracking-tight">{{ order.order_number }}</h1>
              <p class="text-xs text-gray-500 mt-2 uppercase tracking-widest">Ordered on {{ new Date(order.created_at).toLocaleDateString() }}</p>
            </div>
            <span class="text-xs font-bold uppercase px-4 py-2 rounded-full inline-flex items-center gap-2" :class="getStatusColor(order.status)">
              <component :is="getStatusIcon(order.status)" class="w-4 h-4" />
              {{ order.status }}
            </span>
          </div>
        </div>

        <!-- Items -->
        <div class="space-y-4">
          <h2 class="text-xs font-bold uppercase tracking-widest text-gray-400">Items</h2>
          <div class="divide-y divide-gray-100 border border-gray-100">
            <div v-for="item in order.items" :key="item.id" class="flex items-center gap-6 p-6">
              <div class="w-20 h-24 bg-gray-50 shrink-0 overflow-hidden">
                <img :src="url(item.variant?.product?.image)" class="w-full h-full object-cover" />
              </div>
              <div class="flex-grow space-y-1">
                <p class="text-sm font-bold uppercase">{{ item.variant?.product?.name || 'Product' }}</p>
                <p v-if="item.variant?.sku" class="text-[10px] text-gray-400 uppercase tracking-widest">SKU: {{ item.variant.sku }}</p>
                <p v-if="item.variant?.size || item.variant?.color" class="text-xs text-gray-500">{{ [item.variant.size, item.variant.color].filter(Boolean).join(' / ') }}</p>
              </div>
              <div class="text-right shrink-0 space-y-1">
                <p class="text-xs text-gray-500">{{ item.quantity }} × ${{ parseFloat(item.unit_price).toFixed(2) }}</p>
                <p class="text-sm font-bold">${{ parseFloat(item.subtotal).toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Shipment Timeline -->
          <div v-if="order.shipment" class="space-y-4">
            <h2 class="text-xs font-bold uppercase tracking-widest text-gray-400">Shipment</h2>
            <div class="border border-gray-100 p-6 space-y-4">
              <div class="space-y-2 text-sm">
                <p><span class="text-gray-400 text-xs uppercase tracking-widest">Method:</span> {{ order.shipment.method }}</p>
                <p v-if="order.shipment.tracking_number"><span class="text-gray-400 text-xs uppercase tracking-widest">Tracking:</span> {{ order.shipment.tracking_number }}</p>
              </div>
              <div class="space-y-3">
                <div v-for="(step, i) in timeline" :key="i" class="flex items-start gap-4">
                  <div class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" :class="step.done ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'">
                    <CheckCircle v-if="step.done" class="w-3.5 h-3.5" />
                    <div v-else class="w-2 h-2 rounded-full bg-gray-300" />
                  </div>
                  <div>
                    <p class="text-sm font-medium" :class="step.done ? 'text-primary' : 'text-gray-400'">{{ step.label }}</p>
                    <p v-if="step.date" class="text-xs text-gray-400">{{ new Date(step.date).toLocaleDateString() }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary + Invoice -->
          <div class="space-y-4">
            <h2 class="text-xs font-bold uppercase tracking-widest text-gray-400">Summary</h2>
            <div class="border border-gray-100 p-6 space-y-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Subtotal</span>
                <span class="font-bold">${{ parseFloat(order.total_amount).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Shipping</span>
                <span class="text-gray-500">Free</span>
              </div>
              <hr class="border-gray-100" />
              <div class="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${{ parseFloat(order.total_amount).toFixed(2) }}</span>
              </div>
            </div>

            <!-- Invoice -->
            <div v-if="order.invoice" class="border border-gray-100 p-6 space-y-3">
              <p class="text-xs text-gray-400 uppercase tracking-widest font-bold">Invoice</p>
              <p class="text-sm"><span class="text-gray-400 text-xs uppercase tracking-widest">Number:</span> {{ order.invoice.invoice_number }}</p>
              <p class="text-sm"><span class="text-gray-400 text-xs uppercase tracking-widest">Issued:</span> {{ new Date(order.invoice.issued_date).toLocaleDateString() }}</p>
              <p class="text-sm"><span class="text-gray-400 text-xs uppercase tracking-widest">Status:</span> {{ order.invoice.status }}</p>
            </div>

            <!-- Cancel Button -->
            <button
              v-if="order.status === 'processing'"
              @click="handleCancel"
              class="w-full py-4 border border-red-200 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-colors"
            >
              Cancel Order
            </button>
          </div>
        </div>
      </main>

      <div v-else class="flex-grow py-40 text-center">
        <p class="text-gray-400 uppercase tracking-widest text-xs font-bold">Loading order...</p>
      </div>
    </div>
  </div>
</template>
