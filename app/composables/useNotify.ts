import { ref } from 'vue'

export interface Notification {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

const notifications = ref<Notification[]>([])
let nextId = 0

export const useNotify = () => {
  const notify = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = nextId++
    notifications.value.push({ id, message, type })
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      remove(id)
    }, 5000)
  }

  const remove = (id: number) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  return {
    notifications,
    notify,
    remove
  }
}
