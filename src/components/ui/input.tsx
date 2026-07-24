import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Input base. Borde por defecto `border-input` (#2A2A3A); el focus usa el ring
 * de acento (#8B5CF6) definido en el sistema de diseño.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // En mobile: alto 48px (touch target) y texto 16px para evitar el zoom
          // automático de iOS al enfocar. En sm+ vuelve a 40px / 14px.
          'flex h-12 w-full rounded-sm border border-input bg-background px-3 py-2 text-base text-foreground ring-offset-background transition-colors sm:h-10 sm:text-sm',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
