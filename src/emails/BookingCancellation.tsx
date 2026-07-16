import { Heading, Section, Text } from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';
import { EmailHeader } from './components/EmailHeader';
import { EmailFooter } from './components/EmailFooter';
import { EmailButton } from './components/EmailButton';
import { EmailCard } from './components/EmailCard';
import { styles } from './components/styles';
import type { EmailTenant } from './components/styles';
import { formatDate, formatTime } from '@/lib/format';

interface BookingCancellationProps {
  classType: string;
  startsAt: string;
  tenant: EmailTenant;
}

export default function BookingCancellation({
  classType,
  startsAt,
  tenant,
}: BookingCancellationProps) {
  return (
    <EmailLayout preview={`Reserva cancelada · ${classType}`}>
      <EmailHeader tenant={tenant} />
      <Section style={styles.content}>
        <Heading style={styles.heading}>Tu reserva fue cancelada</Heading>
        <Text style={styles.paragraph}>
          Cancelamos tu reserva para la siguiente clase. Puedes reservar otra cuando quieras.
        </Text>
        <EmailCard>
          <Text style={styles.label}>Clase</Text>
          <Text style={styles.value}>{classType}</Text>
          <Text style={styles.label}>Fecha</Text>
          <Text style={{ ...styles.value, marginBottom: 0 }}>
            {formatDate(startsAt)} · {formatTime(startsAt)}
          </Text>
        </EmailCard>
        <Section style={{ margin: '8px 0 0' }}>
          <EmailButton href={`${tenant.url}/portal/classes`}>Reservar otra clase</EmailButton>
        </Section>
      </Section>
      <EmailFooter tenant={tenant} />
    </EmailLayout>
  );
}
