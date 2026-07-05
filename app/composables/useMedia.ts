const PLACEHOLDER = 'https://placehold.co/800x1000/eee/999?text=No+Image'
const urlCache = new Map<string, string>()

export function useMedia() {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl.replace(/\/api\/v1\/?$|\/api\/?$/, '')

  function url(path: string | null | undefined): string {
    if (!path) return PLACEHOLDER
    if (path.startsWith('http')) return path
    if (urlCache.has(path)) return urlCache.get(path)!
    const resolved = `${baseUrl}/storage/${path}`
    urlCache.set(path, resolved)
    return resolved
  }

  return { url }
}
