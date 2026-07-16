import { Dumbbell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CARD_HOVER } from './Section';
import { SpotlightCard } from './SpotlightCard';

interface ClassTypeCardProps {
  name: string;
  description?: string;
  level?: string;
  image?: string | null;
  durationMinutes?: number;
}

const LEVEL_LABELS: Record<string, string> = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
  todos: 'Todos los niveles',
};

export function ClassTypeCard({
  name,
  description,
  level,
  image,
  durationMinutes,
}: ClassTypeCardProps) {
  return (
    <SpotlightCard className="h-full">
      <Card className={cn('group h-full overflow-hidden', CARD_HOVER)}>
      <div className="flex aspect-video items-center justify-center overflow-hidden bg-secondary">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Dumbbell className="size-8 text-muted-foreground" aria-hidden />
        )}
      </div>
      <CardContent className="space-y-2 p-6">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-foreground">{name}</h3>
          {level ? <Badge variant="secondary">{LEVEL_LABELS[level] ?? level}</Badge> : null}
        </div>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        {durationMinutes ? (
          <p className="text-xs text-muted-foreground">{durationMinutes} min</p>
        ) : null}
      </CardContent>
      </Card>
    </SpotlightCard>
  );
}
