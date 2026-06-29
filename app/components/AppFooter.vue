<script setup lang="ts">
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-vue-next'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-white border-t border-gray-100 pt-20 pb-10">
    <div class="container">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <!-- Brand -->
        <div class="space-y-6">
          <h3 class="text-xl font-bold uppercase tracking-tighter">SimpCommerce</h3>
          <p class="text-gray-500 text-sm leading-loose">
            High-quality fashion essentials for the modern wardrobe. Minimalist designs, sustainable practices, and premium materials.
          </p>
          <div class="flex items-center space-x-4">
            <a href="#" class="text-gray-400 hover:text-accent transition-colors"><Facebook class="w-5 h-5" /></a>
            <a href="#" class="text-gray-400 hover:text-accent transition-colors"><Instagram class="w-5 h-5" /></a>
            <a href="#" class="text-gray-400 hover:text-accent transition-colors"><Twitter class="w-5 h-5" /></a>
            <a href="#" class="text-gray-400 hover:text-accent transition-colors"><Youtube class="w-5 h-5" /></a>
          </div>
        </div>

        <!-- Links: Shop -->
        <div>
          <h4 class="text-sm font-bold uppercase mb-8">Shop</h4>
          <ul class="space-y-4 text-sm text-gray-500">
            <li><NuxtLink to="/shop" class="hover:text-accent transition-colors">New Arrivals</NuxtLink></li>
            <li><NuxtLink to="/shop" class="hover:text-accent transition-colors">Best Sellers</NuxtLink></li>
            <li><NuxtLink to="/shop" class="hover:text-accent transition-colors">Men's Collection</NuxtLink></li>
            <li><NuxtLink to="/shop" class="hover:text-accent transition-colors">Women's Collection</NuxtLink></li>
          </ul>
        </div>

        <!-- Links: Support -->
        <div>
          <h4 class="text-sm font-bold uppercase mb-8">Support</h4>
          <ul class="space-y-4 text-sm text-gray-500">
            <li><NuxtLink to="/contact" class="hover:text-accent transition-colors">Contact Us</NuxtLink></li>
            <li><NuxtLink to="/shipping" class="hover:text-accent transition-colors">Shipping & Returns</NuxtLink></li>
            <li><NuxtLink to="/faq" class="hover:text-accent transition-colors">FAQs</NuxtLink></li>
            <li><NuxtLink to="/terms" class="hover:text-accent transition-colors">Terms of Service</NuxtLink></li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h4 class="text-sm font-bold uppercase mb-8">Newsletter</h4>
          <p class="text-gray-500 text-sm mb-6">Subscribe to get special offers and updates.</p>
          <form @submit.prevent class="flex w-full">
            <input 
              type="email" 
              placeholder="Your email address" 
              class="grow bg-gray-50 border-none px-4 py-3 text-sm focus:ring-1 focus:ring-accent outline-none min-w-0"
            >
            <button type="submit" class="bg-primary text-white px-6 py-3 text-xs uppercase font-bold tracking-widest hover:bg-black transition-colors shrink-0">
              Join
            </button>
          </form>
        </div>
      </div>

      <div class="border-t border-gray-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] md:text-xs text-gray-400 uppercase tracking-wider md:tracking-widest">
        <p class="text-center md:text-left order-2 md:order-1">&copy; {{ currentYear }} SimpCommerce. All Rights Reserved.</p>
        <div class="flex items-center justify-center space-x-6 order-1 md:order-2">
          <span class="hover:text-primary cursor-pointer">Privacy Policy</span>
          <span class="hover:text-primary cursor-pointer">Sitemap</span>
        </div>
      </div>
    </div>
  </footer>
</template>
