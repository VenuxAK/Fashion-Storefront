interface Variant {
  id: number
  size?: string
  color?: string
  stock_quantity?: number
  price_adjustment?: number | string
  image?: string
}

export function useVariantSelector(variants: Ref<Variant[]> | ComputedRef<Variant[]>, basePrice: Ref<number | string> | ComputedRef<number | string>) {
  const selectedSize = ref('')
  const selectedColor = ref('')

  const sizes = computed(() => {
    const set = new Set(variants.value.map(v => v.size).filter(Boolean) as string[])
    return [...set]
  })

  const colors = computed(() => {
    const set = new Set(variants.value.map(v => v.color).filter(Boolean) as string[])
    return [...set]
  })

  const needsSelection = computed(() => {
    return variants.value.some(v => v.size) || variants.value.some(v => v.color)
  })

  const selectedVariant = computed(() => {
    if (!variants.value.length) return null
    if (!needsSelection.value || (!selectedSize.value && !selectedColor.value)) {
      return variants.value.find(v => (v.stock_quantity || 0) > 0) || variants.value[0] || null
    }
    return variants.value.find(v =>
      (!selectedSize.value || v.size === selectedSize.value) &&
      (!selectedColor.value || v.color === selectedColor.value)
    ) || null
  })

  const inStock = computed(() => {
    const v = selectedVariant.value
    return v ? (v.stock_quantity || 0) > 0 : false
  })

  const totalStock = computed(() => {
    return variants.value.reduce((sum, v) => sum + (v.stock_quantity || 0), 0)
  })

  const hasStock = computed(() => totalStock.value > 0)

  const adjustedPrice = computed(() => {
    const base = parseFloat(String(basePrice.value || 0))
    const adjustment = parseFloat(String(selectedVariant.value?.price_adjustment || 0))
    return isNaN(base + adjustment) ? 0 : base + adjustment
  })

  return {
    selectedSize,
    selectedColor,
    sizes,
    colors,
    needsSelection,
    selectedVariant,
    inStock,
    totalStock,
    hasStock,
    adjustedPrice,
  }
}
