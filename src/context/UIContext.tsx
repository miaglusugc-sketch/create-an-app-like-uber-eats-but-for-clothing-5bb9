import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Item, Store } from '../types'

interface UIContextValue {
  cartOpen: boolean
  openCart: () => void
  closeCart: () => void
  itemModal: { item: Item; store: Store } | null
  openItem: (item: Item, store: Store) => void
  closeItem: () => void
}

const UIContext = createContext<UIContextValue | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false)
  const [itemModal, setItemModal] = useState<{ item: Item; store: Store } | null>(null)

  const value: UIContextValue = {
    cartOpen,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
    itemModal,
    openItem: (item, store) => setItemModal({ item, store }),
    closeItem: () => setItemModal(null),
  }

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUI(): UIContextValue {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}
