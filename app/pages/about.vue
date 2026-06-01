<script setup lang="ts">
useSeoMeta({
  title: 'About Us | SimpCommerce',
  description: 'Learn about our brand and mission.',
})
</script>

<template>
  <div class="container py-20 max-w-4xl mx-auto">
    <div class="space-y-4 border-b border-gray-100 pb-10 mb-16">
      <h1 class="text-4xl font-bold uppercase tracking-tight">Our Story</h1>
      <p class="text-gray-500 text-xs uppercase tracking-[0.3em]">Modern minimalism for everyday life</p>
    </div>

    <div class="space-y-8 text-gray-600 leading-relaxed">
      <p class="text-lg font-light">
        SimpCommerce was born from a simple belief: great design doesn't need to be complicated. 
        We create clothing that strips away the unnecessary, leaving only what matters — 
        quality materials, clean lines, and timeless silhouettes.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 my-20">
        <div class="text-center space-y-4">
          <div class="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">Q</div>
          <h3 class="font-bold uppercase text-sm tracking-widest">Quality First</h3>
          <p class="text-sm">Every piece is crafted from premium materials, sourced responsibly and built to last.</p>
        </div>
        <div class="text-center space-y-4">
          <div class="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">M</div>
          <h3 class="font-bold uppercase text-sm tracking-widest">Minimal Design</h3>
          <p class="text-sm">Clean aesthetics that transcend seasons. No logos, no trends — just timeless style.</p>
        </div>
        <div class="text-center space-y-4">
          <div class="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">S</div>
          <h3 class="font-bold uppercase text-sm tracking-widest">Sustainable</h3>
          <p class="text-sm">We believe in slow fashion. Smaller collections, better quality, less waste.</p>
        </div>
      </div>

      <p class="text-sm">
        Based in Myanmar, we ship worldwide. Every order is packed with care in 
        recyclable materials. Thank you for supporting thoughtful design.
      </p>
    </div>
  </div>
</template>
