import { Hr, Link, Section, Text } from '@react-email/components';
import { colors, styles } from './styles';
import type { EmailTenant } from './styles';

export function EmailFooter({ tenant }: { tenant: EmailTenant }) {
  const year = new Date().getFullYear();
  return (
    <>
      <Hr style={{ borderColor: colors.border, margin: 0 }} />
      <Section style={{ padding: '24px 32px' }}>
        <Text style={{ ...styles.small, color: colors.text, fontWeight: 600 }}>{tenant.name}</Text>
        {tenant.supportEmail ? (
          <Text style={{ ...styles.small, margin: '4px 0 0' }}>
            <Link href={`mailto:${tenant.supportEmail}`} style={{ color: colors.textMuted }}>
              {tenant.supportEmail}
            </Link>
          </Text>
        ) : null}
        <Text style={{ ...styles.small, margin: '12px 0 0' }}>
          © {year} {tenant.name}. Recibes este correo por tu actividad en el club. Para dejar de
          recibirlos, escríbenos.
        </Text>
      </Section>
    </>
  );
}
