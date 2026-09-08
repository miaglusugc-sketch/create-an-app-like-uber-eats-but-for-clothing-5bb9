import { Link } from 'react-router-dom';
import Logo from './Logo';
import { IconBolt, IconLeaf, IconShield, IconRotate } from './icons';

const perks = [
  { icon: IconBolt, title: 'Under an hour', text: 'Same-day delivery from local boutiques.' },
  { icon: IconRotate, title: 'Free 30-day returns', text: 'Courier picks it up from your door.' },
  { icon: IconShield, title: 'Authenticity check', text: 'Every resale piece verified on site.' },
  { icon: IconLeaf, title: 'Carbon-neutral', text: 'E-bike couriers on every route.' },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {perks.map((p) => (
            <div key={p.title} className="flex flex-col gap-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <p.icon className="h-6 w-6" />
              </span>
              <h4 className="font-bold text-ink">{p.title}</h4>
              <p className="text-sm text-ink-muted">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-ink/10 pt-8 md:flex-row md:items-center">
          <div>
            <Logo />
            <p className="mt-3 max-w-sm text-sm text-ink-muted">
              Fashion from your favourite local boutiques, delivered to your door in minutes.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm sm:grid-cols-3">
            <Link to="/" className="text-ink-soft hover:text-brand-600">Browse</Link>
            <Link to="/favorites" className="text-ink-soft hover:text-brand-600">Favourites</Link>
            <Link to="/search?q=" className="text-ink-soft hover:text-brand-600">Search</Link>
            <span className="text-ink-soft">Become a partner</span>
            <span className="text-ink-soft">Careers</span>
            <span className="text-ink-soft">Help centre</span>
          </div>
        </div>

        <p className="mt-8 text-xs text-ink-muted">
          © {new Date().getFullYear()} Threadly. A demo experience — no real orders are placed.
        </p>
      </div>
    </footer>
  );
}
