'use client';

import dynamic from 'next/dynamic';
import { useIsDesktop } from '@/hooks/useMediaQuery';

/**
 * Wrappers de carga de las escenas 3D: dynamic import con ssr:false y solo en
 * escritorio (evita coste en mobile/SSR). Las escenas usan Three.js puro.
 */

const FloatingParticles = dynamic(() => import('./FloatingParticles'), { ssr: false, loading: () => null });
const BackgroundShader = dynamic(() => import('./BackgroundShader'), { ssr: false, loading: () => null });
const InlineSkate = dynamic(() => import('./InlineSkate'), { ssr: false, loading: () => null });
const ParticleField = dynamic(() => import('./ParticleField'), { ssr: false, loading: () => null });

export function FloatingParticlesLazy({ className }: { className?: string }) {
  const isDesktop = useIsDesktop();
  if (!isDesktop) return null;
  return <FloatingParticles className={className} />;
}

export function BackgroundShaderLazy() {
  const isDesktop = useIsDesktop();
  if (!isDesktop) return null;
  return <BackgroundShader />;
}

export function InlineSkateLazy({ className }: { className?: string }) {
  const isDesktop = useIsDesktop();
  if (!isDesktop) return null;
  return <InlineSkate className={className} />;
}

export function ParticleFieldLazy({ className }: { className?: string }) {
  const isDesktop = useIsDesktop();
  if (!isDesktop) return null;
  return <ParticleField className={className} />;
}
