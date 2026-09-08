import type { Category, GarmentType } from './types';

export interface CategoryDef {
  name: Category;
  garment: GarmentType;
  color: string;
}

export const categories: CategoryDef[] = [
  { name: 'Women', garment: 'dress', color: '#c65f7b' },
  { name: 'Men', garment: 'shirt', color: '#1e2a44' },
  { name: 'Shoes', garment: 'sneaker', color: '#c2410c' },
  { name: 'Streetwear', garment: 'hoodie', color: '#3b3ad6' },
  { name: 'Activewear', garment: 'shorts', color: '#7c3aed' },
  { name: 'Accessories', garment: 'bag', color: '#a16207' },
  { name: 'Kids', garment: 'tshirt', color: '#0d9488' },
  { name: 'Vintage', garment: 'jacket', color: '#4a6a8a' },
];
