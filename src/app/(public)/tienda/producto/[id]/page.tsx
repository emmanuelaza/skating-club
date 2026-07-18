import type { Metadata } from 'next';
import { ProductDetailPage } from '@/components/store/ProductDetailPage';
import { PRODUCTS } from '@/components/store/products-data';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return {
      title: 'Producto No Encontrado · Skating Club',
    };
  }

  return {
    title: `${product.name} · Tienda`,
    description: product.description,
  };
}

export default async function ProductPageRoute({ params }: PageProps) {
  const { id } = await params;
  return <ProductDetailPage productId={id} />;
}
