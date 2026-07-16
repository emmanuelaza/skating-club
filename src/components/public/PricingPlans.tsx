'use client';

import * as React from 'react';
import type { Route } from 'next';
import { PricingCard } from './PricingCard';
import { FadeIn } from '@/components/animations/FadeIn';
import { cn } from '@/lib/utils';

export interface PublicPlan {
  id: string;
  name: string;
  description: string;
  priceCop: number;
  interval: 'month' | 'year';
  features: string[];
  recommended: boolean;
}

/** Grilla de planes con toggle mensual/anual (descuento visual del 20%). */
export function PricingPlans({ plans }: { plans: PublicPlan[] }) {
  const [annual, setAnnual] = React.useState(false);

  return (
    <div className="space-y-8">
      {/* Toggle mensual / anual */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm font-medium transition-colors ${!annual ? 'text-primary' : 'text-muted-foreground'}`}>
          Mensual
        </span>

        <button
          onClick={() => setAnnual(!annual)}
          className={`relative h-7 w-14 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${annual ? 'bg-primary' : 'bg-[#222222]'}`}
          role="switch"
          aria-checked={annual}
          aria-label="Cambiar periodo de facturación"
        >
          <span
            className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all duration-300 ${annual ? 'left-8' : 'left-1'}`}
          />
        </button>

        <span className={`text-sm font-medium transition-colors ${annual ? 'text-primary' : 'text-muted-foreground'}`}>
          Anual{' '}
          <span className="ml-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
            -20%
          </span>
        </span>
      </div>

      {/* Grid de planes */}
      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
        {plans.map((plan, index) => (
          <FadeIn
            key={plan.id}
            delay={index * 0.1}
            className={cn(plan.recommended && 'order-first md:order-none')}
          >
            <PricingCard
              name={plan.name}
              description={plan.description}
              monthlyPrice={plan.priceCop}
              isAnnual={annual}
              features={plan.features}
              recommended={plan.recommended}
              ctaHref={'/register' as Route}
            />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
