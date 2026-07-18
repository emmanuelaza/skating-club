import { Truck, Shield, RefreshCw, Headphones } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: 'Envíos a todo el país',
    desc: 'Rápidos y seguros',
  },
  {
    icon: Shield,
    title: 'Pago 100% seguro',
    desc: 'Múltiples métodos de pago',
  },
  {
    icon: RefreshCw,
    title: 'Cambios fáciles',
    desc: '30 días para cambios',
  },
  {
    icon: Headphones,
    title: 'Atención experta',
    desc: 'Te ayudamos a elegir',
  },
];

export function TrustBand() {
  return (
    <div className="relative">
      {/* Top fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-10"
        style={{ background: 'linear-gradient(to bottom, #0A0A0A 0%, transparent 100%)' }}
      />

      <div className="bg-[#0D0D0D] py-14">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-8 px-6 sm:grid-cols-4">
          {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-3 text-center">
              <div
                className="flex size-12 items-center justify-center rounded-full"
                style={{ background: 'rgba(0,229,160,0.12)' }}
              >
                <Icon className="size-5 text-[#00E5A0]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#F5F5F5]">{title}</p>
                <p className="mt-0.5 text-xs text-[#888888]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10"
        style={{ background: 'linear-gradient(to top, #0A0A0A 0%, transparent 100%)' }}
      />
    </div>
  );
}
