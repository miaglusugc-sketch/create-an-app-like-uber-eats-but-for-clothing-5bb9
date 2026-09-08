import { Plus, Star } from 'lucide-react'
import type { Item, Store } from '../types'
import { GarmentTile } from './GarmentTile'
import { currency } from '../lib/format'
import { useUI } from '../context/UIContext'

export function ItemCard({ item, store }: { item: Item; store: Store }) {
  const { openItem } = useUI()
  const discount = item.compareAt ? Math.round((1 - item.price / item.compareAt) * 100) : 0

  return (
    <button
      onClick={() => openItem(item, store)}
      className="group card flex w-full flex-col overflow-hidden text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative">
        <GarmentTile
          garment={item.garment}
          color={item.colors[0].hex}
          className="aspect-square w-full transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1">
          {item.isNew && (
            <span className="rounded-full bg-ink-950 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white">
              -{discount}%
            </span>
          )}
        </div>
        {item.isPopular && (
          <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-amber-600 shadow-sm backdrop-blur">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            Popular
          </span>
        )}
        <span className="absolute bottom-2.5 right-2.5 grid h-9 w-9 place-items-center rounded-full bg-brand-500 text-white shadow-glow transition-transform duration-200 group-hover:scale-110">
          <Plus className="h-5 w-5" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{item.brand}</p>
        <h4 className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-ink-950">{item.name}</h4>
        <div className="mt-1 flex items-center gap-1 text-xs text-ink-500">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-ink-700">{item.rating.toFixed(1)}</span>
          <span>({item.reviews})</span>
        </div>
        <div className="mt-auto flex items-center gap-2 pt-2">
          <span className="text-base font-extrabold text-ink-950">{currency(item.price)}</span>
          {item.compareAt && (
            <span className="text-xs font-medium text-ink-400 line-through">{currency(item.compareAt)}</span>
          )}
        </div>
        <div className="mt-2 flex items-center gap-1">
          {item.colors.slice(0, 4).map((c) => (
            <span
              key={c.name}
              className="h-3.5 w-3.5 rounded-full border border-ink-200"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
          {item.colors.length > 4 && (
            <span className="text-[10px] font-medium text-ink-400">+{item.colors.length - 4}</span>
          )}
        </div>
      </div>
    </button>
  )
}
