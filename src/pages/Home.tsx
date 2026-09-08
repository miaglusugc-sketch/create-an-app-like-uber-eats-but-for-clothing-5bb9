import { Link } from 'react-router-dom';
import { boutiques, products } from '../data/catalog';
import { categories } from '../data/categories';
import BoutiqueCard from '../components/BoutiqueCard';
import ProductCard from '../components/ProductCard';
import GarmentArt, { shade } from '../components/GarmentArt';
import { useStore } from '../context/StoreContext';
import { IconBolt, IconChevron, IconClock, IconPin } from '../components/icons';

function Hero() {
  const { address } = useStore();
  const floats = [
    { g: 'jacket', c: '#c2410c', pos: 'left-[4%] top-[14%]', size: 'w-24', rot: '-12deg', delay: '0s' },
    { g: 'dress', c: '#c65f7b', pos: 'left-[14%] bottom-[10%]', size: 'w-20', rot: '8deg', delay: '0.6s' },
    { g: 'sneaker', c: '#2f43b8', pos: 'right-[6%] top-[16%]', size: 'w-28', rot: '10deg', delay: '0.3s' },
    { g: 'hat', c: '#0f766e', pos: 'right-[16%] bottom-[12%]', size: 'w-20', rot: '-8deg', delay: '0.9s' },
  ] as const;

  return (
    <section className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700">
      <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5) 0, transparent 40%)' }} />
      {floats.map((f, i) => (
        <div
          key={i}
          className={`pointer-events-none absolute hidden animate-bob lg:block ${f.pos} ${f.size}`}
          style={{ transform: `rotate(${f.rot})`, animationDelay: f.delay }}
        >
          <div
            className="rounded-3xl p-3 shadow-soft"
            style={{ background: `linear-gradient(135deg, ${shade(f.c, 0.3)}, ${shade(f.c, 0.02)})` }}
          >
            <GarmentArt garment={f.g} color={f.c} className="h-full w-full drop-shadow-lg" />
          </div>
        </div>
      ))}

      <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:py-28">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur">
          <IconBolt className="h-4 w-4" />
          Delivering to <span className="max-w-[10rem] truncate">{address}</span>
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
          Fashion, delivered in minutes.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/90 sm:text-lg">
          Shop your city's best boutiques and get it couriered to your door before you've finished your coffee.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/search?q=" className="btn h-12 bg-white px-7 text-base font-bold text-brand-700 hover:bg-white/90">
            Browse everything
          </Link>
          <a href="#boutiques" className="btn h-12 border border-white/40 px-7 text-base font-bold text-white hover:bg-white/10">
            Boutiques near you
          </a>
        </div>
        <div className="mx-auto mt-10 flex max-w-lg flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-white/90">
          <span className="inline-flex items-center gap-2"><IconClock className="h-4 w-4" /> Avg. 32 min</span>
          <span className="inline-flex items-center gap-2"><IconPin className="h-4 w-4" /> {boutiques.length} boutiques live</span>
          <span className="inline-flex items-center gap-2"><IconBolt className="h-4 w-4" /> Free returns</span>
        </div>
      </div>
    </section>
  );
}

function CategoryRail() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {categories.map((c) => (
          <Link
            key={c.name}
            to={`/search?category=${encodeURIComponent(c.name)}`}
            className="group flex shrink-0 flex-col items-center gap-2"
          >
            <span
              className="flex h-20 w-20 items-center justify-center rounded-3xl shadow-card transition-transform duration-300 group-hover:-translate-y-1 sm:h-24 sm:w-24"
              style={{ background: `linear-gradient(135deg, ${shade(c.color, 0.32)}, ${shade(c.color, 0.08)})` }}
            >
              <GarmentArt garment={c.garment} color={c.color} className="h-16 w-16 drop-shadow-md sm:h-20 sm:w-20" />
            </span>
            <span className="text-sm font-semibold text-ink">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ title, subtitle, to }: { title: string; subtitle?: string; to?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-ink-muted">{subtitle}</p>}
      </div>
      {to && (
        <Link to={to} className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-brand-600 hover:gap-2 transition-all">
          See all <IconChevron className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const trending = products.filter((p) => p.trending);
  const featured = boutiques;

  return (
    <div className="space-y-12 pb-4">
      <Hero />

      <div className="animate-fade-up">
        <CategoryRail />
      </div>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader title="Trending now" subtitle="What everyone's ordering today" to="/search?q=" />
        <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {trending.map((p) => (
            <div key={p.id} className="w-56 shrink-0 snap-start sm:w-64">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      <section id="boutiques" className="mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6">
        <SectionHeader title="Boutiques near you" subtitle="Handpicked shops delivering to your area" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((b) => (
            <BoutiqueCard key={b.id} boutique={b} />
          ))}
        </div>
      </section>
    </div>
  );
}
