<script setup lang="ts">
import { Truck, CreditCard, ShieldCheck } from 'lucide-vue-next'

definePageMeta({ middleware: 'sanctum:auth' })

const { getAddresses, createAddress, placeOrder, createPaymentIntent } = useCheckout()
const cartStore = useCartStore()
const { notify } = useNotify()
const { url } = useImage()

const addresses = ref<any[]>([])
const selectedAddressId = ref<number | null>(null)
const isAddingAddress = ref(false)
const isLoading = ref(false)
const isPlacingOrder = ref(false)
const orderNotes = ref('')
const idempotencyKey = ref(crypto.randomUUID())

const paymentMethod = ref<'cash' | 'stripe'>('cash')

// Stripe state
const isPlacingStripeOrder = ref(false) // Prevents double-order bug

const newAddress = reactive({
  type: 'shipping', name: '', phone: '', street: '', city: '', state: '', postal_code: '', is_default: false,
})

const getImageUrl = (image: string) => url(image)

const fetchAddresses = async () => {
  isLoading.value = true
  try {
    const response: any = await getAddresses()
    addresses.value = response.data || []
    if (addresses.value.length > 0) selectedAddressId.value = addresses.value[0].id
  } catch { /* ignore */ }
  finally { isLoading.value = false }
}

const handleAddAddress = async () => {
  isLoading.value = true
  try {
    const response: any = await createAddress(newAddress)
    addresses.value.push(response.data)
    selectedAddressId.value = response.data.id
    isAddingAddress.value = false
    notify('Address added.', 'success')
    Object.assign(newAddress, { type: 'shipping', name: '', phone: '', street: '', city: '', state: '', postal_code: '', is_default: false })
  } catch { notify('Failed to add address.', 'error') }
  finally { isLoading.value = false }
}

const onPaymentMethodChange = async (method: 'cash' | 'stripe') => {
  paymentMethod.value = method
}

const isWaitingForPayment = ref(false)

const handlePlaceOrder = async () => {
  if (!selectedAddressId.value) { notify('Please select a shipping address.', 'error'); return }
  if (isPlacingStripeOrder.value || isPlacingOrder.value) return

  isPlacingOrder.value = true
  if (paymentMethod.value === 'stripe') isPlacingStripeOrder.value = true

  try {
    const orderData: any = {
      address_id: selectedAddressId.value,
      notes: orderNotes.value,
      payment_method: paymentMethod.value,
    }

    if (paymentMethod.value === 'stripe') {
      orderData.success_url = `${window.location.origin}/my/orders/__ORDER_ID__`
      orderData.cancel_url = `${window.location.origin}/checkout`
    }

    const response: any = await placeOrder(orderData, idempotencyKey.value)

    cartStore.resetLocalCart()

    if (response.checkout_url) {
      window.open(response.checkout_url, '_blank')
      isPlacingOrder.value = false
      isPlacingStripeOrder.value = false
      isWaitingForPayment.value = true
    } else {
      const orderNumber = response.order?.order_number || response.data?.order_number
      navigateTo(`/order-success?number=${orderNumber}&method=cash`)
    }
  } catch (error: any) {
    notify(error.data?.message || 'Failed to place order.', 'error')
    isPlacingOrder.value = false
    isPlacingStripeOrder.value = false
  }
}

onMounted(() => fetchAddresses())

useSeoMeta({ title: 'Secure Checkout | SimpCommerce', description: 'Complete your order securely.' })
</script>

