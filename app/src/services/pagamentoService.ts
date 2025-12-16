import { apiService } from './api';

export interface CreateCheckoutRequest {
  produtoId: number;
  compradorId?: number;
  quantity?: number;
  currency?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CreateCheckoutResponse {
  sessionId?: string;
  checkoutUrl?: string;
  status?: string;
  error?: string;
}

export const pagamentoService = {
  async createCheckout(req: CreateCheckoutRequest): Promise<CreateCheckoutResponse> {
    // Garantir success/cancel urls apontem para as páginas locais de retorno
    try {
      const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : 'http://localhost:8081';
      if (!req.successUrl) req.successUrl = `${origin}/sucesso`;
      if (!req.cancelUrl) req.cancelUrl = `${origin}/erro`;
    } catch (e) {
      // ignore
    }

    // Tenta POST (body JSON) e, em caso de falha, tenta fallback via GET com query params
    try {
      const response = await apiService.post<CreateCheckoutResponse>('/pagamento/create', req);
      console.log('[pagamentoService] Checkout criado:', response);
      return response;
    } catch (postError: any) {
      console.error('[pagamentoService] POST /pagamento/create falhou:', postError?.message || postError);

      // Se for erro de JWT expirado, propaga para o caller (já tratado em UI)
      const msg = postError?.message || postError?.response?.data || '';
      if (String(msg).toLowerCase().includes('jwt expired') || String(msg).toLowerCase().includes('expired')) {
        throw new Error(String(msg));
      }

      // Fallback: tentar GET com query params (ex.: /pagamento/create?produtoId=1&compradorId=1)
      try {
        const params = new URLSearchParams();
        if (req.produtoId !== undefined) params.append('produtoId', String(req.produtoId));
        if (req.compradorId !== undefined) params.append('compradorId', String(req.compradorId));
        if (req.quantity !== undefined) params.append('quantity', String(req.quantity));
        if (req.currency) params.append('currency', req.currency);
        if (req.successUrl) params.append('successUrl', req.successUrl);
        if (req.cancelUrl) params.append('cancelUrl', req.cancelUrl);

        const url = `/pagamento/create?${params.toString()}`;
        console.log('[pagamentoService] Tentando fallback GET:', url);

        const response = await apiService.get<CreateCheckoutResponse>(url);
        console.log('[pagamentoService] Checkout criado (GET fallback):', response);
        return response;
      } catch (getError: any) {
        console.error('[pagamentoService] Fallback GET /pagamento/create falhou:', getError);
        // propaga o erro original do POST junto com info do GET
        const composed = new Error(`POST erro: ${postError?.message || postError}; GET erro: ${getError?.message || getError}`);
        throw composed;
      }
    }
  },

  // Novo: criar checkout usando o carrinho do usuário (cria pagamentos por item e uma sessão única)
  async createCheckoutFromCart(req?: { successUrl?: string; cancelUrl?: string }): Promise<CreateCheckoutResponse & { pagamentoIds?: number[] } > {
    try {
      try {
        const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : 'http://localhost:8081';
        if (!req) req = {};
        if (!req.successUrl) req.successUrl = `${origin}/sucesso`;
        if (!req.cancelUrl) req.cancelUrl = `${origin}/erro`;
      } catch (e) {
        // ignore
      }

      const response = await apiService.post<CreateCheckoutResponse & { pagamentoIds?: number[] }>('/pagamento/create-from-cart', req);
      console.log('[pagamentoService] Checkout do carrinho criado:', response);
      return response;
    } catch (postError: any) {
      console.error('[pagamentoService] POST /pagamento/create-from-cart falhou:', postError?.message || postError);

      // Se for erro de JWT expirado, propaga para o caller (já tratado em UI)
      const msg = postError?.message || postError?.response?.data || '';
      if (String(msg).toLowerCase().includes('jwt expired') || String(msg).toLowerCase().includes('expired')) {
        throw new Error(String(msg));
      }

      // Fallback: tentar GET com query params (ex.: /pagamento/create-from-cart?successUrl=..)
      try {
        const params = new URLSearchParams();
        if (req?.successUrl) params.append('successUrl', req.successUrl);
        if (req?.cancelUrl) params.append('cancelUrl', req.cancelUrl);

        const url = `/pagamento/create-from-cart?${params.toString()}`;
        console.log('[pagamentoService] Tentando fallback GET:', url);

        const response = await apiService.get<CreateCheckoutResponse & { pagamentoIds?: number[] }>(url);
        console.log('[pagamentoService] Checkout do carrinho criado (GET fallback):', response);
        return response;
      } catch (getError: any) {
        console.error('[pagamentoService] Fallback GET /pagamento/create-from-cart falhou:', getError);
        const composed = new Error(`POST erro: ${postError?.message || postError}; GET erro: ${getError?.message || getError}`);
        throw composed;
      }
    }
  }
};

export default pagamentoService;
