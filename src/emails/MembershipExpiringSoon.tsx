import { Heading, Section, Text } from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';
import { EmailHeader } from './components/EmailHeader';
import { EmailFooter } from './components/EmailFooter';
import { EmailButton } from './components/EmailButton';
import { EmailCard } from './components/EmailCard';
import { styles } from './components/styles';
import type { EmailTenant } from './components/styles';
import { formatDate } from '@/lib/format';

interface MembershipExpiringSoonProps {
  planName: string;
  endDate: string | null;
  daysLeft: number;
  tenant: EmailTenant;
}

export default function MembershipExpiringSoon({
  planName,
  endDate,
  daysLeft,
  tenant,
}: MembershipExpiringSoonProps) {
  return (
    <EmailLayout preview={`Tu membresía vence en ${daysLeft} días`}>
      <EmailHeader tenant={tenant} />
      <Section style={styles.content}>
        <Heading style={styles.heading}>
          Tu membresía vence en {daysLeft} {daysLeft === 1 ? 'día' : 'días'}
        </Heading>
        <Text style={styles.paragraph}>
          Renueva a tiempo para no perder el acceso a tus clases y beneficios.
        </Text>
        <EmailCard>
          <Text style={styles.label}>Plan</Text>
          <Text style={styles.value}>{planName}</Text>
          <Text style={styles.label}>Fecha de vencimiento</Text>
          <Text style={{ ...styles.value, marginBottom: 0 }}>{formatDate(endDate)}</Text>
        </EmailCard>
        <Section style={{ margin: '8px 0 0' }}>
          <EmailButton href={`${tenant.url}/portal/membership`}>Renovar membresía</EmailButton>
        </Section>
      </Section>
      <EmailFooter tenant={tenant} />
    </EmailLayout>
  );
}
