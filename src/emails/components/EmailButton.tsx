import { Button } from '@react-email/components';
import { colors, fontStack } from './styles';

export function EmailButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Button
      href={href}
      style={{
        backgroundColor: colors.accent,
        color: '#FFFFFF',
        fontFamily: fontStack,
        fontSize: '15px',
        fontWeight: 600,
        textDecoration: 'none',
        padding: '12px 24px',
        borderRadius: '6px',
        display: 'inline-block',
      }}
    >
      {children}
    </Button>
  );
}
