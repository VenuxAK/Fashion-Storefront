<script setup lang="ts">
import { CheckCircle, X } from 'lucide-vue-next'

definePageMeta({
  middleware: 'sanctum:auth',
})

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

// Payment method selection
const paymentMethod = ref<'cod' | 'mmpay' | 'stripe'>('cod')

// MMPay state
const mmpayQrCode = ref<string | null>(null)
const mmpayTransactionId = ref<string | null>(null)
const isCreatingQR = ref(false)

// Stripe state
const stripeLoading = ref(false)
const stripeClientSecret = ref<string | null>(null)
const stripeIntentId = ref<string | null>(null)

const newAddress = reactive({
  type: 'shipping',
  name: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  postal_code: '',
  is_default: false,
})

const getImageUrl = (image: string) => url(image)

const fetchAddresses = async () => {
  isLoading.value = true
  try {
    const response: any = await getAddresses()
    addresses.value = response.data
    if (addresses.value.length > 0) {
      selectedAddressId.value = addresses.value[0].id
    }
  } catch {
    console.error('Failed to fetch addresses')
  } finally {
    isLoading.value = false
  }
}

const handleAddAddress = async () => {
  isLoading.value = true
  try {
    const response: any = await createAddress(newAddress)
    addresses.value.push(response.data)
    selectedAddressId.value = response.data.id
    isAddingAddress.value = false
    notify('Address added successfully.', 'success')
    Object.assign(newAddress, {
      type: 'shipping', name: '', phone: '', street: '', city: '', state: '', postal_code: '', is_default: false,
    })
  } catch {
    notify('Failed to add address.', 'error')
  } finally {
    isLoading.value = false
  }
}

// MMPay — create QR code
const initMMPay = async () => {
  isCreatingQR.value = true
  try {
    const response: any = await createPaymentIntent('mmpay')
    mmpayQrCode.value = response.qr_code
    mmpayTransactionId.value = response.transaction_id
  } catch {
    notify('Failed to initiate payment. Please try again.', 'error')
  } finally {
    isCreatingQR.value = false
  }
}

// Stripe — create PaymentIntent
const initStripe = async () => {
  stripeLoading.value = true
  try {
    const response: any = await createPaymentIntent('stripe')
    stripeClientSecret.value = response.client_secret
    stripeIntentId.value = response.transaction_id
  } catch {
    notify('Failed to initiate payment. Please try again.', 'error')
  } finally {
    stripeLoading.value = false
  }
}

// Handle payment method change
const onPaymentMethodChange = async (method: 'cod' | 'mmpay' | 'stripe') => {
  paymentMethod.value = method
  if (method === 'mmpay' && !mmpayQrCode.value) {
    await initMMPay()
  }
  if (method === 'stripe' && !stripeClientSecret.value) {
    await initStripe()
  }
}

const handlePlaceOrder = async () => {
  if (!selectedAddressId.value) {
    notify('Please select or add a shipping address.', 'error')
    return
  }
  if (paymentMethod.value === 'mmpay' && !mmpayTransactionId.value) {
    notify('Please wait for the QR code to load.', 'error')
    return
  }
  if (paymentMethod.value === 'stripe' && !stripeIntentId.value) {
    notify('Please wait for the payment form to load.', 'error')
    return
  }

  isPlacingOrder.value = true
  try {
    const orderData: any = {
      address_id: selectedAddressId.value,
      notes: orderNotes.value,
      payment_method: paymentMethod.value,
    }

    if (paymentMethod.value === 'mmpay') {
      orderData.payment_transaction_id = mmpayTransactionId.value
    } else if (paymentMethod.value === 'stripe') {
      orderData.payment_intent_id = stripeIntentId.value
    }

    const response: any = await placeOrder(orderData, idempotencyKey.value)

    cartStore.resetLocalCart()
    const orderNumber = response.order?.order_number || response.data?.order_number
    navigateTo(`/order-success?number=${orderNumber}&method=${paymentMethod.value}`)
  } catch (error: any) {
    notify(error.data?.message || 'Failed to place order. Please try again.', 'error')
  } finally {
    isPlacingOrder.value = false
  }
}

onMounted(() => {
  fetchAddresses()
})

useSeoMeta({
  title: 'Secure Checkout | SimpCommerce',
  description: 'Complete your order securely.',
})
</script>

