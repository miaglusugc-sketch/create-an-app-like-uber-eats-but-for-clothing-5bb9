import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getBoutique, getProduct } from '../data/catalog';
import type { Product } from '../data/types';

export interface CartLine {
  key: string;
  productId: string;
  size: string;
  color: string;
  qty: number;
}

export interface PlacedOrder {
  id: string;
  boutiqueId: string;
  lines: CartLine[];
  total: number;
  address: string;
  placedAt: number;
  etaMinutes: number;
  courier: string;
}

interface StoreState {
  cart: CartLine[];
  favorites: string[];
  address: string;
  cartOpen: boolean;
  lastOrder: PlacedOrder | null;
  setAddress: (a: string) => void;
  setCartOpen: (o: boolean) => void;
  addToCart: (product: Product, size: string, color: string, qty?: number) => void;
  removeLine: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clearCart: () => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  cartCount: number;
  cartSubtotal: number;
  cartBoutiqueId: string | null;
  placeOrder: (address: string, courier: string) => PlacedOrder | null;
}

const StoreContext = createContext<StoreState | null>(null);

const CART_KEY = 'threadly.cart.v1';
const FAV_KEY = 'threadly.favorites.v1';
const ADDR_KEY = 'threadly.address.v1';
const ORDER_KEY = 'threadly.lastorder.v1';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

const COURIERS = ['Maya R.', 'Devon K.', 'Priya S.', 'Marco T.', 'Sofia L.', 'Jonah W.'];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(() => load(CART_KEY, []));
  const [favorites, setFavorites] = useState<string[]>(() => load(FAV_KEY, []));
  const [address, setAddress] = useState<string>(() =>
    load(ADDR_KEY, '128 Marlowe Street, Apt 4B'),
  );
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(() =>
    load<PlacedOrder | null>(ORDER_KEY, null),
  );
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    localStorage.setItem(ADDR_KEY, JSON.stringify(address));
  }, [address]);
  useEffect(() => {
    localStorage.setItem(ORDER_KEY, JSON.stringify(lastOrder));
  }, [lastOrder]);

  const cartBoutiqueId = useMemo(() => {
    if (cart.length === 0) return null;
    const p = getProduct(cart[0].productId);
    return p ? p.boutiqueId : null;
  }, [cart]);

  const addToCart = useCallback(
    (product: Product, size: string, color: string, qty = 1) => {
      setCart((prev) => {
        // Different boutique → start a fresh bag (single-boutique checkout).
        const existingBoutique = prev.length ? getProduct(prev[0].productId)?.boutiqueId : null;
        let base = prev;
        if (existingBoutique && existingBoutique !== product.boutiqueId) {
          base = [];
        }
        const key = `${product.id}__${size}__${color}`;
        const found = base.find((l) => l.key === key);
        if (found) {
          return base.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
        }
        return [...base, { key, productId: product.id, size, color, qty }];
      });
      setCartOpen(true);
    },
    [],
  );

  const removeLine = useCallback((key: string) => {
    setCart((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((l) => (l.key === key ? { ...l, qty: Math.max(0, qty) } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const cartCount = useMemo(() => cart.reduce((s, l) => s + l.qty, 0), [cart]);

  const cartSubtotal = useMemo(
    () =>
      cart.reduce((s, l) => {
        const p = getProduct(l.productId);
        return s + (p ? p.price * l.qty : 0);
      }, 0),
    [cart],
  );

  const placeOrder = useCallback(
    (addr: string, courier: string): PlacedOrder | null => {
      if (cart.length === 0 || !cartBoutiqueId) return null;
      const boutique = getBoutique(cartBoutiqueId);
      const deliveryFee = boutique
        ? boutique.freeOver !== undefined && cartSubtotal >= boutique.freeOver
          ? 0
          : boutique.deliveryFee
        : 0;
      const serviceFee = Math.round(cartSubtotal * 0.05 * 100) / 100;
      const total = Math.round((cartSubtotal + deliveryFee + serviceFee) * 100) / 100;
      const eta = boutique ? Math.round((boutique.etaMin + boutique.etaMax) / 2) : 35;
      const order: PlacedOrder = {
        id: `THR-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
        boutiqueId: cartBoutiqueId,
        lines: cart,
        total,
        address: addr,
        placedAt: Date.now(),
        etaMinutes: eta,
        courier: courier || COURIERS[Math.floor(Math.random() * COURIERS.length)],
      };
      setLastOrder(order);
      setCart([]);
      setCartOpen(false);
      return order;
    },
    [cart, cartBoutiqueId, cartSubtotal],
  );

  const value: StoreState = {
    cart,
    favorites,
    address,
    cartOpen,
    lastOrder,
    setAddress,
    setCartOpen,
    addToCart,
    removeLine,
    setQty,
    clearCart,
    toggleFavorite,
    isFavorite,
    cartCount,
    cartSubtotal,
    cartBoutiqueId,
    placeOrder,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export const COURIER_POOL = COURIERS;
