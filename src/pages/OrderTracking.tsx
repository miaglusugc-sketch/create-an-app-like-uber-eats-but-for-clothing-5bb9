import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  Phone,
  MessageSquare,
  Star,
  PartyPopper,
  Clock,
  MapPin,
  Bike,
  Zap,
} from 'lucide-react'
import { Header } from '../components/Header'
import { DeliveryMap } from '../components/DeliveryMap'
import { Garment } from '../components/Garment'
import { getOrder, computeProgress, STATUS_STEPS } from '../lib/orders'
import { storeById } from '../data/stores'
import { currency } from '../lib/format'
import type { Order } from '../types'

export function OrderTracking() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | undefined>(() => (id ? getOrder(id) : undefined))
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (id) setOrder(getOrder(id))
  }, [id])

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  if (!order) {
    return (
      <div className="min-h-screen bg-ink-50">
        <Header showSearch={false} />
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <h1 className="text-2xl font-extrabold text-ink-950">Order not found</h1>
          <p className="mt-2 text-ink-500">We couldn’t find that order.</p>
          <Link to="/orders" className="btn-dark mt-6 inline-flex h-11 px-6 text-sm">
            View your orders
          </Link>
        </div>
      </div>
    )
  }

  const store = storeById(order.storeId)
  const { status, index, fraction, minutesLeft } = computeProgress(order, now)
  const delivered = status === 'delivered'
  const moving = index >= 3
  // route travelled only after pickup
  const routeFraction = delivered ? 1 : index < 2 ? 0 : Math.min(1, (fraction - 0.38) / (1 - 0.38))
  const currentStep = STATUS_STEPS[index]

  const arrival = new Date(order.createdAt + order.etaMinutes * 60_000)
  const arrivalStr = arrival.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

  return (
    <div className="min-h-screen bg-ink-50">
      <Header showSearch={false} />

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink-600 transition hover:text-ink-950"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        {/* Status headline */}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {delivered ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-mint-500/10 px-3 py-1 text-xs font-bold text-mint-600">
                <PartyPopper className="h-3.5 w-3.5" /> Delivered
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-600">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
                </span>
                Live · Order #{order.id.slice(-5).toUpperCase()}
              </span>
            )}
            <h1 className="mt-2 text-3xl font-extrabold leading-tight text-ink-950 sm:text-4xl">
              {delivered ? 'Your order has arrived 🎉' : currentStep.label}
            </h1>
            <p className="mt-1 text-ink-500">{currentStep.blurb}</p>
          </div>

          {!delivered && (
            <div className="rounded-2xl bg-ink-950 px-5 py-3 text-white">
              <p className="text-xs font-medium text-white/60">Arriving in</p>
              <p className="text-2xl font-extrabold leading-none">
                {minutesLeft} <span className="text-base font-semibold">min</span>
              </p>
              <p className="mt-1 text-xs text-white/60">Est. {arrivalStr}</p>
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          {/* Map + progress */}
          <div className="space-y-5">
            <DeliveryMap progress={routeFraction} moving={moving} delivered={delivered} />

            {/* Progress bar */}
            <div className="card p-5">
              <div className="mb-4 h-2 overflow-hidden rounded-full bg-ink-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-mint-500 transition-all duration-1000"
                  style={{ width: `${Math.max(6, fraction * 100)}%` }}
                />
              </div>
              <ol className="space-y-4">
                {STATUS_STEPS.map((step, i) => {
                  const done = i < index
                  const active = i === index
                  return (
                    <li key={step.key} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition ${
                          done
                            ? 'bg-mint-500 text-white'
                            : active
                              ? 'bg-brand-500 text-white ring-4 ring-brand-100'
                              : 'bg-ink-100 text-ink-400'
                        }`}
                      >
                        {done ? <Check className="h-4 w-4" /> : i + 1}
                      </span>
                      <div>
                        <p className={`text-sm font-bold ${active || done ? 'text-ink-950' : 'text-ink-400'}`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-ink-500">{step.blurb}</p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Courier card */}
            <div className="card p-5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-lg font-black text-white">
                    {order.courier.name.slice(0, 1)}
                  </span>
                  <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-white shadow">
                    <Bike className="h-3.5 w-3.5 text-ink-700" />
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-ink-950">{order.courier.name}</p>
                  <p className="text-xs text-ink-500">
                    Your courier · {order.courier.vehicle}
                  </p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-ink-700">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {order.courier.rating}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="grid h-10 w-10 place-items-center rounded-full bg-ink-100 text-ink-700 transition hover:bg-ink-200">
                    <Phone className="h-4 w-4" />
                  </button>
                  <button className="grid h-10 w-10 place-items-center rounded-full bg-ink-100 text-ink-700 transition hover:bg-ink-200">
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-ink-50 p-3">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-500">
                    <MapPin className="h-3.5 w-3.5" /> Delivering to
                  </p>
                  <p className="mt-1 font-semibold text-ink-900">{order.address}</p>
                </div>
                <div className="rounded-2xl bg-ink-50 p-3">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-500">
                    {order.speed === 'express' ? <Zap className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                    {order.speed === 'express' ? 'Express' : 'Standard'}
                  </p>
                  <p className="mt-1 font-semibold text-ink-900">from {order.storeName}</p>
                </div>
              </div>
            </div>

            {/* Order items */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
                <h2 className="text-base font-bold text-ink-950">Your order</h2>
                {store && (
                  <Link to={`/store/${store.id}`} className="text-xs font-semibold text-brand-500 hover:text-brand-600">
                    Order again
                  </Link>
                )}
              </div>
              <div className="space-y-3 px-5 py-4">
                {order.lines.map((line) => (
                  <div key={line.id} className="flex items-center gap-3">
                    <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-ink-50 to-ink-100">
                      <Garment type={line.garment} color={line.color.hex} className="h-9 w-9" />
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
              <div className="space-y-1.5 border-t border-ink-100 px-5 py-4 text-sm">
                <Row label="Subtotal" value={currency(order.subtotal)} />
                <Row label="Delivery" value={order.deliveryFee === 0 ? 'Free' : currency(order.deliveryFee)} />
                <Row label="Service fee" value={currency(order.serviceFee)} />
                <Row label="Tip" value={currency(order.tip)} />
                <div className="flex items-center justify-between border-t border-ink-100 pt-2">
                  <span className="font-extrabold text-ink-950">Total</span>
                  <span className="font-extrabold text-ink-950">{currency(order.total)}</span>
                </div>
              </div>
            </div>

            {delivered && (
              <Link to="/" className="btn-dark h-12 w-full text-sm">
                Order something else
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-ink-600">
      <span>{label}</span>
      <span className="font-semibold text-ink-900">{value}</span>
    </div>
  )
}
