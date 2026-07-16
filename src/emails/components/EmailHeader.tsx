import { Img, Section, Text } from '@react-email/components';
import { colors } from './styles';
import type { EmailTenant } from './styles';

export function EmailHeader({ tenant }: { tenant: EmailTenant }) {
  return (
    <Section style={{ padding: '24px 32px', borderBottom: `1px solid ${colors.border}` }}>
      {tenant.logoUrl ? (
        <Img src={tenant.logoUrl} alt={tenant.name} height={32} style={{ maxHeight: '32px' }} />
      ) : (
        <Text style={{ margin: 0, color: colors.text, fontSize: '18px', fontWeight: 700 }}>
          {tenant.name}
        </Text>
      )}
    </Section>
  );
}
