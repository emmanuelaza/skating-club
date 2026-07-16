import { Body, Container, Head, Html, Preview } from '@react-email/components';
import { styles } from './styles';

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
}

/** Envoltura base: fondo oscuro, contenedor 600px centrado, estilos inline. */
export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>{children}</Container>
      </Body>
    </Html>
  );
}
