import { Heading, Section, Text } from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';
import { EmailHeader } from './components/EmailHeader';
import { EmailFooter } from './components/EmailFooter';
import { EmailButton } from './components/EmailButton';
import { EmailCard } from './components/EmailCard';
import { colors, styles } from './components/styles';
import type { EmailTenant } from './components/styles';
import { formatDate } from '@/lib/format';

interface MembershipActivatedProps {
  planName: string;
  startDate: string | null;
  endDate: string | null;
  benefits: string[];
  tenant: EmailTenant;
}

export default function MembershipActivated({
  planName,
  startDate,
  endDate,
  benefits,
  tenant,
}: MembershipActivatedProps) {
  return (
    <EmailLayout preview="Tu membresía está activa">
      <EmailHeader tenant={tenant} />
      <Section style={styles.content}>
        <Heading style={styles.heading}>¡Tu membresía está activa!</Heading>
        <Text style={styles.paragraph}>
          Ya puedes disfrutar de todos los beneficios de tu plan en {tenant.name}.
        </Text>
        <EmailCard>
          <Text style={styles.label}>Plan</Text>
          <Text style={styles.value}>{planName}</Text>
          <Text style={styles.label}>Inicio</Text>
          <Text style={styles.value}>{formatDate(startDate)}</Text>
          <Text style={styles.label}>Vence</Text>
          <Text style={{ ...styles.value, marginBottom: benefits.length > 0 ? 12 : 0 }}>
            {formatDate(endDate)}
          </Text>
          {benefits.length > 0 ? (
            <>
              <Text style={styles.label}>Beneficios</Text>
              {benefits.map((benefit) => (
                <Text key={benefit} style={{ ...styles.value, fontWeight: 400, margin: '0 0 4px' }}>
                  <span style={{ color: colors.accent }}>•</span> {benefit}
                </Text>
              ))}
            </>
          ) : null}
        </EmailCard>
        <Section style={{ margin: '8px 0 0' }}>
          <EmailButton href={`${tenant.url}/portal`}>Ir al portal</EmailButton>
        </Section>
      </Section>
      <EmailFooter tenant={tenant} />
    </EmailLayout>
  );
}
