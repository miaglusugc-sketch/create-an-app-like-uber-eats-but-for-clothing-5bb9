import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  Zap,
  Bike,
  CreditCard,
  Check,
  Pencil,
  ShieldCheck,
  Clock,
  Gift,
} from 'lucide-react'
import { Header } from '../components/Header'
import { Garment } from '../components/Garment'
import { useCart } from '../context/CartContext'
import { storeById } from '../data/stores'
import { currency } from '../lib/format'
import { loadAddress, saveAddress, type Address } from '../lib/address'
import { saveOrder } from '../lib/orders'
import type { Order } from '../types'
import { uid } from '../lib/format'

const COURIERS = [
  { name: 'Maya R.', vehicle: 'E-bike', rating: 4.96 },
  { name: 'Leo T.', vehicle: 'Scooter', rating: 4.92 },
  { name: 'Priya N.', vehicle: 'E-bike', rating: 4.98 },
  { name: 'Marcus B.', vehicle: 'Car', rating: 4.9 },
  { name: 'Sofia K.', vehicle: 'Bike', rating: 4.94 },
]

export function Checkout() {
  const cart = useCart()
  const navigate = useNavigate()
  const store = cart.storeId ? storeById(cart.storeId) : undefined

  const [address, setAddress] = useState<Address>(loadAddress())
  const [editingAddr, setEditingAddr] = useState(false)
  const [speed, setSpeed] = useState<'standard' | 'express'>('standard')
  const [tip, setTip] = useState<number>(3)
  const [customTip, setCustomTip] = useState('')
  const [payIdx, setPayIdx] = useState(0)
  const [placing, setPlacing] = useState(false)
  const [notes, setNotes] = useState('')

  const baseDelivery = store
    ? store.freeDeliveryOver && cart.subtotal >= store.freeDeliveryOver
      ? 0
      : store.deliveryFee
    : 0
  const expressSurcharge = speed === 'express' ? 4.99 : 0
  const deliveryFee = baseDelivery + expressSurcharge
  const serviceFee = useMemo(() => Math.max(1.99, Math.round(cart.subtotal * 0.05 * 100) / 100), [cart.subtotal])
  const effectiveTip = customTip !== '' ? Math.max(0, Number(customTip) || 0) : tip
  const total = cart.subtotal + deliveryFee + serviceFee + effectiveTip

  const cards = [
    { label: 'Visa •••• 4242', icon: '💳' },
    { label: 'Mastercard •••• 5309', icon: '💳' },
    { label: 'Apple Pay', icon: '' },
  ]

  if (!store || cart.lines.length === 0) {
    return (
      <div className="min-h-screen bg-ink-50">
        <Header showSearch={false} />
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ink-100 text-ink-400">
            <Bike className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-ink-950">Your bag is empty</h1>
          <p className="mt-2 text-ink-500">Add pieces from a boutique to check out.</p>
          <Link to="/" className="btn-dark mt-6 inline-flex h-11 px-6 text-sm">
            Browse boutiques
          </Link>
        </div>
      </div>
    )
  }

  function placeOrder() {
    if (!store) return
    setPlacing(true)
    const etaMinutes =
      speed === 'express' ? Math.max(15, Math.round(store.eta[0] * 0.7)) : Math.round((store.eta[0] + store.eta[1]) / 2)
    const courier = COURIERS[Math.floor(Math.random() * COURIERS.length)]
    const order: Order = {
      id: uid('ord'),
      createdAt: Date.now(),
      storeId: store.id,
      storeName: store.name,
      lines: cart.lines,
      subtotal: cart.subtotal,
      deliveryFee,
      serviceFee,
      tip: effectiveTip,
      total,
      address: `${address.line}, ${address.city}`,
      speed,
      courier,
      etaMinutes,
      status: 'confirmed',
    }
    saveAddress(address)
    saveOrder(order)
    setTimeout(() => {
      cart.clear()
      navigate(`/track/${order.id}`)
    }, 900)
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <Header showSearch={false} />

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink-600 transition hover:text-ink-950"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="mt-3 text-2xl font-extrabold text-ink-950 sm:text-3xl">Checkout</h1>
        <p className="text-sm text-ink-500">
          from <span className="font-semibold text-ink-700">{store.name}</span>
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left column */}
          <div className="space-y-4">
            {/* Address */}
            <section className="card p-5">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-base font-bold text-ink-950">
                  <MapPin className="h-5 w-5 text-brand-500" /> Delivery address
                </h2>
                <button
                  onClick={() => setEditingAddr((v) => !v)}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand-500 hover:text-brand-600"
                >
                  <Pencil className="h-3.5 w-3.5" /> {editingAddr ? 'Done' : 'Edit'}
                </button>
              </div>

              {editingAddr ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="label">Label</label>
                    <input
                      className="input"
                      value={address.label}
                      onChange={(e) => setAddress({ ...address, label: e.target.value })}
                      placeholder="Home"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Street address</label>
                    <input
                      className="input"
                      value={address.line}
                      onChange={(e) => setAddress({ ...address, line: e.target.value })}
                      placeholder="128 Marlowe Street, Apt 4B"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">City, State ZIP</label>
                    <input
                      className="input"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="Brooklyn, NY 11201"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex items-start gap-3 rounded-2xl bg-ink-50 p-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-brand-500 shadow-sm">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div className="text-sm">
                    <p className="font-bold text-ink-900">{address.label}</p>
                    <p className="text-ink-600">{address.line}</p>
                    <p className="text-ink-500">{address.city}</p>
                  </div>
                </div>
              )}

              <div className="mt-3">
                <label className="label">Delivery notes (optional)</label>
                <input
                  className="input"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Leave with the doorman"
                />
              </div>
            </section>

            {/* Delivery speed */}
            <section className="card p-5">
              <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-ink-950">
                <Clock className="h-5 w-5 text-brand-500" /> Delivery speed
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <SpeedOption
                  active={speed === 'standard'}
                  onClick={() => setSpeed('standard')}
                  icon={<Bike className="h-5 w-5" />}
                  title="Standard"
                  sub={`${store.eta[0]}–${store.eta[1]} min`}
                  price={baseDelivery === 0 ? 'Free' : currency(baseDelivery)}
                />
                <SpeedOption
                  active={speed === 'express'}
                  onClick={() => setSpeed('express')}
                  icon={<Zap className="h-5 w-5" />}
                  title="Express"
                  sub={`~${Math.max(15, Math.round(store.eta[0] * 0.7))} min`}
                  price={`+${currency(4.99)}`}
                  highlight
                />
              </div>
            </section>

            {/* Payment */}
            <section className="card p-5">
              <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-ink-950">
                <CreditCard className="h-5 w-5 text-brand-500" /> Payment
              </h2>
              <div className="space-y-2">
                {cards.map((c, i) => (
                  <button
                    key={c.label}
                    onClick={() => setPayIdx(i)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                      payIdx === i ? 'border-brand-400 bg-brand-50/60 ring-2 ring-brand-100' : 'border-ink-200 hover:border-ink-300'
                    }`}
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink-950 text-white">
                      {c.icon ? <span className="text-base">{c.icon}</span> : <CreditCard className="h-4 w-4" />}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-ink-900">{c.label}</span>
                    <span
                      className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
                        payIdx === i ? 'border-brand-500 bg-brand-500 text-white' : 'border-ink-300'
                      }`}
                    >
                      {payIdx === i && <Check className="h-3 w-3" />}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Tip */}
            <section className="card p-5">
              <h2 className="mb-1 flex items-center gap-2 text-base font-bold text-ink-950">
                <Gift className="h-5 w-5 text-brand-500" /> Tip your courier
              </h2>
              <p className="mb-4 text-sm text-ink-500">100% of your tip goes to your courier.</p>
              <div className="flex flex-wrap gap-2">
                {[0, 3, 5, 8].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTip(t)
                      setCustomTip('')
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      customTip === '' && tip === t
                        ? 'bg-ink-950 text-white'
                        : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
                    }`}
                  >
                    {t === 0 ? 'None' : currency(t)}
                  </button>
                ))}
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-400">$</span>
                  <input
                    value={customTip}
                    onChange={(e) => setCustomTip(e.target.value.replace(/[^0-9.]/g, ''))}
                    inputMode="decimal"
                    placeholder="Custom"
                    className={`w-28 rounded-full border py-2 pl-7 pr-3 text-sm font-semibold outline-none transition ${
                      customTip !== '' ? 'border-ink-950 ring-2 ring-ink-100' : 'border-ink-200'
                    }`}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right column: summary */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="card overflow-hidden">
              <div className="border-b border-ink-100 px-5 py-4">
                <h2 className="text-base font-bold text-ink-950">Order summary</h2>
              </div>

              <div className="max-h-64 space-y-3 overflow-y-auto px-5 py-4 thin-scroll">
                {cart.lines.map((line) => (
                  <div key={line.id} className="flex items-center gap-3">
                    <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-ink-50 to-ink-100">
                      <Garment type={line.garment} color={line.color.hex} className="h-11 w-11" />
                      <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-ink-950 text-[11px] font-bold text-white">
                        {line.qty}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink-900">{line.name}</p>
                      <p className="text-xs text-ink-500">
                        {line.color.name} · {line.size}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-ink-900">{currency(line.price * line.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-ink-100 px-5 py-4 text-sm">
                <Row label="Subtotal" value={currency(cart.subtotal)} />
                <Row
                  label={`Delivery${speed === 'express' ? ' (express)' : ''}`}
                  value={deliveryFee === 0 ? 'Free' : currency(deliveryFee)}
                  accent={deliveryFee === 0}
                />
                <Row label="Service fee" value={currency(serviceFee)} />
                <Row label="Courier tip" value={currency(effectiveTip)} />
                <div className="mt-2 flex items-center justify-between border-t border-ink-100 pt-3">
                  <span className="text-base font-extrabold text-ink-950">Total</span>
                  <span className="text-lg font-extrabold text-ink-950">{currency(total)}</span>
                </div>
              </div>

              <div className="px-5 pb-5">
                <button onClick={placeOrder} disabled={placing} className="btn-primary w-full py-3.5 text-sm">
                  {placing ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Placing order…
                    </>
                  ) : (
                    <>Place order · {currency(total)}</>
                  )}
                </button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-mint-600" /> Secure checkout · Free 3-day returns
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function SpeedOption({
  active,
  onClick,
  icon,
  title,
  sub,
  price,
  highlight,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  title: string
  sub: string
  price: string
  highlight?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
        active ? 'border-brand-400 bg-brand-50/60 ring-2 ring-brand-100' : 'border-ink-200 hover:border-ink-300'
      }`}
    >
      <span
        className={`grid h-10 w-10 place-items-center rounded-xl ${
          highlight ? 'bg-brand-500 text-white' : 'bg-ink-950 text-white'
        }`}
      >
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-sm font-bold text-ink-950">{title}</p>
        <p className="text-xs text-ink-500">{sub}</p>
      </div>
      <span className="text-sm font-bold text-ink-900">{price}</span>
    </button>
  )
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between text-ink-600">
      <span>{label}</span>
      <span className={`font-semibold ${accent ? 'text-mint-600' : 'text-ink-900'}`}>{value}</span>
    </div>
  )
}
