<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

useSeoMeta({
  title: 'FAQ | SimpCommerce',
  description: 'Frequently asked questions about payments, ordering, shipping, returns, and account management.',
})

const faqs = [
  { q: 'What payment methods do you accept?', a: 'We accept online card payments via Stripe (Visa, Mastercard, American Express) and Cash on Delivery (COD) for local orders. All online payments are processed securely — we do not store your card details.' },
  { q: 'How long does shipping take?', a: 'Standard shipping takes 3-5 business days for local orders. International shipping may take 7-14 business days depending on your destination country.' },
  { q: 'Do you ship internationally?', a: 'Yes, we ship worldwide. International shipping rates are calculated at checkout based on your destination. Duties and customs fees may apply and are the responsibility of the recipient.' },
  { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and with original tags attached. Refunds are processed to the original payment method within 5-7 business days after we receive the return.' },
  { q: 'How do I track my order?', a: 'Once your order has shipped, you will receive a confirmation email. You can also check your order status anytime from your account dashboard under My Orders.' },
  { q: 'Can I cancel or modify my order?', a: 'You can cancel your order from your account dashboard as long as it is still in "Processing" status. Once an order has been shipped, it cannot be cancelled. To modify an order, contact our support team as soon as possible.' },
  { q: 'How do I find the right size?', a: 'Size guides are available on each product page. We recommend checking the size chart and fit notes before ordering. If you are between sizes, we suggest sizing up for a more relaxed fit.' },
  { q: 'Is my personal and payment information secure?', a: 'Yes. Our site uses SSL encryption for all data transmission. Online payments are handled by Stripe, a PCI-DSS Level 1 certified payment processor. We never have access to your full card details.' },
  { q: 'How do I care for my garments?', a: 'Follow the care instructions on each garment\'s label. In general: wash in cold water with similar colors, use mild detergent, and hang or lay flat to dry. Avoid bleach and high-heat drying to extend the life of your clothing.' },
  { q: 'How do I contact customer support?', a: 'You can reach us by email at hello@simpcommerce.com, by phone at +95 1 234 5678, or by using the contact form on our Contact page. We respond within 24 hours on business days.' },
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
