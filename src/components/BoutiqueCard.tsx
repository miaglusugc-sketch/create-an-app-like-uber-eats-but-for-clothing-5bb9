import { Link } from 'react-router-dom';
import type { Boutique } from '../data/types';
import { productsByBoutique } from '../data/catalog';
import { currency } from '../lib/format';
import GarmentArt, { shade } from './GarmentArt';
import { Stars } from './Logo';
import { IconClock, IconPin } from './icons';

export default function BoutiqueCard({ boutique }: { boutique: Boutique }) {
  const items = productsByBoutique(boutique.id);
  const preview = items.slice(0, 3);

  return (
    <Link
      to={`/boutique/${boutique.id}`}
      className="group card block overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-soft"
    >
      <div
        className="relative flex h-40 items-center justify-center gap-2 overflow-hidden px-6"
        style={{
          background: `linear-gradient(135deg, ${shade(boutique.accent, 0.28)} 0%, ${boutique.accentSoft} 100%)`,
        }}
      >
        {preview.map((p, i) => (
          <div
            key={p.id}
            className="transition-transform duration-500 group-hover:scale-105"
            style={{
              width: 96,
              transform: `translateY(${i === 1 ? -8 : 8}px) rotate(${(i - 1) * 6}deg)`,
            }}
          >
            <GarmentArt
              garment={p.garment}
              color={p.colors[0].hex}
              className="h-32 w-full drop-shadow-[0_14px_16px_rgba(0,0,0,0.14)]"
            />
          </div>
        ))}
        {boutique.badge && (
          <span
            className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold text-white shadow-sm"
            style={{ backgroundColor: boutique.accent }}
          >
            {boutique.badge}
          </span>
        )}
        <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-ink shadow-sm backdrop-blur">
          {boutique.deliveryFee === 0 ? 'Free delivery' : `${currency(boutique.deliveryFee)} delivery`}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold tracking-tight text-ink">{boutique.name}</h3>
          <Stars value={boutique.rating} className="mt-0.5 shrink-0 text-sm" />
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-ink-muted">{boutique.tagline}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <IconClock className="h-4 w-4 text-brand-500" />
            {boutique.etaMin}–{boutique.etaMax} min
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconPin className="h-4 w-4 text-brand-500" />
            {boutique.distanceKm} km · {boutique.neighborhood}
          </span>
        </div>
      </div>
    </Link>
  );
}
