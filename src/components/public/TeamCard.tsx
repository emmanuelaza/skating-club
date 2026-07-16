import { User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CARD_HOVER } from './Section';
import { SpotlightCard } from './SpotlightCard';

interface TeamCardProps {
  name: string;
  photo?: string | null;
  bio?: string;
  specialty?: string;
}

export function TeamCard({ name, photo, bio, specialty }: TeamCardProps) {
  return (
    <SpotlightCard className="h-full">
      <Card className={cn('group relative h-full overflow-hidden text-center', CARD_HOVER)}>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-primary/0 transition-colors duration-200 group-hover:bg-primary/[0.06]"
        />
      <CardContent className="relative flex flex-col items-center gap-2 p-6">
        <span className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-secondary text-muted-foreground ring-2 ring-border transition-all duration-200 group-hover:ring-primary">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt={name} className="size-full object-cover" />
          ) : (
            <User className="size-10" aria-hidden />
          )}
        </span>
        <h3 className="mt-2 font-display text-base font-semibold text-foreground">{name}</h3>
        {specialty ? <p className="text-sm text-muted-foreground">{specialty}</p> : null}
        {bio ? <p className="line-clamp-3 text-sm text-muted-foreground">{bio}</p> : null}
      </CardContent>
      </Card>
    </SpotlightCard>
  );
}
