import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Logo from './Logo';
import { IconBag, IconHeart, IconPin, IconSearch, IconChevron, IconClose } from './icons';

const SAVED_ADDRESSES = [
  '128 Marlowe Street, Apt 4B',
  'Work · 90 Kingsway Tower, Fl 12',
  "Mum's · 5 Hazel Grove",
];

function AddressModal({ onClose }: { onClose: () => void }) {
  const { address, setAddress } = useStore();
  const [value, setValue] = useState(address);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/50 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md animate-scale-in rounded-4xl bg-white p-6 shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink">Delivery address</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-ink/5"
            aria-label="Close"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>
        <div className="relative mt-4">
          <IconPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="field pl-11"
            placeholder="Enter your street address"
          />
        </div>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">Saved</p>
        <div className="mt-2 space-y-1">
          {SAVED_ADDRESSES.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setValue(a)}
              className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition ${
                value === a ? 'bg-brand-50 text-brand-700' : 'hover:bg-ink/5'
              }`}
            >
              <IconPin className="h-4 w-4 shrink-0 text-brand-500" />
              <span className="truncate">{a}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            setAddress(value.trim() || address);
            onClose();
          }}
          className="btn-primary mt-5 h-12 w-full"
        >
          Deliver here
        </button>
      </div>
    </div>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const { address, cartCount, setCartOpen, favorites } = useStore();
  const [q, setQ] = useState('');
  const [addrOpen, setAddrOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const bagRef = useRef<HTMLButtonElement>(null);
  const [bump, setBump] = useState(false);
  const prevCount = useRef(cartCount);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (cartCount > prevCount.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 300);
      prevCount.current = cartCount;
      return () => clearTimeout(t);
    }
    prevCount.current = cartCount;
  }, [cartCount]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-shadow ${
        scrolled ? 'bg-cream/85 shadow-sm backdrop-blur-lg' : 'bg-cream'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <button
          type="button"
          onClick={() => setAddrOpen(true)}
          className="hidden shrink-0 items-center gap-2 rounded-full bg-white px-3 py-2 text-sm shadow-sm transition hover:shadow md:inline-flex"
        >
          <IconPin className="h-4 w-4 text-brand-500" />
          <span className="max-w-[12rem] truncate font-semibold text-ink">{address}</span>
          <IconChevron className="h-4 w-4 rotate-90 text-ink-muted" />
        </button>

        <form onSubmit={submitSearch} className="relative ml-auto hidden max-w-md flex-1 sm:block">
          <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-full border border-ink/10 bg-white py-2.5 pl-11 pr-4 text-sm text-ink shadow-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
            placeholder="Search brands, dresses, sneakers…"
          />
        </form>

        <div className="ml-auto flex items-center gap-1.5 sm:ml-0">
          <Link
            to="/favorites"
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-sm transition hover:text-brand-600"
            aria-label="Favourites"
          >
            <IconHeart className="h-5 w-5" />
            {favorites.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-ink px-1 text-[11px] font-bold text-white">
                {favorites.length}
              </span>
            )}
          </Link>
          <button
            ref={bagRef}
            type="button"
            onClick={() => setCartOpen(true)}
            className={`relative flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-white shadow-sm transition ${
              bump ? 'scale-105' : ''
            }`}
            aria-label="Open bag"
          >
            <IconBag className="h-5 w-5" />
            <span className="hidden text-sm font-semibold sm:inline">Bag</span>
            {cartCount > 0 && (
              <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search + location */}
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 pb-3 sm:hidden">
        <button
          type="button"
          onClick={() => setAddrOpen(true)}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-2.5 text-sm shadow-sm"
        >
          <IconPin className="h-4 w-4 text-brand-500" />
          <span className="max-w-[6rem] truncate font-semibold text-ink">{address}</span>
        </button>
        <form onSubmit={submitSearch} className="relative flex-1">
          <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-full border border-ink/10 bg-white py-2.5 pl-10 pr-4 text-sm text-ink shadow-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
            placeholder="Search Threadly…"
          />
        </form>
      </div>

      {addrOpen && <AddressModal onClose={() => setAddrOpen(false)} />}
    </header>
  );
}
