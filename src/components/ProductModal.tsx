import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../data/types';
import { getBoutique } from '../data/catalog';
import { useStore } from '../context/StoreContext';
import { currency } from '../lib/format';
import GarmentArt, { shade } from './GarmentArt';
import { Stars } from './Logo';
import { IconClose, IconMinus, IconPlus, IconHeart, IconHeartFill, IconClock, IconTruck } from './icons';

export default function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addToCart, isFavorite, toggleFavorite } = useStore();
  const boutique = getBoutique(product.boutiqueId);
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState<string>(product.sizes.length === 1 ? product.sizes[0] : '');
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);
  const fav = isFavorite(product.id);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleAdd = () => {
    if (!size) {
      setError(true);
      return;
    }
    addToCart(product, size, color.name, qty);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-3xl animate-scale-in flex-col overflow-hidden rounded-t-4xl bg-white shadow-soft sm:rounded-4xl md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur hover:bg-white"
          aria-label="Close"
        >
          <IconClose className="h-5 w-5" />
        </button>

        <div
          className="relative flex h-56 shrink-0 items-center justify-center md:h-auto md:w-2/5"
          style={{
            background: `radial-gradient(120% 120% at 30% 20%, ${shade(color.hex, 0.34)} 0%, ${shade(
              color.hex,
              0.12,
            )} 55%, ${shade(color.hex, -0.06)} 100%)`,
          }}
        >
          <GarmentArt
            garment={product.garment}
            color={color.hex}
            className="h-full w-full max-h-72 p-8 drop-shadow-[0_20px_24px_rgba(0,0,0,0.18)]"
          />
          <button
            type="button"
            onClick={() => toggleFavorite(product.id)}
            className={`absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition ${
              fav ? 'bg-white text-brand-500' : 'bg-white/80 text-ink hover:bg-white'
            }`}
            aria-label={fav ? 'Remove from favourites' : 'Save to favourites'}
          >
            {fav ? <IconHeartFill className="h-5 w-5" /> : <IconHeart className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex max-h-[62vh] flex-1 flex-col overflow-y-auto p-6 md:max-h-[80vh]">
          {boutique && (
            <Link
              to={`/boutique/${boutique.id}`}
              onClick={onClose}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:underline"
            >
              {boutique.name}
            </Link>
          )}
          <div className="mt-1 flex items-start justify-between gap-3">
            <h2 className="text-2xl font-extrabold tracking-tight text-ink">{product.name}</h2>
          </div>
          <div className="mt-2 flex items-center gap-3 text-sm text-ink-muted">
            <Stars value={product.rating} />
            <span>·</span>
            <span>{product.reviews} reviews</span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{product.description}</p>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-ink">{currency(product.price)}</span>
            {product.compareAt && (
              <span className="text-base text-ink-muted line-through">
                {currency(product.compareAt)}
              </span>
            )}
          </div>

          {/* Colours */}
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">Colour</span>
              <span className="text-sm text-ink-muted">{color.name}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-9 w-9 rounded-full ring-2 ring-offset-2 transition ${
                    color.name === c.name ? 'ring-brand-500' : 'ring-transparent hover:ring-ink/20'
                  }`}
                  style={{ backgroundColor: c.hex, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)' }}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">Size</span>
              {error && <span className="text-sm font-semibold text-brand-600">Pick a size</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSize(s);
                    setError(false);
                  }}
                  className={`min-w-[3rem] rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                    size === s
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-ink/15 bg-white text-ink hover:border-ink/30'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {boutique && (
            <div className="mt-5 flex flex-wrap gap-4 rounded-2xl bg-cream px-4 py-3 text-sm text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <IconClock className="h-4 w-4 text-brand-500" />
                {boutique.etaMin}–{boutique.etaMax} min
              </span>
              <span className="inline-flex items-center gap-1.5">
                <IconTruck className="h-4 w-4 text-brand-500" />
                {boutique.deliveryFee === 0 ? 'Free delivery' : `${currency(boutique.deliveryFee)} delivery`}
              </span>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-ink/15 p-1">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-ink/5"
                aria-label="Decrease quantity"
              >
                <IconMinus className="h-4 w-4" />
              </button>
              <span className="w-7 text-center font-semibold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-ink/5"
                aria-label="Increase quantity"
              >
                <IconPlus className="h-4 w-4" />
              </button>
            </div>
            <button type="button" onClick={handleAdd} className="btn-primary h-12 flex-1 text-base">
              Add to bag · {currency(product.price * qty)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
