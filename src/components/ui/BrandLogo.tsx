import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
}

export function BrandLogo({
  className,
  showText = true,
  size = 'md',
  href = '/',
  onClick,
}: BrandLogoProps) {
  const iconSizes = {
    sm: 'size-7 sm:size-8',
    md: 'size-9 sm:size-10',
    lg: 'size-12 sm:size-14',
  };

  const textSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
  };

  const content = (
    <div className={cn('inline-flex items-center gap-2.5 shrink-0 group', className)}>
      <div
        className={cn(
          'relative overflow-hidden rounded-full border border-[#8B5CF6]/40 bg-[#0A0A0A] shadow-[0_0_14px_rgba(139,92,246,0.3)] transition-all duration-300 group-hover:scale-105 group-hover:border-[#22D3EE]/50 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]',
          iconSizes[size]
        )}
      >
        <Image
          src="/logo.png"
          alt="Grandes Paisas"
          fill
          sizes="112px"
          className="object-cover rounded-full"
          priority
        />
      </div>
      {showText && (
        <span
          className={cn(
            'font-display font-black tracking-tight text-white transition-colors group-hover:text-[#8B5CF6]',
            textSizes[size]
          )}
        >
          Grandes Paisas
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} prefetch aria-label="Grandes Paisas - Inicio">
        {content}
      </Link>
    );
  }

  return content;
}
