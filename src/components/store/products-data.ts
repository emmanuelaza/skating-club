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
  image: string;
  images?: string[];
  description: string;
  variants?: string[];
  colors?: string[];
  features?: string[];
  specs?: Record<string, string>;
  stock: number;
  faqs?: { question: string; answer: string }[];
  reviewsList?: { user: string; rating: number; date: string; comment: string }[];
}

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
    image: '/images/clase_freestyle.jpg',
    images: [
      '/images/clase_freestyle.jpg',
      'https://images.unsplash.com/photo-1543508282-6319a3e2621d?w=600&q=80',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80'
    ],
    description: 'Bota de fibra de carbono con cierre de trinquete de precisión. Ideal para competencia y entrenamiento avanzado.',
    variants: ['37', '38', '39', '40', '41', '42', '43'],
    colors: ['Verde Neón', 'Negro Mate'],
    features: [
      'Bota ultra ligera de fibra de carbono 100% moldeable al calor.',
      'Chasis de aluminio aeroespacial CNC 7000.',
      'Ruedas de alto rebote de 110mm / 85A.',
      'Rodamientos de precisión de alta velocidad Ceramic ABEC-9.'
    ],
    specs: {
      'Material de Bota': 'Fibra de carbono termo-moldeable',
      'Tamaño de Ruedas': '110 mm',
      'Dureza de Ruedas': '85A PU',
      'Tipo de Rodamientos': 'Cerámica ABEC-9',
      'Tipo de Ejes': 'Ejes de carrera de 8mm de una sola pieza'
    },
    stock: 8,
    faqs: [
      { question: '¿Las botas son termo-moldeables?', answer: 'Sí, la bota de fibra de carbono se puede moldear al calor en un horno especial para un ajuste personalizado perfecto.' },
      { question: '¿Qué talla debo elegir?', answer: 'Recomendamos medir tu pie en centímetros y consultar nuestra guía. Generalmente es una talla más de tu calzado habitual.' }
    ],
    reviewsList: [
      { user: 'Carlos M.', rating: 5, date: '2026-06-15', comment: 'El mejor patín que he tenido. La rigidez de la bota es perfecta y los rodamientos cerámicos se sienten increíblemente rápidos.' },
      { user: 'Sofía R.', rating: 4, date: '2026-07-02', comment: 'Muy veloces. Requieren un par de semanas de uso para que la bota se adapte completamente al pie.' }
    ]
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
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80'
    ],
    description: 'Casco aerodinámico certificado CE EN1078. Ventilación optimizada y forro antibacterial extraíble.',
    variants: ['S', 'M', 'L', 'XL'],
    colors: ['Blanco Brillante', 'Negro Mate', 'Gris Titán'],
    features: [
      'Certificación europea CE EN1078 para máxima seguridad.',
      'Diseño aerodinámico probado en túnel de viento.',
      'Sistema de ajuste micrométrico trasero con perilla.',
      '18 canales de ventilación interna para mantenerte fresco.'
    ],
    specs: {
      'Certificación': 'CE EN1078 / CPSC',
      'Material': 'EPS de alta densidad + Carcasa de Policarbonato In-Mold',
      'Peso': '240g (Talla M)',
      'Ventilación': '18 ventilaciones activas'
    },
    stock: 15,
    faqs: [
      { question: '¿Cómo mido mi talla de casco?', answer: 'Mide la circunferencia de tu cabeza por encima de las cejas con una cinta métrica flexible.' },
      { question: '¿Viene con visera desmontable?', answer: 'No, este modelo Aero está diseñado sin visera para maximizar el coeficiente aerodinámico y visibilidad.' }
    ],
    reviewsList: [
      { user: 'Juan D.', rating: 5, date: '2026-05-18', comment: 'Súper liviano y la ventilación es excelente para días calurosos. Se ajusta muy bien y no se mueve nada.' }
    ]
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
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80'
    ],
    description: 'Pack x4 ruedas de poliuretano de alta densidad, 85A. Excelente agarre y durabilidad para largas distancias.',
    features: [
      'Fórmula avanzada de uretano de rebote súper alto (SHR).',
      'Perfil elíptico para menor fricción y mayor aceleración.',
      'Núcleo optimizado para soportar alta carga sin deformarse.',
      'Dureza 85A idónea para asfalto exterior e interiores.'
    ],
    specs: {
      'Diámetro': '110 mm',
      'Dureza': '85A',
      'Perfil': 'Elíptico de velocidad',
      'Cantidad': 'Pack de 4 ruedas'
    },
    stock: 32,
    faqs: [
      { question: '¿El pack incluye rodamientos o espaciadores?', answer: 'No, el precio es únicamente por el pack de 4 ruedas de poliuretano.' }
    ]
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
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80',
    description: 'Rodilleras, coderas y muñequeras con protección EVA de doble capa. Compatible con patinaje urbano y agresivo.',
    variants: ['S', 'M', 'L', 'XL'],
    stock: 20
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
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    description: 'Mochila con compartimento acolchado para patines, portabilidad superior y fondo impermeable.',
    stock: 12
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
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    description: 'Jersey técnico ultraligero, tejido DryFit, diseño exclusivo Grandes Paisas. Alta transpirabilidad.',
    variants: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 25
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
    image: 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=600&q=80',
    description: 'Incluye llave de ejes, lubricante de rodamientos, herramienta de ajuste y paño de limpieza.',
    stock: 40
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
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&q=80',
    description: 'Pack x16 rodamientos cerámicos ABEC-9. Menor fricción, mayor velocidad, larga vida útil.',
    stock: 18
  }
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
