<script setup lang="ts">
const { register } = useAuth()
const wishlistStore = useWishlistStore()
const cartStore = useCartStore()
const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})
const isLoading = ref(false)
const error = ref('')

useSeoMeta({
  title: 'Register | SimpCommerce',
  description: 'Create your SimpCommerce account.',
})

const handleRegister = async () => {
  isLoading.value = true
  error.value = ''
  try {
    await register(form)
    await wishlistStore.syncWishlist()
    await cartStore.syncCart()
    navigateTo('/')
  } catch (err: any) {
    error.value = err.data?.message || 'Registration failed. Please check your details.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container py-32 flex justify-center">
    <div class="w-full max-w-md space-y-12">
      <div class="text-center space-y-4">
        <h1 class="text-3xl font-bold uppercase tracking-tighter">Register</h1>
        <p class="text-gray-500 text-sm uppercase tracking-widest">Join SimpCommerce today</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div v-if="error" class="bg-red-50 text-red-500 p-4 text-xs font-bold uppercase tracking-widest text-center">
          {{ error }}
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
          <input 
            v-model="form.name"
            type="text" 
            required
            autocomplete="name"
            class="w-full border-b border-gray-200 focus:border-accent outline-none py-3 text-sm transition-colors"
            placeholder="John Doe"
          >
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
          <input 
            v-model="form.email"
            type="email" 
            required
            autocomplete="email"
            class="w-full border-b border-gray-200 focus:border-accent outline-none py-3 text-sm transition-colors"
            placeholder="example@mail.com"
          >
        </div>



        <div class="space-y-2">
          <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Password</label>
          <input 
            v-model="form.password"
            type="password" 
            required
            autocomplete="new-password"
            class="w-full border-b border-gray-200 focus:border-accent outline-none py-3 text-sm transition-colors"
            placeholder="••••••••"
          >
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Confirm Password</label>
          <input 
            v-model="form.password_confirmation"
            type="password" 
            required
            autocomplete="new-password"
            class="w-full border-b border-gray-200 focus:border-accent outline-none py-3 text-sm transition-colors"
            placeholder="••••••••"
          >
        </div>

        <p class="text-[10px] text-gray-400 text-center leading-relaxed">
          By registering, you agree to our <NuxtLink to="/terms" class="underline hover:text-primary">Terms of Service</NuxtLink> and <NuxtLink to="/terms" class="underline hover:text-primary">Privacy Policy</NuxtLink>.
        </p>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-primary text-white py-5 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
        >
          {{ isLoading ? 'Creating Account...' : 'Register' }}
        </button>
      </form>

      <div class="text-center">
        <p class="text-xs text-gray-400 uppercase tracking-widest font-bold pt-6">
          Already have an account? 
          <NuxtLink to="/login" class="text-primary hover:text-accent border-b border-primary ml-2">Login Here</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
