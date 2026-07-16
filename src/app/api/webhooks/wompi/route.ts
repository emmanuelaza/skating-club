import { NextResponse, type NextRequest } from 'next/server';
import { getPaymentProvider, PaymentError } from '@/lib/payments';

/**
 * Webhook de eventos de Wompi.
 *
 * Delega toda la lógica en la capa de pagos desacoplada: verifica la firma del
 * evento dentro de `handleWebhook` y devuelve un `WebhookEvent` normalizado.
 * La conciliación con la base de datos (actualizar el estado del pago de la
 * sede correspondiente) se implementa en el módulo de pagos de negocio.
 *
 * Responde 200 ante eventos válidos y 4xx ante firmas inválidas para que Wompi
 * no reintente indefinidamente un payload manipulado.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const signature = request.headers.get('x-event-checksum') ?? '';

  try {
    const provider = getPaymentProvider();
    const event = await provider.handleWebhook(payload, signature);

    // La persistencia del evento y la actualización del estado de
    // transacción/suscripción de la sede son responsabilidad del módulo de
    // pagos de negocio (módulo 2+). Este handler solo verifica la firma y acusa
    // recibo del evento ya normalizado.
    return NextResponse.json({ received: true, type: event.type }, { status: 200 });
  } catch (error) {
    if (error instanceof PaymentError) {
      const status = error.code === 'invalid_signature' ? 401 : 400;
      return NextResponse.json({ error: error.message, code: error.code }, { status });
    }
    return NextResponse.json({ error: 'Error procesando el webhook' }, { status: 500 });
  }
}
