import 'server-only';
import { cookies } from 'next/headers';

/**
 * Carrito basado en cookie del lado servidor, para que funcione con SSR.
 * Las mutaciones deben invocarse desde Server Actions / Route Handlers (las
 * cookies son de solo lectura en Server Components).
 */
export interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  sku: string | null;
  /** Precio unitario en pesos (COP). */
  price_cop: number;
  quantity: number;
}

const CART_COOKIE = 'cart';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 días

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.variantId === 'string' &&
    typeof item.productId === 'string' &&
    typeof item.name === 'string' &&
    (typeof item.sku === 'string' || item.sku === null) &&
    typeof item.price_cop === 'number' &&
    typeof item.quantity === 'number'
  );
}

export async function getCart(): Promise<CartItem[]> {
  const store = await cookies();
  const raw = store.get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

async function setCart(items: CartItem[]): Promise<void> {
  const store = await cookies();
  store.set(CART_COOKIE, JSON.stringify(items), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function addToCart(item: CartItem): Promise<void> {
  const items = await getCart();
  const existing = items.find((current) => current.variantId === item.variantId);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    items.push(item);
  }
  await setCart(items);
}

export async function updateCartQuantity(variantId: string, quantity: number): Promise<void> {
  const items = await getCart();
  const next = items
    .map((item) => (item.variantId === variantId ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);
  await setCart(next);
}

export async function removeFromCart(variantId: string): Promise<void> {
  const items = (await getCart()).filter((item) => item.variantId !== variantId);
  await setCart(items);
}

export async function clearCart(): Promise<void> {
  const store = await cookies();
  store.delete(CART_COOKIE);
}

/** Subtotal del carrito en pesos. */
export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price_cop * item.quantity, 0);
}
