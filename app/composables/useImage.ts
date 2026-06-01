export function useImage() {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl.replace(/\/api\/?$/, '')

  function url(path: string | null | undefined): string {
    if (!path) return 'https://placehold.co/800x1000/eee/999?text=No+Image'
    if (path.startsWith('http')) return path
    return `${baseUrl}/storage/${path}`
  }

  return { url }
}
