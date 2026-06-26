<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  clientSecret: string | null
}>()

const emit = defineEmits<{
  'payment-success': [intentId: string]
  'payment-error': [message: string]
}>()

const config = useRuntimeConfig()
const loading = ref(false)
const cardElement = ref<HTMLDivElement | null>(null)
const paymentError = ref<string | null>(null)

let stripeInstance: any = null
let elements: any = null
let card: any = null

// Load Stripe.js dynamically
async function loadStripe(): Promise<any> {
  if ((window as any).Stripe) return (window as any).Stripe

  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://js.stripe.com/v3/'
    script.onload = () => resolve((window as any).Stripe)
    document.head.appendChild(script)
  })
}

async function mountCardForm() {
  if (!props.clientSecret || !cardElement.value) return

  loading.value = true
  paymentError.value = null

  try {
    const Stripe = await loadStripe()
    stripeInstance = Stripe(config.public.stripeKey)

    elements = stripeInstance.elements({ clientSecret: props.clientSecret })

    // Create a PaymentElement for the full card form
    card = elements.create('payment', {
      layout: { type: 'tabs', defaultCollapsed: false },
    })
    card.mount(cardElement.value)

    card.on('change', (event: any) => {
      paymentError.value = event.error ? event.error.message : null
    })
  } catch (e: any) {
    paymentError.value = 'Failed to load payment form.'
  } finally {
    loading.value = false
  }
}

async function confirmPayment() {
  if (!stripeInstance || !elements || !props.clientSecret) {
    emit('payment-error', 'Payment not initialized.')
    return
  }

  loading.value = true
  paymentError.value = null

  try {
    const { error, paymentIntent } = await stripeInstance.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (error) {
      paymentError.value = error.message || 'Payment failed.'
      emit('payment-error', paymentError.value)
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      emit('payment-success', paymentIntent.id)
    } else if (paymentIntent && paymentIntent.status === 'processing') {
      // Payment is being processed — can still place the order
      emit('payment-success', paymentIntent.id)
    }
  } catch (e: any) {
    paymentError.value = e.message || 'Payment error.'
    emit('payment-error', paymentError.value)
  } finally {
    loading.value = false
  }
}

// Watch for client secret changes and re-mount the form
watch(() => props.clientSecret, (secret) => {
  if (secret) {
    // Destroy existing card if present
    if (card) {
      card.destroy()
      card = null
    }
    nextTick(() => mountCardForm())
  }
})

onMounted(() => {
  if (props.clientSecret) {
    mountCardForm()
  }
})

// Expose confirmPayment so the parent can call it
defineExpose({ confirmPayment })
</script>

<template>
  <div class="space-y-4">
    <!-- Loading state -->
    <div v-if="loading && !cardElement?.innerHTML" class="py-8 text-center">
      <div class="inline-block w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      <p class="text-[10px] text-gray-400 uppercase tracking-widest mt-2">Loading payment form...</p>
    </div>

    <!-- Card form container -->
    <div ref="cardElement" class="py-4"></div>

    <!-- Error message -->
    <p v-if="paymentError" class="text-[10px] text-red-500 uppercase tracking-widest">{{ paymentError }}</p>
  </div>
</template>
