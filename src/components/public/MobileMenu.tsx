'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { PUBLIC_NAV } from './nav-items';

/**
 * Menú mobile (<lg): botón hamburguesa que abre un drawer fullscreen con fondo
 * sólido #0A0A0A. Links apilados con texto grande y CTAs al final. Entra/sale
 * deslizando desde la derecha (x: 100% -> 0 -> 100%) con AnimatePresence.
 */
export function MobileMenu({ clubName }: { clubName: string }) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Bloquea el scroll del body mientras el drawer está abierto.
  React.useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Cierra al navegar a otra ruta.
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex size-11 items-center justify-center text-foreground lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="size-6" aria-hidden />
      </button>

      {mounted && typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  key="mobile-drawer"
                  className="fixed inset-0 z-[9999] flex flex-col bg-[#0A0A0A] lg:hidden"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="flex h-16 items-center justify-between px-6">
                    <BrandLogo onClick={() => setOpen(false)} />
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="flex size-11 items-center justify-center text-foreground"
                      aria-label="Cerrar menú"
                    >
                      <X className="size-6" aria-hidden />
                    </button>
                  </div>

                  <nav className="flex flex-1 flex-col justify-center gap-2 px-6">
                    {PUBLIC_NAV.map((item) => {
                      const path = item.href as string;
                      const active = path === '/' ? pathname === '/' : pathname.startsWith(path);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          prefetch
                          onClick={() => setOpen(false)}
                          className={cn(
                            'py-3 font-display text-3xl font-semibold tracking-tight transition-colors',
                            active ? 'text-primary' : 'text-foreground hover:text-primary',
                          )}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>

                  <div className="flex flex-col gap-3 px-6 pb-10">
                    <Button asChild variant="outline" size="lg" className="min-h-12 w-full">
                      <Link href="/login" onClick={() => setOpen(false)}>
                        Iniciar sesión
                      </Link>
                    </Button>
                    <Button asChild size="lg" className="min-h-12 w-full">
                      <Link href="/register" onClick={() => setOpen(false)}>
                        Únete
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </>
  );
}
