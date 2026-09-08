import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, MapPin, Search, ChevronDown, Receipt } from 'lucide-react'
import { Logo } from './Logo'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { loadAddress } from '../lib/address'

export function Header({
  search,
  onSearch,
  showSearch = true,
}: {
  search?: string
  onSearch?: (v: string) => void
  showSearch?: boolean
}) {
  const { count } = useCart()
  const { openCart } = useUI()
  const navigate = useNavigate()
  const address = loadAddress()

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <button
          onClick={() => navigate('/checkout')}
          className="hidden items-center gap-2 rounded-full bg-ink-50 px-3 py-2 text-left text-sm transition hover:bg-ink-100 md:flex"
        >
          <MapPin className="h-4 w-4 text-brand-500" />
          <span className="max-w-[180px] truncate">
            <span className="font-semibold text-ink-900">{address.label}</span>
            <span className="text-ink-500"> · {address.line}</span>
          </span>
          <ChevronDown className="h-4 w-4 text-ink-400" />
        </button>

        {showSearch && (
          <div className="relative hidden flex-1 lg:block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={search ?? ''}
              onChange={(e) => onSearch?.(e.target.value)}
              placeholder="Search boutiques, brands or pieces…"
              className="w-full rounded-full border border-ink-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/orders"
            className="hidden h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink-700 transition hover:bg-ink-50 sm:flex"
          >
            <Receipt className="h-4 w-4" />
            Orders
          </Link>
          <button
            onClick={openCart}
            className="relative flex h-11 items-center gap-2 rounded-full bg-ink-950 px-4 text-sm font-semibold text-white transition hover:bg-ink-900"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Bag</span>
            {count > 0 && (
              <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-brand-500 px-1 text-xs font-bold">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="border-t border-ink-100 px-4 py-2.5 lg:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={search ?? ''}
              onChange={(e) => onSearch?.(e.target.value)}
              placeholder="Search boutiques, brands or pieces…"
              className="w-full rounded-full border border-ink-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>
      )}
    </header>
  )
}
