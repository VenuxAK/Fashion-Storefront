const CHECK_INTERVAL = 60000
const STORAGE_KEY = 'order-status-snapshot'
const COUNT_KEY = 'order-notif-count'

export function useOrderNotifications() {
  const { isLoggedIn } = useAuth()
  const { notify } = useNotify()
  const api = useApi()

  const unreadCount = ref(0)
  let intervalId: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    const saved = localStorage.getItem(COUNT_KEY)
    if (saved) unreadCount.value = parseInt(saved) || 0
  })

  function getSnapshot(): Record<number, string> {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
    catch { return {} }
  }

  function saveSnapshot(snapshot: Record<number, string>) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
  }

  async function checkOrders() {
    try {
      const res: any = await api('/my/orders')
      const orders: any[] = res?.data || []
      const snapshot = getSnapshot()
      const isFirstRun = Object.keys(snapshot).length === 0
      const newSnapshot: Record<number, string> = {}

      for (const order of orders) {
        newSnapshot[order.id] = order.status
        if (isFirstRun) continue
        const prevStatus = snapshot[order.id]
        if (prevStatus && prevStatus !== order.status) {
          unreadCount.value++
          localStorage.setItem(COUNT_KEY, String(unreadCount.value))
          notify(
            `Order #${order.order_number} is now "${order.status}".`,
            order.status === 'cancelled' ? 'error' : 'success'
          )
        }
      }

      saveSnapshot(newSnapshot)
    } catch {}
  }

  function startPolling() {
    if (!isLoggedIn.value) return
    checkOrders()
    stopPolling()
    intervalId = setInterval(checkOrders, CHECK_INTERVAL)
  }

  function stopPolling() {
    if (intervalId) { clearInterval(intervalId); intervalId = null }
  }

  function markAllRead() {
    unreadCount.value = 0
    localStorage.removeItem(COUNT_KEY)
  }

  onMounted(() => {
    if (isLoggedIn.value) startPolling()
  })

  watch(isLoggedIn, (loggedIn) => {
    if (loggedIn) startPolling()
    else stopPolling()
  })

  onUnmounted(() => stopPolling())

  return { unreadCount, markAllRead }
}
