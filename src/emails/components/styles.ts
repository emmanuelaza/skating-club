import type { CSSProperties } from 'react';

/** Datos del tenant que reciben las plantillas (header/footer/CTAs). */
export interface EmailTenant {
  name: string;
  logoUrl?: string | null;
  supportEmail?: string;
  /** URL absoluta base de la app, para construir los enlaces de los botones. */
  url: string;
}

/** Paleta del sistema de diseño, en hex (los emails requieren estilos inline). */
export const colors = {
  bg: '#0A0A0A',
  surface: '#111111',
  surfaceElevated: '#1A1A1A',
  border: '#222222',
  accent: '#00E5A0',
  accentHover: '#00C988',
  text: '#F5F5F5',
  textMuted: '#888888',
  success: '#22C55E',
  danger: '#EF4444',
} as const;

/** Email no soporta Google Fonts: stack de sistema. */
export const fontStack =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export const styles: Record<string, CSSProperties> = {
  body: {
    backgroundColor: colors.bg,
    margin: 0,
    padding: '24px 0',
    fontFamily: fontStack,
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: colors.surface,
    borderRadius: '8px',
    overflow: 'hidden',
    border: `1px solid ${colors.border}`,
  },
  content: {
    padding: '32px',
  },
  heading: {
    color: colors.text,
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: '32px',
    margin: '0 0 12px',
  },
  paragraph: {
    color: colors.textMuted,
    fontSize: '15px',
    lineHeight: '24px',
    margin: '0 0 16px',
  },
  small: {
    color: colors.textMuted,
    fontSize: '13px',
    lineHeight: '20px',
    margin: 0,
  },
  label: {
    color: colors.textMuted,
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    margin: '0 0 2px',
  },
  value: {
    color: colors.text,
    fontSize: '15px',
    fontWeight: 600,
    margin: '0 0 12px',
  },
};
