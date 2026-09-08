import { useNavigate } from 'react-router-dom'
import { X, Minus, Plus, Trash2, ShoppingBag, Bike, ArrowRight } from 'lucide-react'
import { useUI } from '../context/UIContext'
import { useCart } from '../context/CartContext'
import { Garment } from './Garment'
import { currency } from '../lib/format'
import { storeById } from '../data/stores'

export function CartDrawer() {
  const { cartOpen, closeCart } = useUI()
  const cart = useCart()
  const navigate = useNavigate()
  const store = cart.storeId ? storeById(cart.storeId) : undefined

  const deliveryFee = store
    ? store.freeDeliveryOver && cart.subtotal >= store.freeDeliveryOver
      ? 0
      : store.deliveryFee
    : 0
  const remainingForFree =
    store?.freeDeliveryOver && cart.subtotal < store.freeDeliveryOver
      ? store.freeDeliveryOver - cart.subtotal
      : 0
  const meetsMin = store ? cart.subtotal >= store.minOrder : false

  function goCheckout() {
    closeCart()
    navigate('/checkout')
  }

  return (
    <>
      {/* Scrim */}
      <div
        className={`fixed inset-0 z-50 bg-ink-950/50 backdrop-blur-sm transition-opacity duration-300 ${
          cartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeCart}
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-[55] flex h-full w-full max-w-md flex-col bg-white shadow-lift transition-transform duration-300 ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!cartOpen}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-extrabold text-ink-950">Your bag</h2>
            {store ? (
              <p className="text-sm text-ink-500">
                from <span className="font-semibold text-ink-700">{store.name}</span>
              </p>
            ) : (
              <p className="text-sm text-ink-500">{cart.count} items</p>
            )}
          </div>
          <button
            onClick={closeCart}
            className="grid h-9 w-9 place-items-center rounded-full text-ink-600 transition hover:bg-ink-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-ink-100 text-ink-400">
              <ShoppingBag className="h-7 w-7" />
            </span>
            <h3 className="text-base font-bold text-ink-900">Your bag is empty</h3>
            <p className="text-sm text-ink-500">
              Browse boutiques near you and add pieces to see them here.
            </p>
            <button onClick={closeCart} className="btn-dark mt-2 h-11 px-6 text-sm">
              Start shopping
            </button>
          </div>
        ) : (
          <>
            {store?.freeDeliveryOver && (
              <div className="border-b border-ink-100 bg-mint-500/5 px-5 py-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-ink-700">
                  <Bike className="h-4 w-4 text-mint-600" />
                  {remainingForFree > 0 ? (
                    <span>
                      Add <span className="text-mint-600">{currency(remainingForFree)}</span> more for free delivery
                    </span>
                  ) : (
                    <span className="text-mint-600">You’ve unlocked free delivery! 🎉</span>
                  )}
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100">
                  <div
                    className="h-full rounded-full bg-mint-500 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (cart.subtotal / (store.freeDeliveryOver || 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4 thin-scroll">
              {cart.lines.map((line) => (
                <div key={line.id} className="flex gap-3 rounded-2xl border border-ink-100 p-3">
                  <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-ink-50 to-ink-100">
                    <Garment type={line.garment} color={line.color.hex} className="h-16 w-16" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                          {line.brand}
                        </p>
                        <h4 className="truncate text-sm font-bold text-ink-950">{line.name}</h4>
                      </div>
                      <button
                        onClick={() => cart.remove(line.id)}
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-400 transition hover:bg-brand-50 hover:text-brand-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs text-ink-500">
                      {line.color.name} · Size {line.size}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 rounded-full border border-ink-200 p-0.5">
                        <button
                          onClick={() => cart.dec(line.id)}
                          className="grid h-7 w-7 place-items-center rounded-full text-ink-700 transition hover:bg-ink-100"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{line.qty}</span>
                        <button
                          onClick={() => cart.inc(line.id)}
                          className="grid h-7 w-7 place-items-center rounded-full text-ink-700 transition hover:bg-ink-100"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-extrabold text-ink-950">
                        {currency(line.price * line.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-ink-100 p-5">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-ink-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-ink-900">{currency(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-ink-600">
                  <span>Delivery</span>
                  <span className="font-semibold text-ink-900">
                    {deliveryFee === 0 ? <span className="text-mint-600">Free</span> : currency(deliveryFee)}
                  </span>
                </div>
              </div>

              {!meetsMin && store && (
                <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                  Add {currency(store.minOrder - cart.subtotal)} more to reach the {currency(store.minOrder)}{' '}
                  minimum for this boutique.
                </p>
              )}

              <button
                onClick={goCheckout}
                disabled={!meetsMin}
                className="btn-primary mt-4 w-full py-3.5 text-sm"
              >
                Go to checkout · {currency(cart.subtotal + deliveryFee)}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={cart.clear}
                className="mt-2 w-full py-1 text-center text-xs font-medium text-ink-400 transition hover:text-brand-500"
              >
                Empty bag
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
