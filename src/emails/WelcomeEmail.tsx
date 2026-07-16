import { Heading, Section, Text } from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';
import { EmailHeader } from './components/EmailHeader';
import { EmailFooter } from './components/EmailFooter';
import { EmailButton } from './components/EmailButton';
import { styles } from './components/styles';
import type { EmailTenant } from './components/styles';

interface WelcomeEmailProps {
  name: string;
  tenant: EmailTenant;
}

const STEPS = [
  'Completa tu perfil con tus datos de contacto.',
  'Reserva tu primera clase desde el portal.',
  'Explora los planes de membresía y elige el tuyo.',
];

export default function WelcomeEmail({ name, tenant }: WelcomeEmailProps) {
  return (
    <EmailLayout preview={`Bienvenido/a a ${tenant.name}`}>
      <EmailHeader tenant={tenant} />
      <Section style={styles.content}>
        <Heading style={styles.heading}>Bienvenido/a, {name}</Heading>
        <Text style={styles.paragraph}>
          Tu cuenta en {tenant.name} está lista. Nos alegra tenerte en la comunidad: aquí
          encontrarás clases para todos los niveles y todo lo que necesitas para avanzar.
        </Text>
        <Section style={{ margin: '8px 0 28px' }}>
          <EmailButton href={`${tenant.url}/portal`}>Ir al portal</EmailButton>
        </Section>
        <Text style={{ ...styles.value, margin: '0 0 12px' }}>Próximos pasos</Text>
        {STEPS.map((step, index) => (
          <Text key={step} style={{ ...styles.paragraph, margin: '0 0 8px' }}>
            {index + 1}. {step}
          </Text>
        ))}
      </Section>
      <EmailFooter tenant={tenant} />
    </EmailLayout>
  );
}
