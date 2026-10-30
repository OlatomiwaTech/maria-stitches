import type { Metadata } from 'next';
import { CartPage } from '@/components/cart/cart-page';

export const metadata: Metadata = { title: 'Shopping bag', robots: { index: false, follow: true } };

export default function CartRoute() { return <CartPage />; }
