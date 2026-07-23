import Link from 'next/link';
import type { Route } from 'next';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SpotlightCard } from './SpotlightCard';

interface PricingCardProps {
  name: string;
  description: string;
  monthlyPrice: number;
  isAnnual: boolean;
  features: string[];
  recommended?: boolean;
  ctaHref: Route;
  ctaLabel?: string;
}

const formatCOP = (price: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);

export function PricingCard({
  name,
  description,
  monthlyPrice,
  isAnnual,
  features,
  recommended = false,
  ctaHref,
  ctaLabel = 'Comenzar ahora',
}: PricingCardProps) {
  const displayPrice = isAnnual ? Math.round(monthlyPrice * 0.8) : monthlyPrice;
  const annualSaving = (monthlyPrice - displayPrice) * 12;

  return (
    <SpotlightCard className="h-full">
      <div
        className={cn(
          'relative flex h-full flex-col rounded-lg p-6 sm:p-8 transition-colors duration-200',
          recommended
            ? 'border border-transparent bg-[linear-gradient(to_bottom,#111,#111),_linear-gradient(to_bottom,#a78bfa,#22d3ee)] bg-origin-border bg-clip-content,border-box shadow-[0_8px_32px_rgba(167,139,250,0.15)]'
            : 'border border-[#222222] bg-[#111111] hover:border-primary/30',
        )}
      >
        {/* Header con nombre del plan y badge integrado */}
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-xl font-bold text-foreground">{name}</h3>
          {recommended && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500/15 to-cyan-500/15 border border-cyan-400/30 px-3 py-1 text-xs font-semibold text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.15)] backdrop-blur-sm">
              <Sparkles className="size-3 text-cyan-400" />
              Más popular
            </span>
          )}
        </div>

        {/* Descripción corta */}
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>

        {/* Precio */}
        <div className="mt-6 mb-6">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span
              className="font-display font-black text-primary transition-all duration-300 leading-none"
              style={{ fontSize: 'clamp(1.35rem, 5.5vw, 2rem)' }}
            >
              {formatCOP(displayPrice)}
            </span>
            <span className="text-sm text-muted-foreground whitespace-nowrap">/mes</span>
          </div>
          <div
            className={cn(
              'overflow-hidden transition-all duration-300',
              isAnnual ? 'mt-1 max-h-8 opacity-100' : 'max-h-0 opacity-0',
            )}
          >
            <p className="text-xs text-primary/80">
              Ahorras {formatCOP(annualSaving)} al año
            </p>
          </div>
        </div>

        {/* Separador */}
        <div className="mb-6 h-px bg-[#222222]" />

        {/* Beneficios */}
        <ul className="mb-8 flex flex-1 flex-col gap-3">
          {features.map((feature, i) => (
            <li key={`${feature}-${i}`} className="flex items-start gap-3 text-sm">
              <Check className="mt-0.5 size-4 flex-shrink-0 text-primary" aria-hidden />
              <span className="leading-snug text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA al fondo */}
        <Link
          href={ctaHref}
          className={cn(
            'block w-full rounded-md py-3 text-center text-sm font-semibold transition-colors duration-200',
            recommended
              ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:from-violet-600 hover:to-cyan-600'
              : 'border border-[#333333] text-foreground hover:border-primary hover:text-primary',
          )}
        >
          {ctaLabel}
        </Link>
      </div>
    </SpotlightCard>
  );
}
