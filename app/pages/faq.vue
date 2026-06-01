<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

useSeoMeta({
  title: 'FAQ | SimpCommerce',
  description: 'Frequently asked questions about ordering, shipping, and returns.',
})

const faqs = [
  { q: 'What payment methods do you accept?', a: 'We currently accept Cash on Delivery (COD) for local orders. Online payment options will be available soon.' },
  { q: 'How long does shipping take?', a: 'Standard shipping takes 3-5 business days for local orders. International shipping may take 7-14 business days depending on your location.' },
  { q: 'Do you ship internationally?', a: 'Yes, we ship worldwide. Shipping costs and delivery times vary by destination.' },
  { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery. Items must be unworn with tags attached. Contact our support team to initiate a return.' },
  { q: 'How do I track my order?', a: 'Once your order ships, you will receive a tracking number via email. You can also view your order status in your account dashboard.' },
  { q: 'Can I cancel my order?', a: 'Yes, you can cancel your order from your account dashboard as long as it is still in "Processing" status. Once shipped, orders cannot be cancelled.' },
  { q: 'Do you have a size guide?', a: 'Yes, size guides are available on each product page. If you need further assistance, please contact our support team.' },
  { q: 'How do I care for my garments?', a: 'We recommend following the care instructions on each garment\'s label. Generally, wash in cold water and hang dry to extend the life of your clothing.' },
]

const openIndex = ref<number | null>(null)

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}
</script>

<template>
  <div class="container py-20 max-w-3xl mx-auto">
    <div class="space-y-4 border-b border-gray-100 pb-10 mb-16 text-center">
      <h1 class="text-4xl font-bold uppercase tracking-tight">FAQ</h1>
      <p class="text-gray-500 text-xs uppercase tracking-[0.3em]">Frequently asked questions</p>
    </div>

    <div class="space-y-4">
      <div
        v-for="(faq, i) in faqs" :key="i"
        class="border border-gray-100"
      >
        <button
          @click="toggle(i)"
          class="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
        >
          <span class="text-sm font-bold uppercase tracking-widest">{{ faq.q }}</span>
          <ChevronDown class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="openIndex === i ? 'rotate-180' : ''" />
        </button>
        <div v-if="openIndex === i" class="px-6 pb-6 text-sm text-gray-500 leading-relaxed">
          {{ faq.a }}
        </div>
      </div>
    </div>
  </div>
</template>
