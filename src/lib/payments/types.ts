/**
 * Contratos de la capa de pagos.
 *
 * Toda la aplicación consume EXCLUSIVAMENTE estos tipos y la interfaz
 * `PaymentProvider`. Ningún componente ni Server Action debe conocer detalles
 * de Wompi, Treli o Stripe. Cambiar de proveedor = cambiar la variable de
 * entorno `PAYMENT_PROVIDER`, sin tocar el resto del código.
 */

/** Montos en la unidad menor de la moneda (centavos) para evitar floats. */
export type AmountInCents = number;

export type Currency = 'COP' | 'USD';

export type CheckoutStatus = 'pending' | 'approved' | 'declined' | 'voided' | 'error';

export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'paused' | 'pending';

export interface CustomerInfo {
  email: string;
  fullName: string;
  /** Teléfono en formato E.164 cuando esté disponible (ej. +573001112233). */
  phone?: string;
  /** Documento del cliente (CC/NIT) para pasarelas colombianas. */
  legalId?: string;
  legalIdType?: 'CC' | 'CE' | 'NIT' | 'PP';
}

export interface CheckoutParams {
  /** Sede a la que pertenece el cobro. Siempre presente (multi-tenant). */
  tenantId: string;
  /** Referencia única del comercio para conciliar (idempotencia). */
  reference: string;
  amount: AmountInCents;
  currency: Currency;
  description: string;
  customer: CustomerInfo;
  /** URL a la que la pasarela redirige tras el intento de pago. */
  redirectUrl: string;
  /** Metadata libre que se devuelve en el webhook. */
  metadata?: Record<string, string>;
}

export interface CheckoutResult {
  /** Id de la transacción/checkout en el proveedor. */
  providerId: string;
  reference: string;
  status: CheckoutStatus;
  /** URL a la que redirigir al usuario para completar el pago, si aplica. */
  checkoutUrl?: string;
}

export interface SubscriptionPlan {
  /** Id del plan tal como existe en el proveedor (Treli/Stripe). */
  providerPlanId: string;
  amount: AmountInCents;
  currency: Currency;
  interval: 'month' | 'year';
}

export interface SubscriptionParams {
  tenantId: string;
  reference: string;
  plan: SubscriptionPlan;
  customer: CustomerInfo;
  redirectUrl: string;
  metadata?: Record<string, string>;
}

export interface SubscriptionResult {
  providerId: string;
  reference: string;
  status: SubscriptionStatus;
  checkoutUrl?: string;
  /** Próxima fecha de cobro en ISO 8601, si el proveedor la informa. */
  currentPeriodEnd?: string;
}

export type WebhookEventType =
  | 'checkout.approved'
  | 'checkout.declined'
  | 'checkout.voided'
  | 'subscription.created'
  | 'subscription.renewed'
  | 'subscription.payment_failed'
  | 'subscription.canceled'
  | 'unknown';

export interface WebhookEvent {
  type: WebhookEventType;
  /** Id del recurso afectado en el proveedor. */
  providerId: string;
  /** Referencia del comercio para conciliar con nuestra DB. */
  reference?: string;
  status: CheckoutStatus | SubscriptionStatus;
  amount?: AmountInCents;
  currency?: Currency;
  /** Payload crudo ya verificado, por si se necesita auditar. */
  raw: unknown;
}

/**
 * Interfaz única que todo proveedor de pagos debe implementar.
 * Definida en CLAUDE.md como contrato no negociable.
 */
export interface PaymentProvider {
  createCheckout(params: CheckoutParams): Promise<CheckoutResult>;
  createSubscription(params: SubscriptionParams): Promise<SubscriptionResult>;
  cancelSubscription(id: string): Promise<void>;
  handleWebhook(payload: unknown, signature: string): Promise<WebhookEvent>;
}

/** Error tipado para fallos de la capa de pagos. */
export class PaymentError extends Error {
  public override readonly cause?: unknown;

  constructor(
    message: string,
    public readonly code:
      | 'not_configured'
      | 'invalid_signature'
      | 'provider_error'
      | 'unsupported_operation',
    cause?: unknown,
  ) {
    super(message);
    this.name = 'PaymentError';
    this.cause = cause;
  }
}