<template>
  <div class="container py-16 md:py-24">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl md:text-4xl font-bold uppercase tracking-tighter mb-2">Checkout</h1>
      <p class="text-gray-500 text-xs uppercase tracking-[0.3em] mb-12">Complete your order</p>

      <div v-if="!isWaitingForPayment" class="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <!-- Left: 3 columns -->
        <div class="lg:col-span-3 space-y-12">

          <!-- Addresses -->
          <div class="space-y-5">
            <h3 class="text-sm font-bold uppercase tracking-widest">Shipping Address</h3>

            <div v-if="isAddingAddress" class="bg-gray-50 p-6 space-y-4 animate-fade-in">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Name</label>
                  <input v-model="newAddress.name" type="text" class="w-full bg-white border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors">
                </div>
                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone</label>
                  <input v-model="newAddress.phone" type="text" class="w-full bg-white border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors">
                </div>
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Street</label>
                <input v-model="newAddress.street" type="text" class="w-full bg-white border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors">
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">City</label>
                  <input v-model="newAddress.city" type="text" class="w-full bg-white border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors">
                </div>
                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">State</label>
                  <input v-model="newAddress.state" type="text" class="w-full bg-white border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors">
                </div>
                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Postal</label>
                  <input v-model="newAddress.postal_code" type="text" class="w-full bg-white border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors">
                </div>
              </div>
              <div class="flex gap-3 pt-2">
                <button @click="handleAddAddress" :disabled="isLoading" class="btn btn-primary text-xs py-3 px-8">Save</button>
                <button @click="isAddingAddress = false" class="btn btn-outline text-xs py-3 px-8">Cancel</button>
              </div>
            </div>

            <div v-else-if="addresses.length > 0" class="space-y-3">
              <div v-for="address in addresses" :key="address.id"
                @click="selectedAddressId = address.id"
                class="border-2 p-5 cursor-pointer transition-all flex items-start gap-4"
                :class="[selectedAddressId === address.id ? 'border-black bg-black/5' : 'border-gray-100 hover:border-gray-300']"
              >
                <div class="mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center"
                  :class="[selectedAddressId === address.id ? 'border-black' : 'border-gray-300']">
                  <div v-if="selectedAddressId === address.id" class="w-2 h-2 bg-black rounded-full"></div>
                </div>
                <div class="space-y-0.5">
                  <p class="text-sm font-semibold">{{ address.name }} <span v-if="address.is_default" class="text-[9px] bg-gray-100 px-1.5 py-0.5 ml-1 tracking-wide">Default</span></p>
                  <p class="text-xs text-gray-500">{{ address.phone }}</p>
                  <p class="text-xs text-gray-500">{{ address.street }}, {{ address.city }}, {{ address.state }} {{ address.postal_code }}</p>
                </div>
              </div>
            </div>

            <div v-else class="py-12 text-center bg-gray-50 border border-gray-100">
              <p class="text-xs text-gray-400 uppercase tracking-widest">No addresses saved.</p>
            </div>

            <button v-if="!isAddingAddress" @click="isAddingAddress = true" class="text-xs font-bold uppercase tracking-widest underline underline-offset-4 hover:text-gray-600 transition-colors">+ Add Address</button>
          </div>

          <!-- Payment Method -->
          <div class="space-y-5">
            <h3 class="text-sm font-bold uppercase tracking-widest">Payment Method</h3>

            <!-- Cash on Delivery -->
            <div @click="onPaymentMethodChange('cash')"
              class="border-2 p-5 cursor-pointer transition-all"
              :class="[paymentMethod === 'cash' ? 'border-black bg-black/5' : 'border-gray-100 hover:border-gray-300']"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center"
                    :class="[paymentMethod === 'cash' ? 'border-black' : 'border-gray-300']">
                    <div v-if="paymentMethod === 'cash'" class="w-2 h-2 bg-black rounded-full"></div>
                  </div>
                  <div>
                    <span class="text-sm font-semibold">Cash on Delivery</span>
                    <p class="text-[11px] text-gray-400 mt-0.5">Pay when you receive your order</p>
                  </div>
                </div>
                <Truck class="w-5 h-5 text-gray-300 shrink-0" />
              </div>
            </div>

            <!-- Stripe -->
            <div @click="onPaymentMethodChange('stripe')"
              class="border-2 p-5 cursor-pointer transition-all"
              :class="[paymentMethod === 'stripe' ? 'border-black bg-black/5' : 'border-gray-100 hover:border-gray-300']"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center"
                    :class="[paymentMethod === 'stripe' ? 'border-black' : 'border-gray-300']">
                    <div v-if="paymentMethod === 'stripe'" class="w-2 h-2 bg-black rounded-full"></div>
                  </div>
                  <div>
                    <span class="text-sm font-semibold">Pay with Card</span>
                    <p class="text-[11px] text-gray-400 mt-0.5">Secure payment via Stripe Checkout</p>
                  </div>
                </div>
                <div class="flex gap-1.5">
                  <span class="text-[9px] px-2 py-0.5 bg-blue-50 text-blue-700 font-bold tracking-wider uppercase">Visa</span>
                  <span class="text-[9px] px-2 py-0.5 bg-orange-50 text-orange-700 font-bold tracking-wider uppercase">MC</span>
                  <span class="text-[9px] px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold tracking-wider uppercase">Amex</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="space-y-3">
            <h3 class="text-sm font-bold uppercase tracking-widest">Order Notes</h3>
            <textarea v-model="orderNotes" rows="3"
              class="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors resize-none"
              placeholder="Special instructions for delivery..."
            ></textarea>
          </div>
        </div>

        <!-- Right: 2 columns -->
        <div class="lg:col-span-2">
          <div class="bg-gray-50 p-8 space-y-6 sticky top-28">
            <h3 class="text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-4">Your Order</h3>

            <div class="space-y-4 max-h-[360px] overflow-y-auto pr-2">
              <div v-for="item in cartStore.items" :key="item.id" class="flex gap-4">
                <div class="w-14 h-18 bg-white border shrink-0">
                  <img :src="getImageUrl(item.image || '')" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold truncate">{{ item.name }}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5">Qty: {{ item.quantity }}</p>
                </div>
                <span class="text-xs font-semibold shrink-0">${{ (parseFloat(String(item.price)) * item.quantity).toFixed(2) }}</span>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-5 space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 text-xs font-semibold uppercase tracking-widest">Subtotal</span>
                <span class="font-semibold">${{ parseFloat(String(cartStore.subtotal)).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 text-xs font-semibold uppercase tracking-widest">Shipping</span>
                <span class="text-green-700 font-semibold text-xs uppercase">Free</span>
              </div>
              <div class="border-t border-gray-200 pt-5 flex justify-between text-lg font-bold">
                <span class="uppercase tracking-wide">Total</span>
                <span>${{ parseFloat(String(cartStore.subtotal)).toFixed(2) }}</span>
              </div>
            </div>

            <button @click="handlePlaceOrder" :disabled="isPlacingOrder || cartStore.items.length === 0"
              class="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span v-if="isPlacingOrder" class="flex items-center justify-center gap-2">
                <span class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing...
              </span>
              <span v-else>Place Order</span>
            </button>
            <p class="text-[10px] text-gray-400 text-center tracking-wider">By placing an order, you agree to our terms &amp; conditions.</p>
          </div>
        </div>
      </div>

      <div v-else class="max-w-2xl mx-auto text-center space-y-8 py-12 animate-fade-in">
        <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
          <CreditCard class="w-8 h-8 text-gray-500" />
        </div>
        <div class="space-y-4">
          <h2 class="text-2xl font-bold uppercase tracking-widest">Payment Window Opened</h2>
          <p class="text-sm text-gray-500 max-w-md mx-auto">
            We've opened a secure Stripe payment window in a new tab. Please complete your payment there to finalize your order.
          </p>
        </div>
        <div class="p-6 bg-gray-50 border border-gray-100 text-left text-sm text-gray-600 max-w-sm mx-auto space-y-4">
          <div class="flex items-start gap-3">
            <ShieldCheck class="w-5 h-5 text-green-600 shrink-0" />
            <p>Your payment is processed securely by Stripe. We do not store your card details.</p>
          </div>
        </div>
        <p class="text-[10px] uppercase tracking-widest text-gray-400">
          Once completed, you can safely close this window.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fadeIn 0.25s ease-out; }
</style>
