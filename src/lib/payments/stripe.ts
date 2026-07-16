import {
  PaymentError,
  type CheckoutParams,
  type CheckoutResult,
  type PaymentProvider,
  type SubscriptionParams,
  type SubscriptionResult,
  type WebhookEvent,
} from './types';

/**
 * Esqueleto de Stripe para la expansión internacional.
 *
 * La interfaz está implementada según el contrato `PaymentProvider`, pero las
 * operaciones lanzan `PaymentError('not_configured')` hasta que se integre el
 * SDK de Stripe y se definan las llaves. Mantenerlo aquí garantiza que activar
 * Stripe sea solo: poblar el .env, instalar `stripe` y completar estos métodos
 * — sin tocar el resto de la aplicación.
 */

interface StripeConfig {
  secretKey: string;
  webhookSecret: string;
}

function loadConfig(): StripeConfig {
  return {
    secretKey: process.env.STRIPE_SECRET_KEY ?? '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? '',
  };
}

function notConfigured(operation: string): never {
  throw new PaymentError(
    `Stripe aún no está integrado (${operation}). Define STRIPE_* en tu .env e instala el SDK.`,
    'not_configured',
  );
}

export class StripeProvider implements PaymentProvider {
  private readonly config: StripeConfig;

  constructor(config?: Partial<StripeConfig>) {
    this.config = { ...loadConfig(), ...config };
  }

  async createCheckout(_params: CheckoutParams): Promise<CheckoutResult> {
    notConfigured('createCheckout');
  }

  async createSubscription(_params: SubscriptionParams): Promise<SubscriptionResult> {
    notConfigured('createSubscription');
  }

  async cancelSubscription(_id: string): Promise<void> {
    notConfigured('cancelSubscription');
  }

  async handleWebhook(_payload: unknown, _signature: string): Promise<WebhookEvent> {
    notConfigured('handleWebhook');
  }
}
