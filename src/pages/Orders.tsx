import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Receipt, ChevronRight, Bike, Check, Clock } from 'lucide-react'
import { Header } from '../components/Header'
import { Garment } from '../components/Garment'
import { loadOrders, computeProgress, STATUS_STEPS } from '../lib/orders'
import { currency } from '../lib/format'
import type { Order } from '../types'

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    setOrders(loadOrders())
  }, [])
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 2000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen bg-ink-50">
      <Header showSearch={false} />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-8">
        <h1 className="text-2xl font-extrabold text-ink-950 sm:text-3xl">Your orders</h1>
        <p className="mt-1 text-ink-500">Track live deliveries and reorder your favorites.</p>

        {orders.length === 0 ? (
          <div className="card mt-8 flex flex-col items-center gap-3 py-16 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-ink-100 text-ink-400">
              <Receipt className="h-7 w-7" />
            </span>
            <h2 className="text-base font-bold text-ink-900">No orders yet</h2>
            <p className="max-w-xs text-sm text-ink-500">
              When you place an order, it’ll show up here so you can track it in real time.
            </p>
            <Link to="/" className="btn-dark mt-2 h-11 px-6 text-sm">
              Browse boutiques
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {orders.map((order) => {
              const { status, index } = computeProgress(order, now)
              const delivered = status === 'delivered'
              const label = STATUS_STEPS[index].label
              const date = new Date(order.createdAt)
              return (
                <Link
                  key={order.id}
                  to={`/track/${order.id}`}
                  className="card flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <div className="flex -space-x-3">
                    {order.lines.slice(0, 3).map((line) => (
                      <span
                        key={line.id}
                        className="grid h-12 w-12 place-items-center rounded-xl border-2 border-white bg-gradient-to-br from-ink-50 to-ink-100"
                      >
                        <Garment type={line.garment} color={line.color.hex} className="h-9 w-9" />
                      </span>
                    ))}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-bold text-ink-950">{order.storeName}</p>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                          delivered ? 'bg-mint-500/10 text-mint-600' : 'bg-brand-50 text-brand-600'
                        }`}
                      >
                        {delivered ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {label}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-ink-500">
                      {order.lines.length} {order.lines.length === 1 ? 'item' : 'items'} ·{' '}
                      {date.toLocaleDateString([], { month: 'short', day: 'numeric' })} ·{' '}
                      {date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </p>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-ink-600">
                      <Bike className="h-3.5 w-3.5" /> {currency(order.total)}
                    </p>
                  </div>

                  <ChevronRight className="h-5 w-5 shrink-0 text-ink-300" />
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
