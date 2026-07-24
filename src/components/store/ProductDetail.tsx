'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  X, Heart, Star, ShoppingCart, Shield, Truck, RefreshCw, Headphones, ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from './products-data';
import { useCart } from './CartProvider';

interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetail({ product, onClose }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = React.useState<string | null>(null);
  const [liked, setLiked] = React.useState(false);
  const [added, setAdded] = React.useState(false);
  const { addItem } = useCart();

  React.useEffect(() => {
    if (product?.variants?.length) {
      setSelectedVariant(product.variants[0] ?? null);
    }
    setAdded(false);
    setLiked(false);
  }, [product]);

  const handleAdd = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      variant: selectedVariant ?? undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const trustItems = [
    { icon: Truck, label: 'Envío rápido' },
    { icon: Shield, label: 'Pago seguro' },
    { icon: RefreshCw, label: '30 días' },
    { icon: Headphones, label: 'Soporte experto' },
  ];

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            key="detail-backdrop"
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            key="detail-modal"
            className="fixed inset-x-4 bottom-0 top-16 z-50 mx-auto flex max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-[#111111] shadow-2xl sm:inset-4 sm:top-auto sm:max-h-[90vh] sm:rounded-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Close */}
            <div className="flex items-center justify-between border-b border-[#222222] px-6 py-4">
              <nav className="flex items-center gap-1 text-xs text-[#888888]">
                <span>Tienda</span>
                <ChevronRight className="size-3" />
                <span>{product.category}</span>
                <ChevronRight className="size-3" />
                <span className="text-[#F5F5F5]">{product.name}</span>
              </nav>
              <button
                type="button"
                onClick={onClose}
                className="flex size-8 items-center justify-center rounded-md border border-[#222222] text-[#888888] transition-colors hover:border-[#8B5CF6] hover:text-[#F5F5F5]"
                aria-label="Cerrar"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2 md:gap-12">
                {/* Image */}
                <div className="relative overflow-hidden rounded-xl bg-[radial-gradient(ellipse_at_center,#1A1A1A_0%,#0A0A0A_100%)] pt-[80%]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-8"
                    unoptimized={product.image.startsWith('http')}
                  />
                  {product.isNew && (
                    <span className="absolute left-4 top-4 rounded-md bg-[#8B5CF6] px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                      Nuevo
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setLiked((l) => !l)}
                    className={`absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border transition-all ${
                      liked
                        ? 'border-[#8B5CF6] bg-[#8B5CF6]/20 text-[#8B5CF6]'
                        : 'border-[#222222] bg-black/40 text-[#888888] hover:border-[#8B5CF6] hover:text-[#8B5CF6]'
                    }`}
                  >
                    <Heart className={`size-4 ${liked ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#888888]">
                      {product.category}
                    </p>
                    <h2 className="mt-1 font-display text-2xl font-bold leading-tight text-[#F5F5F5] sm:text-3xl">
                      {product.name}
                    </h2>
                  </div>

                  <p className="font-display text-4xl font-black text-[#22D3EE]">
                    ${product.price.toLocaleString('es-CO')}
                  </p>

                  {/* Stars */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-[#22D3EE] text-[#22D3EE]'
                              : 'fill-[#222222] text-[#222222]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-[#888888]">
                      {product.rating} · ({product.reviews} reseñas)
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-[#888888]">{product.description}</p>

                  {/* Variants */}
                  {product.variants && product.variants.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#888888]">
                        Talla / Variante
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setSelectedVariant(v)}
                            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                              selectedVariant === v
                                ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 text-[#8B5CF6]'
                                : 'border-[#222222] text-[#888888] hover:border-[#444] hover:text-[#F5F5F5]'
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stock */}
                  <p className="text-sm text-[#888888]">
                    Stock disponible:{' '}
                    <span className={product.stock > 5 ? 'text-[#8B5CF6]' : 'text-yellow-400'}>
                      {product.stock} unidades
                    </span>
                  </p>

                  {/* CTA */}
                  <button
                    type="button"
                    onClick={handleAdd}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold transition-all duration-300 ${
                      added
                        ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white border-0'
                        : 'border border-[#8B5CF6] bg-transparent text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white'
                    }`}
                  >
                    <ShoppingCart className="size-5" />
                    {added ? '¡Agregado al carrito!' : 'Agregar al carrito'}
                  </button>

                  {/* Trust strip */}
                  <div className="mt-2 grid grid-cols-4 gap-2 border-t border-[#222222] pt-4">
                    {trustItems.map(({ icon: Icon, label }) => (
                      <div key={label} className="flex flex-col items-center gap-1 text-center">
                        <Icon className="size-4 text-[#8B5CF6]" />
                        <span className="text-[10px] text-[#888888]">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
