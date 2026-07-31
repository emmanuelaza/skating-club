import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CARD_HOVER } from './Section';
import { SpotlightCard } from './SpotlightCard';
import { priceLabel, type ClubCategory } from '@/lib/club-data';

/**
 * Card de categoría para el grid público. Muestra solo nombre, descripción
 * corta y precio desde; el detalle completo vive en /clases/[slug].
 */
export function CategoryCard({ category }: { category: ClubCategory }) {
  return (
    <SpotlightCard className="h-full">
      <Link href={`/clases/${category.slug}` as Route} className="block h-full">
        <Card className={cn('group flex h-full flex-col overflow-hidden', CARD_HOVER)}>
          <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <Badge variant="secondary" className="absolute left-4 top-4">
              {category.stage}
            </Badge>
          </div>

          <div className="flex flex-1 flex-col gap-3 p-6">
            <h3 className="font-display text-xl font-bold leading-tight text-foreground">
              {category.name}
            </h3>
            <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
              {category.shortDesc}
            </p>
            <div className="mt-1 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm font-semibold text-primary">{priceLabel(category)}</span>
              <ArrowRight
                className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
                aria-hidden
              />
            </div>
          </div>
        </Card>
      </Link>
    </SpotlightCard>
  );
}
