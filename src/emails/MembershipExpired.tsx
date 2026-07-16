import { Heading, Section, Text } from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';
import { EmailHeader } from './components/EmailHeader';
import { EmailFooter } from './components/EmailFooter';
import { EmailButton } from './components/EmailButton';
import { styles } from './components/styles';
import type { EmailTenant } from './components/styles';

interface MembershipExpiredProps {
  planName: string;
  tenant: EmailTenant;
}

export default function MembershipExpired({ planName, tenant }: MembershipExpiredProps) {
  return (
    <EmailLayout preview="Tu membresía ha vencido">
      <EmailHeader tenant={tenant} />
      <Section style={styles.content}>
        <Heading style={styles.heading}>Tu membresía ha vencido</Heading>
        <Text style={styles.paragraph}>
          Tu plan {planName} llegó a su fin. Renueva ahora para retomar tus clases en {tenant.name}.
        </Text>
        <Section style={{ margin: '8px 0 0' }}>
          <EmailButton href={`${tenant.url}/portal/membership`}>Renovar ahora</EmailButton>
        </Section>
      </Section>
      <EmailFooter tenant={tenant} />
    </EmailLayout>
  );
}
