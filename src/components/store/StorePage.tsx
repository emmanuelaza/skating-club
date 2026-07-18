'use client';

import * as React from 'react';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { StoreHero } from './StoreHero';
import { FilterBar } from './FilterBar';
import { ProductCard } from './ProductCard';
import { ProductDetail } from './ProductDetail';
import { TrustBand } from './TrustBand';
import { CartDrawer } from './CartDrawer';
import { PRODUCTS, type Product } from './products-data';
import { PUBLIC_CONTAINER } from '@/components/public/Section';

export function StorePage() {
  const [activeCategory, setActiveCategory] = React.useState('todos');
  const [sortOrder, setSortOrder] = React.useState('popular');
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  const filteredProducts = React.useMemo(() => {
    let list = activeCategory === 'todos'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.categorySlug === activeCategory);

    switch (sortOrder) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        list = [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        list = [...list].sort((a, b) => b.reviews - a.reviews);
    }
    return list;
  }, [activeCategory, sortOrder]);

  return (
    <>
      {/* Breadcrumb */}
      <div className={`${PUBLIC_CONTAINER} pt-20 pb-2`}>
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#888888]">
          <Link href="/" className="flex items-center gap-1 transition-colors hover:text-[#F5F5F5]">
            <Home className="size-3" />
          </Link>
          <ChevronRight className="size-3" />
          <span className="font-medium text-[#00E5A0]">Tienda</span>
        </nav>
      </div>

      {/* Hero */}
      <StoreHero />

      {/* Filter bar + Product grid */}
      <div id="productos" className={`${PUBLIC_CONTAINER} py-10`}>
        <FilterBar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />

        {filteredProducts.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                onOpenDetail={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <p className="text-lg font-semibold text-[#F5F5F5]">Sin productos</p>
            <p className="text-sm text-[#888888]">No hay productos en esta categoría aún.</p>
          </div>
        )}
      </div>

      {/* Trust band */}
      <TrustBand />

      {/* Product detail modal */}
      <ProductDetail
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Cart drawer */}
      <CartDrawer />
    </>
  );
}
