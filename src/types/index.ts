export interface Product {
  id: string
  name: string
  category: string
  subcategory?: string
  price: number
  originalPrice?: number
  description: string
  sizes: string[]
  material: string[]
  rating: number
  reviewCount: number
  inStock: boolean
  featured: boolean
  flagImagePath: string
  isoCode?: string
}

export interface CartItem {
  product: Product
  quantity: number
  selectedSize?: string
  selectedMaterial?: string
}

export interface User {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  addresses: Address[]
  orderIds: string[]
}

export interface Address {
  id: string
  firstName: string
  lastName: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  isDefault: boolean
}

export interface Order {
  id: string
  userId?: string
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  shippingAddress: Address
  shippingMethod: string
  paymentLast4: string
  estimatedDelivery: string
  createdAt: string
  status: 'processing' | 'shipped' | 'delivered'
}

export interface Review {
  id: string
  productId: string
  author: string
  rating: number
  title: string
  body: string
  date: string
}
