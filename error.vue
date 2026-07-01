<script setup lang="ts">
import { computed } from 'vue'
import { clearError } from '#app'
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })

// We handle specifically our 503 (Store Unavailable) or standard 404s.
const isMaintenance = computed(() => props.error?.statusCode === 503)
</script>

<template>
  <div class="min-h-screen bg-[#F6F9FC] flex flex-col items-center justify-center p-4 selection:bg-rose-100">
    <!-- Maintenance State -->
    <div v-if="isMaintenance" class="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-1000">
      <div class="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-rose-500"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
      </div>
      <div class="space-y-4">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">We'll be right back</h1>
        <p class="text-gray-500 leading-relaxed">
          The store is currently down for scheduled maintenance. We're working hard to bring you an even better shopping experience. Please check back soon.
        </p>
      </div>
      <button @click="handleError" class="mt-8 bg-gray-900 text-white font-medium px-8 py-3 rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 active:scale-95 duration-200">
        Refresh Page
      </button>
    </div>

    <!-- Generic 404 / Error State -->
    <div v-else class="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-1000">
      <div class="text-[120px] font-black text-gray-200 leading-none select-none tracking-tighter">
        {{ error?.statusCode || 'Oops' }}
      </div>
      <div class="space-y-4">
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Something went wrong</h1>
        <p class="text-gray-500 leading-relaxed">
          {{ error?.message || 'We couldn\'t find the page you were looking for.' }}
        </p>
      </div>
      <button @click="handleError" class="mt-8 bg-gray-900 text-white font-medium px-8 py-3 rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 active:scale-95 duration-200">
        Return Home
      </button>
    </div>
  </div>
</template>
