<script setup lang="ts">
import { Mail, Phone, MapPin } from 'lucide-vue-next'
const { notify } = useNotify()

useSeoMeta({
  title: 'Contact | SimpCommerce',
  description: 'Get in touch with our team.',
})
</script>

<template>
  <div class="container py-20 max-w-4xl mx-auto">
    <div class="space-y-4 border-b border-gray-100 pb-10 mb-16">
      <h1 class="text-4xl font-bold uppercase tracking-tight">Contact</h1>
      <p class="text-gray-500 text-xs uppercase tracking-[0.3em]">We'd love to hear from you</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
      <div class="space-y-8">
        <div class="flex items-start gap-6">
          <Mail class="w-5 h-5 text-gray-400 mt-1 shrink-0" />
          <div>
            <h3 class="text-sm font-bold uppercase tracking-widest mb-1">Email</h3>
            <p class="text-sm text-gray-500">hello@simpcommerce.com</p>
          </div>
        </div>
        <div class="flex items-start gap-6">
          <Phone class="w-5 h-5 text-gray-400 mt-1 shrink-0" />
          <div>
            <h3 class="text-sm font-bold uppercase tracking-widest mb-1">Phone</h3>
            <p class="text-sm text-gray-500">+95 1 234 5678</p>
          </div>
        </div>
        <div class="flex items-start gap-6">
          <MapPin class="w-5 h-5 text-gray-400 mt-1 shrink-0" />
          <div>
            <h3 class="text-sm font-bold uppercase tracking-widest mb-1">Address</h3>
            <p class="text-sm text-gray-500">123 Merchant Road<br />Yangon, Myanmar</p>
          </div>
        </div>
      </div>

      <form @submit.prevent="notify('Message sent successfully. We will get back to you soon.', 'success')" class="space-y-6">
        <div>
          <label class="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Name</label>
          <input type="text" autocomplete="name" required class="w-full border border-gray-200 p-4 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="Your name" />
        </div>
        <div>
          <label class="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Email</label>
          <input type="email" autocomplete="email" required class="w-full border border-gray-200 p-4 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="your@email.com" />
        </div>
        <div>
          <label class="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Message</label>
          <textarea rows="5" required class="w-full border border-gray-200 p-4 text-sm focus:outline-none focus:border-primary transition-colors resize-none" placeholder="How can we help?" />
        </div>
        <button type="submit" class="btn btn-primary w-full py-4 text-xs font-bold uppercase tracking-widest">Send Message</button>
      </form>
    </div>
  </div>
</template>
