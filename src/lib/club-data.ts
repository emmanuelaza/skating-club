/**
 * Información real del club (categorías, horarios, planes, sede).
 *
 * Fuente única de verdad para el sitio público. Cambiar aquí actualiza el
 * home, el listado de clases, las páginas de detalle, contacto y el footer.
 */

/* ─────────────────────────── SEDE ─────────────────────────── */

export const CLUB_LOCATION = {
  /** Sede principal de entrenamiento. */
  venue: 'Unidad Deportiva María Luisa Calle',
  unit: 'Local 106',
  /** Dirección en una línea, para footer y metadatos. */
  full: 'Unidad Deportiva María Luisa Calle, Local 106',
  /** Sede alterna usada los viernes. */
  altVenue: 'Patinódromo Guillermo León Botero',
  altNote:
    'Los viernes, Escuela y Transición entrenan en el Patinódromo Guillermo León Botero. En Menores Alto Rendimiento algunos viernes también se entrena allí.',
} as const;

/* ─────────────────────── CONDICIONES COMUNES ─────────────────────── */

/** Matrícula única de inscripción. Incluye la camiseta oficial del club. */
export const ENROLLMENT_FEE_COP = 70_000;

/** Descuento por cada mensualidad cuando se inscriben familiares. */
export const FAMILY_DISCOUNT_COP = 15_000;

/* ─────────────────────────── CATEGORÍAS ─────────────────────────── */

export interface ScheduleBlock {
  /** Nombre del bloque: "Tarde", "Noche", "Sábados"… */
  label: string;
  /** Días que cubre el bloque. */
  days: string;
  /** Franja horaria. */
  time: string;
  /** Sede, si es distinta de la principal. */
  venue?: string;
}

export interface MonthlyPlan {
  id: string;
  /** Jornada o modalidad: "Escuela Tarde", "Escuela Nocturna"… */
  group: string;
  /** Días incluidos: "Lunes a viernes + sábados". */
  days: string;
  priceCop: number;
  /** Marca la opción más elegida dentro de la categoría. */
  popular?: boolean;
}

export interface ClubCategory {
  slug: string;
  name: string;
  /** Una o dos líneas para la card del grid. */
  shortDesc: string;
  /** Descripción completa para la página de detalle. */
  fullDesc: string;
  /** Etapa de formación, se muestra como badge. */
  stage: string;
  /** Precio mínimo mensual, base del "Desde $X al mes". */
  priceFromCop: number;
  /** true -> el precio es único, se muestra sin "Desde". */
  fixedPrice?: boolean;
  /** Qué acompañamiento profesional incluye. */
  includes: string[];
  schedule: ScheduleBlock[];
  plans: MonthlyPlan[];
  /** Requisitos especiales de inscripción. */
  requirements?: string[];
  image: string;
}

