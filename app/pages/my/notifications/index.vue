<script setup lang="ts">
import { Bell, PackageCheck, Truck, CreditCard, RefreshCw, CheckCheck, ChevronRight, Trash2 } from 'lucide-vue-next'
import type { OrderNotification, PaginatedResponse } from '~/types'

definePageMeta({ middleware: 'sanctum:auth' })

const { data: initialData, pending: initialPending } = await useAsyncData('my-notifications', () => {
  const { getNotifications } = useNotifications()
  return getNotifications({ per_page: 20 })
}, {
  getCachedData: (key) => useNuxtData(key).data.value,
  timeout: 10000,
})

const notifications = ref<OrderNotification[]>([])
const meta = ref<PaginatedResponse<OrderNotification>['meta'] | null>(null)
const loading = ref(true)
const marking = ref(false)
const clearing = ref(false)

const { markAllRead, markRead, clearNotifications } = useNotifications()

const typeIcons: Record<string, any> = {
  new_order: PackageCheck,
  status_change: RefreshCw,
  shipment_update: Truck,
  payment_confirmed: CreditCard,
}

function initData() {
  if (initialData.value) {
    const d = initialData.value as PaginatedResponse<OrderNotification>
    notifications.value = d.data || []
    meta.value = d.meta || null
  }
  loading.value = false
}

initData()

async function loadPage(page: number) {
  loading.value = true
  try {
    const { getNotifications } = useNotifications()
    const res: any = await getNotifications({ page, per_page: 20 })
    notifications.value = res.data || []
    meta.value = res.meta || null
  } catch {} finally {
    loading.value = false
  }
}

async function handleMarkRead(item: OrderNotification) {
  if (item.read_at) return
  try {
    await markRead(item.id)
    item.read_at = new Date().toISOString()
  } catch {}
}

async function handleMarkAllRead() {
  marking.value = true
  try {
    await markAllRead()
    notifications.value.forEach((i) => { i.read_at = new Date().toISOString() })
  } catch {} finally {
    marking.value = false
  }
}

async function handleClearAll() {
  clearing.value = true
  try {
    await clearNotifications()
    notifications.value = []
    meta.value = null
  } catch {} finally {
    clearing.value = false
  }
}

useSeoMeta({
  title: 'Notifications | SimpCommerce',
  description: 'View your order notifications.',
})

const grouped = computed(() => {
  const groups: Record<string, OrderNotification[]> = {}
  for (const n of notifications.value) {
    const date = new Date(n.created_at).toLocaleDateString()
    if (!groups[date]) groups[date] = []
    groups[date].push(n)
  }
  return groups
})
</script>

<template>
  <div class="container py-20">
    <div class="flex flex-col lg:flex-row gap-16">
      <UserNav />

      <main class="flex-grow space-y-12">
        <div class="space-y-4 border-b border-gray-100 pb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold uppercase tracking-tighter">Notifications</h1>
              <p class="text-gray-500 text-xs uppercase tracking-[0.3em] mt-1">Order updates and alerts</p>
            </div>
            <div v-if="notifications.length > 0" class="flex items-center gap-4">
              <button
                :disabled="clearing"
                class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                @click="handleClearAll"
              >
                <Trash2 class="w-4 h-4" />
                Clear all
              </button>
              <button
                :disabled="marking"
                class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/70 transition-colors disabled:opacity-50"
                @click="handleMarkAllRead"
              >
                <CheckCheck class="w-4 h-4" />
                Mark all read
              </button>
            </div>
          </div>
        </div>

        <div v-if="loading && !notifications.length" class="py-20 text-center uppercase tracking-widest text-xs font-bold text-gray-400">
          Loading...
        </div>

        <div v-else-if="notifications.length > 0" class="space-y-8">
          <div v-for="(items, date) in grouped" :key="date" class="space-y-3">
            <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">{{ date }}</p>
            <div class="space-y-2">
              <div
                v-for="item in items"
                :key="item.id"
                @click="handleMarkRead(item)"
                class="flex items-start gap-4 px-6 py-4 border cursor-pointer transition-all"
                :class="[
                  !item.read_at ? 'border-l-primary border-l-4 bg-gray-50/50' : 'border-gray-100 hover:border-gray-200',
                ]"
              >
                <component :is="typeIcons[item.type] || Bell" class="w-5 h-5 mt-0.5 shrink-0 text-gray-400" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold uppercase">{{ item.title }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ item.body }}</p>
                  <p class="text-[10px] text-gray-400 mt-1.5">{{ item.diff_for_humans }}</p>
                </div>
                <NuxtLink
                  :to="`/my/orders/${item.order_id}`"
                  class="shrink-0 mt-1 text-gray-300 hover:text-primary transition-colors"
                  @click.stop
                >
                  <ChevronRight class="w-5 h-5" />
                </NuxtLink>
              </div>
            </div>
          </div>

          <div v-if="meta && meta.last_page > 1" class="flex justify-center gap-4 pt-8">
            <button
              v-if="meta.current_page > 1"
              class="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors"
              @click="loadPage(meta!.current_page - 1)"
            >
              Previous
            </button>
            <span class="text-xs text-gray-400">
              Page {{ meta.current_page }} of {{ meta.last_page }}
            </span>
            <button
              v-if="meta.current_page < meta.last_page"
              class="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors"
              @click="loadPage(meta!.current_page + 1)"
            >
              Next
            </button>
          </div>
        </div>

        <div v-else class="py-32 flex flex-col items-center justify-center text-center space-y-8 bg-gray-50 border border-dashed border-gray-200">
          <Bell class="w-12 h-12 text-gray-300" />
          <div class="space-y-2">
            <h2 class="text-xl font-bold uppercase tracking-tight">No notifications</h2>
            <p class="text-gray-500 text-xs uppercase tracking-widest">You're all caught up!</p>
          </div>
          <NuxtLink to="/shop" class="btn btn-primary px-10 py-4 uppercase text-xs tracking-widest font-bold">
            Continue Shopping
          </NuxtLink>
        </div>
      </main>
    </div>
  </div>
</template>
