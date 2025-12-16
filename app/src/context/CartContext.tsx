// src/context/CartContext.tsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';
import { CartItem, CarrinhoItemAPI } from '../@types/carrinho';

interface CartContextData {
  items: CartItem[];
  addToCart: (produtoId: number, quantidade?: number) => Promise<void>;
  removeFromCart: (produtoId: number) => Promise<void>;
  updateQuantity: (produtoId: number, quantidade: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getSubtotal: () => Promise<number>;
  countItems: () => Promise<number>;
  loading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chaves para armazenamento local
  const CART_ITEMS_KEY = '@Cart:items';
  const CART_LAST_SYNC_KEY = '@Cart:lastSync';

  // Converter item da API para formato local
  const mapApiToCartItem = (apiItem: CarrinhoItemAPI): CartItem => {
    const produto = apiItem.produto || {
      id: apiItem.id || 0,
      nome: 'Produto',
      preco: apiItem.precoUnitario || 0,
      imagemUrl: '',
      quantidadeEstoque: 10
    };

    return {
      id: `produto-${produto.id}`,
      produtoId: produto.id,
      imagem: produto.imagemUrl || 'https://via.placeholder.com/150',
      nome: produto.nome,
      preco: produto.preco,
      quantidade: apiItem.quantidade || 1,
      disponivel: produto.quantidadeEstoque > 0,
      selecionado: true,
      precoUnitario: apiItem.precoUnitario || produto.preco,
      subtotal: apiItem.subtotal || (produto.preco * (apiItem.quantidade || 1))
    };
  };

  // Carregar carrinho do servidor
  const loadCartFromServer = async (): Promise<CartItem[]> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.get<CarrinhoItemAPI[]>('/carrinho');
      const cartItems = response.map(item => mapApiToCartItem(item));
      
      // Salvar localmente para cache
      await AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(cartItems));
      await AsyncStorage.setItem(CART_LAST_SYNC_KEY, new Date().toISOString());
      
      setItems(cartItems);
      return cartItems;
    } catch (error: any) {
      console.error('Erro ao carregar carrinho do servidor:', error);
      setError(error.message || 'Erro ao carregar carrinho');
      
      // Tentar carregar do cache local
      try {
        const cached = await AsyncStorage.getItem(CART_ITEMS_KEY);
        if (cached) {
          const cachedItems: CartItem[] = JSON.parse(cached);
          setItems(cachedItems);
          return cachedItems;
        }
      } catch (cacheError) {
        console.error('Erro ao carregar cache do carrinho:', cacheError);
      }
      
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Adicionar item ao carrinho
  const addToCart = async (produtoId: number, quantidade: number = 1): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.post<CarrinhoItemAPI>('/carrinho/adicionar', null, {
        params: { produtoId, quantidade }
      });

      const newItem = mapApiToCartItem(response);
      
      // Atualizar estado local
      setItems(prevItems => {
        const existingIndex = prevItems.findIndex(item => item.produtoId === produtoId);
        
        if (existingIndex >= 0) {
          // Atualizar quantidade se já existir
          const updatedItems = [...prevItems];
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantidade: updatedItems[existingIndex].quantidade + quantidade,
            subtotal: updatedItems[existingIndex].preco * (updatedItems[existingIndex].quantidade + quantidade)
          };
          return updatedItems;
        } else {
          // Adicionar novo item
          return [...prevItems, newItem];
        }
      });

      // Atualizar cache
      await AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(items));
      await AsyncStorage.setItem(CART_LAST_SYNC_KEY, new Date().toISOString());

      Alert.alert('Sucesso!', 'Produto adicionado ao carrinho');
    } catch (error: any) {
      console.error('Erro ao adicionar ao carrinho:', error);
      
      let errorMessage = 'Erro ao adicionar ao carrinho';
      if (error.message?.includes('401') || error.message?.includes('Não autorizado')) {
        errorMessage = 'Faça login para adicionar itens ao carrinho';
      } else if (error.message?.includes('404')) {
        errorMessage = 'Produto não encontrado';
      } else if (error.message?.includes('500')) {
        errorMessage = 'Erro no servidor. Tente novamente.';
      }

      setError(errorMessage);
      Alert.alert('Erro', errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remover item do carrinho
  const removeFromCart = async (produtoId: number): Promise<void> => {
    try {
      setLoading(true);
      
      await apiService.delete(`/carrinho/remover/${produtoId}`);
      
      // Atualizar estado local
      setItems(prevItems => prevItems.filter(item => item.produtoId !== produtoId));
      
      // Atualizar cache
      await AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(items));
      
      Alert.alert('Sucesso', 'Item removido do carrinho');
    } catch (error: any) {
      console.error('Erro ao remover do carrinho:', error);
      setError(error.message || 'Erro ao remover item');
      Alert.alert('Erro', 'Não foi possível remover o item do carrinho');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar quantidade
  const updateQuantity = async (produtoId: number, quantidade: number): Promise<void> => {
    if (quantidade < 1) {
      // Se quantidade for 0, remover item
      await removeFromCart(produtoId);
      return;
    }

    try {
      setLoading(true);
      
      // Primeiro remover o item antigo
      await removeFromCart(produtoId);
      
      // Adicionar com nova quantidade
      await addToCart(produtoId, quantidade);
      
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Limpar carrinho
  const clearCart = async (): Promise<void> => {
    try {
      setLoading(true);
      
      await apiService.delete('/carrinho/limpar');
      
      // Limpar estado local
      setItems([]);
      
      // Limpar cache
      await AsyncStorage.removeItem(CART_ITEMS_KEY);
      await AsyncStorage.removeItem(CART_LAST_SYNC_KEY);
      
      Alert.alert('Sucesso', 'Carrinho limpo');
    } catch (error: any) {
      console.error('Erro ao limpar carrinho:', error);
      setError(error.message || 'Erro ao limpar carrinho');
      Alert.alert('Erro', 'Não foi possível limpar o carrinho');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Obter subtotal
  const getSubtotal = async (): Promise<number> => {
    try {
      const response = await apiService.get<number>('/carrinho/subtotal');
      return response;
    } catch (error) {
      console.error('Erro ao obter subtotal:', error);
      // Calcular localmente como fallback
      return items.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }
  };

  // Contar itens
  const countItems = async (): Promise<number> => {
    try {
      const response = await apiService.get<number>('/carrinho/contar');
      return response;
    } catch (error) {
      console.error('Erro ao contar itens:', error);
      // Usar contagem local como fallback
      return items.length;
    }
  };

  // Recarregar carrinho
  const refreshCart = async (): Promise<void> => {
    await loadCartFromServer();
  };

  // Carregar carrinho na inicialização
  useEffect(() => {
    loadCartFromServer();
  }, []);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getSubtotal,
    countItems,
    loading,
    error,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};