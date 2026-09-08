import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { CartLine, Item, Store } from '../types'
import { uid } from '../lib/format'

const STORAGE_KEY = 'threadly.cart.v1'

interface CartState {
  storeId: string | null
  lines: CartLine[]
}

type Action =
  | { type: 'ADD'; item: Item; store: Store; size: string; color: { name: string; hex: string }; qty: number }
  | { type: 'INC'; lineId: string }
  | { type: 'DEC'; lineId: string }
  | { type: 'REMOVE'; lineId: string }
  | { type: 'CLEAR' }
  | { type: 'REPLACE_STORE'; item: Item; store: Store; size: string; color: { name: string; hex: string }; qty: number }
  | { type: 'HYDRATE'; state: CartState }

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return action.state
    case 'ADD': {
      // if adding from a different store, ignore here (UI handles the confirm flow)
      if (state.storeId && state.storeId !== action.store.id) return state
      const existing = state.lines.find(
        (l) => l.itemId === action.item.id && l.size === action.size && l.color.name === action.color.name,
      )
      if (existing) {
        return {
          storeId: action.store.id,
          lines: state.lines.map((l) =>
            l.id === existing.id ? { ...l, qty: l.qty + action.qty } : l,
          ),
        }
      }
      const line: CartLine = {
        id: uid('line'),
        itemId: action.item.id,
        storeId: action.store.id,
        name: action.item.name,
        brand: action.item.brand,
        price: action.item.price,
        garment: action.item.garment,
        accent: action.store.accent,
        size: action.size,
        color: action.color,
        qty: action.qty,
      }
      return { storeId: action.store.id, lines: [...state.lines, line] }
    }
    case 'REPLACE_STORE': {
      const line: CartLine = {
        id: uid('line'),
        itemId: action.item.id,
        storeId: action.store.id,
        name: action.item.name,
        brand: action.item.brand,
        price: action.item.price,
        garment: action.item.garment,
        accent: action.store.accent,
        size: action.size,
        color: action.color,
        qty: action.qty,
      }
      return { storeId: action.store.id, lines: [line] }
    }
    case 'INC':
      return { ...state, lines: state.lines.map((l) => (l.id === action.lineId ? { ...l, qty: l.qty + 1 } : l)) }
    case 'DEC': {
      const lines = state.lines
        .map((l) => (l.id === action.lineId ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0)
      return { storeId: lines.length ? state.storeId : null, lines }
    }
    case 'REMOVE': {
      const lines = state.lines.filter((l) => l.id !== action.lineId)
      return { storeId: lines.length ? state.storeId : null, lines }
    }
    case 'CLEAR':
      return { storeId: null, lines: [] }
    default:
      return state
  }
}

interface CartContextValue extends CartState {
  add: (args: { item: Item; store: Store; size: string; color: { name: string; hex: string }; qty: number }) => void
  replaceStore: (args: { item: Item; store: Store; size: string; color: { name: string; hex: string }; qty: number }) => void
  inc: (lineId: string) => void
  dec: (lineId: string) => void
  remove: (lineId: string) => void
  clear: () => void
  count: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)

function init(): CartState {
  if (typeof window === 'undefined') return { storeId: null, lines: [] }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as CartState
  } catch {
    /* ignore */
  }
  return { storeId: null, lines: [] }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, init)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  const value = useMemo<CartContextValue>(() => {
    const count = state.lines.reduce((n, l) => n + l.qty, 0)
    const subtotal = state.lines.reduce((n, l) => n + l.qty * l.price, 0)
    return {
      ...state,
      count,
      subtotal,
      add: (args) => dispatch({ type: 'ADD', ...args }),
      replaceStore: (args) => dispatch({ type: 'REPLACE_STORE', ...args }),
      inc: (lineId) => dispatch({ type: 'INC', lineId }),
      dec: (lineId) => dispatch({ type: 'DEC', lineId }),
      remove: (lineId) => dispatch({ type: 'REMOVE', lineId }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
