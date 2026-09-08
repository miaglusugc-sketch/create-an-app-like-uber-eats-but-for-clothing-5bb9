import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { getProduct } from '../data/catalog';
import ProductCard from '../components/ProductCard';
import { IconHeart } from '../components/icons';

export default function Favorites() {
  const { favorites } = useStore();
  const items = favorites.map((id) => getProduct(id)).filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <IconHeart className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Your favourites</h1>
          <p className="text-ink-muted">
            {items.length ? `${items.length} saved ${items.length === 1 ? 'piece' : 'pieces'}` : 'Tap the heart on anything you love'}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-4xl bg-white py-20 text-center shadow-card">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream text-ink-muted">
            <IconHeart className="h-7 w-7" />
          </div>
          <div>
            <p className="text-lg font-bold text-ink">Nothing saved yet</p>
            <p className="mt-1 max-w-sm text-sm text-ink-muted">
              Save pieces you're eyeing and they'll wait for you right here.
            </p>
          </div>
          <Link to="/" className="btn-primary h-11 px-6">Discover pieces</Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
