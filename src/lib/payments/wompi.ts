import { createHash } from 'node:crypto';
import {
  PaymentError,
  type CheckoutParams,
  type CheckoutResult,
  type CheckoutStatus,
  type PaymentProvider,
  type SubscriptionParams,
  type SubscriptionResult,
  type WebhookEvent,
  type WebhookEventType,
} from './types';

/**
 * Implementación real de Wompi (Colombia) sobre Web Checkout + Eventos.
 *
 * Las credenciales se leen de variables de entorno y por ahora pueden estar
 * vacías: en ese caso, cualquier operación que las requiera lanza
 * PaymentError('not_configured') con un mensaje claro. Cuando lleguen las
 * llaves, basta con poblar el .env — este código no cambia.
 *
 * Docs: https://docs.wompi.co
 */

interface WompiConfig {
  publicKey: string;
  privateKey: string;
  eventsSecret: string;
  integritySecret: string;
  environment: 'production' | 'sandbox';
}

const CHECKOUT_BASE_URL = 'https://checkout.wompi.co/p/';
const API_BASE: Record<WompiConfig['environment'], string> = {
  production: 'https://production.wompi.co/v1',
  sandbox: 'https://sandbox.wompi.co/v1',
};

function loadConfig(): WompiConfig {
  const publicKey = process.env.WOMPI_PUBLIC_KEY ?? '';
  const privateKey = process.env.WOMPI_PRIVATE_KEY ?? '';
  const eventsSecret = process.env.WOMPI_EVENTS_SECRET ?? '';
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET ?? '';
  const environment = (process.env.WOMPI_ENVIRONMENT as WompiConfig['environment']) ?? 'sandbox';

  return { publicKey, privateKey, eventsSecret, integritySecret, environment };
}

function assertConfigured(
  value: string,
  field: keyof Omit<WompiConfig, 'environment'>,
): asserts value is string {
  if (!value) {
    throw new PaymentError(
      `Wompi no está configurado: falta ${field}. Define las variables WOMPI_* en tu .env.`,
      'not_configured',
    );
  }
}

/** Firma de integridad para Web Checkout: SHA256(ref + amount + currency + secret). */
function integritySignature(
  reference: string,
  amountInCents: number,
  currency: string,
  integritySecret: string,
): string {
  const payload = `${reference}${amountInCents}${currency}${integritySecret}`;
  return createHash('sha256').update(payload).digest('hex');
}

/** Mapea el estado de transacción de Wompi a nuestro CheckoutStatus. */
function mapTransactionStatus(status: string): CheckoutStatus {
  switch (status) {
    case 'APPROVED':
      return 'approved';
    case 'DECLINED':
      return 'declined';
    case 'VOIDED':
      return 'voided';
    case 'PENDING':
      return 'pending';
    default:
      return 'error';
  }
}

function mapEventType(eventName: string, status: CheckoutStatus): WebhookEventType {
  if (eventName === 'transaction.updated' || eventName === 'transaction.created') {
    if (status === 'approved') return 'checkout.approved';
    if (status === 'declined') return 'checkout.declined';
    if (status === 'voided') return 'checkout.voided';
  }
  return 'unknown';
}

/**
 * Verifica la firma de un evento de Wompi.
 * Wompi calcula: SHA256(concat(valores de properties) + timestamp + eventsSecret).
 */
function verifyEventSignature(
  payload: WompiEventPayload,
  eventsSecret: string,
): boolean {
  const properties = payload.signature?.properties ?? [];
  const concatenated = properties
    .map((path) => String(resolvePath(payload.data, path.replace(/^transaction\./, '')) ?? ''))
    .join('');
  const toSign = `${concatenated}${payload.timestamp}${eventsSecret}`;
  const computed = createHash('sha256').update(toSign).digest('hex');
  return timingSafeEqualHex(computed, payload.signature?.checksum ?? '');
}

/** Resuelve una ruta tipo "transaction.amount_in_cents" sobre un objeto. */
function resolvePath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/** Comparación de hashes hex en tiempo constante para evitar timing attacks. */
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

interface WompiEventPayload {
  event: string;
  timestamp: number;
  signature?: {
    checksum?: string;
    properties?: string[];
  };
  data: {
    transaction?: {
      id?: string;
      status?: string;
      reference?: string;
      amount_in_cents?: number;
      currency?: string;
    };
  };
}

export class WompiProvider implements PaymentProvider {
  private readonly config: WompiConfig;

  constructor(config?: Partial<WompiConfig>) {
    this.config = { ...loadConfig(), ...config };
  }

  async createCheckout(params: CheckoutParams): Promise<CheckoutResult> {
    assertConfigured(this.config.publicKey, 'publicKey');
    assertConfigured(this.config.integritySecret, 'integritySecret');

    const signature = integritySignature(
      params.reference,
      params.amount,
      params.currency,
      this.config.integritySecret,
    );

    const url = new URL(CHECKOUT_BASE_URL);
    url.searchParams.set('public-key', this.config.publicKey);
    url.searchParams.set('currency', params.currency);
    url.searchParams.set('amount-in-cents', String(params.amount));
    url.searchParams.set('reference', params.reference);
    url.searchParams.set('signature:integrity', signature);
    url.searchParams.set('redirect-url', params.redirectUrl);
    url.searchParams.set('customer-data:email', params.customer.email);
    url.searchParams.set('customer-data:full-name', params.customer.fullName);
    if (params.customer.phone) {
      url.searchParams.set('customer-data:phone-number', params.customer.phone);
    }
    if (params.customer.legalId && params.customer.legalIdType) {
      url.searchParams.set('customer-data:legal-id', params.customer.legalId);
      url.searchParams.set('customer-data:legal-id-type', params.customer.legalIdType);
    }

    return {
      providerId: params.reference,
      reference: params.reference,
      status: 'pending',
      checkoutUrl: url.toString(),
    };
  }

  /**
   * Las suscripciones recurrentes en Colombia se gestionan vía Treli (que a su
   * vez liquida con Wompi). El proveedor Wompi puro no expone suscripciones
   * nativas, por lo que esta operación se delega a la integración de Treli.
   */
  async createSubscription(_params: SubscriptionParams): Promise<SubscriptionResult> {
    throw new PaymentError(
      'Wompi no gestiona suscripciones de forma nativa. Usa la integración de Treli.',
      'unsupported_operation',
    );
  }

  async cancelSubscription(_id: string): Promise<void> {
    throw new PaymentError(
      'Wompi no gestiona suscripciones de forma nativa. Usa la integración de Treli.',
      'unsupported_operation',
    );
  }

  async handleWebhook(payload: unknown, _signature: string): Promise<WebhookEvent> {
    assertConfigured(this.config.eventsSecret, 'eventsSecret');

    const event = payload as WompiEventPayload;
    if (!event || typeof event !== 'object' || !event.signature) {
      throw new PaymentError('Payload de webhook de Wompi inválido.', 'provider_error');
    }

    if (!verifyEventSignature(event, this.config.eventsSecret)) {
      throw new PaymentError('Firma del webhook de Wompi inválida.', 'invalid_signature');
    }

    const tx = event.data.transaction;
    const status = mapTransactionStatus(tx?.status ?? '');

    return {
      type: mapEventType(event.event, status),
      providerId: tx?.id ?? '',
      reference: tx?.reference,
      status,
      amount: tx?.amount_in_cents,
      currency: tx?.currency === 'USD' ? 'USD' : 'COP',
      raw: payload,
    };
  }

  /** Expuesto para consultas de conciliación contra la API de transacciones. */
  apiBaseUrl(): string {
    return API_BASE[this.config.environment];
  }
}
