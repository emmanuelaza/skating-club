# Skating Club — Plataforma multi-sede

Plataforma para clubes de patinaje con arquitectura multi-tenant (una sede = un
tenant), construida sobre Next.js 15 y Supabase.

## Stack

- **Framework**: Next.js 15 (App Router) + TypeScript estricto
- **Base de datos / Auth / Storage**: Supabase (PostgreSQL + RLS)
- **UI**: Tailwind CSS + shadcn/ui (tema personalizado "hielo")
- **Formularios**: react-hook-form + zod
- **Pagos**: Wompi (Colombia) — capa desacoplada, Stripe como esqueleto
- **CMS**: Sanity.io v3
- **Email**: Resend + React Email
- **Iconos**: lucide-react (sin emojis en la UI)

## Animaciones y 3D

- **three.js + @react-three/fiber + @react-three/drei** — escenas 3D en hero y secciones
- **framer-motion** — animaciones de componentes y transiciones de página
- **lenis** — smooth scroll global
- **gsap + @gsap/react** — animaciones de texto y scroll-triggered

### Usos específicos
- Hero del sitio público: escena 3D con patín o pista abstracta
- Dashboard: micro-animaciones en KPIs y cards con framer-motion
- Transiciones entre páginas: fade + slide con framer-motion
- Títulos grandes: animación de entrada letra por letra con GSAP
- Scroll del sitio público: parallax con GSAP ScrollTrigger

## Puesta en marcha

```bash
npm install
cp .env.example .env        # completar variables
npm run dev
```

App en http://localhost:3000.

## Scripts

| Script               | Descripción                          |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Servidor de desarrollo               |
| `npm run build`      | Build de producción                  |
| `npm run start`      | Servir el build                      |
| `npm run lint`       | ESLint                               |
| `npm run typecheck`  | `tsc --noEmit`                       |
| `npm run format`     | Prettier (escribe)                   |

## Arquitectura

### Multi-sede (tenancy)

Cada sede es un tenant. Todas las tablas de negocio llevan `tenant_id uuid NOT
NULL` con RLS activo. El tenant se resuelve en el middleware:

1. **Subdominio**: `bogota.clubx.com` → slug `bogota` → lookup en DB.
2. **Cookie `tenant_id`**: para fijar la sede en desarrollo local.

- `src/middleware.ts` — refresca sesión Supabase + escribe `x-tenant-slug`.
- `src/lib/tenant/index.ts` — parseo de host y lookup de tenant.
- `src/lib/tenant/context.ts` — `getCurrentTenant()` para Server Components.

### Pagos (desacoplados)

Nunca se llama a Wompi/Stripe directamente desde componentes o Server Actions.
Todo pasa por la interfaz única `PaymentProvider`:

```ts
import { getPaymentProvider } from '@/lib/payments';

const provider = getPaymentProvider(); // según PAYMENT_PROVIDER
const checkout = await provider.createCheckout(params);
```

- `src/lib/payments/index.ts` — selector de proveedor activo.
- `src/lib/payments/types.ts` — contratos (`PaymentProvider`, tipos, errores).
- `src/lib/payments/wompi.ts` — implementación real (llaves vía `.env`).
- `src/lib/payments/stripe.ts` — esqueleto para expansión internacional.

Cuando lleguen las credenciales de Wompi solo se completan las variables
`WOMPI_*` del `.env`; el código no cambia.

## Estructura

```
src/
  app/                 # App Router (layout, page, globals.css)
  components/ui/        # Primitivos shadcn/ui
  lib/
    env.ts             # Validación de variables de entorno (zod)
    utils.ts           # cn()
    supabase/          # Clientes browser / server / middleware + tipos DB
    tenant/            # Resolución multi-sede
    payments/          # Capa de pagos desacoplada
  middleware.ts        # Sesión + resolución de tenant
```

## Próximos pasos

- Migraciones SQL del esquema multi-tenant con RLS.
- Flujo de autenticación (login / registro) por sede.
- Panel de administración por sede.
- Integración Treli para suscripciones.
- Configuración de Sanity y Resend.


