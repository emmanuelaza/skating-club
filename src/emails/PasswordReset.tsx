import { Heading, Section, Text } from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';
import { EmailHeader } from './components/EmailHeader';
import { EmailFooter } from './components/EmailFooter';
import { EmailButton } from './components/EmailButton';
import { styles } from './components/styles';
import type { EmailTenant } from './components/styles';

interface PasswordResetProps {
  resetUrl: string;
  tenant: EmailTenant;
}

export default function PasswordReset({ resetUrl, tenant }: PasswordResetProps) {
  return (
    <EmailLayout preview="Restablecer contraseña">
      <EmailHeader tenant={tenant} />
      <Section style={styles.content}>
        <Heading style={styles.heading}>Restablecer contraseña</Heading>
        <Text style={styles.paragraph}>
          Recibimos una solicitud para restablecer la contraseña de tu cuenta en {tenant.name}.
        </Text>
        <Section style={{ margin: '8px 0 24px' }}>
          <EmailButton href={resetUrl}>Restablecer contraseña</EmailButton>
        </Section>
        <Text style={{ ...styles.small, margin: '0 0 6px' }}>Este enlace expira en 1 hora.</Text>
        <Text style={styles.small}>Si no solicitaste esto, ignora este mensaje.</Text>
      </Section>
      <EmailFooter tenant={tenant} />
    </EmailLayout>
  );
}
