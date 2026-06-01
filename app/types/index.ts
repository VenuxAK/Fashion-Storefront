export interface StoreSettings {
  id: number
  name: string
  slug: string
  description: string | null
  logo: string | null
  phone: string | null
  email: string | null
  is_active: boolean
  settings: Record<string, any> | null
  products_count: number
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  products_count?: number
}

export interface ProductVariant {
  id: number
  product_id: number
  sku: string
  size: string | null
  color: string | null
  image: string | null
  image_url: string | null
  price_adjustment: number
  purchase_price: number | null
  stock_quantity: number
  product?: Product
}

export interface Product {
  id: number
  category_id: number
  category?: Category
  name: string
  slug: string
  description: string | null
  base_price: number
  image: string | null
  image_url: string | null
  total_stock: number
  variants: ProductVariant[]
}

export interface Customer {
  id: number
  name: string
  email: string | null
  phone: string | null
  loyalty_points: number
}

export interface Address {
  id: number
  customer_id: number
  type: string
  name: string
  phone: string
  street: string
  city: string
  state: string
  postal_code: string
  is_default: boolean
}

export interface CartItem {
  id: number
  customer_id: number
  product_variant_id: number
  variant?: ProductVariant
  quantity: number
}

export interface OrderItem {
  id: number
  product_variant_id: number
  variant?: ProductVariant
  quantity: number
  unit_price: number
  subtotal: number
}

export interface Shipment {
  id: number
  order_id: number
  address_id: number
  method: string
  tracking_number: string | null
  tracking_url: string | null
  shipped_at: string | null
  delivered_at: string | null
  notes: string | null
  address?: Address
}

export interface Invoice {
  id: number
  order_id: number
  invoice_number: string
  issued_date: string
  due_date: string | null
  status: string
}

export interface Order {
  id: number
  customer_id: number
  order_number: string
  total_amount: number
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled'
  source: string
  notes: string | null
  items?: OrderItem[]
  shipment?: Shipment
  invoice?: Invoice
  created_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}
