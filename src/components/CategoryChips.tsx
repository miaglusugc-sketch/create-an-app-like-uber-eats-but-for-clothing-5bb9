import { Sparkles } from 'lucide-react'
import type { Category, GarmentType } from '../types'
import { Garment } from './Garment'

export type FilterKey = Category | 'all'

const FILTERS: { key: FilterKey; label: string; garment?: GarmentType }[] = [
  { key: 'all', label: 'All' },
  { key: 'tops', label: 'Tops', garment: 'tshirt' },
  { key: 'bottoms', label: 'Bottoms', garment: 'pants' },
  { key: 'dresses', label: 'Dresses', garment: 'dress' },
  { key: 'outerwear', label: 'Outerwear', garment: 'jacket' },
  { key: 'footwear', label: 'Footwear', garment: 'sneaker' },
  { key: 'accessories', label: 'Accessories', garment: 'bag' },
]

export function CategoryChips({
  active,
  onChange,
}: {
  active: FilterKey
  onChange: (k: FilterKey) => void
}) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {FILTERS.map((f) => {
        const on = f.key === active
        return (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
            className={`chip ${
              on
                ? 'border-ink-950 bg-ink-950 text-white'
                : 'border-ink-200 bg-white text-ink-700 hover:border-ink-400'
            }`}
          >
            {f.key === 'all' ? (
              <Sparkles className={`h-4 w-4 ${on ? 'text-brand-300' : 'text-brand-500'}`} />
            ) : (
              <span className="grid h-5 w-5 place-items-center">
                <Garment
                  type={f.garment!}
                  color={on ? '#ffffff' : '#6a629b'}
                  className="h-5 w-5"
                />
              </span>
            )}
            {f.label}
          </button>
        )
      })}
    </div>
  )
}
