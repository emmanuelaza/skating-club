'use client';

import * as React from 'react';
import Image from 'next/image';
import { X, Minus, Plus, ShoppingCart, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './CartProvider';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col bg-[#111111] shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#222222] px-6 py-5">
              <div className="flex items-center gap-3">
                <ShoppingCart className="size-5 text-[#8B5CF6]" />
                <h2 className="font-display text-lg font-semibold text-[#F5F5F5]">
                  Carrito
                </h2>
                {items.length > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#8B5CF6] text-[11px] font-bold text-[#FFFFFF]">
                    {items.reduce((a, i) => a + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="flex size-8 items-center justify-center rounded-md border border-[#222222] text-[#888888] transition-colors hover:border-[#8B5CF6] hover:text-[#FFFFFF]"
                aria-label="Cerrar carrito"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-[#1A1A1A]">
                    <ShoppingCart className="size-7 text-[#888888]" />
                  </div>
                  <p className="text-sm text-[#888888]">Tu carrito está vacío</p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="text-sm font-medium text-[#8B5CF6] underline underline-offset-2"
                  >
                    Explorar productos
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-[#222222] px-6">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 py-5">
                      {/* Image */}
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-[radial-gradient(ellipse_at_center,#1A1A1A,#0A0A0A)]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold leading-tight text-[#F5F5F5]">
                              {item.name}
                            </p>
                            <p className="mt-0.5 text-xs text-[#888888]">{item.category}</p>
                            {item.variant && (
                              <p className="mt-0.5 text-xs text-[#888888]">{item.variant}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="shrink-0 text-[#888888] transition-colors hover:text-[#F5F5F5]"
                            aria-label="Eliminar"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>

                        <div className="mt-auto flex items-center justify-between">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="flex size-6 items-center justify-center rounded-full border border-[#222222] text-[#888888] transition-colors hover:border-[#8B5CF6] hover:text-[#8B5CF6]"
                              aria-label="Reducir cantidad"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="min-w-4 text-center text-sm font-medium text-[#F5F5F5]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex size-6 items-center justify-center rounded-full border border-[#222222] text-[#888888] transition-colors hover:border-[#8B5CF6] hover:text-[#8B5CF6]"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                          {/* Price */}
                          <p className="font-display text-base font-bold text-[#22D3EE]">
                            ${(item.price * item.quantity).toLocaleString('es-CO')}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[#222222] px-6 py-6">
                {/* Subtotal */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-[#888888]">Subtotal</span>
                  <span className="font-display text-2xl font-bold text-[#22D3EE]">
                    ${total.toLocaleString('es-CO')}
                  </span>
                </div>

                {/* CTA */}
                <button
                  type="button"
                  disabled
                  className="group relative w-full overflow-hidden rounded-lg border border-[#8B5CF6]/40 px-6 py-3.5 text-sm font-semibold text-[#888888] transition-all duration-300 disabled:cursor-not-allowed"
                >
                  Finalizar compra
                </button>
                <p className="mt-2 text-center text-xs text-[#888888]">
                  Los pagos en línea estarán disponibles próximamente.
                </p>

                {/* Shipping note */}
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#1A1A1A] px-3 py-2.5">
                  <Truck className="size-4 shrink-0 text-[#8B5CF6]" />
                  <p className="text-xs text-[#888888]">
                    Envíos a todo el país — rápidos y seguros
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
