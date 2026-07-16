import { Snowflake } from 'lucide-react';
import { getCurrentTenant } from '@/lib/tenant';

/**
 * Layout de autenticación: centra una columna de 400px sobre el fondo oscuro
 * (#0A0A0F) y muestra el nombre de la sede sobre la card.
 */
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const tenant = await getCurrentTenant();
  const clubName = tenant?.name ?? 'Skating Club';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-3 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Snowflake className="size-6" aria-hidden />
          </span>
          <span className="font-display text-xl font-semibold text-foreground">{clubName}</span>
        </div>
        {children}
      </div>
    </main>
  );
}
