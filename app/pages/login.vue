<script setup lang="ts">
const { login } = useAuth()
const wishlistStore = useWishlistStore()
const cartStore = useCartStore()
const form = reactive({
  email: '',
  password: ''
})
const isLoading = ref(false)
const error = ref('')

const handleLogin = async () => {
  isLoading.value = true
  error.value = ''
  try {
    await login(form)
    await wishlistStore.syncWishlist()
    await cartStore.syncCart()
    navigateTo('/')
  } catch (err: any) {
    error.value = err.data?.message || 'Login failed. Please check your credentials.'
  } finally {
    isLoading.value = false
  }
}

const handleGoogleLogin = async () => {
  try {
    const api = useApi()
    const response: any = await api('/auth/oauth/google/redirect')
    if (response.redirect_url) {
      window.location.href = response.redirect_url
    }
  } catch (err) {
    error.value = 'Failed to initialize Google login. Please try again later.'
  }
}
</script>

<template>
  <div class="container py-32 flex justify-center">
    <div class="w-full max-w-md space-y-12">
      <div class="text-center space-y-4">
        <h1 class="text-3xl font-bold uppercase tracking-tighter">Login</h1>
        <p class="text-gray-500 text-sm uppercase tracking-widest">Welcome back to SimpCommerce</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div v-if="error" class="bg-red-50 text-red-500 p-4 text-xs font-bold uppercase tracking-widest text-center">
          {{ error }}
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
          <input 
            v-model="form.email"
            type="email" 
            required
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
            class="w-full border-b border-gray-200 focus:border-accent outline-none py-3 text-sm transition-colors"
            placeholder="••••••••"
          >
        </div>

        <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
          <label class="flex items-center space-x-2 cursor-pointer text-gray-400 hover:text-primary">
            <input type="checkbox" class="accent-primary">
            <span>Remember Me</span>
          </label>
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-primary text-white py-5 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
        >
          {{ isLoading ? 'Loading...' : 'Login' }}
        </button>
      </form>

      <div class="text-center space-y-6">
        <p class="text-xs text-gray-400 uppercase tracking-widest font-bold">Or login with</p>
        <div class="flex justify-center space-x-4">
          <button @click="handleGoogleLogin" class="w-12 h-12 border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <img src="https://www.svgrepo.com/show/355037/google.svg" class="w-5 h-5">
          </button>
        </div>
        <p class="text-xs text-gray-400 uppercase tracking-widest font-bold pt-6">
          Don't have an account? 
          <NuxtLink to="/register" class="text-primary hover:text-accent border-b border-primary ml-2">Register Now</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
