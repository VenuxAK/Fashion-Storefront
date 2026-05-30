<script setup lang="ts">
import { MapPin, Plus, Trash2, CheckCircle } from 'lucide-vue-next'

definePageMeta({
  middleware: 'auth'
})

const { getAddresses, createAddress } = useCheckout() // Reusing from useCheckout
const api = useApi() // For delete and default actions

const addresses = ref([])
const isLoading = ref(false)
const isAddingAddress = ref(false)

const newAddress = reactive({
  name: '', phone: '', street: '', city: '', state: '', postal_code: '', is_default: false
})

const fetchAddresses = async () => {
  isLoading.value = true
  try {
    const response: any = await getAddresses()
    addresses.value = response.data
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const handleAddAddress = async () => {
  isLoading.value = true
  try {
    await createAddress(newAddress)
    await fetchAddresses()
    isAddingAddress.value = false
    Object.assign(newAddress, {
      name: '', phone: '', street: '', city: '', state: '', postal_code: '', is_default: false
    })
  } catch (err) {
    alert('Failed to add address.')
  } finally {
    isLoading.value = false
  }
}

const deleteAddress = async (id: number) => {
  if (!confirm('Are you sure you want to delete this address?')) return
  try {
    await api(`/addresses/${id}`, { method: 'DELETE' })
    await fetchAddresses()
  } catch (err) {
    alert('Failed to delete address.')
  }
}

const setDefault = async (id: number) => {
  try {
    await api(`/addresses/${id}/default`, { method: 'PUT' })
    await fetchAddresses()
  } catch (err) {
    alert('Failed to set default address.')
  }
}

onMounted(() => {
  fetchAddresses()
})
</script>

<template>
  <div class="container py-20">
    <div class="flex flex-col lg:flex-row gap-16">
      <UserNav />

      <main class="flex-grow space-y-12">
        <div class="flex justify-between items-end border-b border-gray-100 pb-8">
          <div class="space-y-4">
            <h1 class="text-3xl font-bold uppercase tracking-tighter">Address Book</h1>
            <p class="text-gray-500 text-xs uppercase tracking-[0.3em]">Manage your shipping locations</p>
          </div>
          <button 
            @click="isAddingAddress = !isAddingAddress"
            class="text-xs font-bold uppercase tracking-widest text-accent hover:text-primary transition-colors border-b-2 border-accent pb-1"
          >
            {{ isAddingAddress ? 'Cancel' : '+ Add New' }}
          </button>
        </div>

        <div v-if="isAddingAddress" class="bg-gray-50 p-10 space-y-8 max-w-2xl">
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Recipient Name</label>
              <input v-model="newAddress.name" type="text" class="w-full bg-white border-none px-4 py-4 text-sm focus:ring-1 focus:ring-accent outline-none shadow-sm">
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number</label>
              <input v-model="newAddress.phone" type="text" class="w-full bg-white border-none px-4 py-4 text-sm focus:ring-1 focus:ring-accent outline-none shadow-sm">
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Street Address</label>
            <input v-model="newAddress.street" type="text" class="w-full bg-white border-none px-4 py-4 text-sm focus:ring-1 focus:ring-accent outline-none shadow-sm">
          </div>
          <div class="grid grid-cols-3 gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">City</label>
              <input v-model="newAddress.city" type="text" class="w-full bg-white border-none px-4 py-4 text-sm focus:ring-1 focus:ring-accent outline-none shadow-sm">
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">State</label>
              <input v-model="newAddress.state" type="text" class="w-full bg-white border-none px-4 py-4 text-sm focus:ring-1 focus:ring-accent outline-none shadow-sm">
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Postal Code</label>
              <input v-model="newAddress.postal_code" type="text" class="w-full bg-white border-none px-4 py-4 text-sm focus:ring-1 focus:ring-accent outline-none shadow-sm">
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <input v-model="newAddress.is_default" type="checkbox" id="default-check" class="accent-accent">
            <label for="default-check" class="text-[10px] font-bold uppercase tracking-widest text-gray-400 cursor-pointer">Set as default address</label>
          </div>
          <button @click="handleAddAddress" :disabled="isLoading" class="btn btn-primary px-12 py-5 text-xs">Save Address</button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            v-for="address in addresses" 
            :key="address.id"
            class="border border-gray-100 p-8 space-y-6 flex flex-col justify-between hover:shadow-lg transition-shadow relative overflow-hidden"
          >
            <div v-if="address.is_default" class="absolute top-0 right-0 bg-accent text-white text-[8px] font-bold uppercase tracking-widest px-4 py-1">Default</div>
            
            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-accent">
                  <MapPin class="w-5 h-5" />
                </div>
                <div>
                  <p class="text-sm font-bold uppercase">{{ address.name }}</p>
                  <p class="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{{ address.phone }}</p>
                </div>
              </div>
              <p class="text-xs text-gray-500 leading-loose">
                {{ address.street }}<br>
                {{ address.city }}, {{ address.state }} {{ address.postal_code }}
              </p>
            </div>

            <div class="flex items-center justify-between pt-6 border-t border-gray-50">
              <button 
                v-if="!address.is_default"
                @click="setDefault(address.id)"
                class="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-accent flex items-center"
              >
                Set Default
              </button>
              <div v-else class="text-[10px] font-bold uppercase tracking-widest text-green-500 flex items-center">
                <CheckCircle class="w-3 h-3 mr-1" /> Primary
              </div>

              <button @click="deleteAddress(address.id)" class="text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
