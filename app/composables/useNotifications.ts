import type { OrderNotification, PaginatedResponse } from '~/types'

const CHECK_INTERVAL = 60000

export function useNotifications() {
  const { isLoggedIn } = useAuth()
  const { notify } = useNotify()
  const api = useApi()
  const nuxt = useNuxtApp()

  const unreadCount = ref(0)
  let intervalId: ReturnType<typeof setInterval> | null = null

  async function fetchUnreadCount() {
    try {
      const res: any = await api('/customer/notifications/unread-count')
      unreadCount.value = res?.count ?? 0
    } catch { unreadCount.value = 0 }
  }

  async function getNotifications(params?: Record<string, any>): Promise<PaginatedResponse<OrderNotification>> {
    return api('/customer/notifications', { params })
  }

  async function markRead(id: number): Promise<void> {
    await api(`/customer/notifications/${id}/read`, { method: 'PUT' })
  }

  async function markAllRead(): Promise<void> {
    await api('/customer/notifications/read-all', { method: 'POST' })
    unreadCount.value = 0
  }

  async function clearNotifications(): Promise<void> {
    await api('/customer/notifications/clear', { method: 'DELETE' })
    unreadCount.value = 0
  }

  function startPolling() {
    if (!isLoggedIn.value) return
    fetchUnreadCount()
    stopPolling()
    intervalId = setInterval(fetchUnreadCount, CHECK_INTERVAL)
  }

  function stopPolling() {
    if (intervalId) { clearInterval(intervalId); intervalId = null }
  }

  let echoChannel: any = null

  function startEchoListener() {
    if (!process.client || !isLoggedIn.value) return
    const echo = nuxt.$echo as any
    if (!echo) return

    stopEchoListener()
    const config = useRuntimeConfig()
    const storeSlug = import.meta.server ? '' : (config.public.storeSlug as string)

    echoChannel = echo.channel(`store.${storeSlug || 'clothing'}`)

    echoChannel.listen('.new-order', (data: any) => {
      notify(`New order: ${data.title}`, 'info')
      fetchUnreadCount()
    })

    echoChannel.listen('.payment-confirmed', (data: any) => {
      notify(`Payment confirmed: ${data.title}`, 'success')
      fetchUnreadCount()
    })
  }

  function stopEchoListener() {
    if (echoChannel) {
      const echo = nuxt.$echo as any
      if (echo) echo.leaveChannel(`store.clothing`)
      echoChannel = null
    }
  }

  onMounted(() => {
    if (isLoggedIn.value) {
      startPolling()
      startEchoListener()
    }
  })

  watch(isLoggedIn, (loggedIn) => {
    if (loggedIn) {
      startPolling()
      startEchoListener()
    } else {
      stopPolling()
      stopEchoListener()
    }
  })

  onUnmounted(() => {
    stopPolling()
    stopEchoListener()
  })

  return { unreadCount, getNotifications, markRead, markAllRead, clearNotifications }
}
