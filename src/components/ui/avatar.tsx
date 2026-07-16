import { cn } from '@/lib/utils';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

interface AvatarProps {
  name: string;
  src?: string | null;
  className?: string;
}

/**
 * Avatar simple: muestra la imagen si existe, o las iniciales del nombre.
 * Sin dependencia de Radix.
 */
export function Avatar({ name, src, className }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-xs font-medium text-secondary-foreground',
        className,
      )}
    >
      {src ? (
        // Avatares vienen de Supabase Storage con tamaño fijo; img basta aquí.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="size-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </span>
  );
}
