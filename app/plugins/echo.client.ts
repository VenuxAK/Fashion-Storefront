import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  if (typeof window !== 'undefined') {
    window.Pusher = Pusher
  }

  const port = config.public.reverbPort

  const echo = new Echo({
    broadcaster: 'reverb',
    key: config.public.reverbKey,
    wsHost: config.public.reverbHost,
    ...(port && { wsPort: Number(port) }),
    ...(port && { wssPort: Number(port) }),
    forceTLS: !port,
    enabledTransports: port ? ['ws'] : ['wss'],
  })

  return {
    provide: { echo },
  }
})
