import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBoutique, productsByBoutique } from '../data/catalog';
import type { Category } from '../data/types';
import ProductCard from '../components/ProductCard';
import GarmentArt, { shade } from '../components/GarmentArt';
import { Stars } from '../components/Logo';
import { currency } from '../lib/format';
import { IconArrowLeft, IconClock, IconPin, IconTruck, IconLeaf } from '../components/icons';

export default function Boutique() {
  const { id } = useParams<{ id: string }>();
  const boutique = id ? getBoutique(id) : undefined;
  const items = useMemo(() => (id ? productsByBoutique(id) : []), [id]);
  const [filter, setFilter] = useState<Category | 'All'>('All');

  if (!boutique) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-ink">Boutique not found</h1>
        <Link to="/" className="btn-primary mt-6 h-11 px-6">Back home</Link>
      </div>
    );
  }

  const cats = Array.from(new Set(items.map((p) => p.category)));
  const shown = filter === 'All' ? items : items.filter((p) => p.category === filter);
  const preview = items.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${shade(boutique.accent, 0.2)} 0%, ${boutique.accent} 100%)` }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(circle at 80% 10%, rgba(255,255,255,0.55) 0, transparent 45%)' }} />
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/30"
          >
            <IconArrowLeft className="h-4 w-4" /> All boutiques
          </Link>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              {boutique.badge && (
                <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-ink shadow-sm">
                  {boutique.badge}
                </span>
              )}
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                {boutique.name}
              </h1>
              <p className="mt-2 text-lg text-white/90">{boutique.tagline}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-white">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 backdrop-blur">
                  <Stars value={boutique.rating} className="[&_span]:text-white [&_svg]:text-amber-300" />
                  <span className="font-normal text-white/80">({boutique.reviews.toLocaleString()})</span>
                </span>
                <span className="inline-flex items-center gap-1.5"><IconClock className="h-4 w-4" /> {boutique.etaMin}–{boutique.etaMax} min</span>
                <span className="inline-flex items-center gap-1.5"><IconTruck className="h-4 w-4" /> {boutique.deliveryFee === 0 ? 'Free delivery' : `${currency(boutique.deliveryFee)} delivery`}</span>
                <span className="inline-flex items-center gap-1.5"><IconPin className="h-4 w-4" /> {boutique.distanceKm} km · {boutique.neighborhood}</span>
                <span className="inline-flex items-center gap-1.5"><IconLeaf className="h-4 w-4" /> E-bike courier</span>
              </div>
            </div>

            <div className="hidden shrink-0 gap-2 md:flex">
              {preview.map((p, i) => (
                <div key={p.id} className="w-20" style={{ transform: `translateY(${i % 2 ? 10 : 0}px)` }}>
                  <div className="rounded-2xl bg-white/15 p-2 backdrop-blur">
                    <GarmentArt garment={p.garment} color={p.colors[0].hex} className="h-24 w-full drop-shadow-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-[64px] z-30 border-b border-ink/10 bg-cream/90 backdrop-blur sm:top-[68px]">
        <div className="no-scrollbar mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {(['All', ...cats] as (Category | 'All')[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`chip ${
                filter === c ? 'bg-ink text-white' : 'bg-white text-ink shadow-sm hover:bg-ink/5'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
