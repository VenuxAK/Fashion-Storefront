<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { Lock, ShieldCheck, AlertCircle } from 'lucide-vue-next'

const props = defineProps<{
  clientSecret: string | null
}>()

const emit = defineEmits<{
  'payment-success': [intentId: string]
  'payment-error': [message: string]
}>()

const config = useRuntimeConfig()
const loading = ref(true)
const cardContainer = ref<HTMLDivElement | null>(null)
const paymentError = ref<string | null>(null)
const elementsReady = ref(false)

let stripe: any = null
let elements: any = null

async function mountCard() {
  if (!props.clientSecret || !cardContainer.value) return

  loading.value = true
  elementsReady.value = false
  paymentError.value = null

  try {
    const Stripe = await loadStripeJs()
    stripe = Stripe(config.public.stripeKey)

    elements = stripe.elements({
      clientSecret: props.clientSecret,
      appearance: {
        theme: 'flat',
        variables: {
          colorPrimary: '#333333',
          colorBackground: '#fafafa',
          colorText: '#333333',
          colorDanger: '#dc2626',
          colorTextSecondary: '#9ca3af',
          colorTextPlaceholder: '#9ca3af',
          fontFamily: '"Poppins", "Inter", ui-sans-serif, system-ui, sans-serif',
          fontSizeBase: '14px',
          fontWeightNormal: '400',
          fontWeightMedium: '500',
          fontWeightBold: '600',
          borderRadius: '0px',
          spacingUnit: '4px',
          spacingGridRow: '16px',
          spacingGridColumn: '16px',
        },
        rules: {
          '.Input': {
            border: '1px solid #e5e7eb',
            boxShadow: 'none',
            padding: '10px 16px',
            transition: 'border-color 0.2s ease',
          },
          '.Input:focus': {
            border: '1px solid #9ca3af',
            boxShadow: 'none',
          },
          '.Input:hover': {
            border: '1px solid #d1d5db',
          },
          '.Input--invalid': {
            border: '1px solid #dc2626',
            boxShadow: 'none',
          },
          '.Label': {
            fontSize: '10px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#9ca3af',
            marginBottom: '6px',
          },
          '.Tab': {
            border: '2px solid #f3f4f6',
            borderRadius: '0px',
            boxShadow: 'none',
            transition: 'all 0.2s ease',
          },
          '.Tab:hover': {
            border: '2px solid #d1d5db',
          },
          '.Tab--selected': {
            border: '2px solid #333333',
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
            boxShadow: 'none',
          },
          '.TabIcon--selected': {
            color: '#333333',
          },
          '.TabLabel--selected': {
            color: '#333333',
            fontWeight: '600',
          },
          '.Error': {
            fontSize: '11px',
            fontWeight: '600',
            color: '#dc2626',
          },
        },
      },
    })

    const payment = elements.create('payment', {
      layout: {
        type: 'tabs',
        defaultCollapsed: false,
      },
    })

    payment.mount(cardContainer.value)
    elementsReady.value = true
    payment.on('ready', () => { loading.value = false })
    payment.on('change', (event: any) => {
      paymentError.value = event.error ? event.error.message : null
    })
  } catch (e: any) {
    loading.value = false
    paymentError.value = 'Failed to load payment form. Please refresh the page.'
  }
}

async function confirmPayment(): Promise<boolean> {
  if (!stripe || !elements || !props.clientSecret) {
    emit('payment-error', 'Payment not initialized.')
    return false
  }

  const { error, paymentIntent } = await stripe.confirmPayment({
    elements,
    redirect: 'if_required',
  })

  if (error) {
    paymentError.value = error.message || 'Payment failed.'
    emit('payment-error', paymentError.value!)
    return false
  }

  if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing')) {
    emit('payment-success', paymentIntent.id)
    return true
  }

  return false
}

async function loadStripeJs(): Promise<any> {
  if ((window as any).Stripe) return (window as any).Stripe
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://js.stripe.com/v3/'
    script.onload = () => resolve((window as any).Stripe)
    document.head.appendChild(script)
  })
}

watch(() => props.clientSecret, () => {
  if (cardContainer.value) cardContainer.value.innerHTML = ''
  nextTick(() => mountCard())
})

onMounted(() => mountCard())

defineExpose({ confirmPayment })
</script>

<template>
  <div class="stripe-form-wrapper animate-fade-in">
    <!-- Card Form Container -->
    <div class="border-2 border-gray-100 bg-white min-h-[200px] transition-all"
      :class="{ 'flex items-center justify-center': loading }"
    >
      <!-- Loading State -->
      <div v-if="loading" class="w-full py-10 text-center">
        <div class="inline-flex flex-col items-center gap-3">
          <div class="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
          <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Loading secure payment...</span>
        </div>
      </div>

      <!-- Stripe Elements Mount Point -->
      <div v-show="!loading" ref="cardContainer" class="w-full p-5"></div>
    </div>

    <!-- Error Message -->
    <div v-if="paymentError" class="flex items-center gap-2 mt-3 px-1">
      <AlertCircle class="w-3.5 h-3.5 shrink-0 text-red-600" />
      <p class="text-[11px] font-semibold text-red-600">{{ paymentError }}</p>
    </div>

    <!-- Security & Trust Strip -->
    <div class="mt-4 bg-gray-50 border border-gray-100 px-5 py-3.5 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <ShieldCheck class="w-4 h-4 text-gray-400 shrink-0" />
        <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          256-bit SSL Encrypted
        </span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="text-[9px] px-2 py-0.5 bg-blue-50 text-blue-700 font-bold tracking-wider uppercase">Visa</span>
        <span class="text-[9px] px-2 py-0.5 bg-orange-50 text-orange-700 font-bold tracking-wider uppercase">MC</span>
        <span class="text-[9px] px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold tracking-wider uppercase">Amex</span>
      </div>
    </div>

    <!-- Powered by Stripe -->
    <div class="mt-2.5 flex items-center justify-center gap-1.5 px-1">
      <Lock class="w-3 h-3 text-gray-300 shrink-0" />
      <span class="text-[10px] text-gray-300 tracking-wider">Secured by Stripe</span>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
</style>
