import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bike, Clock, Sparkles, TrendingUp, ArrowRight, Search as SearchIcon } from 'lucide-react'
import { Header } from '../components/Header'
import { StoreCard } from '../components/StoreCard'
import { ItemCard } from '../components/ItemCard'
import { CategoryChips, type FilterKey } from '../components/CategoryChips'
import { stores, items, storeById } from '../data/stores'
import type { Store } from '../types'

type SortKey = 'recommended' | 'rating' | 'fastest' | 'delivery'

export function Home() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterKey>('all')
  const [sort, setSort] = useState<SortKey>('recommended')

  const q = query.trim().toLowerCase()

  const filteredStores = useMemo(() => {
    let list = stores.slice()
    if (filter !== 'all') list = list.filter((s) => s.categories.includes(filter))
    if (q) {
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.tagline.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }
    switch (sort) {
      case 'rating':
        list.sort((a, b) => b.rating - a.rating)
        break
      case 'fastest':
        list.sort((a, b) => a.eta[0] - b.eta[0])
        break
      case 'delivery':
        list.sort((a, b) => a.deliveryFee - b.deliveryFee)
        break
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating)
    }
    return list
  }, [q, filter, sort])

  const matchingItems = useMemo(() => {
    if (!q) return []
    return items
      .filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.brand.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q),
      )
      .slice(0, 10)
  }, [q])

  const featured = stores.filter((s) => s.featured)

  return (
    <div className="min-h-screen bg-ink-50">
      <Header search={query} onSearch={setQuery} />

      {!q && <Hero />}

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6">
        {/* Filters */}
        <div className="sticky top-[65px] z-30 -mx-4 mb-6 bg-ink-50/90 px-4 py-3 backdrop-blur lg:top-[65px]">
          <CategoryChips active={filter} onChange={setFilter} />
          <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="shrink-0 text-xs font-semibold text-ink-400">Sort</span>
            {(
              [
                ['recommended', 'Recommended', Sparkles],
                ['rating', 'Top rated', TrendingUp],
                ['fastest', 'Fastest', Clock],
                ['delivery', 'Cheapest delivery', Bike],
              ] as [SortKey, string, typeof Sparkles][]
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  sort === key ? 'bg-brand-500 text-white' : 'bg-white text-ink-600 hover:bg-ink-100'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Search results: matching items */}
        {q && matchingItems.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-extrabold text-ink-950">
              Pieces matching “{query}”
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {matchingItems.map((it) => {
                const st = storeById(it.storeId)!
                return <ItemCard key={it.id} item={it} store={st} />
              })}
            </div>
          </section>
        )}

        {/* Featured row (only when not searching / all) */}
        {!q && filter === 'all' && (
          <section className="mb-9">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-ink-950">Featured boutiques</h2>
              <span className="hidden text-xs font-semibold text-ink-400 sm:inline">Handpicked for you</span>
            </div>
            <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
              {featured.map((s) => (
                <div key={s.id} className="w-[300px] shrink-0 snap-start">
                  <StoreCard store={s} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All boutiques */}
        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-lg font-extrabold text-ink-950">
              {q ? `Boutiques matching “${query}”` : 'Boutiques near you'}
            </h2>
            <span className="text-sm text-ink-500">{filteredStores.length} places</span>
          </div>

          {filteredStores.length === 0 ? (
            <div className="card flex flex-col items-center gap-3 py-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-ink-100 text-ink-400">
                <SearchIcon className="h-6 w-6" />
              </span>
              <h3 className="text-base font-bold text-ink-900">No boutiques found</h3>
              <p className="max-w-xs text-sm text-ink-500">
                Try a different category or clear your search to see everything near you.
              </p>
              <button
                onClick={() => {
                  setQuery('')
                  setFilter('all')
                }}
                className="btn-dark mt-1 h-10 px-5 text-sm"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredStores.map((s) => (
                <StoreCard key={s.id} store={s} />
              ))}
            </div>
          )}
        </section>

        <ValueProps />
      </main>

      <Footer />
    </div>
  )
}

function Hero() {
  const topStore: Store = stores[1]
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-mint-500/20 blur-3xl" />
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:py-16 lg:grid-cols-2">
        <div className="animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/15">
            <Sparkles className="h-3.5 w-3.5 text-brand-300" />
            Fashion delivered in under an hour
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            Your favorite boutiques,{' '}
            <span className="bg-gradient-to-r from-brand-400 to-brand-200 bg-clip-text text-transparent">
              delivered
            </span>{' '}
            to your door.
          </h1>
          <p className="mt-4 max-w-md text-base text-white/70">
            Order clothing, shoes and accessories from local boutiques and get them dropped off the same day.
            Try on at home, keep what you love.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() =>
                document.getElementById('boutiques')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
              className="btn-primary h-12 px-6 text-sm"
            >
              Browse boutiques
              <ArrowRight className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-4 text-sm text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-mint-400" /> ~35 min avg
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Bike className="h-4 w-4 text-mint-400" /> Free returns
              </span>
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="relative mx-auto grid max-w-sm grid-cols-2 gap-4">
            <FloatCard store={stores[0]} className="mt-8" />
            <FloatCard store={topStore} />
            <FloatCard store={stores[2]} />
            <FloatCard store={stores[6]} className="-mt-4" />
          </div>
        </div>
      </div>
      <div id="boutiques" className="absolute bottom-0" />
    </section>
  )
}

function FloatCard({ store, className = '' }: { store: Store; className?: string }) {
  return (
    <Link
      to={`/store/${store.id}`}
      className={`group rounded-2xl bg-white/10 p-3 ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15 ${className}`}
    >
      <div className={`mb-2 flex h-24 items-center justify-center rounded-xl bg-gradient-to-br ${store.gradient}`}>
        <span className="text-2xl font-black text-white/90 drop-shadow">{store.name.slice(0, 1)}</span>
      </div>
      <p className="truncate text-sm font-bold text-white">{store.name}</p>
      <p className="text-xs text-white/60">
        {store.eta[0]}–{store.eta[1]} min · ★ {store.rating}
      </p>
    </Link>
  )
}

function ValueProps() {
  const props = [
    { icon: Bike, title: 'Same-day delivery', body: 'Local couriers bring your order in as little as 20 minutes.' },
    { icon: Clock, title: 'Try before you commit', body: 'Free 3-day returns — keep what fits, send back the rest.' },
    { icon: Sparkles, title: 'Curated boutiques', body: 'Every store is handpicked for quality and style.' },
  ]
  return (
    <section className="mt-12 grid gap-4 sm:grid-cols-3">
      {props.map((p) => (
        <div key={p.title} className="card p-5">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-500">
            <p.icon className="h-5 w-5" />
          </span>
          <h3 className="mt-3 text-base font-bold text-ink-950">{p.title}</h3>
          <p className="mt-1 text-sm text-ink-500">{p.body}</p>
        </div>
      ))}
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-ink-400">
        <p className="font-semibold text-ink-600">Threadly</p>
        <p className="mt-1">Fashion, delivered. This is a demo experience — no real orders are placed.</p>
      </div>
    </footer>
  )
}
