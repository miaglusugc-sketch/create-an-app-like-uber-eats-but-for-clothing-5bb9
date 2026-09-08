import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { getBoutique, getProduct } from '../data/catalog';
import { currency, plural } from '../lib/format';
import GarmentArt, { shade } from './GarmentArt';
import { IconBag, IconClose, IconMinus, IconPlus, IconClock, IconTruck, IconBolt } from './icons';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    cart,
    cartOpen,
    setCartOpen,
    setQty,
    removeLine,
    cartSubtotal,
    cartCount,
    cartBoutiqueId,
  } = useStore();

  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [cartOpen]);

  const boutique = cartBoutiqueId ? getBoutique(cartBoutiqueId) : null;
  const freeDelivery =
    boutique && boutique.freeOver !== undefined && cartSubtotal >= boutique.freeOver;
  const deliveryFee = boutique ? (freeDelivery ? 0 : boutique.deliveryFee) : 0;
  const serviceFee = Math.round(cartSubtotal * 0.05 * 100) / 100;
  const total = cartSubtotal + deliveryFee + serviceFee;
  const toFreeDelivery =
    boutique && boutique.freeOver ? Math.max(0, boutique.freeOver - cartSubtotal) : 0;

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slide-in flex-col bg-cream shadow-soft">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink/10 bg-white px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-ink">Your bag</h2>
            {boutique ? (
              <p className="text-sm text-ink-muted">
                {plural(cartCount, 'item')} from {boutique.name}
              </p>
            ) : (
              <p className="text-sm text-ink-muted">Nothing here yet</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-ink/5"
            aria-label="Close bag"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-ink-muted shadow-card">
              <IconBag className="h-9 w-9" />
            </div>
            <div>
              <p className="text-lg font-bold text-ink">Your bag is empty</p>
              <p className="mt-1 text-sm text-ink-muted">
                Add pieces from a boutique and they'll show up here.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setCartOpen(false);
                navigate('/');
              }}
              className="btn-primary h-11 px-6"
            >
              Start browsing
            </button>
          </div>
        ) : (
          <>
            {boutique && (
              <div className="flex items-center gap-4 border-b border-ink/10 bg-white px-5 py-2.5 text-sm text-ink-soft">
                <span className="inline-flex items-center gap-1.5">
                  <IconClock className="h-4 w-4 text-brand-500" />
                  {boutique.etaMin}–{boutique.etaMax} min
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <IconTruck className="h-4 w-4 text-brand-500" />
                  {deliveryFee === 0 ? 'Free delivery' : `${currency(deliveryFee)} delivery`}
                </span>
              </div>
            )}

            {toFreeDelivery > 0 && boutique && (
              <div className="border-b border-ink/10 bg-brand-50 px-5 py-3">
                <p className="text-sm font-semibold text-brand-700">
                  Add {currency(toFreeDelivery)} more for free delivery
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-100">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all"
                    style={{
                      width: `${Math.min(100, (cartSubtotal / (boutique.freeOver || 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {cart.map((line) => {
                const p = getProduct(line.productId);
                if (!p) return null;
                const c = p.colors.find((x) => x.name === line.color) ?? p.colors[0];
                return (
                  <div key={line.key} className="flex gap-3 rounded-3xl bg-white p-3 shadow-card">
                    <div
                      className="flex h-24 w-20 shrink-0 items-center justify-center rounded-2xl"
                      style={{
                        background: `radial-gradient(120% 120% at 30% 20%, ${shade(
                          c.hex,
                          0.32,
                        )} 0%, ${shade(c.hex, 0.05)} 100%)`,
                      }}
                    >
                      <GarmentArt garment={p.garment} color={c.hex} className="h-full w-full p-2" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate text-sm font-bold text-ink">{p.name}</h3>
                        <button
                          type="button"
                          onClick={() => removeLine(line.key)}
                          className="shrink-0 text-ink-muted hover:text-brand-600"
                          aria-label="Remove item"
                        >
                          <IconClose className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        {line.color} · Size {line.size}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1 rounded-full border border-ink/15 p-0.5">
                          <button
                            type="button"
                            onClick={() => setQty(line.key, line.qty - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-ink hover:bg-ink/5"
                            aria-label="Decrease quantity"
                          >
                            <IconMinus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold">{line.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(line.key, line.qty + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-ink hover:bg-ink/5"
                            aria-label="Increase quantity"
                          >
                            <IconPlus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-ink">
                          {currency(p.price * line.qty)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="border-t border-ink/10 bg-white px-5 py-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-ink-soft">
                  <span>Subtotal</span>
                  <span className="font-semibold text-ink">{currency(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-ink-soft">
                  <span>Delivery</span>
                  <span className="font-semibold text-ink">
                    {deliveryFee === 0 ? 'Free' : currency(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-ink-soft">
                  <span>Service fee</span>
                  <span className="font-semibold text-ink">{currency(serviceFee)}</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-dashed border-ink/15 pt-3">
                <span className="text-base font-bold text-ink">Total</span>
                <span className="text-xl font-extrabold text-ink">{currency(total)}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCartOpen(false);
                  navigate('/checkout');
                }}
                className="btn-primary mt-4 h-12 w-full text-base"
              >
                <IconBolt className="h-5 w-5" />
                Checkout · {currency(total)}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
