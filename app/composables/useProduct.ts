export const useProduct = () => {
  const api = useApi()

  const getProducts = async (params: any = {}) => {
    return await api('/storefront/products', { params })
  }

  const getProductBySlug = async (slug: string) => {
    return await api(`/storefront/products/${slug}`)
  }

  const getCategories = async () => {
    return await api('/storefront/categories')
  }

  const getStoreSettings = async () => {
    return await api('/storefront/settings')
  }

  return {
    getProducts,
    getProductBySlug,
    getCategories,
    getStoreSettings
  }
}
