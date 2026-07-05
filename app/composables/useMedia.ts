const PLACEHOLDER = 'https://placehold.co/800x1000/eee/999?text=No+Image'

export function useMedia() {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl.replace(/\/api\/v1\/?$|\/api\/?$/, '')

  function url(path: string | null | undefined): string {
    if (!path) return PLACEHOLDER
    if (path.startsWith('http')) return path
    return `${baseUrl}/storage/${path}`
  }

  return { url }
}
