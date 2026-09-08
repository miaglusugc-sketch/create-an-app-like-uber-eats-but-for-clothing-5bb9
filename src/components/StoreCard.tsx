import { Link } from 'react-router-dom'
import { Clock, Bike, Tag } from 'lucide-react'
import type { Store } from '../types'
import { itemsByStore } from '../data/stores'
import { Stars } from './Stars'
import { Garment } from './Garment'
import { currency, priceDots } from '../lib/format'

export function StoreCard({ store }: { store: Store }) {
  const items = itemsByStore(store.id)
  const showcase = items.slice(0, 3)

  return (
    <Link
      to={`/store/${store.id}`}
      className="group card block overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className={`relative h-40 bg-gradient-to-br ${store.gradient}`}>
        {/* showcase garments */}
        <div className="absolute inset-0 flex items-center justify-center gap-1 px-4">
          {showcase.map((it, idx) => (
            <div
              key={it.id}
              className="transition-transform duration-500 group-hover:-translate-y-1"
              style={{
                transform: `rotate(${(idx - 1) * 8}deg)`,
                zIndex: idx === 1 ? 2 : 1,
              }}
            >
              <Garment
                type={it.garment}
                color={it.colors[0].hex}
                className={idx === 1 ? 'h-28 w-28 drop-shadow-lg' : 'h-20 w-20 opacity-90 drop-shadow-md'}
              />
            </div>
          ))}
        </div>

        {store.promo && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-brand-600 shadow-sm">
            <Tag className="h-3 w-3" />
            {store.promo}
          </span>
        )}
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/35 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          <Clock className="h-3 w-3" />
          {store.eta[0]}–{store.eta[1]} min
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-ink-950">{store.name}</h3>
            <p className="truncate text-sm text-ink-500">{store.tagline}</p>
          </div>
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-black"
            style={{ backgroundColor: store.accent + '22', color: store.accent }}
          >
            {store.name.slice(0, 1)}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500">
          <Stars rating={store.rating} />
          <span>({store.reviews.toLocaleString()})</span>
          <span className="text-ink-300">•</span>
          <span className="font-medium text-ink-600">{priceDots(store.priceLevel)}</span>
          <span className="text-ink-300">•</span>
          <span>{store.distanceKm} km</span>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-mint-500/10 px-2 py-1 font-semibold text-mint-600">
            <Bike className="h-3.5 w-3.5" />
            {store.deliveryFee === 0 ? 'Free delivery' : `${currency(store.deliveryFee)} delivery`}
          </span>
          {store.tags.slice(0, 1).map((t) => (
            <span key={t} className="rounded-full bg-ink-100 px-2 py-1 font-medium text-ink-600">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