export const CLUB_CATEGORIES: ClubCategory[] = [
  {
    slug: 'escuela',
    name: 'Escuela',
    shortDesc:
      'Aprende, mejora tu técnica y crece en el deporte, desde nivel básico hasta avanzado.',
    fullDesc:
      'La Escuela es un espacio para aprender, mejorar la técnica y crecer en el deporte. Recibimos desde nivel básico hasta avanzado, con un plan de trabajo que avanza a tu ritmo y acompañamiento de psicología deportiva incluido dentro del proceso.',
    stage: 'Formación',
    priceFromCop: 85_000,
    includes: ['Psicología deportiva incluida', 'Niveles básico a avanzado'],
    schedule: [
      { label: 'Tarde', days: 'Lunes a viernes', time: '4:00 p. m. – 6:00 p. m.' },
      { label: 'Noche', days: 'Lunes a jueves', time: '7:30 p. m. – 9:00 p. m.' },
      { label: 'Sábados', days: 'Sábados', time: '8:30 a. m. – 10:00 a. m.' },
      {
        label: 'Viernes',
        days: 'Viernes',
        time: '4:00 p. m. – 6:00 p. m.',
        venue: CLUB_LOCATION.altVenue,
      },
    ],
    plans: [
      {
        id: 'escuela-tarde-completo',
        group: 'Escuela Tarde',
        days: 'Lunes a viernes + sábados',
        priceCop: 160_000,
        popular: true,
      },
      {
        id: 'escuela-tarde-2dias',
        group: 'Escuela Tarde',
        days: '2 días a la semana + sábados',
        priceCop: 135_000,
      },
      {
        id: 'escuela-noche-completo',
        group: 'Escuela Nocturna',
        days: 'Lunes a jueves + sábados',
        priceCop: 145_000,
      },
      {
        id: 'escuela-noche-2dias',
        group: 'Escuela Nocturna',
        days: '2 días a la semana + sábados',
        priceCop: 120_000,
      },
      {
        id: 'escuela-sabados',
        group: 'Escuela Sábados',
        days: 'Solo sábados',
        priceCop: 85_000,
      },
    ],
    image: '/images/clase_infantil_1.jpg',
  },
  {
    slug: 'menores-alto-rendimiento',
    name: 'Menores Alto Rendimiento',
    shortDesc:
      'Formación competitiva para niños y jóvenes con acompañamiento integral en cada entrenamiento.',
    fullDesc:
      'Formación competitiva para niños y jóvenes que ya compiten o quieren hacerlo. El proceso incluye acompañamiento integral de psicología deportiva, nutrición deportiva y fisioterapeuta permanente en campo, para sostener las cargas de entrenamiento y el calendario de competencia.',
    stage: 'Alto rendimiento',
    priceFromCop: 180_000,
    includes: [
      'Psicología deportiva',
      'Nutrición deportiva',
      'Fisioterapeuta permanente en campo',
    ],
    schedule: [
      { label: 'Pista', days: 'Lunes a viernes', time: '4:00 p. m. – 6:30 p. m.' },
      { label: 'Preparación física', days: 'Martes y jueves', time: '6:00 a. m. – 7:30 a. m.' },
      { label: 'Sábados', days: 'Sábados', time: '7:30 a. m. – 10:00 a. m.' },
      {
        label: 'Viernes (algunas semanas)',
        days: 'Viernes',
        time: '4:00 p. m. – 6:30 p. m.',
        venue: CLUB_LOCATION.altVenue,
      },
    ],
    plans: [
      {
        id: 'mar-completo',
        group: 'Alto Rendimiento',
        days: 'Lunes a viernes + sábados',
        priceCop: 210_000,
        popular: true,
      },
      {
        id: 'mar-4dias',
        group: 'Alto Rendimiento',
        days: '4 días a la semana + sábados',
        priceCop: 195_000,
      },
      {
        id: 'mar-3dias',
        group: 'Alto Rendimiento',
        days: '3 días a la semana + sábados',
        priceCop: 180_000,
      },
    ],
    requirements: [
      'Los deportistas que vengan de otro club deben presentar carta de libertad y paz y salvo como requisito de inscripción.',
    ],
    image: '/images/clase_infantil_3.jpg',
  },
  {
    slug: 'transicion',
    name: 'Transición',
    shortDesc:
      'Para deportistas con bases que quieren dar el salto a un nivel más exigente.',
    fullDesc:
      'Transición es el puente entre la escuela y el alto rendimiento: está pensada para deportistas que ya tienen bases y quieren dar el salto a un nivel más exigente. Incluye entrenamiento técnico, preparación física en gimnasio, entrenamiento en bicicleta, psicología deportiva semanal, nutrición deportiva y fisioterapeuta en campo.',
    stage: 'Pre-competencia',
    priceFromCop: 190_000,
    fixedPrice: true,
    includes: [
      'Entrenamiento técnico',
      'Preparación física en gimnasio',
      'Entrenamiento en bicicleta',
      'Psicología deportiva semanal',
      'Nutrición deportiva',
      'Fisioterapeuta en campo',
    ],
    schedule: [
      { label: 'Pista', days: 'Lunes, miércoles y viernes', time: '4:00 p. m. – 6:00 p. m.' },
      { label: 'Gimnasio', days: 'Martes y jueves', time: '4:00 p. m. – 5:30 p. m.' },
      { label: 'Bicicleta', days: 'Sábados', time: '7:00 a. m. – 9:00 a. m.' },
      {
        label: 'Viernes',
        days: 'Viernes',
        time: '4:00 p. m. – 6:00 p. m.',
        venue: CLUB_LOCATION.altVenue,
      },
    ],
    plans: [
      {
        id: 'transicion-completo',
        group: 'Transición',
        days: 'Plan completo — pista, gimnasio y bicicleta',
        priceCop: 190_000,
        popular: true,
      },
    ],
    image: '/images/nosotros_alineados.jpg',
  },
  {
    slug: 'semillero-jovenes-adultos',
    name: 'Semillero Jóvenes y Adultos',
    shortDesc:
      'Aprende a patinar desde cero de forma recreativa, pero con técnica profesional.',
    fullDesc:
      'Pensado para adolescentes, jóvenes y adultos que quieren aprender a patinar desde cero. Es un espacio recreativo, sin presión de competencia, pero con técnica profesional: trabajamos resistencia, equilibrio y confianza sobre patines desde la primera clase.',
    stage: 'Recreativo',
    priceFromCop: 85_000,
    includes: ['Técnica profesional', 'Grupos de adolescentes, jóvenes y adultos'],
    schedule: [
      { label: 'Noche A', days: 'Lunes y miércoles', time: '7:30 p. m. – 9:00 p. m.' },
      { label: 'Noche B', days: 'Martes y jueves', time: '7:30 p. m. – 9:00 p. m.' },
      { label: 'Sábados', days: 'Sábados', time: '10:00 a. m. – 11:30 a. m.' },
    ],
    plans: [
      {
        id: 'semillero-2dias-sabado',
        group: 'Semillero',
        days: '2 días a la semana + sábados',
        priceCop: 120_000,
        popular: true,
      },
      {
        id: 'semillero-2dias',
        group: 'Semillero',
        days: '2 días a la semana',
        priceCop: 95_000,
      },
      {
        id: 'semillero-sabados',
        group: 'Semillero',
        days: 'Solo sábados',
        priceCop: 85_000,
      },
    ],
    image: '/images/clase_slalom.jpg',
  },
];

export function getCategoryBySlug(slug: string): ClubCategory | undefined {
  return CLUB_CATEGORIES.find((category) => category.slug === slug);
}

/** Formatea pesos colombianos sin decimales: 85000 -> "$85.000". */
export function formatCop(value: number): string {
  return `$${value.toLocaleString('es-CO')}`;
}

/** Etiqueta de precio para cards y detalle: "Desde $85.000 al mes". */
export function priceLabel(category: ClubCategory): string {
  const amount = formatCop(category.priceFromCop);
  return category.fixedPrice ? `${amount} al mes` : `Desde ${amount} al mes`;
}
