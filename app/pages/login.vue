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

useSeoMeta({
  title: 'Login | SimpCommerce',
  description: 'Sign in to your SimpCommerce account.',
})

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
            autocomplete="current-password"
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
          <button @click="handleGoogleLogin" class="w-12 h-12 border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors" title="Login with Google">
            <svg viewBox="0 0 24 24" width="20" height="20" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
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
