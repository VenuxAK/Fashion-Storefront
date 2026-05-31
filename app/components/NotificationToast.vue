<script setup lang="ts">
import { X, CheckCircle, AlertCircle, Info } from 'lucide-vue-next'

const { notifications, remove } = useNotify()

const getIcon = (type: string) => {
  switch (type) {
    case 'success': return CheckCircle
    case 'error': return AlertCircle
    default: return Info
  }
}

const getColors = (type: string) => {
  switch (type) {
    case 'success': return 'bg-white border-green-100 text-green-600'
    case 'error': return 'bg-white border-red-100 text-red-600'
    default: return 'bg-white border-blue-100 text-blue-600'
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-24 right-6 z-[200] space-y-4 w-full max-w-sm pointer-events-none">
      <TransitionGroup
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-10"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-10"
      >
        <div 
          v-for="note in notifications" 
          :key="note.id"
          class="pointer-events-auto border shadow-xl p-5 flex items-start space-x-4 animate-in slide-in-from-right-full"
          :class="getColors(note.type)"
        >
          <div class="flex-shrink-0 pt-0.5">
            <component :is="getIcon(note.type)" class="w-5 h-5" />
          </div>
          <div class="flex-grow space-y-1">
            <p class="text-xs font-bold uppercase tracking-widest">{{ note.type }}</p>
            <p class="text-sm text-gray-900 font-medium leading-relaxed">{{ note.message }}</p>
          </div>
          <button @click="remove(note.id)" class="text-gray-400 hover:text-gray-900 transition-colors pt-0.5">
            <X class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.animate-in {
  animation-duration: 0.3s;
}
</style>
