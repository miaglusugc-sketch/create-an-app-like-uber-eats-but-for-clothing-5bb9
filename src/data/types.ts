export type GarmentType =
  | 'tshirt'
  | 'hoodie'
  | 'jacket'
  | 'coat'
  | 'dress'
  | 'skirt'
  | 'pants'
  | 'shorts'
  | 'sweater'
  | 'shirt'
  | 'sneaker'
  | 'boot'
  | 'hat'
  | 'bag'
  | 'sunglasses'
  | 'scarf';

export type Category =
  | 'Women'
  | 'Men'
  | 'Shoes'
  | 'Streetwear'
  | 'Accessories'
  | 'Kids'
  | 'Activewear'
  | 'Vintage';

export interface Boutique {
  id: string;
  name: string;
  tagline: string;
  rating: number;
  reviews: number;
  etaMin: number;
  etaMax: number;
  deliveryFee: number;
  distanceKm: number;
  priceTier: 1 | 2 | 3;
  categories: Category[];
  accent: string;
  accentSoft: string;
  neighborhood: string;
  badge?: string;
  freeOver?: number;
}

export interface Product {
  id: string;
  name: string;
  boutiqueId: string;
  category: Category;
  garment: GarmentType;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
  tags: string[];
  trending?: boolean;
}
