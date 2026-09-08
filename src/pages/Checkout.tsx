import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore, COURIER_POOL } from '../context/StoreContext';
import { getBoutique, getProduct } from '../data/catalog';
import { currency, plural } from '../lib/format';
import GarmentArt, { shade } from '../components/GarmentArt';
import {
  IconArrowLeft,
  IconPin,
  IconBolt,
  IconClock,
  IconCheck,
  IconUser,
  IconTruck,
} from '../components/icons';

const TIPS = [0, 2, 4, 6];

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartSubtotal, cartBoutiqueId, address, setAddress, placeOrder } = useStore();
  const boutique = cartBoutiqueId ? getBoutique(cartBoutiqueId) : null;

  const [name, setName] = useState('Alex Morgan');
  const [phone, setPhone] = useState('+1 (555) 018-2245');
  const [addr, setAddr] = useState(address);
  const [note, setNote] = useState('');
  const [when, setWhen] = useState<'asap' | 'schedule'>('asap');
  const [pay, setPay] = useState<'card' | 'apple' | 'cash'>('card');
  const [tip, setTip] = useState(4);
  const [placing, setPlacing] = useState(false);

  if (cart.length === 0 || !boutique) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-ink-muted shadow-card">
          <IconTruck className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-ink">Your bag is empty</h1>
        <p className="mt-2 text-ink-muted">Add some pieces before heading to checkout.</p>
        <Link to="/" className="btn-primary mt-6 h-11 px-6">Start browsing</Link>
      </div>
    );
  }

  const freeDelivery = boutique.freeOver !== undefined && cartSubtotal >= boutique.freeOver;
  const deliveryFee = freeDelivery ? 0 : boutique.deliveryFee;
  const serviceFee = Math.round(cartSubtotal * 0.05 * 100) / 100;
  const total = cartSubtotal + deliveryFee + serviceFee + tip;
  const itemCount = cart.reduce((s, l) => s + l.qty, 0);

  const handlePlace = () => {
    setPlacing(true);
    setAddress(addr);
    const courier = COURIER_POOL[Math.floor(Math.random() * COURIER_POOL.length)];
    setTimeout(() => {
      const order = placeOrder(addr, courier);
      if (order) navigate(`/order/${order.id}`);
      else setPlacing(false);
    }, 700);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-brand-600"
      >
        <IconArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">Checkout</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left: forms */}
        <div className="space-y-4">
          {/* Delivery */}
          <section className="card p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
              <IconPin className="h-5 w-5 text-brand-500" /> Delivery details
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-ink-soft">Full name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} className="field" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-ink-soft">Phone</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="field" />
              </label>
            </div>
            <label className="mt-3 block">
              <span className="mb-1 block text-sm font-semibold text-ink-soft">Address</span>
              <input value={addr} onChange={(e) => setAddr(e.target.value)} className="field" />
            </label>
            <label className="mt-3 block">
              <span className="mb-1 block text-sm font-semibold text-ink-soft">
                Courier note <span className="font-normal text-ink-muted">(optional)</span>
              </span>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Leave at the door, buzz 4B…"
                className="field"
              />
            </label>
          </section>

          {/* Timing */}
          <section className="card p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
              <IconClock className="h-5 w-5 text-brand-500" /> When
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setWhen('asap')}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                  when === 'asap' ? 'border-brand-500 bg-brand-50' : 'border-ink/15 hover:border-ink/30'
                }`}
              >
                <IconBolt className={`mt-0.5 h-5 w-5 ${when === 'asap' ? 'text-brand-500' : 'text-ink-muted'}`} />
                <span>
                  <span className="block font-bold text-ink">Standard · ASAP</span>
                  <span className="text-sm text-ink-muted">{boutique.etaMin}–{boutique.etaMax} min</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setWhen('schedule')}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                  when === 'schedule' ? 'border-brand-500 bg-brand-50' : 'border-ink/15 hover:border-ink/30'
                }`}
              >
                <IconClock className={`mt-0.5 h-5 w-5 ${when === 'schedule' ? 'text-brand-500' : 'text-ink-muted'}`} />
                <span>
                  <span className="block font-bold text-ink">Schedule</span>
                  <span className="text-sm text-ink-muted">Pick a 1-hour window today</span>
                </span>
              </button>
            </div>
          </section>

          {/* Payment */}
          <section className="card p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
              <IconUser className="h-5 w-5 text-brand-500" /> Payment
            </h2>
            <div className="mt-4 space-y-2">
              {[
                { id: 'card', label: 'Visa •••• 4242', sub: 'Expires 08/28' },
                { id: 'apple', label: 'Apple Pay', sub: 'Face ID' },
                { id: 'cash', label: 'Cash on delivery', sub: 'Pay the courier' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPay(opt.id as typeof pay)}
                  className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                    pay === opt.id ? 'border-brand-500 bg-brand-50' : 'border-ink/15 hover:border-ink/30'
                  }`}
                >
                  <span>
                    <span className="block font-bold text-ink">{opt.label}</span>
                    <span className="text-sm text-ink-muted">{opt.sub}</span>
                  </span>
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      pay === opt.id ? 'border-brand-500 bg-brand-500 text-white' : 'border-ink/25'
                    }`}
                  >
                    {pay === opt.id && <IconCheck className="h-4 w-4" />}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Tip */}
          <section className="card p-5">
            <h2 className="text-lg font-bold text-ink">Tip your courier</h2>
            <p className="text-sm text-ink-muted">100% of tips go directly to your rider.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {TIPS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTip(t)}
                  className={`min-w-[4rem] rounded-xl border px-4 py-2.5 font-bold transition ${
                    tip === t ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink/15 text-ink hover:border-ink/30'
                  }`}
                >
                  {t === 0 ? 'None' : currency(t)}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right: summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-ink/10 p-5">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
                style={{ backgroundColor: boutique.accent }}
              >
                <IconTruck className="h-6 w-6" />
              </span>
              <div>
                <p className="font-bold text-ink">{boutique.name}</p>
                <p className="text-sm text-ink-muted">{plural(itemCount, 'item')} · {boutique.neighborhood}</p>
              </div>
            </div>

            <div className="max-h-64 space-y-3 overflow-y-auto p-5">
              {cart.map((line) => {
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
                    <span className="text-sm font-bold text-ink">{currency(p.price * line.qty)}</span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-1.5 border-t border-ink/10 p-5 text-sm">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span>
                <span className="font-semibold text-ink">{currency(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Delivery</span>
                <span className="font-semibold text-ink">{deliveryFee === 0 ? 'Free' : currency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Service fee</span>
                <span className="font-semibold text-ink">{currency(serviceFee)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Courier tip</span>
                <span className="font-semibold text-ink">{currency(tip)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-dashed border-ink/15 pt-3">
                <span className="text-base font-bold text-ink">Total</span>
                <span className="text-xl font-extrabold text-ink">{currency(total)}</span>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={handlePlace}
                disabled={placing}
                className="btn-primary h-12 w-full text-base"
              >
                {placing ? 'Placing order…' : `Place order · ${currency(total)}`}
              </button>
              <p className="mt-3 text-center text-xs text-ink-muted">
                Demo checkout — no payment is taken and no real order is placed.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
