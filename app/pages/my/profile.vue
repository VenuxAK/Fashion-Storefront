<script setup lang="ts">
definePageMeta({
  middleware: 'sanctum:auth'
})

const { user } = useAuth()
const { updateProfile } = useProfile()

const form = reactive({
  name: user.value?.name || '',
  email: user.value?.email || '',
  password: '',
  password_confirmation: ''
})

const isLoading = ref(false)
const message = ref({ type: '', text: '' })

const handleUpdate = async () => {
  isLoading.value = true
  message.value = { type: '', text: '' }
  try {
    const data = { ...form } as Record<string, any>
    if (!data.password) {
      delete data.password
      delete data.password_confirmation
    }
    await updateProfile(data as any)
    message.value = { type: 'success', text: 'Profile updated successfully.' }
  } catch (err: any) {
    message.value = { type: 'error', text: err.data?.message || 'Failed to update profile.' }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container py-20">
    <div class="flex flex-col lg:flex-row gap-16">
      <UserNav />

      <main class="grow space-y-12">
        <div class="space-y-4 border-b border-gray-100 pb-8">
          <h1 class="text-3xl font-bold uppercase tracking-tighter">Profile Settings</h1>
          <p class="text-gray-500 text-xs uppercase tracking-[0.3em]">Update your personal information</p>
        </div>

        <div class="max-w-2xl">
          <form @submit.prevent="handleUpdate" class="space-y-8">
            <div v-if="message.text" :class="[message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600']" class="p-4 text-xs font-bold uppercase tracking-widest text-center">
              {{ message.text }}
            </div>

            <div class="space-y-6">
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                <input v-model="form.name" type="text" required class="w-full border-b border-gray-100 focus:border-accent outline-none py-4 text-sm transition-colors" placeholder="Your Name">
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                <input v-model="form.email" type="email" required class="w-full border-b border-gray-100 focus:border-accent outline-none py-4 text-sm transition-colors" placeholder="your@email.com">
              </div>

              <div class="pt-8 border-t border-gray-100">
                <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">Change Password (Leave blank to keep current)</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">New Password</label>
                    <input v-model="form.password" type="password" class="w-full border-b border-gray-100 focus:border-accent outline-none py-4 text-sm transition-colors" placeholder="••••••••">
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Confirm New Password</label>
                    <input v-model="form.password_confirmation" type="password" class="w-full border-b border-gray-100 focus:border-accent outline-none py-4 text-sm transition-colors" placeholder="••••••••">
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-8">
              <button 
                type="submit" 
                :disabled="isLoading"
                class="bg-primary text-white px-12 py-5 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
              >
                {{ isLoading ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  </div>
</template>
