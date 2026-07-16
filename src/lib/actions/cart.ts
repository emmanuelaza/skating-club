'use server';

import { revalidatePath } from 'next/cache';
import { addToCart, removeFromCart, updateCartQuantity, clearCart, type CartItem } from '@/lib/cart';

export async function addToCartAction(item: CartItem): Promise<void> {
  await addToCart(item);
  revalidatePath('/portal/store/cart');
}

export async function updateCartQuantityAction(variantId: string, quantity: number): Promise<void> {
  await updateCartQuantity(variantId, quantity);
  revalidatePath('/portal/store/cart');
}

export async function removeFromCartAction(variantId: string): Promise<void> {
  await removeFromCart(variantId);
  revalidatePath('/portal/store/cart');
}

export async function clearCartAction(): Promise<void> {
  await clearCart();
  revalidatePath('/portal/store/cart');
}
