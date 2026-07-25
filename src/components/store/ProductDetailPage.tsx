'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, Heart, Star, ShoppingCart, ShieldCheck, Truck, Lock,
  Minus, Plus, ChevronRight, HelpCircle, User, Calendar, Store,
  Clock, Mail, Bell,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PRODUCTS, type Product } from './products-data';
import { useCart } from './CartProvider';
import { PUBLIC_CONTAINER } from '@/components/public/Section';
import { ProductCard } from './ProductCard';

interface ProductDetailPageProps {
  productId: string;
}

// ── Coming Soon Form ──────────────────────────────────────────────────────────
function ComingSoonContent({ product }: { product: Product }) {
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Clock badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-4 py-1.5 w-fit">
        <Clock className="size-4 text-[#8B5CF6]" />
        <span className="text-sm font-semibold text-[#8B5CF6]">Próximamente disponible</span>
      </div>

      <div>
        <h1 className="font-display text-3xl font-bold leading-tight text-[#F5F5F5] mt-1">
          {product.name}
        </h1>
        {/* Go On badge */}
        <div className="flex items-center gap-1.5 mt-2">
          <Store className="size-3.5 text-[#555555]" />
          <span className="text-xs text-[#555555] font-medium">Distribuido por Go On Tienda Deportiva</span>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-[#888888] max-w-md">
        Este modelo está en camino. Déjanos tu correo y serás el primero en saber cuando esté disponible para compra. 
        No te perderás de nada.
      </p>

      {/* Features preview */}
      {product.features && product.features.length > 0 && (
        <div className="rounded-xl border border-[#222222] bg-[#111111] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#888888] mb-3">Lo que viene</p>
          <ul className="space-y-2.5">
            {product.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-[#888888] leading-relaxed">
                <span className="block size-1.5 rounded-full bg-[#8B5CF6] mt-2 shrink-0" />
                {feat}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Notify form */}
      {sent ? (
        <div className="rounded-xl border border-[#22D3EE]/30 bg-[#22D3EE]/10 p-5 flex items-center gap-3">
          <Bell className="size-5 text-[#22D3EE] shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#22D3EE]">¡Listo! Te avisaremos.</p>
            <p className="text-xs text-[#888888] mt-0.5">Te enviaremos un correo a <strong>{email}</strong> cuando esté disponible.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#555555]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full rounded-xl border border-[#222222] bg-[#111111] py-3 pl-10 pr-4 text-sm text-[#F5F5F5] placeholder-[#555555] outline-none transition-colors focus:border-[#8B5CF6]"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:from-[#7c4df2] hover:to-[#5457e5] whitespace-nowrap"
          >
            Notificarme cuando esté disponible
          </button>
        </form>
      )}
    </div>
  );
}

// ── Main Detail Page ──────────────────────────────────────────────────────────
export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const { addItem, openCart } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [selectedVariant, setSelectedVariant] = React.useState<string | null>(null);
  const [selectedVariantGroup, setSelectedVariantGroup] = React.useState<string | null>(null);
  const [liked, setLiked] = React.useState(false);
  const [added, setAdded] = React.useState(false);

  const product = React.useMemo(() => {
    return PRODUCTS.find((p) => p.id === productId) ?? null;
  }, [productId]);

  if (!product) {
    return (
      <div className={`${PUBLIC_CONTAINER} py-32 text-center`}>
        <h2 className="font-display text-2xl font-bold text-[#F5F5F5]">Producto no encontrado</h2>
        <p className="mt-2 text-sm text-[#888888]">El producto que buscas no existe o fue retirado de la tienda.</p>
        <Link href="/tienda" className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white transition-all">
          <ArrowLeft className="size-4" />
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);

  const [zoomStyle, setZoomStyle] = React.useState<React.CSSProperties>({ display: 'none' });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${productImages[activeImageIndex]})`,
    });
  };
  const handleMouseLeave = () => setZoomStyle({ display: 'none' });

  React.useEffect(() => {
    if (product.variants?.length) setSelectedVariant(product.variants[0] ?? null);
    if (product.variantGroups?.length) setSelectedVariantGroup(product.variantGroups[0]?.value ?? null);
    setActiveImageIndex(0);
    setQuantity(1);
    setAdded(false);
  }, [product]);

  const relatedProducts = React.useMemo(() => {
    return PRODUCTS
      .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id && !p.comingSoon)
      .slice(0, 4);
  }, [product]);

  const handleAdd = () => {
    if (product.comingSoon) return;
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

  const handleBuyNow = () => {
    if (product.comingSoon) return;
    addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      variant: selectedVariant ?? undefined,
    });
    openCart();
  };

  const trustStrip = [
    { icon: Truck, label: 'Envío rápido a todo el país' },
    { icon: ShieldCheck, label: 'Garantía oficial y cambios fáciles' },
    { icon: Lock, label: 'Pagos encriptados 100% seguros' },
  ];

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-[#F5F5F5] pb-20">
      <div className={`${PUBLIC_CONTAINER} pt-24 pb-4`}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#888888] mb-6">
          <Link href="/" className="transition-colors hover:text-[#F5F5F5]">Inicio</Link>
          <ChevronRight className="size-3" />
          <Link href="/tienda" className="transition-colors hover:text-[#F5F5F5]">Tienda</Link>
          <ChevronRight className="size-3" />
          <span className="capitalize">{product.category}</span>
          <ChevronRight className="size-3" />
          <span className="text-[#8B5CF6] font-medium truncate">{product.name}</span>
        </nav>

        <Link href="/tienda" className="inline-flex items-center gap-2 text-xs font-semibold text-[#888888] hover:text-[#8B5CF6] transition-colors mb-6">
          <ArrowLeft className="size-3.5" />
          Volver al catálogo
        </Link>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT: Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div
              className="relative w-full overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_center,#1A1A1A_0%,#0A0A0A_100%)] aspect-square border border-[#222222] cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <Image
                src={productImages[activeImageIndex] || product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-contain p-8 transition-transform duration-300"
                unoptimized={Boolean(productImages[activeImageIndex]?.startsWith('http'))}
              />

              {/* Zoom Overlay */}
              <div
                className="absolute inset-0 pointer-events-none hidden lg:block bg-no-repeat z-30"
                style={{ ...zoomStyle, backgroundSize: '200%' }}
              />

              {product.isNew && !product.comingSoon && (
                <span className="absolute left-4 top-4 rounded-md bg-[#8B5CF6] px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white z-20">
                  Nuevo
                </span>
              )}
              {product.comingSoon && (
                <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-lg bg-[#8B5CF6] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white z-20">
                  <Clock className="size-3.5" />
                  Próximamente
                </span>
              )}
              <button
                type="button"
                onClick={() => setLiked(!liked)}
                className={`absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border z-20 transition-all ${
                  liked
                    ? 'border-[#8B5CF6] bg-[#8B5CF6]/20 text-[#8B5CF6]'
                    : 'border-[#222222] bg-black/40 text-[#888888] hover:border-[#8B5CF6] hover:text-[#8B5CF6]'
                }`}
              >
                <Heart className={`size-5 ${liked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {productImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImageIndex(i)}
                    className={`relative size-20 shrink-0 overflow-hidden rounded-xl border bg-[#111111] transition-all ${
                      activeImageIndex === i
                        ? 'border-[#8B5CF6] ring-1 ring-[#8B5CF6]'
                        : 'border-[#222222] hover:border-[#444]'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Miniatura ${i + 1}`}
                      fill
                      className="object-contain p-2"
                      unoptimized={img.startsWith('http')}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Information */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {product.comingSoon ? (
              <ComingSoonContent product={product} />
            ) : (
              <>
                {/* Header */}
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#888888]">
                    {product.category}
                  </span>
                  <h1 className="font-display text-3xl font-bold leading-tight text-[#F5F5F5] mt-1">
                    {product.name}
                  </h1>
                  {/* Go On distributor badge */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <Store className="size-3.5 text-[#555555]" />
                    <span className="text-xs text-[#555555] font-medium">Distribuido por Go On Tienda Deportiva</span>
                  </div>
                </div>

                {/* Price & Stock */}
                <div className="flex items-baseline justify-between border-b border-[#222222] pb-4">
                  <p className="font-display text-3xl font-black text-[#22D3EE]">
                    ${product.price.toLocaleString('es-CO')}
                  </p>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-2.5 py-0.5 ${
                    product.stock > 5
                      ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]'
                      : 'bg-yellow-400/10 text-yellow-400'
                  }`}>
                    {product.stock > 5 ? 'Disponible' : `Últimas ${product.stock} unidades`}
                  </span>
                </div>

                {/* Rating */}
                {product.reviews > 0 && (
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
                      {product.rating} · ({product.reviews} opiniones)
                    </span>
                  </div>
                )}

                {/* ── AIDA Content ── */}
                {product.aida && (
                  <div className="flex flex-col gap-4">
                    {/* ATENCIÓN */}
                    <p className="font-display text-lg font-bold leading-snug text-[#F5F5F5]">
                      {product.aida.attention}
                    </p>
                    {/* INTERÉS */}
                    <p className="text-sm leading-relaxed text-[#888888]">
                      {product.aida.interest}
                    </p>
                    {/* DESEO */}
                    <p className="text-sm leading-relaxed text-[#888888] border-l-2 border-[#8B5CF6]/40 pl-3">
                      {product.aida.desire}
                    </p>
                  </div>
                )}

                {/* Variant Groups (personajes infantiles) */}
                {product.variantGroups && product.variantGroups.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#888888] mb-2">
                      Diseño: <span className="text-[#F5F5F5] font-normal">
                        {product.variantGroups.find(v => v.value === selectedVariantGroup)?.label}
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.variantGroups.map((vg) => (
                        <button
                          key={vg.value}
                          type="button"
                          onClick={() => setSelectedVariantGroup(vg.value)}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                            selectedVariantGroup === vg.value
                              ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 text-[#8B5CF6]'
                              : 'border-[#222222] text-[#888888] hover:border-[#444]'
                          }`}
                        >
                          {vg.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tallas / Variantes */}
                {product.variants && product.variants.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#888888] mb-2">
                      Talla
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`min-w-[40px] rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                            selectedVariant === v
                              ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 text-[#8B5CF6]'
                              : 'border-[#222222] text-[#888888] hover:border-[#444]'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & CTAs */}
                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#888888]">
                      Cantidad
                    </span>
                    <div className="flex items-center rounded-lg border border-[#222222] bg-[#111111] p-1">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="flex size-7 items-center justify-center rounded-md text-[#888888] hover:bg-[#1A1A1A] hover:text-[#F5F5F5] transition-colors"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="min-w-8 text-center text-sm font-semibold text-[#F5F5F5]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="flex size-7 items-center justify-center rounded-md text-[#888888] hover:bg-[#1A1A1A] hover:text-[#F5F5F5] transition-colors"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* ACCIÓN — CTA con texto del AIDA */}
                  {product.aida && (
                    <p className="text-xs text-[#8B5CF6] font-medium">{product.aida.action}</p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="rounded-xl border-0 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] py-3.5 text-sm font-bold text-white transition-all duration-300 hover:from-[#7c4df2] hover:to-[#5457e5]"
                    >
                      Comprar ahora
                    </button>
                    <button
                      type="button"
                      onClick={handleAdd}
                      className={`flex items-center justify-center gap-2 rounded-xl border py-3.5 text-sm font-bold transition-all duration-300 ${
                        added
                          ? 'border-[#22D3EE] bg-[#22D3EE]/10 text-[#22D3EE]'
                          : 'border-[#222222] bg-[#111111]/80 hover:border-[#8B5CF6] hover:text-[#8B5CF6]'
                      }`}
                    >
                      <ShoppingCart className="size-4" />
                      {added ? '¡Agregado!' : 'Agregar al carrito'}
                    </button>
                  </div>
                </div>

                {/* Trust strips */}
                <div className="border-t border-[#222222] pt-6 flex flex-col gap-3">
                  {trustStrip.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <div className="flex size-7 items-center justify-center rounded-full bg-[#8B5CF6]/10">
                        <Icon className="size-3.5 text-[#8B5CF6]" />
                      </div>
                      <span className="text-xs text-[#888888] font-medium">{label}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── SPECS & FEATURES — only for non-coming-soon ── */}
        {!product.comingSoon && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-16 pt-12 border-t border-[#222222]">
            <div className="lg:col-span-6">
              <h3 className="font-display text-lg font-bold text-[#F5F5F5] mb-4">
                Características destacadas
              </h3>
              {product.features && product.features.length > 0 ? (
                <ul className="space-y-3">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-[#888888] leading-relaxed">
                      <span className="block size-1.5 rounded-full bg-[#8B5CF6] mt-2 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#888888] italic">
                  Materiales y componentes premium optimizados para máxima durabilidad y rendimiento.
                </p>
              )}
            </div>

            <div className="lg:col-span-6">
              <h3 className="font-display text-lg font-bold text-[#F5F5F5] mb-4">
                Especificaciones técnicas
              </h3>
              <div className="rounded-xl border border-[#222222] bg-[#111111] overflow-hidden">
                <table className="w-full text-sm text-left border-collapse">
                  <tbody>
                    {product.specs && Object.keys(product.specs).length > 0 ? (
                      Object.entries(product.specs).map(([key, val], idx) => (
                        <tr
                          key={key}
                          className={`border-b border-[#222222]/60 last:border-0 ${idx % 2 === 0 ? 'bg-[#151515]' : ''}`}
                        >
                          <td className="px-4 py-3 font-semibold text-[#888888] w-2/5">{key}</td>
                          <td className="px-4 py-3 text-[#F5F5F5]">{val}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="bg-[#151515]">
                        <td className="px-4 py-3 font-semibold text-[#888888]">Categoría</td>
                        <td className="px-4 py-3 text-[#F5F5F5]">{product.category}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── REVIEWS — only for non-coming-soon ── */}
        {!product.comingSoon && product.reviewsList && product.reviewsList.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#222222]">
            <h3 className="font-display text-xl font-bold text-[#F5F5F5] mb-6">
              Opiniones de clientes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {product.reviewsList.map((rev, idx) => (
                  <div key={idx} className="rounded-xl border border-[#222222] bg-[#111111] p-5 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-full bg-[#1A1A1A] text-[#888888]">
                          <User className="size-4" />
                        </div>
                        <span className="text-sm font-semibold text-[#F5F5F5]">{rev.user}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#888888]">
                        <Calendar className="size-3.5" />
                        {rev.date}
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3.5 ${
                            i < rev.rating ? 'fill-[#22D3EE] text-[#22D3EE]' : 'fill-[#222222] text-[#222222]'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-[#888888]">{rev.comment}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-[#222222] bg-[#111111] p-6 flex flex-col items-center justify-center text-center">
                <span className="text-5xl font-black font-display text-[#22D3EE]">{product.rating}</span>
                <div className="flex gap-0.5 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${
                        i < Math.floor(product.rating) ? 'fill-[#22D3EE] text-[#22D3EE]' : 'fill-[#222222] text-[#222222]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#888888] mt-2">Basado en {product.reviews} valoraciones</span>
              </div>
            </div>
          </div>
        )}

        {/* ── FAQS ── */}
        {!product.comingSoon && product.faqs && product.faqs.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#222222]">
            <h3 className="font-display text-xl font-bold text-[#F5F5F5] mb-6">
              Preguntas frecuentes
            </h3>
            <div className="space-y-4 max-w-4xl">
              {product.faqs.map((faq, idx) => (
                <div key={idx} className="rounded-xl border border-[#222222] bg-[#111111] p-5 flex gap-3.5">
                  <HelpCircle className="size-5 text-[#8B5CF6] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-[#F5F5F5]">{faq.question}</h4>
                    <p className="mt-2 text-sm text-[#888888] leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RELATED PRODUCTS ── */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#222222]">
            <h3 className="font-display text-xl font-bold text-[#F5F5F5] mb-6">
              Productos relacionados
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {relatedProducts.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
