'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Snowflake, Search, User, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { PUBLIC_NAV } from './nav-items';
import { PUBLIC_CONTAINER } from './Section';
import { MobileMenu } from './MobileMenu';
import { useCart } from '@/components/store/CartProvider';

export function Navbar({ clubName = 'Grandes Paisas' }: { clubName?: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const isStore = pathname.startsWith('/tienda');
  const { openCart, itemCount } = useCart();

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
          ? 'border-[#222222] bg-[#0A0A0A]/80 backdrop-blur-md'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className={cn(PUBLIC_CONTAINER, 'flex h-16 items-center justify-between gap-4')}>
        {/* Logo */}
        <BrandLogo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {PUBLIC_NAV.map((item) => {
            const path = item.href as string;
            const active = path === '/' ? pathname === '/' : pathname.startsWith(path);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={cn(
                  'relative rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active ? 'text-primary' : 'text-[#888888] hover:text-[#F5F5F5]',
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="hidden items-center gap-2 lg:flex">
          {/* Search (store pages) */}
          {isStore && (
            <div className="relative flex items-center">
              {searchOpen ? (
                <input
                  autoFocus
                  placeholder="Buscar productos"
                  onBlur={() => setSearchOpen(false)}
                  className="h-8 w-48 rounded-md border border-[#222222] bg-[#111111] pl-3 pr-8 text-sm text-[#F5F5F5] placeholder-[#888888] outline-none focus:border-primary transition-colors"
                />
              ) : null}
              <button
                type="button"
                onClick={() => setSearchOpen((o) => !o)}
                className={cn(
                  'flex size-8 items-center justify-center rounded-md border border-[#222222] bg-[#111111] text-[#888888] transition-colors hover:border-primary hover:text-primary',
                  searchOpen && '-ml-8',
                )}
                aria-label="Buscar"
              >
                <Search className="size-4" />
              </button>
            </div>
          )}

          {/* User */}
          <Link
            href="/login"
            className="flex size-8 items-center justify-center rounded-md border border-[#222222] bg-[#111111] text-[#888888] transition-colors hover:border-primary hover:text-primary"
            aria-label="Mi cuenta"
          >
            <User className="size-4" />
          </Link>

          {/* Cart */}
          <button
            type="button"
            onClick={openCart}
            className="relative flex size-8 items-center justify-center rounded-md border border-[#222222] bg-[#111111] text-[#888888] transition-colors hover:border-primary hover:text-primary"
            aria-label="Carrito"
          >
            <ShoppingCart className="size-4" />
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile controls & Menu */}
        <div className="flex items-center gap-1 lg:hidden">
          {/* Cart (Mobile) */}
          <button
            type="button"
            onClick={openCart}
            className="relative flex size-11 items-center justify-center rounded-md text-[#888888] transition-colors hover:text-primary"
            aria-label="Carrito"
          >
            <ShoppingCart className="size-5" />
            {itemCount > 0 && (
              <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </button>
          
          <MobileMenu clubName={clubName} />
        </div>
      </div>
    </header>
  );
}
