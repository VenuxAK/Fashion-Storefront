import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  if (typeof window !== 'undefined') {
    window.Pusher = Pusher
  }

  const echo = new Echo({
    broadcaster: 'reverb',
    key: config.public.reverbKey,
    wsHost: config.public.reverbHost,
    wsPort: Number(config.public.reverbPort) || 8080,
    wssPort: Number(config.public.reverbPort) || 8080,
    forceTLS: false,
    enabledTransports: ['ws'],
  })

  return {
    provide: { echo },
  }
})
