import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { boutiques, products } from '../data/catalog';
import { categories } from '../data/categories';
import type { Category } from '../data/types';
import ProductCard from '../components/ProductCard';
import { IconSearch, IconSliders } from '../components/icons';

type Sort = 'recommended' | 'price-asc' | 'price-desc' | 'rating';

const SORTS: { value: Sort; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top rated' },
];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const initialQ = params.get('q') ?? '';
  const initialCat = (params.get('category') as Category | null) ?? 'All';
  const [q, setQ] = useState(initialQ);
  const [cat, setCat] = useState<Category | 'All'>(initialCat);
  const [sort, setSort] = useState<Sort>('recommended');

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = products.filter((p) => {
      const matchesCat = cat === 'All' || p.category === cat;
      if (!matchesCat) return false;
      if (!term) return true;
      const boutique = boutiques.find((b) => b.id === p.boutiqueId);
      const hay = [
        p.name,
        p.category,
        p.garment,
        p.description,
        boutique?.name ?? '',
        ...p.tags,
        ...p.colors.map((c) => c.name),
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(term);
    });

    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      default:
        list = [...list].sort((a, b) => Number(!!b.trending) - Number(!!a.trending));
    }
    return list;
  }, [q, cat, sort]);

  const updateQuery = (nextQ: string, nextCat: Category | 'All') => {
    const p = new URLSearchParams();
    if (nextQ.trim()) p.set('q', nextQ.trim());
    if (nextCat !== 'All') p.set('category', nextCat);
    setParams(p, { replace: true });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="relative">
        <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
        <input
          autoFocus
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            updateQuery(e.target.value, cat);
          }}
          placeholder="Search brands, dresses, sneakers, colours…"
          className="w-full rounded-full border border-ink/10 bg-white py-3.5 pl-12 pr-4 text-base text-ink shadow-card outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
        />
      </div>

      {/* Category chips */}
      <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <button
          type="button"
          onClick={() => {
            setCat('All');
            updateQuery(q, 'All');
          }}
          className={`chip ${cat === 'All' ? 'bg-ink text-white' : 'bg-white text-ink shadow-sm hover:bg-ink/5'}`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => {
              setCat(c.name);
              updateQuery(q, c.name);
            }}
            className={`chip ${cat === c.name ? 'bg-ink text-white' : 'bg-white text-ink shadow-sm hover:bg-ink/5'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-sm text-ink-muted">
          <span className="font-bold text-ink">{results.length}</span> {results.length === 1 ? 'piece' : 'pieces'}
          {q.trim() && <> for “<span className="font-semibold text-ink">{q.trim()}</span>”</>}
          {cat !== 'All' && <> in <span className="font-semibold text-ink">{cat}</span></>}
        </p>
        <label className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm shadow-sm">
          <IconSliders className="h-4 w-4 text-ink-muted" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="cursor-pointer bg-transparent font-semibold text-ink outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-ink-muted shadow-card">
            <IconSearch className="h-7 w-7" />
          </div>
          <p className="text-lg font-bold text-ink">No pieces found</p>
          <p className="max-w-sm text-sm text-ink-muted">
            Try a different search term or clear the filters to see everything we deliver.
          </p>
          <button
            type="button"
            onClick={() => {
              setQ('');
              setCat('All');
              updateQuery('', 'All');
            }}
            className="btn-ghost mt-2 h-10 px-5"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
