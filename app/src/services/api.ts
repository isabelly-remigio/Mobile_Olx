import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// IMPORTANTE: Substitua pelo IP REAL da sua máquina
// Para descobrir seu IP no Windows: ipconfig
// No Mac/Linux: ifconfig | grep "inet "
// Use o IP que aparece em "IPv4 Address" ou similar
const BASE_URL = 'http://localhost:8080/api'; // Para emulador/desenvolvimento

class ApiService {
  private api: AxiosInstance;
  
  // Rotas que NÃO precisam de token de autenticação
  private publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh',
    '/auth/forgot-password',
    '/auth/reset-password',
    'api/produtos',          // Rotas de produtos são públicas
    'api/produtos/**',       // Qualquer subrota de produtos
    'api/health',            // Health check
    '/swagger-ui.html',   // Documentação
    '/v3/api-docs'        // OpenAPI docs
  ];

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 60000, // Aumentei o timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Configurar interceptor de requisições
    this.api.interceptors.request.use(
      async (config) => {
        try {
          // Verifica se é uma rota pública
          const isPublicRoute = this.isPublicRoute(config.url || '');
          
          // Se NÃO for rota pública, adiciona o token
          if (!isPublicRoute) {
            const token = await AsyncStorage.getItem('auth_token');
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          }
          
          // Adiciona headers para evitar problemas de CORS
          config.headers['X-Requested-With'] = 'XMLHttpRequest';
          
          // Log para debug (remova em produção)
          console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
            isPublicRoute,
            hasToken: !isPublicRoute && !!AsyncStorage.getItem('auth_token')
          });
          
          return config;
        } catch (error) {
          console.error('[API Request Interceptor Error]', error);
          return config;
        }
      },
      (error) => Promise.reject(error)
    );

    // Configurar interceptor de respostas
    this.api.interceptors.response.use(
      (response) => {
        // Log para debug (remova em produção)
        console.log(`[API Response] ${response.status} ${response.config.url}`);
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        
        console.log('[API Error Details]:', {
          url: originalRequest?.url,
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          headers: error.response?.headers
        });

        // Se for erro 401 (Não autorizado)
        if (error.response?.status === 401) {
          Alert.alert(
            'Sessão expirada',
            'Faça login novamente.',
            [{ text: 'OK' }]
          );
          
          // Limpar token
          await AsyncStorage.removeItem('auth_token');
        }

        // Se for erro 403 (Proibido)
        if (error.response?.status === 403) {
          // Se for uma rota pública com erro 403, pode ser problema de CORS ou backend
          if (this.isPublicRoute(originalRequest?.url || '')) {
            console.warn('[API Warning] Rota pública retornou 403. Verifique configurações do backend.');
          } else {
            Alert.alert(
              'Acesso negado',
              'Você não tem permissão para acessar este recurso.',
              [{ text: 'OK' }]
            );
          }
          
          // Limpar token se existir
          await AsyncStorage.removeItem('auth_token');
        }

        // Se for erro 500 (Erro interno do servidor)
        if (error.response?.status === 500) {
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
   * Verifica se uma URL corresponde a uma rota pública
   */
  private isPublicRoute(url: string): boolean {
    // Remove a base URL se presente
    const cleanUrl = url.replace(BASE_URL, '').replace('/api', '');
    
    // Verifica se a URL corresponde a algum padrão de rota pública
    return this.publicRoutes.some(route => {
      // Se a rota termina com **, verifica se começa com o padrão
      if (route.endsWith('/**')) {
        const baseRoute = route.replace('/**', '');
        return cleanUrl.startsWith(baseRoute);
      }
      // Verificação exata ou se contém a rota
      return cleanUrl === route || cleanUrl.startsWith(route + '/');
    });
  }

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
   * Método para requisições públicas (não envia token mesmo se existir)
   * Útil para garantir que rotas públicas não recebam token
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
        // O servidor respondeu com um código de erro
        const message = error.response.data?.message || 
                       error.response.data?.error || 
                       error.message;
        return new Error(`Erro ${error.response.status}: ${message}`);
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        return new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
      }
    }
    
    // Se for erro de timeout
    if (error.code === 'ECONNABORTED') {
      return new Error('Timeout: O servidor demorou muito para responder.');
    }
    
    return new Error('Ocorreu um erro inesperado.');
  }

  // Método para testar conexão
  async testConnection(): Promise<boolean> {
    try {
      await this.getPublic('/health');
      return true;
    } catch (error) {
      console.log('Teste de conexão falhou:', error);
      return false;
    }
  }

  // Método para limpar token (logout)
  async clearAuthToken(): Promise<void> {
    await AsyncStorage.removeItem('auth_token');
  }

  // Método para verificar se tem token
  async hasAuthToken(): Promise<boolean> {
    const token = await AsyncStorage.getItem('auth_token');
    return !!token;
  }
}

export const apiService = new ApiService();

// Exporte também uma instância pública separada para uso específico
export const publicApi = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});