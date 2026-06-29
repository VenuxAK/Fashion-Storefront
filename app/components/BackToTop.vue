<script setup lang="ts">
import { ChevronUp } from 'lucide-vue-next'
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()
const isVisible = computed(() => y.value > 600)

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-10"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-10"
  >
    <button 
      v-if="isVisible"
      @click="scrollToTop"
      class="fixed bottom-10 right-10 z-100 w-12 h-12 bg-white border border-gray-100 shadow-xl rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
    >
      <ChevronUp class="w-6 h-6" />
    </button>
  </Transition>
</template>
