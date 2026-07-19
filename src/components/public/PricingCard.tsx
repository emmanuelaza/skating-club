import Link from 'next/link';
import type { Route } from 'next';
import { Check } from 'lucide-react';
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
          'relative flex h-full flex-col rounded-lg border bg-[#111111] p-6 sm:p-8 transition-colors duration-200',
          recommended
            ? 'border-primary/50 shadow-[0_8px_32px_rgba(0,229,160,0.12)]'
            : 'border-[#222222] hover:border-primary/30',
        )}
      >
        {/* Badge "Más popular" */}
        {recommended && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="whitespace-nowrap rounded-full bg-primary px-3 py-1 text-xs font-bold text-black">
              Más popular
            </span>
          </div>
        )}

        {/* Nombre del plan */}
        <h3 className="font-display text-xl font-bold text-foreground">{name}</h3>

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
              ? 'bg-primary text-black hover:bg-[#00C988]'
              : 'border border-[#333333] text-foreground hover:border-primary hover:text-primary',
          )}
        >
          {ctaLabel}
        </Link>
      </div>
    </SpotlightCard>
  );
}
