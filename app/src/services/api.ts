import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANTE: Substitua pelo IP REAL da sua máquina
// Para descobrir seu IP no Windows: ipconfig
// No Mac/Linux: ifconfig | grep "inet "
// Use o IP que aparece em "IPv4 Address" ou similar
const BASE_URL = 'http://localhost:8080/api'; // Para emulador/desenvolvimento
class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 15000, // Aumentei o timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Configurar interceptor de requisições
    this.api.interceptors.request.use(
      async (config) => {
        try {
          // Se tiver token, adiciona no header
          const token = await AsyncStorage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          
          // Adiciona headers para evitar problemas de CORS
          config.headers['X-Requested-With'] = 'XMLHttpRequest';
          
          return config;
        } catch (error) {
          return config;
        }
      },
      (error) => Promise.reject(error)
    );

    // Configurar interceptor de respostas
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        console.log('API Error Details:', {
          url: originalRequest?.url,
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });

        // Se for erro 403, talvez precise de token
        if (error.response?.status === 403) {
          // Tentar refresh token ou redirecionar para login
          Alert.alert(
            'Acesso negado',
            'Sua sessão expirou ou você não tem permissão.',
            [{ text: 'OK' }]
          );
          
          // Limpar token se existir
          await AsyncStorage.removeItem('auth_token');
        }

        // Se for erro 500 (servidor)
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

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // O servidor respondeu com um código de erro
        const message = error.response.data?.message || error.message;
        return new Error(`Erro ${error.response.status}: ${message}`);
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        return new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
      }
    }
    return new Error('Ocorreu um erro inesperado.');
  }

  // Método para testar conexão
  async testConnection(): Promise<boolean> {
    try {
      await this.api.get('/health');
      return true;
    } catch (error) {
      console.log('Teste de conexão falhou:', error);
      return false;
    }
  }
}

export const apiService = new ApiService();