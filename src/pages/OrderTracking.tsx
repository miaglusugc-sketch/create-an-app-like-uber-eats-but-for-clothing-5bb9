import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { getBoutique, getProduct } from '../data/catalog';
import { currency, plural } from '../lib/format';
import GarmentArt, { shade } from '../components/GarmentArt';
import { Stars } from '../components/Logo';
import { IconCheck, IconBag, IconTruck, IconBolt, IconPin, IconClock, IconUser } from '../components/icons';

// Compressed demo timeline: the full journey animates over this many ms.
const DEMO_MS = 150000;

const STAGES = [
  { key: 'confirmed', label: 'Order confirmed', desc: 'We sent your order to the boutique.', icon: IconCheck, at: 0 },
  { key: 'packing', label: 'Packing your pieces', desc: 'Folding, steaming and tissue-wrapping.', icon: IconBag, at: 0.08 },
  { key: 'pickup', label: 'Courier picked up', desc: 'Your rider is on the move.', icon: IconBolt, at: 0.3 },
  { key: 'otw', label: 'On the way to you', desc: 'Heading to your address now.', icon: IconTruck, at: 0.5 },
  { key: 'delivered', label: 'Delivered', desc: 'Enjoy your new fit!', icon: IconPin, at: 1 },
] as const;

const ROUTE = 'M 40 210 C 90 170, 70 120, 130 120 S 210 150, 250 100 S 330 70, 360 40';

