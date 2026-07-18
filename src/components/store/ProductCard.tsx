'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Star, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from './products-data';
import { useCart } from './CartProvider';

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const router = useRouter();
  const [liked, setLiked] = React.useState(false);
  const [addedFeedback, setAddedFeedback] = React.useState(false);
  const { addItem, openCart } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
    });
    // Abre el carrito inmediatamente
    openCart();
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((l) => !l);
  };

  const navigateToDetail = (e: React.MouseEvent) => {
    // Redirige a la página individual del producto
    router.push(`/tienda/producto/${product.id}`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={navigateToDetail}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[#222222] bg-[#111111] transition-all duration-300 hover:-translate-y-1 hover:border-[#2e2e2e] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
    >
      {/* Image area */}
      <div className="relative overflow-hidden bg-[radial-gradient(ellipse_at_center,#1A1A1A_0%,#0A0A0A_100%)] pt-[75%]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          unoptimized={product.image.startsWith('http') || product.image.startsWith('/hero-store.jpg')}
        />

        {/* New badge */}
        {product.isNew && (
          <span className="absolute left-3 top-3 rounded-md bg-[#00E5A0] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0A0A0A]">
            Nuevo
          </span>
        )}

        {/* Favorite button */}
        <button
          type="button"
          onClick={handleLike}
          aria-label={liked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          className={`absolute right-3 top-3 flex size-8 items-center justify-center rounded-full border transition-all duration-200 ${
            liked
              ? 'border-[#00E5A0] bg-[#00E5A0]/20 text-[#00E5A0]'
              : 'border-[#222222] bg-black/40 text-[#888888] hover:border-[#00E5A0] hover:text-[#00E5A0]'
          }`}
        >
          <Heart className={`size-3.5 ${liked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-[10px] font-medium uppercase tracking-wider text-[#888888]">
          {product.category}
        </p>
        <h3 className="font-display text-sm font-semibold leading-tight text-[#F5F5F5] group-hover:text-[#00E5A0] transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Price */}
        <p className="mt-0.5 font-display text-lg font-bold text-[#00E5A0]">
          ${product.price.toLocaleString('es-CO')}
        </p>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`size-3 ${
                  i < Math.floor(product.rating)
                    ? 'fill-[#00E5A0] text-[#00E5A0]'
                    : 'fill-[#222222] text-[#222222]'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-[#888888]">({product.reviews})</span>
        </div>

        {/* Actions - Modern Nike/Apple side-by-side design */}
        <div className="mt-auto flex gap-2 pt-2 border-t border-[#222222]/40">
          {/* Comprar ahora - Main CTA */}
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 rounded-lg border border-[#00E5A0] bg-[#00E5A0] py-2 text-xs font-bold text-[#0A0A0A] transition-all duration-300 hover:bg-[#00C988] hover:border-[#00C988] active:scale-95"
          >
            Comprar ahora
          </button>

          {/* Agregar al carrito - Compact Icon CTA */}
          <button
            type="button"
            onClick={handleAdd}
            aria-label="Agregar al carrito"
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 ${
              addedFeedback
                ? 'border-[#00E5A0] bg-[#00E5A0]/10 text-[#00E5A0]'
                : 'border-[#222222] bg-[#1A1A1A] text-[#888888] hover:border-[#00E5A0] hover:text-[#00E5A0] active:scale-95'
            }`}
          >
            {addedFeedback ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
