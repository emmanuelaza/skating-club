import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { CreditCard, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Section, SectionHeading, PUBLIC_CONTAINER, CARD_HOVER } from '@/components/public/Section';
import { PricingPlans, type PublicPlan } from '@/components/public/PricingPlans';
import { FAQAccordion } from '@/components/public/FAQAccordion';
import { InteractiveClasses } from '@/components/public/InteractiveClasses';
import { TestimonialsStack } from '@/components/public/TestimonialsStack';
import { FadeIn } from '@/components/animations/FadeIn';
import { GlowText } from '@/components/animations/GlowText';
import { SpotlightCard } from '@/components/public/SpotlightCard';
import { CounterAnimation } from '@/components/animations/CounterAnimation';
import { MagneticButton } from '@/components/animations/MagneticButton';
import {
  FloatingParticlesLazy,
  BackgroundShaderLazy,
  ParticleFieldLazy,
} from '@/components/3d/Scene3D';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Grandes Paisas · El arte de rodar con precisión',
  description:
    'Club de patinaje profesional en Bogotá. Clases para todos los niveles, instructores certificados y una comunidad que te impulsa.',
  openGraph: {
    title: 'Grandes Paisas',
    description: 'El arte de rodar con precisión. Bogotá, Colombia.',
    type: 'website',
  },
};

/* ─────────────────────────── DATA ─────────────────────────── */

const OFFERINGS = [
  {
    icon: CreditCard,
    title: 'Progresa a tu ritmo',
    text: 'Planes flexibles que se adaptan a tu nivel y agenda. Sin contratos largos, sin sorpresas.',
    result: '→ Más del 80% de nuestros miembros ven mejora en sus primeras 4 semanas',
  },
  {
    icon: Calendar,
    title: 'Aprende con los mejores',
    text: 'Instructores certificados con métodos probados para principiantes y competidores.',
    result: '→ Clases disponibles 6 días a la semana, desde las 7am hasta las 9pm',
  },
  {
    icon: Users,
    title: 'No patinas solo',
    text: 'Una comunidad activa que te motiva, te reta y celebra cada uno de tus logros.',
    result: '→ Eventos, competencias y grupos de entrenamiento cada semana',
  },
];

const OFFERING_STATS = [
  { value: '4', label: 'semanas para notar tu primera mejora real' },
  { value: '+200', label: 'patinadores que ya transformaron su nivel' },
  { value: '98%', label: 'de satisfacción entre nuestros miembros' },
];

const CLASS_TYPES = [
  {
    name: 'Iniciación Infantil',
    level: 'Principiante',
    duration: 60,
    desc: 'Tus primeros deslizamientos en pista de manera segura y divertida. Ideal para niños que comienzan.',
    image: '/images/clase_iniciacion_infantil.jpg',
  },
  {
    name: 'Patinaje Infantil',
    level: 'Principiante',
    duration: 60,
    desc: 'Juegos y técnicas dinámicas en movimiento para desarrollar velocidad y destreza en la pista.',
    image: '/images/clase_patinaje_infantil.jpg',
  },
  {
    name: 'Slalom',
    level: 'Avanzado',
    duration: 60,
    desc: 'Técnica, giros rápidos y precisión extrema entre conos a alta velocidad.',
    image: '/images/clase_slalom.jpg',
  },
  {
    name: 'Patinaje Artístico',
    level: 'Principiante',
    duration: 75,
    desc: 'Figuras, coreografías y expresión corporal sobre ruedas. Desarrolla gracia, equilibrio y elegancia.',
    image: '/images/clase_artistico.jpg',
  },
  {
    name: 'Freestyle',
    level: 'Intermedio',
    duration: 60,
    desc: 'Trucos, saltos urbanos, saltos de rampa y estilo libre sobre patines inline.',
    image: '/images/clase_freestyle.jpg',
  },
];

