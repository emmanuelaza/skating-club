import { Heading, Section, Text } from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';
import { EmailHeader } from './components/EmailHeader';
import { EmailFooter } from './components/EmailFooter';
import { colors, styles } from './components/styles';
import type { EmailTenant } from './components/styles';
import { formatDate, formatTime } from '@/lib/format';

interface PasswordChangedProps {
  name: string;
  changedAt: string;
  tenant: EmailTenant;
}

export default function PasswordChanged({ name, changedAt, tenant }: PasswordChangedProps) {
  return (
    <EmailLayout preview="Tu contraseña fue cambiada">
      <EmailHeader tenant={tenant} />
      <Section style={styles.content}>
        <Heading style={styles.heading}>Tu contraseña fue cambiada</Heading>
        <Text style={styles.paragraph}>
          Hola {name}, te confirmamos que la contraseña de tu cuenta se actualizó el{' '}
          {formatDate(changedAt)} a las {formatTime(changedAt)}.
        </Text>
        <Text style={{ ...styles.paragraph, color: colors.text }}>
          Si no fuiste tú, contáctanos inmediatamente
          {tenant.supportEmail ? ` a ${tenant.supportEmail}` : ''}.
        </Text>
      </Section>
      <EmailFooter tenant={tenant} />
    </EmailLayout>
  );
}
