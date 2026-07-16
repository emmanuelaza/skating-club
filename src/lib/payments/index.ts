import { WompiProvider } from './wompi';
import { StripeProvider } from './stripe';
import type { PaymentProvider } from './types';

export type {
  PaymentProvider,
  CheckoutParams,
  CheckoutResult,
  CheckoutStatus,
  SubscriptionParams,
  SubscriptionResult,
  SubscriptionStatus,
  SubscriptionPlan,
  WebhookEvent,
  WebhookEventType,
  CustomerInfo,
  Currency,
  AmountInCents,
} from './types';
export { PaymentError } from './types';

type ProviderName = 'wompi' | 'stripe';

let instance: PaymentProvider | null = null;
let instanceName: ProviderName | null = null;

function resolveProviderName(): ProviderName {
  const raw = process.env.PAYMENT_PROVIDER ?? 'wompi';
  if (raw !== 'wompi' && raw !== 'stripe') {
    throw new Error(
      `PAYMENT_PROVIDER inválido: "${raw}". Valores permitidos: "wompi" | "stripe".`,
    );
  }
  return raw;
}

function build(name: ProviderName): PaymentProvider {
  switch (name) {
    case 'wompi':
      return new WompiProvider();
    case 'stripe':
      return new StripeProvider();
  }
}

/**
 * Punto de entrada único de la capa de pagos.
 *
 * Devuelve el proveedor activo según `PAYMENT_PROVIDER`. Toda la aplicación
 * debe usar SOLO esta función — nunca instanciar Wompi/Stripe directamente ni
 * llamarlos desde componentes o Server Actions.
 *
 * La instancia se memoiza por nombre de proveedor; si la variable de entorno
 * cambia (p. ej. en tests) se reconstruye.
 */
export function getPaymentProvider(): PaymentProvider {
  const name = resolveProviderName();
  if (!instance || instanceName !== name) {
    instance = build(name);
    instanceName = name;
  }
  return instance;
}