const PLANS: PublicPlan[] = [
  {
    id: 'basico',
    name: 'Básico',
    description: 'Ideal para quienes empiezan a descubrir el patinaje.',
    priceCop: 89000,
    interval: 'month',
    features: [
      'Acceso a pista libre',
      '2 clases grupales al mes',
      'App de reservas',
      'Equipamiento de cortesía',
    ],
    recommended: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'El plan favorito de nuestra comunidad. Progresa rápido.',
    priceCop: 159000,
    interval: 'month',
    features: [
      'Pista libre ilimitada',
      '8 clases grupales al mes',
      '1 clase personalizada',
      'Descuentos en tienda',
      'Acceso a eventos mensuales',
    ],
    recommended: true,
  },
  {
    id: 'elite',
    name: 'Elite',
    description: 'Para competidores y patinadores que quieren ir al máximo.',
    priceCop: 249000,
    interval: 'month',
    features: [
      'Todo lo de Pro',
      'Clases ilimitadas',
      'Entrenamiento competitivo',
      'Acceso prioritario a eventos',
      'Análisis de técnica mensual',
    ],
    recommended: false,
  },
];




const FAQS = [
  {
    id: 'f1',
    question: '¿Necesito experiencia previa para empezar?',
    answer:
      'No. Tenemos clases para principiantes absolutos y te acompañamos desde el primer giro.',
  },
  {
    id: 'f2',
    question: '¿Qué incluye cada membresía?',
    answer:
      'Cada plan define el acceso a pista libre y la cantidad de clases. Puedes comparar Básico, Pro y Elite en la sección de planes.',
  },
  {
    id: 'f3',
    question: '¿Prestan el equipo o debo llevar el mío?',
    answer:
      'Contamos con patines y protección de cortesía para tus primeras clases. Luego te asesoramos para tu propio equipo.',
  },
  {
    id: 'f4',
    question: '¿Cómo funcionan los pagos?',
    answer:
      'Los pagos son mensuales a través de Wompi. Próximamente podrás gestionarlos desde tu portal de miembro.',
  },
  {
    id: 'f5',
    question: '¿Puedo cancelar cuando quiera?',
    answer:
      'Sí. No manejamos permanencia: cancelas tu membresía en cualquier momento desde tu cuenta.',
  },
  {
    id: 'f6',
    question: '¿Dónde están ubicados?',
    answer:
      'Estamos en Bogotá, Colombia. Escríbenos desde la página de contacto para conocer la dirección y los horarios.',
  },
];

/* ─────────────────────────── PAGE ─────────────────────────── */

