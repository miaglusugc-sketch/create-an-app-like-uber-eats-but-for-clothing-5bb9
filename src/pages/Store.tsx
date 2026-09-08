import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, Bike, Star, MapPin, ShieldCheck, Tag, ShoppingBag } from 'lucide-react'
import { Header } from '../components/Header'
import { ItemCard } from '../components/ItemCard'
import { itemsByStore, storeById, CATEGORY_LABELS } from '../data/stores'
import type { Category } from '../types'
import { currency, priceDots } from '../lib/format'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'

export function StorePage() {
  const { id } = useParams<{ id: string }>()
  const store = id ? storeById(id) : undefined
  const allItems = useMemo(() => (id ? itemsByStore(id) : []), [id])
  const [activeCat, setActiveCat] = useState<Category | 'all'>('all')
  const cart = useCart()
  const { openCart } = useUI()

  if (!store) {
    return (
      <div className="min-h-screen bg-ink-50">
        <Header showSearch={false} />
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h1 className="text-2xl font-extrabold text-ink-950">Boutique not found</h1>
          <p className="mt-2 text-ink-500">This boutique may have closed or moved.</p>
          <Link to="/" className="btn-dark mt-6 inline-flex h-11 px-6 text-sm">
            Back to boutiques
          </Link>
        </div>
      </div>
    )
  }

  const cats = Array.from(new Set(allItems.map((i) => i.category))) as Category[]
  const grouped = cats
    .map((c) => ({ cat: c, items: allItems.filter((i) => i.category === c) }))
    .filter((g) => (activeCat === 'all' ? true : g.cat === activeCat))

  const cartHasThisStore = cart.storeId === store.id && cart.count > 0

  return (
    <div className="min-h-screen bg-ink-50">
      <Header showSearch={false} />

      {/* Hero */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${store.gradient}`}>
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-black/40"
          >
            <ArrowLeft className="h-4 w-4" /> All boutiques
          </Link>

          <div className="mt-6 flex items-end gap-4">
            <span
              className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/95 text-2xl font-black shadow-lg"
              style={{ color: store.accent === '#ffffff' ? store.gradient.includes('ff2d55') ? '#ff2d55' : '#161616' : store.accent }}
            >
              {store.name.slice(0, 1)}
            </span>
            <div className="pb-1 text-white">
              <h1 className="text-2xl font-extrabold leading-tight drop-shadow-sm sm:text-3xl">{store.name}</h1>
              <p className="text-sm text-white/80">{store.tagline}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {store.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* info bar */}
        <div className="bg-black/20 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 text-sm text-white">
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-bold">{store.rating}</span>
              <span className="text-white/70">({store.reviews.toLocaleString()})</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-white/80" /> {store.eta[0]}–{store.eta[1]} min
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Bike className="h-4 w-4 text-white/80" />
              {store.deliveryFee === 0 ? 'Free delivery' : `${currency(store.deliveryFee)} delivery`}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-white/80" /> {store.distanceKm} km · {priceDots(store.priceLevel)}
            </span>
          </div>
        </div>
      </section>

      {/* Promo / min order banners */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="-mt-0 flex flex-wrap gap-3 py-4">
          {store.promo && (
            <div className="inline-flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700">
              <Tag className="h-4 w-4" /> {store.promo}
            </div>
          )}
          <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-ink-600 shadow-soft">
            <ShieldCheck className="h-4 w-4 text-mint-600" /> {currency(store.minOrder)} minimum · Free 3-day returns
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="sticky top-[65px] z-30 border-y border-ink-100 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4">
          <div className="no-scrollbar flex gap-1 overflow-x-auto py-2">
            <button
              onClick={() => setActiveCat('all')}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeCat === 'all' ? 'bg-ink-950 text-white' : 'text-ink-600 hover:bg-ink-100'
              }`}
            >
              All ({allItems.length})
            </button>
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeCat === c ? 'bg-ink-950 text-white' : 'text-ink-600 hover:bg-ink-100'
                }`}
              >
                {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items */}
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6">
        {grouped.map((g) => (
          <section key={g.cat} className="mb-10 scroll-mt-32">
            <h2 className="mb-4 text-xl font-extrabold text-ink-950">{CATEGORY_LABELS[g.cat]}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {g.items.map((it) => (
                <ItemCard key={it.id} item={it} store={store} />
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Sticky bag bar */}
      {cartHasThisStore && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-white/95 p-3 backdrop-blur-xl animate-slide-up sm:p-4">
          <div className="mx-auto flex max-w-6xl items-center gap-3">
            <button onClick={openCart} className="btn-primary w-full py-3.5 text-sm">
              <ShoppingBag className="h-5 w-5" />
              View bag · {cart.count} {cart.count === 1 ? 'item' : 'items'}
              <span className="ml-auto">{currency(cart.subtotal)}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
