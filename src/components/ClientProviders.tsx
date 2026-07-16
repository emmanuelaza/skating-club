'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { ReactLenisProvider } from '@/lib/animations/lenis';

const PageLoader = dynamic(() => import('@/components/PageLoader'), { ssr: false });

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageLoader />
      <ReactLenisProvider>{children}</ReactLenisProvider>
    </>
  );
}
