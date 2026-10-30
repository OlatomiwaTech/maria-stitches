'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartLine, Product } from '@/lib/types';

type CartContextValue = {
  lines: CartLine[];
  count: number;
  totalNgn: number;
  add: (product: Product, variantId: string, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  ready: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'maria-stitches-cart-v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setLines(parsed.filter(isCartLine));
      }
    } catch { window.localStorage.removeItem(STORAGE_KEY); }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const add = useCallback((product: Product, variantId: string, quantity = 1) => {
    const variant = product.variants.find((item) => item.id === variantId);
    if (!variant?.available || quantity < 1 || quantity > 10) return;
    setLines((previous) => {
      const existing = previous.find((line) => line.variantId === variantId);
      if (existing) return previous.map((line) => line.variantId === variantId ? { ...line, quantity: Math.min(10, line.quantity + quantity) } : line);
      return [...previous, {
        productId: product.id,
        variantId,
        slug: product.slug,
        name: product.name,
        image: product.images[0]?.url ?? '',
        size: variant.size,
        color: variant.color,
        unitPriceNgn: product.priceNgn,
        quantity,
        isDemo: product.isDemo,
      }];
    });
  }, []);

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    if (!Number.isInteger(quantity) || quantity < 1) return;
    setLines((previous) => previous.map((line) => line.variantId === variantId ? { ...line, quantity: Math.min(10, quantity) } : line));
  }, []);
  const remove = useCallback((variantId: string) => setLines((previous) => previous.filter((line) => line.variantId !== variantId)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(() => ({
    lines,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
    totalNgn: lines.reduce((sum, line) => sum + line.unitPriceNgn * line.quantity, 0),
    add, setQuantity, remove, clear, ready,
  }), [lines, add, setQuantity, remove, clear, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart must be used inside CartProvider');
  return value;
}

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== 'object') return false;
  const line = value as Partial<CartLine>;
  return typeof line.productId === 'string' && typeof line.variantId === 'string'
    && typeof line.slug === 'string' && typeof line.name === 'string'
    && typeof line.unitPriceNgn === 'number' && Number.isFinite(line.unitPriceNgn)
    && typeof line.quantity === 'number' && Number.isInteger(line.quantity) && line.quantity >= 1 && line.quantity <= 10
    && typeof line.isDemo === 'boolean';
}
