import { Quote, Star, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CARD_HOVER } from './Section';

export interface TestimonialItem {
  id: string;
  name: string;
  photo?: string | null;
  text?: string;
  plan?: string;
  rating?: number;
}

/** Carrusel con scroll-snap CSS (sin librería ni JS). */
export function TestimonialCarousel({ items }: { items: TestimonialItem[] }) {
  return (
    <div className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4">
      {items.map((item) => (
        <Card key={item.id} className={cn('relative w-[340px] shrink-0 snap-center', CARD_HOVER)}>
          <Quote
            className="absolute right-5 top-5 size-12 text-primary/20"
            aria-hidden
          />
          <CardContent className="relative space-y-4 p-6">
            {item.rating ? (
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={cn(
                      'size-4',
                      index < (item.rating ?? 0)
                        ? 'fill-warning text-warning'
                        : 'text-muted-foreground',
                    )}
                    aria-hidden
                  />
                ))}
              </div>
            ) : null}
            {item.text ? (
              <p className="text-sm leading-relaxed text-foreground">“{item.text}”</p>
            ) : null}
            <div className="flex items-center gap-3 pt-2">
              <span className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-secondary text-muted-foreground">
                {item.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.photo} alt={item.name} className="size-full object-cover" />
                ) : (
                  <User className="size-4" aria-hidden />
                )}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                {item.plan ? (
                  <Badge variant="secondary" className="mt-1">
                    {item.plan}
                  </Badge>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
