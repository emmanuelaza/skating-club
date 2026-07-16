import { Section } from '@react-email/components';
import { colors } from './styles';

export function EmailCard({ children }: { children: React.ReactNode }) {
  return (
    <Section
      style={{
        backgroundColor: colors.surfaceElevated,
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        padding: '20px',
        margin: '0 0 20px',
      }}
    >
      {children}
    </Section>
  );
}
