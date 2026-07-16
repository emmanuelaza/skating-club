import { Heading, Section, Text } from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';
import { EmailHeader } from './components/EmailHeader';
import { EmailFooter } from './components/EmailFooter';
import { EmailButton } from './components/EmailButton';
import { styles } from './components/styles';
import type { EmailTenant } from './components/styles';

interface EmailVerificationProps {
  confirmUrl: string;
  tenant: EmailTenant;
}

export default function EmailVerification({ confirmUrl, tenant }: EmailVerificationProps) {
  return (
    <EmailLayout preview="Verifica tu email">
      <EmailHeader tenant={tenant} />
      <Section style={styles.content}>
        <Heading style={styles.heading}>Verifica tu email</Heading>
        <Text style={styles.paragraph}>
          Confirma tu dirección de correo para activar tu cuenta en {tenant.name}.
        </Text>
        <Section style={{ margin: '8px 0 24px' }}>
          <EmailButton href={confirmUrl}>Verificar email</EmailButton>
        </Section>
        <Text style={styles.small}>Este enlace expira en 24 horas.</Text>
      </Section>
      <EmailFooter tenant={tenant} />
    </EmailLayout>
  );
}
