// src/services/carrinhoService.ts

import { apiService } from './api';
import { CartItem } from '../@types/carrinho';

export const CarrinhoService = {
  // ADICIONAR ITEM
  async adicionarItem(produtoId: number, quantidade: number = 1): Promise<any> {
    try {
      const responseData = await apiService.post('/carrinho/adicionar', null, {
        params: {
          produtoId,
          quantidade
        }
      });

      return responseData;
    } catch (error: any) {
      throw error;
    }
  },

  // REMOVER ITEM
  async removerItem(produtoId: number): Promise<void> {
    try {
      await apiService.delete(`/carrinho/remover/${produtoId}`);
    } catch (error: any) {
      throw error;
    }
  },

  // LISTAR CARRINHO
  async listarCarrinho(): Promise<CartItem[]> {
    try {
      const responseData = await apiService.get('/carrinho');

      if (Array.isArray(responseData)) {
        return responseData.map(item => this.formatarItemBackend(item));
      }

      return [];
    } catch (error: any) {
      throw error;
    }
  },

  // LIMPAR CARRINHO
  async limparCarrinho(): Promise<void> {
    try {
      await apiService.delete('/carrinho/limpar');
    } catch (error: any) {
      throw error;
    }
  },

  // ATUALIZAR QUANTIDADE (fallback simples)
  async atualizarQuantidade(produtoId: number, quantidade: number): Promise<any> {
    if (quantidade === 0) {
      await this.removerItem(produtoId);
      return null;
    }

    await this.removerItem(produtoId);
    return this.adicionarItem(produtoId, quantidade);
  },

  // FORMATAR ITEM DO BACKEND
  formatarItemBackend(item: any): CartItem {
    const produto = item.produto || {};

    const produtoId: number =
      Number(item.produtoId ?? produto.id ?? 0);

    const preco = Number(produto.preco ?? item.precoUnitario ?? 0);
    const quantidade = Number(item.quantidade ?? 1);

    const disponivel =
      produto.disponivel !== false &&
      (produto.estoque === undefined || produto.estoque > 0);

    return {
      id: String(produtoId),
      produtoId,              // ✅ NUMBER
      produto,
      nome: produto.nome || `Produto ${produtoId}`,
      preco,
      imagem:
        produto.imagemUrl ||
        produto.imagem ||
        'https://via.placeholder.com/150',
      quantidade,
      precoUnitario: preco,
      subtotal: preco * quantidade,
      disponivel,
      selecionado: true
    };
  },

  // SUBTOTAL
  async getSubtotal(): Promise<number> {
    try {
      const responseData = await apiService.get('/carrinho/subtotal');
      return Number(responseData) || 0;
    } catch {
      const itens = await this.listarCarrinho();
      return itens.reduce((total, item) => total + item.subtotal, 0);
    }
  },

  // CONTAR ITENS
  async contarItens(): Promise<number> {
    try {
      const responseData = await apiService.get('/carrinho/contar');
      return Number(responseData) || 0;
    } catch {
      const itens = await this.listarCarrinho();
      return itens.length;
    }
  }
};