function useProgress(placedAt: number) {
  const [progress, setProgress] = useState(() =>
    Math.min(1, Math.max(0, (Date.now() - placedAt) / DEMO_MS)),
  );
  useEffect(() => {
    const update = () => {
      const p = Math.min(1, Math.max(0, (Date.now() - placedAt) / DEMO_MS));
      setProgress(p);
      return p;
    };
    if (update() >= 1) return;
    const timer = setInterval(() => {
      if (update() >= 1) clearInterval(timer);
    }, 250);
    return () => clearInterval(timer);
  }, [placedAt]);
  return progress;
}

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const { lastOrder } = useStore();
  const order = lastOrder && lastOrder.id === id ? lastOrder : null;
  const progress = useProgress(order?.placedAt ?? Date.now());
  const pathRef = useRef<SVGPathElement>(null);
  const [pos, setPos] = useState({ x: 40, y: 210 });

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    const eased = progress; // linear along route
    const pt = path.getPointAtLength(eased * len);
    setPos({ x: pt.x, y: pt.y });
  }, [progress]);

  const boutique = order ? getBoutique(order.boutiqueId) : null;

  const currentStage = useMemo(() => {
    let idx = 0;
    STAGES.forEach((s, i) => {
      if (progress >= s.at) idx = i;
    });
    return idx;
  }, [progress]);

  if (!order || !boutique) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-ink-muted shadow-card">
          <IconTruck className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-ink">Order not found</h1>
        <p className="mt-2 text-ink-muted">We couldn't find a live order to track right now.</p>
        <Link to="/" className="btn-primary mt-6 h-11 px-6">Back home</Link>
      </div>
    );
  }

  const delivered = progress >= 1;
  const remainingMin = Math.max(0, Math.ceil((1 - progress) * order.etaMinutes));
  const itemCount = order.lines.reduce((s, l) => s + l.qty, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Status banner */}
      <div className="card overflow-hidden">
        <div
          className="px-6 py-7 text-white"
          style={{ background: `linear-gradient(135deg, ${shade(boutique.accent, 0.18)}, ${boutique.accent})` }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
                Order {order.id}
              </p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
                {delivered ? 'Delivered!' : `Arriving in ~${remainingMin} min`}
              </h1>
              <p className="mt-1 text-white/90">{STAGES[currentStage].desc}</p>
            </div>
            <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur sm:flex">
              {delivered ? <IconCheck className="h-8 w-8" /> : <IconTruck className="h-8 w-8 animate-bob" />}
            </div>
          </div>
          {/* progress bar */}
          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-white transition-[width] duration-500 ease-out"
              style={{ width: `${Math.max(4, progress * 100)}%` }}
            />
          </div>
        </div>

        {/* Map */}
        <div className="relative bg-[#eaf1ee]">
          <svg viewBox="0 0 400 240" className="h-64 w-full sm:h-80" preserveAspectRatio="xMidYMid slice">
            {/* land blocks */}
            <rect x="0" y="0" width="400" height="240" fill="#e7eee9" />
            <g fill="#dde7e1">
              <rect x="20" y="20" width="90" height="60" rx="6" />
              <rect x="150" y="14" width="110" height="52" rx="6" />
              <rect x="290" y="30" width="90" height="70" rx="6" />
              <rect x="30" y="110" width="80" height="70" rx="6" />
              <rect x="150" y="150" width="120" height="70" rx="6" />
              <rect x="300" y="140" width="80" height="80" rx="6" />
            </g>
            {/* water */}
            <path d="M0 90 Q 120 70 200 95 T 400 90 L400 120 Q 260 130 160 118 T 0 120 Z" fill="#cfe4ea" opacity="0.7" />
            {/* roads */}
            <g stroke="#f4f8f6" strokeWidth="7" fill="none" strokeLinecap="round">
              <path d="M0 100 H400" />
              <path d="M0 190 H400" />
              <path d="M120 0 V240" />
              <path d="M280 0 V240" />
            </g>
            {/* route */}
            <path d={ROUTE} fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" opacity="0.9" />
            <path
              ref={pathRef}
              d={ROUTE}
              fill="none"
              stroke={boutique.accent}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="2 8"
            />
            {/* store pin */}
            <g transform="translate(40 210)">
              <circle r="12" fill="#fff" stroke={boutique.accent} strokeWidth="3" />
              <circle r="4" fill={boutique.accent} />
            </g>
            {/* home pin */}
            <g transform="translate(360 40)">
              <circle r="12" fill={delivered ? '#16a34a' : '#fff'} stroke="#16a34a" strokeWidth="3" />
              <path d="M-5 1 L0 -4 L5 1 V6 H-5 Z" fill={delivered ? '#fff' : '#16a34a'} />
            </g>
            {/* courier */}
            <g transform={`translate(${pos.x} ${pos.y})`} style={{ transition: 'transform 0.4s linear' }}>
              <circle r="15" fill={boutique.accent} opacity="0.18" />
              <circle r="11" fill={boutique.accent} stroke="#fff" strokeWidth="2.5" />
              <g transform="translate(-6 -6)" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="2.5" cy="9" r="2.2" />
                <circle cx="9.5" cy="9" r="2.2" />
                <path d="M2.5 9 L5 4 H8 M5 4 L7.5 9" />
              </g>
            </g>
          </svg>
          <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-ink shadow-sm backdrop-blur">
            {boutique.neighborhood} → {order.address.split(',')[0]}
          </div>
        </div>

        {/* Courier card */}
        <div className="flex items-center gap-4 border-t border-ink/10 p-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <IconUser className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-ink">{order.courier}</p>
            <p className="flex items-center gap-2 text-sm text-ink-muted">
              <Stars value={4.9} className="text-xs" /> · E-bike courier
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-cream px-3 py-2 text-sm font-semibold text-ink sm:inline">
              {delivered ? 'Arrived' : `${remainingMin} min away`}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline + summary */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="card p-6">
          <h2 className="text-lg font-bold text-ink">Delivery progress</h2>
          <ol className="mt-4 space-y-1">
            {STAGES.map((s, i) => {
              const done = i < currentStage || delivered;
              const active = i === currentStage && !delivered;
              return (
                <li key={s.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${
                        done
                          ? 'border-brand-500 bg-brand-500 text-white'
                          : active
                            ? 'border-brand-500 bg-white text-brand-500'
                            : 'border-ink/15 bg-white text-ink-muted'
                      }`}
                    >
                      <s.icon className="h-4 w-4" />
                    </span>
                    {i < STAGES.length - 1 && (
                      <span className={`my-1 w-0.5 flex-1 ${done ? 'bg-brand-500' : 'bg-ink/10'}`} style={{ minHeight: 20 }} />
                    )}
                  </div>
                  <div className={`pb-4 ${active ? '' : ''}`}>
                    <p className={`font-bold ${done || active ? 'text-ink' : 'text-ink-muted'}`}>{s.label}</p>
                    <p className="text-sm text-ink-muted">{s.desc}</p>
                    {active && (
                      <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
                        <span className="h-1.5 w-1.5 animate-ping rounded-full bg-brand-500" /> In progress
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <aside className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: boutique.accent }}>
                <IconBag className="h-6 w-6" />
              </span>
              <div>
                <p className="font-bold text-ink">{boutique.name}</p>
                <p className="text-sm text-ink-muted">{plural(itemCount, 'item')}</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {order.lines.map((line) => {
                const p = getProduct(line.productId);
                if (!p) return null;
                const c = p.colors.find((x) => x.name === line.color) ?? p.colors[0];
                return (
                  <div key={line.key} className="flex items-center gap-3">
                    <div
                      className="flex h-14 w-12 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: `radial-gradient(120% 120% at 30% 20%, ${shade(c.hex, 0.32)}, ${shade(c.hex, 0.05)})` }}
                    >
                      <GarmentArt garment={p.garment} color={c.hex} className="h-full w-full p-1" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{p.name}</p>
                      <p className="text-xs text-ink-muted">{line.color} · {line.size} · ×{line.qty}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-dashed border-ink/15 pt-3">
              <span className="font-bold text-ink">Total paid</span>
              <span className="text-lg font-extrabold text-ink">{currency(order.total)}</span>
            </div>
          </div>

          <div className="card flex items-center gap-3 p-5 text-sm text-ink-soft">
            <IconClock className="h-5 w-5 shrink-0 text-brand-500" />
            <span>Delivering to <span className="font-semibold text-ink">{order.address}</span></span>
          </div>

          <Link to="/" className="btn-ghost h-12 w-full">Order something else</Link>
        </aside>
      </div>
    </div>
  );
}
