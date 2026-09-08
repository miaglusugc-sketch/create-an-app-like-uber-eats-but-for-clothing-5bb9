import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../data/types';
import { getBoutique } from '../data/catalog';
import { useStore } from '../context/StoreContext';
import { currency } from '../lib/format';
import GarmentArt, { shade } from './GarmentArt';
import ProductModal from './ProductModal';
import { Stars } from './Logo';
import { IconHeart, IconHeartFill, IconPlus } from './icons';

export default function ProductCard({ product }: { product: Product }) {
  const { isFavorite, toggleFavorite } = useStore();
  const [open, setOpen] = useState(false);
  const fav = isFavorite(product.id);
  const boutique = getBoutique(product.boutiqueId);
  const base = product.colors[0]?.hex ?? '#cccccc';
  const discount =
    product.compareAt && product.compareAt > product.price
      ? Math.round((1 - product.price / product.compareAt) * 100)
      : 0;

  return (
    <>
      <div className="group card relative overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-soft">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative block aspect-[4/5] w-full overflow-hidden text-left"
          style={{
            background: `radial-gradient(120% 120% at 30% 15%, ${shade(base, 0.32)} 0%, ${shade(
              base,
              0.12,
            )} 55%, ${shade(base, -0.05)} 100%)`,
          }}
          aria-label={`Quick view ${product.name}`}
        >
          <GarmentArt
            garment={product.garment}
            color={base}
            className="absolute inset-0 h-full w-full p-6 drop-shadow-[0_18px_20px_rgba(0,0,0,0.16)] transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="rounded-full bg-brand-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                -{discount}%
              </span>
            )}
            {product.trending && (
              <span className="rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                Trending
              </span>
            )}
          </div>
        </button>

        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition ${
            fav ? 'bg-white text-brand-500' : 'bg-white/80 text-ink hover:bg-white'
          }`}
          aria-label={fav ? 'Remove from favourites' : 'Save to favourites'}
        >
          {fav ? <IconHeartFill className="h-5 w-5" /> : <IconHeart className="h-5 w-5" />}
        </button>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-ink">{product.name}</h3>
              {boutique && (
                <Link
                  to={`/boutique/${boutique.id}`}
                  className="mt-0.5 block truncate text-sm text-ink-muted hover:text-brand-600"
                >
                  {boutique.name}
                </Link>
              )}
            </div>
            <Stars value={product.rating} className="mt-0.5 shrink-0 text-xs" />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-ink">{currency(product.price)}</span>
              {product.compareAt && (
                <span className="text-sm text-ink-muted line-through">
                  {currency(product.compareAt)}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="btn-primary h-10 w-10 !p-0"
              aria-label={`Add ${product.name} to bag`}
            >
              <IconPlus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {open && <ProductModal product={product} onClose={() => setOpen(false)} />}
    </>
  );
}
