import { apiService } from '../services/api';
import { Produto } from '@/app/src/@types/home';

export interface FavoritoResponse {
  id: number;
  usuarioId: number;
  produtoId: number;
  produto: Produto;
  createdAt: string;
}

export interface FavoritoRequest {
  produtoId: number;
}

class FavoritoService {
  private baseUrl = '/favoritos';

  async adicionarFavorito(produtoId: number): Promise<void> {
    try {
      await apiService.post<void>(`${this.baseUrl}/produto/${produtoId}`, null);
    } catch (error) {
      throw error;
    }
  }

  async removerFavorito(produtoId: number): Promise<void> {
    try {
      await apiService.delete<void>(`${this.baseUrl}/produto/${produtoId}`);
    } catch (error) {
      throw error;
    }
  }

  async listarFavoritos(): Promise<Produto[]> {
    try {
      const response = await apiService.get<Produto[]>(this.baseUrl);
      return response.map(produto => ({
        ...produto,
        id: produto.id.toString()
      }));
    } catch (error) {
      throw error;
    }
  }

  async verificarFavorito(produtoId: number): Promise<boolean> {
    try {
      const response = await apiService.get<boolean>(
        `${this.baseUrl}/produto/${produtoId}/verificar`
      );
      return response;
    } catch (error) {
      return false;
    }
  }

  async listarFavoritosPaginados(
    page: number = 0,
    size: number = 10
  ): Promise<{
    content: Produto[];
    totalPages: number;
    totalElements: number;
    last: boolean;
  }> {
    try {
      const response = await apiService.get<{
        content: any[];
        totalPages: number;
        totalElements: number;
        last: boolean;
      }>(`${this.baseUrl}/pagina?page=${page}&size=${size}`);
      
      const content = response.content.map(produto => ({
        ...produto,
        id: produto.id.toString()
      }));
      
      return {
        ...response,
        content
      };
    } catch (error) {
      throw error;
    }
  }
}

export const favoritoService = new FavoritoService();
