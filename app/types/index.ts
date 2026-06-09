export interface Category {
  id: number
  name: string
  slug: string
  image?: string
}

export interface Variant {
  id: number
  product_id: number
  sku: string
  size?: string
  color?: string
  stock_quantity: number
  price_adjustment?: number | string
  image?: string
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  base_price: number | string
  image?: string
  category_id?: number
  category?: Category
  variants?: Variant[]
}

export interface CartItem {
  id?: number // ID is only present if fetched from API
  variant_id: number
  name: string
  price: number
  quantity: number
  image?: string
  color?: string
  size?: string
}

export interface Address {
  id: number
  type: string
  name: string
  phone: string
  street: string
  city: string
  state: string
  postal_code: string
  is_default: boolean
}

export interface OrderItem {
  id: number
  order_id: number
  product_variant_id: number
  quantity: number
  unit_price: number | string
  variant?: {
    color?: string
    size?: string
    image?: string
    product?: {
      name: string
      image?: string
    }
  }
}

export interface Order {
  id: number
  order_number: string
  status: string
  total_amount: number | string
  notes?: string
  created_at: string
  shipping_address?: Address
  items?: OrderItem[]
}
