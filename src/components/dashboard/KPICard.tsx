import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn } from '@/components/animations/FadeIn';
import { CounterAnimation } from '@/components/animations/CounterAnimation';
import { SpotlightCard } from '@/components/public/SpotlightCard';
import { cn } from '@/lib/utils';

interface KPICardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  /** Variación porcentual vs. mes anterior. null oculta el delta. */
  delta?: number | null;
  /** Posición en la grilla, para escalonar la entrada. */
  index?: number;
  /** Si se provee, anima el número con CounterAnimation. */
  countTo?: number;
  countFormat?: 'number' | 'cop';
}

export function KPICard({
  label,
  value,
  icon: Icon,
  delta,
  index = 0,
  countTo,
  countFormat = 'number',
}: KPICardProps) {
  const showDelta = typeof delta === 'number' && Number.isFinite(delta);
  const positive = (delta ?? 0) >= 0;

  return (
    <FadeIn delay={index * 0.08}>
      <SpotlightCard className="h-full rounded-xl">
        <Card className="h-full border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
            </div>
            <div className="mt-3 flex items-end justify-between gap-2">
              <span className="font-display text-3xl font-semibold text-foreground">
                {countTo !== undefined ? (
                  <CounterAnimation target={countTo} format={countFormat} duration={1.2} />
                ) : (
                  value
                )}
              </span>
            {showDelta ? (
              <span
                className={cn(
                  'flex items-center gap-0.5 text-sm font-medium',
                  positive ? 'text-success' : 'text-destructive',
                )}
              >
                {positive ? (
                  <ArrowUpRight className="size-4" aria-hidden />
                ) : (
                  <ArrowDownRight className="size-4" aria-hidden />
                )}
                {Math.abs(delta ?? 0).toFixed(1)}%
              </span>
            ) : null}
          </div>
            {showDelta ? (
              <p className="mt-1 text-xs text-muted-foreground">vs. mes anterior</p>
            ) : null}
          </CardContent>
        </Card>
      </SpotlightCard>
    </FadeIn>
  );
}
