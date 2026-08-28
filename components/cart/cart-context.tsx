"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  useState,
  type ReactNode,
} from "react";
import { SITE } from "@/lib/constants";

export type CartSnapshot = {
  slug: string;
  name: string;
  price: number;
  image: string;
  stock: number;
};

export type CartLine = CartSnapshot & { quantity: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  add: (product: CartSnapshot, quantity?: number) => void;
  remove: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "c2c-cart";
const EMPTY: CartLine[] = [];

/* ---------- external store backed by localStorage ---------- */
const listeners = new Set<() => void>();
let rawCache: string | undefined;
let parsedCache: CartLine[] = EMPTY;

function parse(raw: string | null): CartLine[] {
  if (!raw) return EMPTY;
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? (v as CartLine[]) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): CartLine[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== rawCache) {
    rawCache = raw ?? undefined;
    parsedCache = parse(raw);
  }
  return parsedCache;
}

function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function commit(lines: CartLine[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* ignore */
  }
  rawCache = undefined;
  listeners.forEach((l) => l());
}

/* ---------- provider ---------- */
export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [open, setOpen] = useState(false);

  const add = (product: CartSnapshot, quantity = 1) => {
    if (product.stock <= 0) return;
    const next = [...lines];
    const existing = next.find((l) => l.slug === product.slug);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock);
    } else {
      next.push({
        ...product,
        quantity: Math.min(quantity, product.stock),
      });
    }
    commit(next);
    setOpen(true);
  };

  const remove = (slug: string) => {
    commit(lines.filter((l) => l.slug !== slug));
  };

  const setQuantity = (slug: string, quantity: number) => {
    const next = lines
      .map((l) =>
        l.slug === slug
          ? { ...l, quantity: Math.max(0, Math.min(quantity, l.stock)) }
          : l,
      )
      .filter((l) => l.quantity > 0);
    commit(next);
  };

  const clear = () => commit([]);

  const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const count = lines.reduce((s, l) => s + l.quantity, 0);
  const shipping =
    subtotal === 0 || subtotal >= SITE.freeShippingThreshold
      ? 0
      : SITE.shippingFee;
  const total = subtotal + shipping;

  const value: CartContextValue = {
    lines,
    count,
    subtotal,
    shipping,
    total,
    add,
    remove,
    setQuantity,
    clear,
    open,
    setOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
