import { apiService } from './api';

export type CheckoutSessionResponse = {
  url: string;
};

export type PaymentIntentResponse = {
  client_secret: string;
};

/**
 * Cria uma sessão de Checkout no backend. O backend deve retornar um objeto
 * com `{ url }` apontando para a sessão hospedada do Stripe (Checkout).
 *
 * Exemplo de endpoint backend esperado: POST /pagamentos/checkout-session
 */
export async function createCheckoutSession(data: any): Promise<CheckoutSessionResponse> {
  const response = await apiService.post<CheckoutSessionResponse>('/pagamentos/checkout-session', data);
  console.debug('createCheckoutSession response:', response);
  return response;
}

/**
 * Cria um PaymentIntent no backend e retorna o `client_secret` para que o
 * cliente possa confirmar o pagamento (usado por PaymentSheet / stripe-react-native).
 *
 * Exemplo de endpoint backend esperado: POST /pagamentos/payment-intent
 */
export async function createPaymentIntent(data: any): Promise<PaymentIntentResponse> {
  return apiService.post<PaymentIntentResponse>('/pagamentos/payment-intent', data);
}

export default {
  createCheckoutSession,
  createPaymentIntent,
};
