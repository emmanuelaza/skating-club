import type { Metadata, Viewport } from 'next';
import { Inter, Syne, JetBrains_Mono } from 'next/font/google';
import ClientProviders from '@/components/ClientProviders';
import './globals.css';

// Body / UI
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// Display / headings
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

// Mono
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Skating Club',
    template: '%s · Skating Club',
  },
  description: 'Plataforma multi-sede para clubes de patinaje.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Skating Club',
  },
};

export const viewport: Viewport = {
  // #0A0A0A — tema oscuro por defecto.
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable} font-sans`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
