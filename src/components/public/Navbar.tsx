'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Snowflake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PUBLIC_NAV } from './nav-items';
import { PUBLIC_CONTAINER } from './Section';
import { MobileMenu } from './MobileMenu';

export function Navbar({ clubName = 'Skating Club' }: { clubName?: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300',
        scrolled
          ? 'border-border bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/60'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className={cn(PUBLIC_CONTAINER, 'flex h-16 items-center justify-between gap-4')}>
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Snowflake className="size-5" aria-hidden />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            {clubName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {PUBLIC_NAV.map((item) => {
            const path = item.href as string;
            const active = path === '/' ? pathname === '/' : pathname.startsWith(path);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Únete</Link>
          </Button>
        </div>

        <MobileMenu clubName={clubName} />
      </div>
    </header>
  );
}
