import { Column, Heading, Hr, Row, Section, Text } from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';
import { EmailHeader } from './components/EmailHeader';
import { EmailFooter } from './components/EmailFooter';
import { EmailButton } from './components/EmailButton';
import { colors, styles } from './components/styles';
import type { EmailTenant } from './components/styles';
import { formatCOP } from '@/lib/format';

export interface OrderEmailItem {
  name: string;
  variant: string;
  quantity: number;
  price_cop: number;
}

interface OrderConfirmationProps {
  orderRef: string;
  items: OrderEmailItem[];
  totalCop: number;
  shippingAddress?: string | null;
  tenant: EmailTenant;
}

const cellText: React.CSSProperties = { color: colors.text, fontSize: '14px', margin: 0 };
const headText: React.CSSProperties = {
  color: colors.textMuted,
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  margin: 0,
};

export default function OrderConfirmation({
  orderRef,
  items,
  totalCop,
  shippingAddress,
  tenant,
}: OrderConfirmationProps) {
  return (
    <EmailLayout preview={`Pedido confirmado #${orderRef}`}>
      <EmailHeader tenant={tenant} />
      <Section style={styles.content}>
        <Heading style={styles.heading}>Pedido confirmado #{orderRef}</Heading>
        <Text style={styles.paragraph}>Recibimos tu pedido. Aquí está el resumen.</Text>

        <Section
          style={{
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '16px 20px',
            margin: '0 0 16px',
          }}
        >
          <Row>
            <Column style={{ width: '55%' }}>
              <Text style={headText}>Producto</Text>
            </Column>
            <Column style={{ width: '15%', textAlign: 'center' }}>
              <Text style={headText}>Cant.</Text>
            </Column>
            <Column style={{ width: '30%', textAlign: 'right' }}>
              <Text style={headText}>Precio</Text>
            </Column>
          </Row>
          <Hr style={{ borderColor: colors.border, margin: '10px 0' }} />
          {items.map((item, index) => (
            <Row key={`${item.name}-${index}`} style={{ marginBottom: '8px' }}>
              <Column style={{ width: '55%' }}>
                <Text style={cellText}>{item.name}</Text>
                <Text style={{ ...headText, textTransform: 'none', margin: '2px 0 0' }}>
                  {item.variant}
                </Text>
              </Column>
              <Column style={{ width: '15%', textAlign: 'center' }}>
                <Text style={cellText}>{item.quantity}</Text>
              </Column>
              <Column style={{ width: '30%', textAlign: 'right' }}>
                <Text style={cellText}>{formatCOP(item.price_cop * item.quantity)}</Text>
              </Column>
            </Row>
          ))}
          <Hr style={{ borderColor: colors.border, margin: '10px 0' }} />
          <Row>
            <Column style={{ width: '70%' }}>
              <Text style={{ ...cellText, fontWeight: 700 }}>Total</Text>
            </Column>
            <Column style={{ width: '30%', textAlign: 'right' }}>
              <Text style={{ ...cellText, fontWeight: 700 }}>{formatCOP(totalCop)}</Text>
            </Column>
          </Row>
        </Section>

        {shippingAddress ? (
          <>
            <Text style={styles.label}>Dirección de envío</Text>
            <Text style={styles.value}>{shippingAddress}</Text>
          </>
        ) : null}

        <Section style={{ margin: '8px 0 0' }}>
          <EmailButton href={`${tenant.url}/portal/account`}>Ver mi pedido</EmailButton>
        </Section>
      </Section>
      <EmailFooter tenant={tenant} />
    </EmailLayout>
  );
}
