import Link from 'next/link';
import type { Route } from 'next';
import { FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { CARD_HOVER } from './Section';
import { SpotlightCard } from './SpotlightCard';

interface BlogCardProps {
  title: string;
  href: Route;
  category?: string;
  image?: string | null;
  publishedAt?: string;
  excerpt?: string;
  readingMinutes?: number;
}

export function BlogCard({
  title,
  href,
  category,
  image,
  publishedAt,
  excerpt,
  readingMinutes,
}: BlogCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <SpotlightCard className="h-full">
        <Card className={cn('h-full overflow-hidden', CARD_HOVER)}>
        <div className="flex aspect-video items-center justify-center overflow-hidden bg-secondary">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={title}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <FileText className="size-8 text-muted-foreground" aria-hidden />
          )}
        </div>
        <CardContent className="space-y-2 p-6">
          <div className="flex items-center gap-2">
            {category ? <Badge variant="secondary">{category}</Badge> : null}
            {publishedAt ? (
              <span className="text-xs text-muted-foreground">{formatDate(publishedAt)}</span>
            ) : null}
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
          {excerpt ? <p className="line-clamp-2 text-sm text-muted-foreground">{excerpt}</p> : null}
          {readingMinutes ? (
            <p className="text-xs text-muted-foreground">{readingMinutes} min de lectura</p>
          ) : null}
        </CardContent>
        </Card>
      </SpotlightCard>
    </Link>
  );
}
