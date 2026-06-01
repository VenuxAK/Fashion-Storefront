<script setup lang="ts">
useSeoMeta({
  title: 'Shipping | SimpCommerce',
  description: 'Shipping policy and delivery information.',
})
</script>

<template>
  <div class="container py-20 max-w-4xl mx-auto">
    <div class="space-y-4 border-b border-gray-100 pb-10 mb-16">
      <h1 class="text-4xl font-bold uppercase tracking-tight">Shipping Policy</h1>
      <p class="text-gray-500 text-xs uppercase tracking-[0.3em]">Delivery information and costs</p>
    </div>

    <div class="space-y-8 text-gray-600 text-sm leading-relaxed">
      <section class="space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-widest text-primary">Processing Time</h2>
        <p>Orders are processed within 1-2 business days after placement. You will receive a confirmation email once your order has been shipped.</p>
      </section>

      <section class="space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-widest text-primary">Shipping Methods & Costs</h2>
        <div class="space-y-3">
          <div class="flex justify-between border-b border-gray-100 pb-3">
            <span class="font-medium">Standard Shipping</span>
            <span class="text-gray-500">3-5 business days</span>
            <span class="font-bold">Free</span>
          </div>
          <div class="flex justify-between border-b border-gray-100 pb-3">
            <span class="font-medium">Express Shipping</span>
            <span class="text-gray-500">1-2 business days</span>
            <span class="font-bold">$5.00</span>
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-widest text-primary">International Shipping</h2>
        <p>We ship worldwide. International orders typically arrive within 7-14 business days. Customs fees and import duties may apply and are the responsibility of the customer.</p>
      </section>

      <section class="space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-widest text-primary">Order Tracking</h2>
        <p>Once shipped, you will receive a tracking number via email. You can also track your order from your account dashboard under "My Orders".</p>
      </section>

      <section class="space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-widest text-primary">Delivery Issues</h2>
        <p>If your order has not arrived within the estimated timeframe, please contact our support team. We will investigate and resolve the issue promptly.</p>
      </section>
    </div>
  </div>
</template>
