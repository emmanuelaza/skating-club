import { Heading, Section, Text } from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';
import { EmailHeader } from './components/EmailHeader';
import { EmailFooter } from './components/EmailFooter';
import { EmailButton } from './components/EmailButton';
import { EmailCard } from './components/EmailCard';
import { styles } from './components/styles';
import type { EmailTenant } from './components/styles';
import { formatDate, formatTime } from '@/lib/format';

interface BookingConfirmationProps {
  classType: string;
  instructor: string | null;
  location: string | null;
  startsAt: string;
  durationMinutes: number;
  tenant: EmailTenant;
}

export default function BookingConfirmation({
  classType,
  instructor,
  location,
  startsAt,
  durationMinutes,
  tenant,
}: BookingConfirmationProps) {
  return (
    <EmailLayout preview={`Reserva confirmada · ${classType}`}>
      <EmailHeader tenant={tenant} />
      <Section style={styles.content}>
        <Heading style={styles.heading}>Reserva confirmada</Heading>
        <Text style={styles.paragraph}>
          Te esperamos el {formatDate(startsAt)} a las {formatTime(startsAt)}.
        </Text>
        <EmailCard>
          <Text style={styles.label}>Clase</Text>
          <Text style={styles.value}>{classType}</Text>
          <Text style={styles.label}>Instructor</Text>
          <Text style={styles.value}>{instructor ?? 'Por asignar'}</Text>
          <Text style={styles.label}>Sala</Text>
          <Text style={styles.value}>{location ?? 'Por confirmar'}</Text>
          <Text style={styles.label}>Duración</Text>
          <Text style={{ ...styles.value, marginBottom: 0 }}>{durationMinutes} min</Text>
        </EmailCard>
        <Text style={styles.paragraph}>Recuerda llegar 10 minutos antes para prepararte.</Text>
        <Section style={{ margin: '8px 0 0' }}>
          <EmailButton href={`${tenant.url}/portal/classes/my-bookings`}>Ver mis reservas</EmailButton>
        </Section>
      </Section>
      <EmailFooter tenant={tenant} />
    </EmailLayout>
  );
}
