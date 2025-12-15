import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Alert } from 'react-native';

const BASE_URL = 'http://localhost:8080/api';

class ApiService {
  private api: AxiosInstance;

  private publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh',
    '/auth/verify',
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

    this.api.interceptors.request.use(
      async (config) => {
        try {
          const url = config.url || '';
          const isPublicRoute = this.isPublicRoute(url);

          let token = null;
          if (!isPublicRoute) {
            token = await AsyncStorage.getItem('auth_token');
            if (!token) {
              token = await AsyncStorage.getItem('@Auth:token');
              if (token) {
                await AsyncStorage.setItem('auth_token', token);
              }
            }

            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          }

          config.headers['X-Requested-With'] = 'XMLHttpRequest';
          return config;
        } catch (error) {
          return config;
        }
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        const url = originalRequest?.url || 'unknown';

        if (error.response?.status === 401) {
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
          Alert.alert(
            'Acesso negado',
            'Você não tem permissão para acessar este recurso.',
            [{ text: 'OK' }]
          );
        }

        if (error.response?.status === 500) {
          Alert.alert(
            'Erro no servidor',
            'Tente novamente mais tarde.',
            [{ text: 'OK' }]
          );
        }

        // Log detalhado do body da resposta (se houver)
        try {
          console.error('[apiService] Response error details:', {
            url,
            status: error.response?.status,
            data: JSON.stringify(error.response?.data)
          });
        } catch (e) {
          console.error('[apiService] Falha ao serializar response.data', e);
        }

        return Promise.reject(error);
      }
    );
  }

  private isPublicRoute(url: string): boolean {
    let cleanUrl = url;
    if (url.startsWith(BASE_URL)) {
      cleanUrl = url.substring(BASE_URL.length);
    }

    return this.publicRoutes.some(route => {
      if (route.endsWith('/**')) {
        const baseRoute = route.replace('/**', '');
        return cleanUrl.startsWith(baseRoute);
      }
      if (cleanUrl === route) return true;
      if (cleanUrl.startsWith(route + '/')) return true;
      return false;
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
        return new Error('Não foi possível conectar ao servidor.');
      }
    }

    if (error.code === 'ECONNABORTED') {
      return new Error('Timeout: O servidor demorou muito para responder.');
    }

    return error instanceof Error ? error : new Error('Ocorreu um erro inesperado.');
  }

  async clearAllTokens(): Promise<void> {
    const keys = ['auth_token', '@Auth:token', '@Auth:user'];
    await Promise.all(keys.map(key => AsyncStorage.removeItem(key)));
  }

  async checkTokens(): Promise<{ auth_token: string | null, authToken: string | null }> {
    const auth_token = await AsyncStorage.getItem('auth_token');
    const authToken = await AsyncStorage.getItem('@Auth:token');
    return { auth_token, authToken };
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getPublic('/health');
      return true;
    } catch {
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

// Interceptor para debug: loga requisições públicas e verifica token no storage
publicApi.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('auth_token') || await AsyncStorage.getItem('@Auth:token');
    console.log('[publicApi] Requisição:', {
      method: config.method,
      url: `${config.baseURL}${config.url}`,
      headers: config.headers,
      hasTokenInStorage: !!token,
    });
  } catch (e) {
    console.log('[publicApi] Erro ao inspecionar token:', e);
  }
  return config;
}, (error) => Promise.reject(error));

// Log de resposta para publicApi (inclui erros)
publicApi.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      console.error('[publicApi] Response error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: JSON.stringify(error.response?.data)
      });
    } catch (e) {
      console.error('[publicApi] Falha ao serializar response.data', e);
    }
    return Promise.reject(error);
  }
);
