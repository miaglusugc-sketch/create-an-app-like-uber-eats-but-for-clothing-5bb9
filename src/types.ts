export type Category =
  | 'tops'
  | 'bottoms'
  | 'dresses'
  | 'outerwear'
  | 'footwear'
  | 'accessories'

export type GarmentType =
  | 'tshirt'
  | 'shirt'
  | 'hoodie'
  | 'sweater'
  | 'jacket'
  | 'coat'
  | 'dress'
  | 'skirt'
  | 'pants'
  | 'shorts'
  | 'sneaker'
  | 'boot'
  | 'heel'
  | 'hat'
  | 'bag'
  | 'sunglasses'
  | 'scarf'
  | 'watch'

export interface Item {
  id: string
  storeId: string
  name: string
  brand: string
  description: string
  price: number
  /** original price for showing a discount, optional */
  compareAt?: number
  category: Category
  garment: GarmentType
  colors: { name: string; hex: string }[]
  sizes: string[]
  rating: number
  reviews: number
  isNew?: boolean
  isPopular?: boolean
}

export interface Store {
  id: string
  name: string
  tagline: string
  /** short descriptive tags shown on the card */
  tags: string[]
  categories: Category[]
  rating: number
  reviews: number
  /** delivery estimate, minutes range e.g. [25, 40] */
  eta: [number, number]
  deliveryFee: number
  minOrder: number
  distanceKm: number
  priceLevel: 1 | 2 | 3
  promo?: string
  /** tailwind gradient classes for the storefront hero */
  gradient: string
  /** accent hex used for logo mark + highlights */
  accent: string
  featured?: boolean
  /** free delivery threshold */
  freeDeliveryOver?: number
}

export interface CartLine {
  id: string
  itemId: string
  storeId: string
  name: string
  brand: string
  price: number
  garment: GarmentType
  accent: string
  size: string
  color: { name: string; hex: string }
  qty: number
}

export type OrderStatus =
  | 'confirmed'
  | 'preparing'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered'

export interface Order {
  id: string
  createdAt: number
  storeId: string
  storeName: string
  lines: CartLine[]
  subtotal: number
  deliveryFee: number
  serviceFee: number
  tip: number
  total: number
  address: string
  speed: 'standard' | 'express'
  courier: { name: string; vehicle: string; rating: number }
  /** estimated total minutes for the delivery from order time */
  etaMinutes: number
  status: OrderStatus
}