<template>
  <div class="container py-20">
    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <!-- Left: Shipping & Payment -->
        <div class="space-y-12">
          <div class="space-y-4">
            <h1 class="text-3xl font-bold uppercase tracking-tighter">Checkout</h1>
            <p class="text-gray-500 text-xs uppercase tracking-[0.3em]">Shipping Information</p>
          </div>

          <!-- Address Selection -->
          <div class="space-y-6">
            <div class="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 class="text-sm font-bold uppercase tracking-widest">Shipping Address</h3>
              <button
                v-if="!isAddingAddress"
                @click="isAddingAddress = true"
                class="text-[10px] font-bold uppercase tracking-widest text-accent hover:text-primary transition-colors"
              >
                + Add New Address
              </button>
            </div>

            <div v-if="isAddingAddress" class="bg-gray-50 p-8 space-y-6 animate-fade-in">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Recipient Name</label>
                  <input v-model="newAddress.name" type="text" class="w-full bg-white border-none px-4 py-3 text-sm focus:ring-1 focus:ring-accent outline-none shadow-sm">
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number</label>
                  <input v-model="newAddress.phone" type="text" class="w-full bg-white border-none px-4 py-3 text-sm focus:ring-1 focus:ring-accent outline-none shadow-sm">
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Street Address</label>
                <input v-model="newAddress.street" type="text" class="w-full bg-white border-none px-4 py-3 text-sm focus:ring-1 focus:ring-accent outline-none shadow-sm">
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div class="space-y-2">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">City</label>
                  <input v-model="newAddress.city" type="text" class="w-full bg-white border-none px-4 py-3 text-sm focus:ring-1 focus:ring-accent outline-none shadow-sm">
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">State</label>
                  <input v-model="newAddress.state" type="text" class="w-full bg-white border-none px-4 py-3 text-sm focus:ring-1 focus:ring-accent outline-none shadow-sm">
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Postal Code</label>
                  <input v-model="newAddress.postal_code" type="text" class="w-full bg-white border-none px-4 py-3 text-sm focus:ring-1 focus:ring-accent outline-none shadow-sm">
                </div>
              </div>
              <div class="flex space-x-4 pt-4">
                <button @click="handleAddAddress" :disabled="isLoading" class="btn btn-primary text-xs py-3 px-8">Save Address</button>
                <button @click="isAddingAddress = false" class="btn btn-outline text-xs py-3 px-8">Cancel</button>
              </div>
            </div>

            <div v-else-if="addresses.length > 0" class="space-y-4">
              <div
                v-for="address in addresses"
                :key="address.id"
                @click="selectedAddressId = address.id"
                class="border-2 p-6 cursor-pointer transition-all flex items-start space-x-4"
                :class="[selectedAddressId === address.id ? 'border-accent bg-accent/5' : 'border-gray-50 hover:border-gray-200']"
              >
                <div class="mt-1">
                  <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center" :class="[selectedAddressId === address.id ? 'border-accent' : 'border-gray-300']">
                    <div v-if="selectedAddressId === address.id" class="w-2 h-2 bg-accent rounded-full"></div>
                  </div>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-bold uppercase">{{ address.name }} <span v-if="address.is_default" class="text-[8px] bg-gray-200 px-1 ml-2">Default</span></p>
                  <p class="text-xs text-gray-500">{{ address.phone }}</p>
                  <p class="text-xs text-gray-500">{{ address.street }}, {{ address.city }}, {{ address.state }} {{ address.postal_code }}</p>
                </div>
              </div>
            </div>

            <div v-else class="py-10 text-center bg-gray-50">
              <p class="text-xs text-gray-400 uppercase tracking-widest">No addresses saved yet.</p>
            </div>
          </div>

          <!-- Payment Method Selection -->
          <div class="space-y-6">
            <h3 class="text-sm font-bold uppercase tracking-widest border-b border-gray-100 pb-4">Payment Method</h3>

            <!-- COD -->
            <div
              @click="onPaymentMethodChange('cod')"
              class="border-2 p-6 cursor-pointer transition-all flex items-center justify-between"
              :class="[paymentMethod === 'cod' ? 'border-accent bg-accent/5' : 'border-gray-50 hover:border-gray-200']"
            >
              <div class="flex items-center space-x-4">
                <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center" :class="[paymentMethod === 'cod' ? 'border-accent' : 'border-gray-300']">
                  <div v-if="paymentMethod === 'cod'" class="w-2 h-2 bg-accent rounded-full"></div>
                </div>
                <span class="text-sm font-bold uppercase">Cash on Delivery (COD)</span>
              </div>
            </div>

            <!-- MyanMyanPay / Wallet -->
            <div
              @click="onPaymentMethodChange('mmpay')"
              class="border-2 p-6 cursor-pointer transition-all"
              :class="[paymentMethod === 'mmpay' ? 'border-accent bg-accent/5' : 'border-gray-50 hover:border-gray-200']"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center" :class="[paymentMethod === 'mmpay' ? 'border-accent' : 'border-gray-300']">
                    <div v-if="paymentMethod === 'mmpay'" class="w-2 h-2 bg-accent rounded-full"></div>
                  </div>
                  <span class="text-sm font-bold uppercase">Pay with Wallet (KBZPay, WavePay, etc.)</span>
                </div>
                <div v-if="isCreatingQR" class="text-[10px] text-gray-400 animate-pulse">Generating QR...</div>
              </div>

              <!-- MMPay QR Code -->
              <div v-if="paymentMethod === 'mmpay' && mmpayQrCode" class="mt-6 flex flex-col items-center space-y-4 p-6 bg-white border">
                <img :src="mmpayQrCode" alt="Scan to pay" class="w-48 h-48" />
                <p class="text-[10px] text-gray-400 uppercase tracking-widest text-center">
                  Scan with KBZPay, WavePay, or any Myanmar wallet app
                </p>
                <button
                  @click.stop="initMMPay"
                  class="text-[10px] font-bold uppercase tracking-widest text-accent underline"
                >
                  Generate new QR code
                </button>
              </div>
            </div>

            <!-- Stripe -->
            <div
              @click="onPaymentMethodChange('stripe')"
              class="border-2 p-6 cursor-pointer transition-all"
              :class="[paymentMethod === 'stripe' ? 'border-accent bg-accent/5' : 'border-gray-50 hover:border-gray-200']"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center" :class="[paymentMethod === 'stripe' ? 'border-accent' : 'border-gray-300']">
                    <div v-if="paymentMethod === 'stripe'" class="w-2 h-2 bg-accent rounded-full"></div>
                  </div>
                  <span class="text-sm font-bold uppercase">Pay with Card (Visa/Mastercard)</span>
                </div>
                <div v-if="stripeLoading" class="text-[10px] text-gray-400 animate-pulse">Loading...</div>
              </div>
              <div v-if="paymentMethod === 'stripe' && stripeClientSecret" class="mt-4 text-xs text-gray-500">
                <p>Card payment intent created. Complete the payment on the next screen after placing the order.</p>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-widest border-b border-gray-100 pb-4">Order Notes (Optional)</h3>
            <textarea
              v-model="orderNotes"
              rows="4"
              class="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-accent outline-none"
              placeholder="Special instructions for delivery..."
            ></textarea>
          </div>
        </div>

        <!-- Right: Order Summary -->
        <div class="space-y-10">
          <div class="bg-gray-50 p-10 space-y-8">
            <h3 class="text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-4">Your Order</h3>

            <div class="space-y-6 max-h-[400px] overflow-y-auto pr-4">
              <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between items-center">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-16 bg-white shadow-sm flex-shrink-0">
                    <img :src="getImageUrl(item.image)" class="w-full h-full object-cover">
                  </div>
                  <div>
                    <p class="text-xs font-bold uppercase">{{ item.name }}</p>
                    <p class="text-[10px] text-gray-400 uppercase tracking-widest">Qty: {{ item.quantity }}</p>
                  </div>
                </div>
                <span class="text-xs font-bold">${{ (parseFloat(String(item.price)) * item.quantity).toFixed(2) }}</span>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-6 space-y-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 uppercase tracking-widest text-xs font-bold">Subtotal</span>
                <span class="font-bold">${{ parseFloat(String(cartStore.subtotal)).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 uppercase tracking-widest text-xs font-bold">Shipping</span>
                <span class="text-green-600 font-bold uppercase text-[10px]">Free</span>
              </div>
              <div class="border-t border-gray-200 pt-6 flex justify-between items-center text-xl font-bold uppercase">
                <span>Total</span>
                <span>${{ parseFloat(String(cartStore.subtotal)).toFixed(2) }}</span>
              </div>
            </div>

            <button
              @click="handlePlaceOrder"
              :disabled="isPlacingOrder || cartStore.items.length === 0"
              class="w-full bg-primary text-white py-6 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors disabled:opacity-50"
            >
              {{ isPlacingOrder ? 'Processing...' : 'Place Order Now' }}
            </button>
            <p class="text-[10px] text-gray-400 text-center uppercase tracking-widest">
              By placing an order, you agree to our terms & conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
