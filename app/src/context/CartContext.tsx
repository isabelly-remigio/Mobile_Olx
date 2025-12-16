// src/context/CartContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { CarrinhoItemAPI, CartItem } from '../@types/carrinho';
import { apiService } from '../services/api';

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
      const doPost = async () => apiService.post<CarrinhoItemAPI>('/carrinho/adicionar', null, { params: { produtoId, quantidade } });

      // Try the request; on certain server errors, we'll attempt a refresh+retry
      let response = null as any;
      try {
        response = await doPost();
      } catch (err: any) {
        const isServerError = err?.response?.status === 500 || String(err?.message || '').includes('Row was updated or deleted');
        if (isServerError) {
          console.warn('[Cart] adicionarItem failed with server error, refreshing cart and retrying once', err);
          await loadCartFromServer();
          try {
            response = await doPost();
          } catch (err2: any) {
            throw err2;
          }
        } else {
          throw err;
        }
      }

      const newItem = mapApiToCartItem(response);

      // Atualizar estado local de forma determinística (usar estado atual, não a variável stale)
      const updatedItems = (() => {
        const existingIndex = items.findIndex(item => item.produtoId === produtoId);
        if (existingIndex >= 0) {
          const clone = [...items];
          const newQuantidade = clone[existingIndex].quantidade + quantidade;
          clone[existingIndex] = {
            ...clone[existingIndex],
            quantidade: newQuantidade,
            subtotal: clone[existingIndex].preco * newQuantidade
          };
          return clone;
        }
        return [...items, newItem];
      })();

      setItems(updatedItems);
      // Atualizar cache de forma síncrona com o novo estado
      await AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(updatedItems));
      await AsyncStorage.setItem(CART_LAST_SYNC_KEY, new Date().toISOString());

      Alert.alert('Sucesso!', 'Produto adicionado ao carrinho');
    } catch (error: any) {
      console.error('Erro ao adicionar ao carrinho:', error);
      let errorMessage = 'Erro ao adicionar ao carrinho';
      if (error?.response?.status === 401 || String(error.message || '').includes('Não autorizado')) {
        errorMessage = 'Faça login para adicionar itens ao carrinho';
      } else if (error?.response?.status === 404 || String(error.message || '').includes('404')) {
        errorMessage = 'Produto não encontrado';
      } else if (error?.response?.status === 500 || String(error.message || '').includes('500')) {
        errorMessage = 'Erro no servidor. Atualizei o carrinho local — tente novamente.';
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

      // Atualizar estado local e cache com o novo array
      const newItems = items.filter(item => item.produtoId !== produtoId);
      setItems(newItems);
      await AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(newItems));

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

    // Use local state to compute delta when possible to avoid unnecessary remove/add
    const existing = items.find(i => i.produtoId === produtoId);
    const atual = existing?.quantidade ?? 0;
    if (atual === quantidade) return;

    try {
      setLoading(true);

      if (quantidade > atual) {
        // Só aumentar: enviar delta de quantidade
        const delta = quantidade - atual;
        await addToCart(produtoId, delta);
        return;
      }

      // Se diminuir: removemos e adicionamos (servidor não expõe endpoint de set)
      try {
        await removeFromCart(produtoId);
        await addToCart(produtoId, quantidade);
      } catch (err: any) {
        // Se ocorrer erro de concorrência no servidor, re-sincronizamos e informamos o usuário
        console.warn('[Cart] updateQuantity failed; refreshing cart', err);
        await loadCartFromServer();
        Alert.alert('Erro', 'Não foi possível atualizar a quantidade. Atualizei o carrinho local — tente novamente.');
        throw err;
      }

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