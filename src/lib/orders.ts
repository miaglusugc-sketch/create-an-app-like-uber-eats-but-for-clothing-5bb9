import type { Order, OrderStatus } from '../types'

const KEY = 'threadly.orders.v1'

export function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return (JSON.parse(raw) as Order[]).sort((a, b) => b.createdAt - a.createdAt)
  } catch {
    return []
  }
}

export function saveOrder(order: Order): void {
  const all = loadOrders()
  all.unshift(order)
  localStorage.setItem(KEY, JSON.stringify(all))
}

export function getOrder(id: string): Order | undefined {
  return loadOrders().find((o) => o.id === id)
}

export const STATUS_STEPS: { key: OrderStatus; label: string; blurb: string }[] = [
  { key: 'confirmed', label: 'Order confirmed', blurb: 'The boutique received your order' },
  { key: 'preparing', label: 'Being styled & packed', blurb: 'Your pieces are being folded and wrapped' },
  { key: 'picked_up', label: 'Picked up', blurb: 'Your courier has your package' },
  { key: 'on_the_way', label: 'On the way', blurb: 'Heading to your address' },
  { key: 'delivered', label: 'Delivered', blurb: 'Enjoy your new fit!' },
]

/**
 * Demo time compression: a realistic ~30 min delivery would be impossible to
 * watch, so the tracking timeline plays back at an accelerated rate. The ETA
 * displayed to the user still counts down from the realistic estimate.
 */
export const DEMO_TIME_SCALE = 12

/**
 * Compute the live delivery progress from elapsed time.
 * Returns the current status, index, and a 0..1 progress fraction.
 */
export function computeProgress(order: Order, now: number): {
  status: OrderStatus
  index: number
  fraction: number
  minutesLeft: number
} {
  const totalMs = order.etaMinutes * 60_000
  const elapsed = Math.max(0, (now - order.createdAt) * DEMO_TIME_SCALE)
  const fraction = Math.min(1, elapsed / totalMs)

  // Distribute the 4 transitions across the timeline.
  // confirmed: 0, preparing: 0.12, picked_up: 0.38, on_the_way: 0.55, delivered: 1
  const marks: { key: OrderStatus; at: number }[] = [
    { key: 'confirmed', at: 0 },
    { key: 'preparing', at: 0.12 },
    { key: 'picked_up', at: 0.38 },
    { key: 'on_the_way', at: 0.55 },
    { key: 'delivered', at: 1 },
  ]

  let index = 0
  for (let i = 0; i < marks.length; i++) {
    if (fraction >= marks[i].at) index = i
  }
  const status = marks[index].key
  const minutesLeft = Math.max(0, Math.ceil((totalMs - elapsed) / 60_000))
  return { status, index, fraction, minutesLeft }
}
