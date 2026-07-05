<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

interface Banner {
  title: string
  subtitle?: string
  image: string
  link: string
  buttonText?: string
  textColor?: string // e.g. 'text-white' or 'text-gray-900'
  align?: 'left' | 'center' | 'right'
  overlay?: boolean
}

const props = withDefaults(defineProps<{
  banner: Banner
  heightClass?: string // e.g., 'h-[300px]' or 'aspect-[2/1]'
}>(), {
  heightClass: 'h-full min-h-[250px]'
})
</script>

<template>
  <NuxtLink 
    :to="banner.link" 
    class="relative block w-full overflow-hidden group rounded-sm"
    :class="heightClass"
  >
    <!-- Background Image -->
    <div class="absolute inset-0 bg-gray-200">
      <NuxtImg 
        :src="banner.image" 
        :alt="banner.title"
        format="webp"
        loading="lazy"
        fetchpriority="low"
        sizes="100vw"
        class="w-full h-full object-cover transition-transform duration-700"
      />
    </div>

    <!-- Content -->
    <div 
      class="relative h-full flex flex-col p-8 md:p-12 z-10"
      :class="[
        banner.align === 'center' ? 'items-center text-center justify-center' :
        banner.align === 'right' ? 'items-end text-right justify-center' :
        'items-start text-left justify-center',
        banner.textColor || 'text-white'
      ]"
    >
      <p v-if="banner.subtitle" class="text-sm md:text-base font-semibold tracking-widest uppercase mb-2">
        {{ banner.subtitle }}
      </p>
      <h3 class="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 max-w-md">
        {{ banner.title }}
      </h3>
      
      <button 
        v-if="banner.buttonText" 
        class="px-6 py-2.5 border-2 text-sm font-semibold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
        :class="banner.textColor === 'text-gray-900' ? 'border-gray-900 hover:bg-gray-900 hover:text-white' : 'border-white hover:bg-white hover:text-gray-900'"
      >
        {{ banner.buttonText }}
      </button>
    </div>
  </NuxtLink>
</template>
