import { useEffect, useState } from 'react'
import { X, Minus, Plus, Star, Check, ShoppingBag, AlertTriangle } from 'lucide-react'
import { useUI } from '../context/UIContext'
import { useCart } from '../context/CartContext'
import { GarmentTile } from './GarmentTile'
import { currency } from '../lib/format'
import { CATEGORY_LABELS } from '../data/stores'

export function ItemModal() {
  const { itemModal, closeItem, openCart } = useUI()
  const cart = useCart()

  const [size, setSize] = useState<string>('')
  const [colorIdx, setColorIdx] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [confirmSwitch, setConfirmSwitch] = useState(false)

  const item = itemModal?.item
  const store = itemModal?.store

  useEffect(() => {
    if (item) {
      setSize(item.sizes.length === 1 ? item.sizes[0] : '')
      setColorIdx(0)
      setQty(1)
      setAdded(false)
      setConfirmSwitch(false)
    }
  }, [item])

  // lock body scroll while open
  useEffect(() => {
    if (itemModal) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [itemModal])

  if (!itemModal || !item || !store) return null

  const color = item.colors[colorIdx]
  const discount = item.compareAt ? Math.round((1 - item.price / item.compareAt) * 100) : 0
  const differentStore = cart.storeId !== null && cart.storeId !== store.id

  function doAdd() {
    if (!item || !store) return
    if (!size) return
    if (differentStore) {
      setConfirmSwitch(true)
      return
    }
    cart.add({ item, store, size, color, qty })
    flashAdded()
  }

  function flashAdded() {
    setAdded(true)
    setTimeout(() => {
      closeItem()
      openCart()
    }, 550)
  }

  function replaceAndAdd() {
    if (!item || !store) return
    cart.replaceStore({ item, store, size, color, qty })
    setConfirmSwitch(false)
    flashAdded()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm animate-fade-in" onClick={closeItem} />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-lift animate-slide-up sm:rounded-3xl sm:animate-scale-in">
        <button
          onClick={closeItem}
          className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink-700 shadow-sm transition hover:bg-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid overflow-y-auto sm:grid-cols-2">
          {/* Visual */}
          <div className="relative bg-ink-50">
            <GarmentTile
              garment={item.garment}
              color={color.hex}
              padded={false}
              className="aspect-square w-full p-10 sm:aspect-auto sm:h-full sm:min-h-[420px]"
            />
            <div className="absolute left-4 top-4 flex gap-1.5">
              {item.isNew && (
                <span className="rounded-full bg-ink-950 px-2.5 py-1 text-xs font-bold text-white">New in</span>
              )}
              {discount > 0 && (
                <span className="rounded-full bg-brand-500 px-2.5 py-1 text-xs font-bold text-white">-{discount}%</span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-500">{item.brand}</p>
            <h2 className="mt-1 text-2xl font-extrabold leading-tight text-ink-950">{item.name}</h2>
            <div className="mt-2 flex items-center gap-3 text-sm text-ink-500">
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-ink-800">{item.rating.toFixed(1)}</span>
                <span>({item.reviews} reviews)</span>
              </span>
              <span className="text-ink-300">•</span>
              <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-semibold text-ink-600">
                {CATEGORY_LABELS[item.category]}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink-600">{item.description}</p>

            {/* Color */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="label mb-0">Color</span>
                <span className="text-sm font-semibold text-ink-700">{color.name}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.colors.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setColorIdx(i)}
                    className={`relative h-9 w-9 rounded-full border-2 transition ${
                      i === colorIdx ? 'border-brand-500 scale-110' : 'border-ink-200'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {i === colorIdx && (
                      <Check
                        className="absolute inset-0 m-auto h-4 w-4"
                        style={{ color: isLight(c.hex) ? '#161616' : '#fff' }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="label mb-0">Size</span>
                {!size && <span className="text-xs font-semibold text-brand-500">Please select</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {item.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-[3rem] rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                      s === size
                        ? 'border-ink-950 bg-ink-950 text-white'
                        : 'border-ink-200 bg-white text-ink-800 hover:border-ink-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-full border border-ink-200 p-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-9 w-9 place-items-center rounded-full text-ink-700 transition hover:bg-ink-100 disabled:opacity-40"
                  disabled={qty <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(9, q + 1))}
                  className="grid h-9 w-9 place-items-center rounded-full text-ink-700 transition hover:bg-ink-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={doAdd}
                disabled={!size || added}
                className="btn-primary h-12 flex-1 text-sm"
              >
                {added ? (
                  <>
                    <Check className="h-5 w-5" /> Added to bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5" />
                    Add to bag · {currency(item.price * qty)}
                  </>
                )}
              </button>
            </div>

            {item.compareAt && (
              <p className="mt-3 text-center text-xs text-ink-500">
                You save{' '}
                <span className="font-bold text-mint-600">{currency((item.compareAt - item.price) * qty)}</span> on
                this order
              </p>
            )}
          </div>
        </div>

        {/* Store switch confirm overlay */}
        {confirmSwitch && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-ink-950/60 p-5 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-lift animate-scale-in">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-amber-100 text-amber-600">
                <AlertTriangle className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-ink-950">Start a new bag?</h3>
              <p className="mt-1 text-sm text-ink-600">
                Your bag has items from another boutique. Threadly delivers one boutique per order, so adding this
                will empty your current bag.
              </p>
              <div className="mt-5 flex gap-2">
                <button onClick={() => setConfirmSwitch(false)} className="btn-ghost h-11 flex-1 text-sm">
                  Keep bag
                </button>
                <button onClick={replaceAndAdd} className="btn-primary h-11 flex-1 text-sm">
                  New bag
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function isLight(hex: string): boolean {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const num = parseInt(full, 16)
  const r = (num >> 16) & 0xff
  const g = (num >> 8) & 0xff
  const b = num & 0xff
  return 0.299 * r + 0.587 * g + 0.114 * b > 180
}
