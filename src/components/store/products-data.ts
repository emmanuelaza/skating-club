// Mock product data for the skating store
export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: 'patines' | 'protecciones' | 'ruedas' | 'accesorios' | 'ropa' | 'mantenimiento';
  price: number;
  rating: number;
  reviews: number;
  isNew: boolean;
  image: string; // placeholder path
  description: string;
  variants?: string[];
  stock: number;
}

// Using placeholder images via picsum with deterministic seeds
export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Patín Inline Pro Speed X9',
    category: 'Patines de velocidad',
    categorySlug: 'patines',
    price: 489000,
    rating: 4.9,
    reviews: 128,
    isNew: true,
    image: '/hero-store.jpg',
    description: 'Bota de fibra de carbono con cierre de trinquete de precisión. Ideal para competencia y entrenamiento avanzado.',
    variants: ['37', '38', '39', '40', '41', '42', '43'],
    stock: 8,
  },
  {
    id: 'p2',
    name: 'Casco Aero Elite CE',
    category: 'Protección cefálica',
    categorySlug: 'protecciones',
    price: 189000,
    rating: 4.8,
    reviews: 74,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    description: 'Casco aerodinámico certificado CE EN1078. Ventilación optimizada y forro antibacterial extraíble.',
    variants: ['S', 'M', 'L', 'XL'],
    stock: 15,
  },
  {
    id: 'p3',
    name: 'Ruedas Speed 110mm',
    category: 'Ruedas de competencia',
    categorySlug: 'ruedas',
    price: 95000,
    rating: 4.7,
    reviews: 42,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
    description: 'Pack x4 ruedas de poliuretano de alta densidad, 85A. Excelente agarre y durabilidad para largas distancias.',
    stock: 32,
  },
  {
    id: 'p4',
    name: 'Kit Protecciones Completo',
    category: 'Set de protecciones',
    categorySlug: 'protecciones',
    price: 145000,
    rating: 4.6,
    reviews: 89,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80',
    description: 'Rodilleras, coderas y muñequeras con protección EVA de doble capa. Compatible con patinaje urbano y agresivo.',
    variants: ['S', 'M', 'L', 'XL'],
    stock: 20,
  },
  {
    id: 'p5',
    name: 'Mochila Técnica Club',
    category: 'Accesorios de transporte',
    categorySlug: 'accesorios',
    price: 129000,
    rating: 4.5,
    reviews: 36,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    description: 'Mochila con compartimento acolchado para patines, portabilidad superior y fondo impermeable.',
    stock: 12,
  },
  {
    id: 'p6',
    name: 'Jersey Aero Club Edition',
    category: 'Ropa técnica',
    categorySlug: 'ropa',
    price: 89000,
    rating: 4.8,
    reviews: 55,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
    description: 'Jersey técnico ultraligero, tejido DryFit, diseño exclusivo Skating Club. Alta transpirabilidad.',
    variants: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 25,
  },
  {
    id: 'p7',
    name: 'Kit Mantenimiento Premium',
    category: 'Mantenimiento',
    categorySlug: 'mantenimiento',
    price: 55000,
    rating: 4.4,
    reviews: 28,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=400&q=80',
    description: 'Incluye llave de ejes, lubricante de rodamientos, herramienta de ajuste y paño de limpieza.',
    stock: 40,
  },
  {
    id: 'p8',
    name: 'Rodamientos Ceramic Speed',
    category: 'Rodamientos',
    categorySlug: 'mantenimiento',
    price: 79000,
    rating: 4.9,
    reviews: 63,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&q=80',
    description: 'Pack x16 rodamientos cerámicos ABEC-9. Menor fricción, mayor velocidad, larga vida útil.',
    stock: 18,
  },
];

export const CATEGORIES = [
  { slug: 'todos', label: 'Todos', icon: 'LayoutGrid' },
  { slug: 'patines', label: 'Patines', icon: 'Zap' },
  { slug: 'protecciones', label: 'Protecciones', icon: 'Shield' },
  { slug: 'ruedas', label: 'Ruedas', icon: 'Circle' },
  { slug: 'accesorios', label: 'Accesorios', icon: 'Package' },
  { slug: 'ropa', label: 'Ropa', icon: 'Shirt' },
  { slug: 'mantenimiento', label: 'Mantenimiento', icon: 'Wrench' },
] as const;
