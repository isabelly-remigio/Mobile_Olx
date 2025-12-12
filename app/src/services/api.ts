import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const BASE_URL = 'http://localhost:8080/api';

class ApiService {
  private api: AxiosInstance;
  
  // ✅ CORRETO: Rotas públicas SEM '/api' no início
  private publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify',
    '/auth/resend-verification',
    '/auth/esqueci-senha',
    '/produtos',
    '/produtos/**',
    '/health',
    '/swagger-ui.html',
    '/v3/api-docs'
  ];

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // ✅ INTERCEPTOR DE REQUEST CORRIGIDO
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const url = config.url || '';
          const isPublicRoute = this.isPublicRoute(url);
          
          // ✅ BUSCAR TOKEN CORRETAMENTE
          let token = null;
          if (!isPublicRoute) {
            // Tentar 'auth_token' primeiro
            token = await AsyncStorage.getItem('auth_token');
            
            // Se não encontrar, tentar '@Auth:token'
            if (!token) {
              token = await AsyncStorage.getItem('@Auth:token');
              // Se encontrou aqui, copiar para manter consistência
              if (token) {
                await AsyncStorage.setItem('auth_token', token);
                console.log('[API] Token copiado de @Auth:token para auth_token');
              }
            }
            
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
              console.log(`[API Request] ✅ Token adicionado (${token.substring(0, 20)}...)`);
            } else {
              console.warn('[API Request] ⚠️ Rota privada sem token:', url);
            }
          }
          
          config.headers['X-Requested-With'] = 'XMLHttpRequest';
          
          // ✅ LOG CORRETO
          console.log(`[API Request] ${config.method?.toUpperCase()} ${url}`, {
            isPublicRoute,
            hasToken: !!token,
            tokenPreview: token ? token.substring(0, 20) + '...' : 'none'
          });
          
          return config;
        } catch (error) {
          console.error('[API Request Interceptor Error]', error);
          return config;
        }
      },
      (error) => Promise.reject(error)
    );

    // ✅ INTERCEPTOR DE RESPONSE MELHORADO
    this.api.interceptors.response.use(
      (response) => {
        console.log(`[API Response] ✅ ${response.status} ${response.config.url}`);
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        const url = originalRequest?.url || 'unknown';
        
        console.log('[API Error Details]:', {
          url,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          isPublicRoute: this.isPublicRoute(url)
        });

        // ✅ TRATAMENTO DE ERROS MELHORADO
        if (error.response?.status === 401) {
          console.log('[API] 🚨 401 Unauthorized - Token inválido ou expirado');
          Alert.alert(
            'Sessão expirada',
            'Faça login novamente.',
            [{ 
              text: 'OK', 
              onPress: async () => {
                await this.clearAllTokens();
              }
            }]
          );
        }

        if (error.response?.status === 403) {
          console.log('[API] 🚫 403 Forbidden - Acesso negado');
          
          if (this.isPublicRoute(url)) {
            console.warn('[API] Rota pública retornou 403 - Verificar backend');
          }
          
          Alert.alert(
            'Acesso negado',
            'Você não tem permissão para acessar este recurso.',
            [{ text: 'OK' }]
          );
          
          // Não limpar token automaticamente para 403
          // Pode ser um erro de permissão, não de autenticação
        }

        if (error.response?.status === 404) {
          console.log('[API] 🔍 404 Not Found:', url);
        }

        if (error.response?.status === 500) {
          console.log('[API] 💥 500 Internal Server Error');
          Alert.alert(
            'Erro no servidor',
            'Tente novamente mais tarde.',
            [{ text: 'OK' }]
          );
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * ✅ MÉTODO isPublicRoute CORRIGIDO
   */
  private isPublicRoute(url: string): boolean {
    // Remove apenas a BASE_URL, mantendo o '/api' se presente
    let cleanUrl = url;
    if (url.startsWith(BASE_URL)) {
      cleanUrl = url.substring(BASE_URL.length);
    }
    
    console.log(`[isPublicRoute] URL: "${url}" → Clean: "${cleanUrl}"`);
    
    const isPublic = this.publicRoutes.some(route => {
      // Se a rota termina com /** 
      if (route.endsWith('/**')) {
        const baseRoute = route.replace('/**', '');
        return cleanUrl.startsWith(baseRoute);
      }
      
      // Verificação exata
      if (cleanUrl === route) {
        return true;
      }
      
      // Verifica se começa com a rota + /
      if (cleanUrl.startsWith(route + '/')) {
        return true;
      }
      
      return false;
    });
    
    console.log(`[isPublicRoute] Result: ${isPublic ? 'PUBLIC' : 'PRIVATE'}`);
    return isPublic;
  }

  // Métodos HTTP (mantenha como estão)
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * ✅ MÉTODO getPublic ATUALIZADO
   */
  async getPublic<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axios.get<T>(`${BASE_URL}${url}`, {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const message = error.response.data?.message || 
                       error.response.data?.error || 
                       `Erro ${error.response.status}: ${error.response.statusText}`;
        return new Error(message);
      } else if (error.request) {
        return new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
      }
    }
    
    if (error.code === 'ECONNABORTED') {
      return new Error('Timeout: O servidor demorou muito para responder.');
    }
    
    return error instanceof Error ? error : new Error('Ocorreu um erro inesperado.');
  }

  // ✅ NOVO: Limpar todos os tokens possíveis
  async clearAllTokens(): Promise<void> {
    const keys = ['auth_token', '@Auth:token', '@Auth:user'];
    await Promise.all(keys.map(key => AsyncStorage.removeItem(key)));
    console.log('[API] Todos os tokens removidos');
  }

  // ✅ NOVO: Verificar qual token está disponível
  async checkTokens(): Promise<{auth_token: string | null, authToken: string | null}> {
    const auth_token = await AsyncStorage.getItem('auth_token');
    const authToken = await AsyncStorage.getItem('@Auth:token');
    
    console.log('[API] Tokens disponíveis:', {
      auth_token: auth_token ? `✅ (${auth_token.substring(0, 20)}...)` : '❌',
      '@Auth:token': authToken ? `✅ (${authToken.substring(0, 20)}...)` : '❌',
      sãoIguais: auth_token === authToken ? '✅' : '❌'
    });
    
    return { auth_token, authToken };
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getPublic('/health');
      return true;
    } catch (error) {
      console.log('Teste de conexão falhou:', error);
      return false;
    }
  }

  async hasAuthToken(): Promise<boolean> {
    const token1 = await AsyncStorage.getItem('auth_token');
    const token2 = await AsyncStorage.getItem('@Auth:token');
    return !!(token1 || token2);
  }
}

export const apiService = new ApiService();

export const publicApi = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});