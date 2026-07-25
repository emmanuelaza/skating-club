// Catálogo real de productos — distribuidos por Go On Tienda Deportiva
export interface ProductVariantGroup {
  label: string;
  value: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: 'patines' | 'cascos';
  price: number;
  rating: number;
  reviews: number;
  isNew: boolean;
  /** Mostrar como "Próximamente" — sin precio ni carrito */
  comingSoon?: boolean;
  image: string;
  images?: string[];
  /** Descripción corta para el grid de productos */
  description: string;
  /** Grupos de variantes con imagen (p.ej. personajes infantiles) */
  variantGroups?: ProductVariantGroup[];
  variants?: string[];
  features?: string[];
  specs?: Record<string, string>;
  stock: number;
  faqs?: { question: string; answer: string }[];
  reviewsList?: { user: string; rating: number; date: string; comment: string }[];
  // ── Contenido AIDA para la página de detalle ──
  aida?: {
    attention: string;
    interest: string;
    desire: string;
    action: string;
  };
}

export const PRODUCTS: Product[] = [
  // ── PRODUCTO 1: Casco Kask Protone ─────────────────────────────────────────
  {
    id: 'casco-kask-protone',
    name: 'Casco Kask Protone',
    category: 'Cascos',
    categorySlug: 'cascos',
    price: 580000,
    rating: 4.9,
    reviews: 47,
    isNew: true,
    image: '/products/casco-kask-protone.jpg',
    images: ['/products/casco-kask-protone.jpg'],
    description: 'Aerodinámica y ventilación de nivel profesional.',
    variants: ['S', 'M', 'L', 'XL'],
    features: [
      'Sistema de ventilación con múltiples canales activos que mantiene la cabeza fresca durante el entrenamiento intenso.',
      'Diseño aerodinámico probado para reducir la resistencia al viento y ganar milésimas en cada vuelta.',
      'Disponible en blanco y verde militar para adaptarse a cualquier identidad deportiva.',
      'Cierre de ajuste micrométrico trasero para una fijación segura sin puntos de presión.',
      'Materiales de alta resistencia a impactos, certificado para competencia y uso diario.',
    ],
    specs: {
      'Colores disponibles': 'Blanco / Verde Militar',
      'Tallas': 'S / M / L / XL',
      'Sistema de ajuste': 'Micrométrico trasero',
      'Ventilación': 'Multicanal activo',
      'Uso': 'Competencia y entrenamiento avanzado',
    },
    stock: 6,
    aida: {
      attention:
        'Protege lo más importante sin sacrificar ni un gramo de rendimiento. El Kask Protone es el casco que eligen los patinadores de velocidad que compiten en serio — porque saben que no hay segundo intento.',
      interest:
        'Diseñado con múltiples canales de ventilación activa, el Protone mantiene tu cabeza fresca incluso en los entrenamientos más exigentes. Su silueta aerodinámica corta el viento con precisión quirúrgica, reduciendo la resistencia y dándote esa fracción de segundo que puede definir una carrera. Disponible en blanco brillante y verde militar, dos versiones que comunican exactamente lo que eres: un competidor serio.',
      desire:
        'Un buen casco no es un gasto, es una inversión en tu carrera deportiva. Sea que estés construyendo el hábito de la seguridad desde tus primeras rodadas o que ya estés persiguiendo el podio, el Kask Protone es el tipo de equipo que no te limita — te impulsa. Cuando el entrenamiento se siente cómodo y seguro, entrenas más duro, más seguido y con más confianza.',
      action:
        'Elige tu talla y asegura el tuyo antes de que se agote. El stock es limitado y la temporada de competencia no espera.',
    },
    faqs: [
      {
        question: '¿Cómo mido mi talla de casco?',
        answer:
          'Mide la circunferencia de tu cabeza con una cinta métrica flexible, justo por encima de las cejas. S: 52-56 cm · M: 56-58 cm · L: 58-61 cm · XL: 61-64 cm.',
      },
      {
        question: '¿Está disponible en los dos colores?',
        answer:
          'Sí, puedes elegir entre blanco y verde militar. La disponibilidad por talla puede variar, consúltanos para confirmar stock exacto.',
      },
    ],
    reviewsList: [
      {
        user: 'Andrés V.',
        rating: 5,
        date: '2026-05-12',
        comment:
          'El casco más cómodo que he tenido. La ventilación es brutal y el ajuste queda perfecto. Vale cada peso.',
      },
      {
        user: 'Daniela M.',
        rating: 5,
        date: '2026-06-03',
        comment:
          'Lo uso en competencia y entrenamiento. Ligero, seguro y la ventilación es notablemente mejor que mi casco anterior.',
      },
    ],
  },

  // ── PRODUCTO 2: Patín Magic Pro Coming Soon ─────────────────────────────────
  {
    id: 'patin-magic-pro-freestyle',
    name: 'Patín Magic Pro Freestyle',
    category: 'Patines',
    categorySlug: 'patines',
    price: 0,
    rating: 0,
    reviews: 0,
    isNew: false,
    comingSoon: true,
    image: '/products/patin-magic-pro-coming-soon.jpg',
    images: ['/products/patin-magic-pro-coming-soon.jpg'],
    description: 'El patín freestyle más esperado del año, próximamente disponible.',
    stock: 0,
    features: [
      'Bota con sistema de cierre múltiple — velcro, cinturón y lazo.',
      'Chasis de aluminio CNC de alta precisión.',
      'Tres ruedas de 110 mm para velocidad y estabilidad excepcionales.',
      'Diseño completamente negro para un look agresivo y profesional.',
    ],
  },

  // ── PRODUCTO 3: Patines Infantiles Edición Especial ─────────────────────────
  {
    id: 'patines-infantiles-edicion-especial',
    name: 'Patines Infantiles Edición Especial',
    category: 'Patines',
    categorySlug: 'patines',
    price: 220000,
    rating: 4.8,
    reviews: 63,
    isNew: true,
    image: '/products/patines-infantiles.jpg',
    images: ['/products/patines-infantiles.jpg'],
    description: 'Diseños únicos que tus hijos van a amar.',
    variantGroups: [
      { label: 'Liga de la Justicia', value: 'liga-justicia' },
      { label: 'Mujer Maravilla', value: 'mujer-maravilla' },
      { label: 'Batman', value: 'batman' },
      { label: 'Superman', value: 'superman' },
    ],
    variants: ['28', '29', '30', '31', '32', '33', '34', '35'],
    features: [
      'Cuatro diseños exclusivos: Liga de la Justicia, Mujer Maravilla, Batman y Superman.',
      'Bota rígida de alta resistencia, diseñada para el uso infantil intenso del día a día.',
      'Ruedas duraderas con buena adherencia para superficies de parque, pista y salón.',
      'Sistema de ajuste de talla adaptable para acompañar el crecimiento del pie.',
      'Refuerzos en puntos clave para mayor seguridad y confianza mientras aprenden.',
    ],
    specs: {
      'Tallas disponibles': '28 al 35',
      'Diseños': 'Liga / Mujer Maravilla / Batman / Superman',
      'Material de bota': 'Plástico rígido de alta resistencia',
      'Uso recomendado': 'Principiantes e intermedios (3-10 años)',
    },
    stock: 14,
    aida: {
      attention:
        'Los primeros pasos sobre ruedas son para siempre. Hazlos inolvidables, seguros y divertidos con un patín que los niños van a querer ponerse todos los días.',
      interest:
        'La edición especial Liga de la Justicia llega con cuatro diseños que los niños ya conocen y aman. La bota rígida resiste el uso diario sin deformarse, y las ruedas están diseñadas para durar incluso con el ritmo implacable de un niño activo.',
      desire:
        'Como papá o mamá, sabes lo que significa ver a tu hijo descubrir el placer de moverse sobre ruedas con confianza. Estos patines están construidos para acompañar el crecimiento y el progreso, desde esa primera rodada insegura hasta el día en que ya no necesiten tu mano.',
      action:
        'Elige el diseño favorito de tu hijo y la talla correcta. El kit perfecto de inicio puede estar en tu carrito en segundos.',
    },
    faqs: [
      {
        question: '¿Vienen con protecciones incluidas?',
        answer:
          'No incluyen protecciones, pero te recomendamos adquirirlas por separado. Consúltanos para asesorarte según la edad y nivel de tu hijo.',
      },
      {
        question: '¿Cómo elijo la talla correcta para mi hijo?',
        answer:
          'Mide el pie de tu hijo en centímetros de talón a punta y elige la talla correspondiente. Si está entre dos tallas, sube una para mayor comodidad.',
      },
    ],
    reviewsList: [
      {
        user: 'Laura C.',
        rating: 5,
        date: '2026-05-20',
        comment:
          'Mi hijo pidió el de Batman y quedó encantado. La calidad sorprende para el precio. Rueda muy bien.',
      },
      {
        user: 'Mariana P.',
        rating: 5,
        date: '2026-06-18',
        comment:
          'Los de Superman. Los niños los aman y ya llevan 3 meses usándolos casi todos los días sin ningún problema.',
      },
    ],
  },

  // ── PRODUCTO 4: Patín Magic Pro Urban ──────────────────────────────────────
  {
    id: 'patin-magic-pro-urban',
    name: 'Patín Magic Pro Urban',
    category: 'Patines',
    categorySlug: 'patines',
    price: 450000,
    rating: 4.7,
    reviews: 38,
    isNew: false,
    image: '/products/patin-magic-pro-urban.jpg',
    images: ['/products/patin-magic-pro-urban.jpg'],
    description: 'Estilo urbano con el respaldo de un chasis profesional.',
    variants: ['36', '37', '38', '39', '40', '41', '42', '43'],
    features: [
      'Chasis profesional de tres ruedas de 110 mm para mayor velocidad y estabilidad sobre cualquier superficie.',
      'Bota blanca con detalles en rosa que combina identidad visual con rendimiento real.',
      'Marco IAM Urban de grado profesional, ligero y resistente.',
      'Cierre de trinquete + velcro para ajuste firme y rápido en cualquier rodada.',
    ],
    specs: {
      'Ruedas': '3 × 110 mm',
      'Marco': 'IAM Urban — aluminio profesional',
      'Colores': 'Blanco con ruedas rosadas',
      'Cierre': 'Trinquete + velcro',
      'Tallas': '36 al 43',
    },
    stock: 9,
    aida: {
      attention:
        'Patina la ciudad a tu manera, con un chasis de competencia y un look que hace girar cabezas. Porque el estilo no está reñido con el rendimiento.',
      interest:
        'El Magic Pro Urban monta tres ruedas de 110 mm en un chasis de aluminio de grado profesional — más velocidad, más estabilidad y menos esfuerzo por kilómetro. Todo esto en un diseño limpio en blanco con ruedas rosadas que lo convierte en el patín más reconocible de cualquier parque.',
      desire:
        'Este patín es para quienes quieren verse tan bien como se sienten al rodar. Para quien no acepta elegir entre rendimiento e identidad visual. Si ya sabes patinar y buscas ese salto de calidad sin perder tu estilo, el Magic Pro Urban es lo que estabas esperando.',
      action:
        'Stock limitado de esta edición. Elige tu talla y asegura el tuyo hoy antes de que se agote.',
    },
    faqs: [
      {
        question: '¿Las tres ruedas grandes dificultan el aprendizaje?',
        answer:
          'En realidad facilitan el avance. Las ruedas de 110 mm son más estables a mayor velocidad y requieren menos esfuerzo de empuje, ideal para quien ya tiene base en patinaje.',
      },
      {
        question: '¿Es unisex o solo para mujer?',
        answer:
          'Es completamente unisex. El diseño blanco y rosado es una opción de estilo, no una restricción de uso.',
      },
    ],
    reviewsList: [
      {
        user: 'Sara L.',
        rating: 5,
        date: '2026-04-08',
        comment:
          'Las ruedas de 110 son una diferencia enorme respecto a mis patines anteriores. Y el diseño es precioso.',
      },
      {
        user: 'Camilo R.',
        rating: 4,
        date: '2026-05-31',
        comment:
          'Excelente calidad y muy rápido. La bota al principio aprieta pero en dos semanas se amolda perfectamente.',
      },
    ],
  },

  // ── PRODUCTO 5: Patín Profesional Onix ─────────────────────────────────────
  {
    id: 'patin-profesional-onix',
    name: 'Patín Profesional Onix',
    category: 'Patines',
    categorySlug: 'patines',
    price: 1200000,
    rating: 5.0,
    reviews: 29,
    isNew: false,
    image: '/products/patin-onix.jpg',
    images: ['/products/patin-onix.jpg'],
    description: 'Fibra de carbono para quienes compiten en serio.',
    variants: ['36', '37', '38', '39', '40', '41', '42', '43'],
    features: [
      'Bota en fibra de carbono de altísima resistencia y bajo peso — la diferencia que sientes desde la primera zancada.',
      'Chasis de aluminio de grado profesional CNC, mecanizado de una sola pieza para máxima rigidez.',
      'Cuatro ruedas de 100 mm de perfil delgado optimizadas para velocidad máxima en pista.',
      'Rodamientos Canariam GP de alta precisión incluidos.',
      'Sistema de cierre con trinquete de carrera para ajuste milimétrico en competencia.',
    ],
    specs: {
      'Material bota': 'Fibra de carbono 100%',
      'Chasis': 'Aluminio CNC de grado profesional',
      'Ruedas': '4 × 100 mm — Canariam Speed',
      'Rodamientos': 'Canariam GP — Alta precisión',
      'Cierre': 'Trinquete de carrera + cordón',
      'Tallas': '36 al 43',
    },
    stock: 4,
    aida: {
      attention:
        'Ya superaste la etapa de aprender. Ahora compites por el podio y cada milésima de segundo cuenta. El Onix no es para principiantes — es para quienes ya decidieron ganar.',
      interest:
        'La bota del Onix está construida en fibra de carbono pura: el material más ligero y rígido disponible en equipamiento deportivo. Eso significa transferencia total de potencia con cada empuje, cero pérdida de energía en la bota. El chasis de aluminio CNC de una sola pieza elimina cualquier punto de flexión, y las cuatro ruedas de 100 mm están optimizadas para la pista.',
      desire:
        'En patinaje de velocidad, la diferencia entre el primer y el segundo lugar no siempre es talento — a veces es equipo. El Onix te pone en igualdad de condiciones con los mejores. Cuando tienes el equipo correcto, entrenas diferente, compites con más confianza y tu techo de rendimiento sube.',
      action:
        'Este es un producto de gama alta con stock muy limitado. Si estás listo para competir en serio, este es el momento.',
    },
    faqs: [
      {
        question: '¿La bota de fibra de carbono es termo-moldeable?',
        answer:
          'Consulta disponibilidad del servicio de termomoldeo con nosotros. La fibra de carbono requiere un proceso especializado diferente al plástico convencional.',
      },
      {
        question: '¿Los rodamientos de competencia están incluidos?',
        answer:
          'Sí, el Onix viene completo con rodamientos Canariam GP instalados, listos para usar desde el primer día.',
      },
    ],
    reviewsList: [
      {
        user: 'Felipe O.',
        rating: 5,
        date: '2026-03-15',
        comment:
          'Gané mi primera medalla de oro con estos patines. La rigidez de la bota de carbono es incomparable.',
      },
      {
        user: 'Valentina S.',
        rating: 5,
        date: '2026-04-22',
        comment:
          'La inversión más grande que he hecho en equipamiento y también la más inteligente. Notablemente más rápido.',
      },
    ],
  },
];

// ── Categorías de la tienda ──────────────────────────────────────────────────
export const CATEGORIES = [
  { slug: 'todos', label: 'Todos', icon: 'LayoutGrid' },
  { slug: 'patines', label: 'Patines', icon: 'Zap' },
  { slug: 'cascos', label: 'Cascos', icon: 'HardHat' },
] as const;

export type CategorySlug = 'todos' | 'patines' | 'cascos';
