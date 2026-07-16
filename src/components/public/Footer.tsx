import Link from 'next/link';
import type { Route } from 'next';
import { Snowflake, Instagram, Facebook, Music2, Mail, Phone, MapPin } from 'lucide-react';
import { PUBLIC_CONTAINER } from './Section';
import { cn } from '@/lib/utils';

const CLUB_LINKS: { label: string; href: Route }[] = [
  { label: 'Inicio', href: '/' as Route },
  { label: 'Nosotros', href: '/nosotros' as Route },
  { label: 'Clases', href: '/clases' as Route },
  { label: 'Blog', href: '/blog' as Route },
];

const PLAN_LINKS = ['Básico', 'Pro', 'Elite'];

const SOCIAL = [
  { label: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  { label: 'TikTok', icon: Music2, href: 'https://tiktok.com' },
  { label: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
];

export function Footer({ clubName = 'Skating Club' }: { clubName?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className={cn(PUBLIC_CONTAINER, 'grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4')}>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Snowflake className="size-5" aria-hidden />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              {clubName}
            </span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            El arte de rodar con precisión. Clases, comunidad y competencia para todos los niveles.
          </p>
          <div className="flex gap-3">
            {SOCIAL.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="size-4" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Club</h3>
          <ul className="space-y-2.5">
            {CLUB_LINKS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Membresías</h3>
          <ul className="space-y-2.5">
            {PLAN_LINKS.map((plan) => (
              <li key={plan}>
                <Link
                  href={'/planes' as Route}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {plan}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Contacto</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <a
                href="mailto:hola@skatingclub.co"
                className="flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Mail className="size-4 shrink-0" aria-hidden />
                hola@skatingclub.co
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" aria-hidden />
              +57 300 123 4567
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              Bogotá, Colombia
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className={cn(PUBLIC_CONTAINER, 'py-6')}>
          <p className="text-center text-xs text-muted-foreground">
            © {year} {clubName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
