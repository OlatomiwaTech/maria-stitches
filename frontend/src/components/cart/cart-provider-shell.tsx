'use client';

import { CartProvider } from './cart-provider';

export function CartProviderShell({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