export default function PublicHomePage() {
  return (
    <>
      {/* ═══════════════════════════════════════════ HERO */}
      <section
        className={cn(
          // Mobile: 88vh, imagen fotográfica de fondo
          'relative overflow-hidden',
          'min-h-[88vh] md:min-h-[90vh] lg:min-h-screen',
          // En desktop mostramos el shader y fondo transparente
          'md:flex md:items-center md:justify-center',
          'md:bg-transparent',
          // En mobile el fondo es negro puro (se fusiona con la máscara inferior)
          'bg-[#0A0A0A]',
        )}
      >
        {/* ─── DESKTOP: fondo 3D shader + partículas ─── */}
        <BackgroundShaderLazy />
        <ParticleFieldLazy className="pointer-events-none absolute inset-0 z-0" />

        {/* ─── MOBILE only: imagen fotográfica inmersiva ─── */}
        {/* Capa 1 — Imagen enfocada en la patinadora (esquina inferior derecha) */}
        <div className="absolute inset-0 z-[1] w-full h-full md:hidden" aria-hidden="true">
          <Image
            src="/hero-mobile.jpg"
            alt=""
            fill
            priority
            loading="eager"
            sizes="(max-width: 768px) 100vw"
            className="object-cover object-[88%_bottom]"
          />
        </div>

        {/* Capa 2 — Overlay sutil superior e izquierdo para contraste del texto sin oscurecer a la chica */}
        <div
          className="pointer-events-none absolute inset-0 z-[2] md:hidden"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(to bottom, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.30) 40%, transparent 65%)',
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 z-[3] md:hidden"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(to right, rgba(10,10,10,0.70) 0%, rgba(10,10,10,0.15) 50%, transparent 75%)',
          }}
        />

        {/* Capa 5 — Máscara de transición inferior sutil hacia el fondo negro */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[30%] md:hidden"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(10,10,10,0.6) 50%, #0A0A0A 100%)',
          }}
        />

        {/* Capa 6 — Líneas de velocidad sutiles */}
        <div className="pointer-events-none absolute inset-0 z-[5] md:hidden" aria-hidden="true">
          {[
            { top: '60%', opacity: 0.45 },
            { top: '63%', opacity: 0.30 },
            { top: '65.5%', opacity: 0.20 },
          ].map((line, i) => (
            <div
              key={i}
              className="absolute left-0"
              style={{
                top: line.top,
                width: '50%',
                height: '1px',
                background: `linear-gradient(to left, transparent 0%, rgba(34,211,238,${line.opacity}) 100%)`,
              }}
            />
          ))}
        </div>

        {/* ─── Capa 4: Contenido del hero en espacio negativo ─── */}
        <div
          className={cn(
            'relative z-[10] w-full',
            // MOBILE: alineado arriba en espacio negativo (padding top compacto 76px)
            'flex flex-col items-start px-5 pt-[76px]',
            // DESKTOP: centrado como antes
            'md:mx-auto md:flex md:max-w-4xl md:flex-col md:items-center md:px-6 md:pb-16 md:pt-32 md:text-center',
            'lg:py-0',
          )}
        >
          {/* Eyebrow */}
          <span
            className="mb-2 block uppercase text-white/70 md:mb-4 md:text-muted-foreground font-semibold"
            style={{ fontSize: '9.5px', letterSpacing: '0.22em' }}
          >
            Club de patinaje profesional · Bogotá
          </span>

          {/* Título */}
          <h1
            className="mb-2 font-display font-black leading-[1.12] tracking-tight text-white md:mb-4 md:text-foreground"
            style={{ fontSize: 'clamp(1.75rem, 5.5vw, 5.5rem)', maxWidth: '240px' }}
          >
            {/* Mobile: texto plano sobre el área limpia superior izquierda */}
            <span className="md:hidden">El arte de rodar con precisión</span>
            {/* Desktop: GlowText animado */}
            <span className="hidden md:block">
              <GlowText text="El arte de rodar con precisión" highlightWords={['arte', 'precisión']} />
            </span>
          </h1>

          {/* Subtítulo */}
          <p
            className="mb-5 leading-relaxed text-white/80 md:mb-8 md:text-muted-foreground text-xs sm:text-sm"
            style={{ maxWidth: '230px' }}
          >
            Clases, membresías y comunidad para patinadores de todos los niveles.
          </p>

          {/* Botones */}
          <div className="flex w-full flex-col gap-2 min-[360px]:flex-row min-[360px]:w-auto md:justify-center md:gap-4 max-w-[240px] min-[360px]:max-w-none">
            {/* Primario: degradado de violeta a cyan */}
            <MagneticButton className="w-full min-[360px]:w-auto">
              <Button
                asChild
                size="lg"
                className="w-full min-[360px]:w-auto py-2 sm:py-3 text-xs md:py-4 md:text-base font-semibold bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white border-0 transition-all duration-300 shadow-[0_0_20px_rgba(167,139,250,0.3)]"
              >
                <Link href="/register">Únete al club</Link>
              </Button>
            </MagneticButton>
            {/* Secundario */}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full min-[360px]:w-auto border-white/30 py-2 sm:py-3 text-xs text-white hover:border-primary hover:text-primary md:border-border md:py-4 md:text-base md:text-foreground font-semibold"
            >
              <Link href={'/clases' as Route}>Ver clases</Link>
            </Button>
          </div>

          {/* Social proof — solo desktop */}
          <div className="mt-10 hidden flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground md:flex">
            <span>200+ miembros</span>
            <span className="text-primary">·</span>
            <span>15+ clases semanales</span>
            <span className="text-primary">·</span>
            <span>5 años de experiencia</span>
          </div>
        </div>

        {/* Scroll indicator — solo desktop */}
        <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Scroll</span>
          <div aria-hidden className="h-12 w-px animate-pulse bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════ BANDA CONFIANZA */}
      <section
        className="relative border-y border-border bg-card"
        style={{ marginTop: 0 }}
      >
        {/* Resplandor de transición — solo mobile, eco del halo de la imagen */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 md:hidden"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(0,229,160,0.04) 0%, transparent 100%)',
          }}
        />
        <div
          className={cn(
            PUBLIC_CONTAINER,
            'grid grid-cols-3 gap-4 py-6 text-center md:py-10',
          )}
        >
          {[
            { node: <CounterAnimation target={200} suffix="+" />, label: 'Miembros' },
            { node: <CounterAnimation target={15} />, label: 'Clases semanales' },
            { node: <CounterAnimation target={5} />, label: 'Años' },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <span className="font-display text-2xl font-bold text-primary sm:text-3xl">{item.node}</span>
              <span className="text-xs text-muted-foreground sm:text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════ QUÉ OFRECEMOS */}
      <Section>
        <FadeIn>
          <SectionHeading
            title="Lo que ofrecemos"
            subtitle="No vendemos características. Te mostramos resultados reales."
            highlight={['ofrecemos']}
          />
        </FadeIn>

        {/* 3 cards orientadas a beneficios */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {OFFERINGS.map(({ icon: Icon, title, text, result }, index) => (
            <FadeIn key={title} delay={index * 0.1}>
              <SpotlightCard className="h-full">
                <div className={cn('flex h-full flex-col rounded-lg border border-border bg-card p-6', CARD_HOVER)}>
                  <span className="flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                  <p className="mt-4 text-xs font-medium text-primary">{result}</p>
                </div>
              </SpotlightCard>
            </FadeIn>
          ))}
        </div>

        {/* Stats bajo las cards */}
        <div className="mt-14 grid grid-cols-1 gap-8 pt-10 border-t border-border sm:grid-cols-3 sm:gap-6 md:gap-12">
          {OFFERING_STATS.map((stat, i) => (
            <FadeIn
              key={stat.value}
              delay={i * 0.1}
              className={cn(
                'text-center px-4 py-2 flex flex-col items-center justify-center',
                i > 0 && 'sm:border-l sm:border-border'
              )}
            >
              <p className="font-display text-3xl font-black text-primary sm:text-[2.5rem]">{stat.value}</p>
              <p className="mt-2 text-xs leading-snug text-muted-foreground sm:text-[13px] max-w-[200px] sm:max-w-none px-2">{stat.label}</p>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════ CLASES */}
      <section className="bg-card py-16 sm:py-24">
        <div className={PUBLIC_CONTAINER}>
          <FadeIn>
            <SectionHeading
              title="Nuestras clases"
              subtitle="Encuentra la disciplina perfecta, desde tus primeros pasos hasta competencias."
              highlight={['clases']}
            />
          </FadeIn>
        </div>
        <InteractiveClasses classTypes={CLASS_TYPES} />
      </section>

      {/* ═══════════════════════════════════════════ LOGROS Y RESULTADOS */}
      <Section>
        <FadeIn>
          <SectionHeading
            title="Logros que nos enorgullecen"
            subtitle="Nuestros patinadores destacan en las pistas nacionales e internacionales."
            highlight={['enorgullecen']}
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
          {/* Foto protagonista (Podio) - 60% en desktop */}
          <div className="md:col-span-6 group relative h-[300px] md:h-[450px] overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 shadow-lg">
            <Image
              src="/images/logros_podio.jpg"
              alt="Podio de competencia"
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-opacity duration-300 group-hover:from-black/95" />
            <div className="absolute bottom-0 left-0 p-6">
              <span className="text-xs uppercase tracking-widest text-primary font-bold">Campeonato Panamericano</span>
              <h4 className="font-display text-lg font-bold text-white mt-1">Medalla de Oro al Centro en el Podio</h4>
            </div>
          </div>

          {/* Columna vertical - 40% en desktop */}
          <div className="md:col-span-4 flex flex-col gap-6 h-auto md:h-[450px]">
            {/* Joven con medallas */}
            <div className="flex-1 min-h-[180px] group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 shadow-lg">
              <Image
                src="/images/logros_joven_medallas.jpg"
                alt="Joven destacado con medallas"
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-opacity duration-300 group-hover:from-black/95" />
              <div className="absolute bottom-0 left-0 p-6">
                <span className="text-xs uppercase tracking-widest text-primary font-bold">Categoría Juvenil</span>
                <h4 className="font-display text-base font-bold text-white mt-1">Destacado con Múltiples Medallas</h4>
              </div>
            </div>

            {/* Grupo celebrando */}
            <div className="flex-1 min-h-[180px] group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 shadow-lg">
              <Image
                src="/images/logros_celebracion.jpg"
                alt="Equipo celebrando medallas"
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-opacity duration-300 group-hover:from-black/95" />
              <div className="absolute bottom-0 left-0 p-6">
                <span className="text-xs uppercase tracking-widest text-primary font-bold">Celebración de Triunfo</span>
                <h4 className="font-display text-base font-bold text-white mt-1">Logros en Equipo y Compañerismo</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Fila de cifras destacadas */}
        <div className="mt-14 grid grid-cols-1 gap-8 pt-10 border-t border-border sm:grid-cols-3 sm:gap-6 md:gap-12">
          {[
            { value: '145+', label: 'Medallas obtenidas en campeonatos oficiales' },
            { value: '38', label: 'Deportistas en torneos internacionales' },
            { value: '12', label: 'Años consecutivos compitiendo al más alto nivel' },
          ].map((stat, i) => (
            <FadeIn
              key={stat.value}
              delay={i * 0.1}
              className={cn(
                'text-center px-4 py-2 flex flex-col items-center justify-center',
                i > 0 && 'sm:border-l sm:border-border'
              )}
            >
              <p className="font-display text-4xl font-black text-primary sm:text-[3rem]">{stat.value}</p>
              <p className="mt-2 text-xs leading-snug text-muted-foreground sm:text-[13px] max-w-[200px] sm:max-w-none px-2">{stat.label}</p>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════ PLANES */}
      <Section>
        <FadeIn>
          <SectionHeading
            title="Planes y membresías"
            subtitle="Elige el plan que se adapta a tu ritmo. Sin permanencia."
            highlight={['membresías']}
          />
        </FadeIn>
        <PricingPlans plans={PLANS} />
      </Section>

      {/* ═══════════════════════════════════════════ STATS GLOBALES */}
      <Section alt className="relative overflow-hidden">
        <FloatingParticlesLazy className="pointer-events-none absolute inset-0 z-0 opacity-30" />
        <div className="relative z-10 grid grid-cols-2 gap-y-10 lg:grid-cols-4 lg:divide-x lg:divide-border">
          {[
            { target: 200, suffix: '+', label: 'Miembros activos' },
            { target: 15, suffix: '', label: 'Clases por semana' },
            { target: 5, suffix: '', label: 'Años de experiencia' },
            { target: 98, suffix: '%', label: 'Satisfacción' },
          ].map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 0.1} className="px-4 text-center">
              <p className="font-display text-5xl font-bold text-primary sm:text-[64px] sm:leading-none">
                <CounterAnimation target={stat.target} suffix={stat.suffix} />
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{stat.label}</p>
            </FadeIn>
          ))}
        </div>
      </Section>



      {/* ═══════════════════════════════════════════ TESTIMONIOS */}
      <TestimonialsStack />

      {/* ═══════════════════════════════════════════ FAQ */}
      <Section>
        <FadeIn>
          <SectionHeading title="Preguntas frecuentes" />
        </FadeIn>
        <div className="mx-auto max-w-[720px]">
          <FAQAccordion items={FAQS} />
        </div>
      </Section>

      {/* ═══════════════════════════════════════════ CTA FINAL */}
      <section className="bg-card py-16 sm:py-28">
        <div className={cn(PUBLIC_CONTAINER, 'flex flex-col items-center text-center')}>
          <FadeIn className="flex w-full flex-col items-center">
            <h2 className="max-w-2xl font-display text-2xl font-bold tracking-tight text-foreground sm:text-[2.75rem] sm:leading-tight">
              <GlowText text="¿Listo para empezar?" highlightWords={['empezar']} />
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Únete a la comunidad y reserva tu primera clase hoy mismo.
            </p>
            <MagneticButton className="mt-8 w-full sm:w-auto">
              <Button asChild size="lg" className="w-full">
                <Link href="/register">Únete al club</Link>
              </Button>
            </MagneticButton>
            <p className="mt-4 text-[13px] text-muted-foreground">
              Sin compromisos · Cancela cuando quieras
            </p>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
