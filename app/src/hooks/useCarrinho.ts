
  // src/hooks/useCarrinho.ts
  import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { CartItem, OrderSummary } from '../@types/carrinho';
import { CarrinhoService } from '../services/carrinhoService';
import pagamentoService from '../services/pagamentoService';

type UseCarrinhoReturn = {
  cartItems: CartItem[];
  selectAll: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  isOnline: boolean;
  addToCart: (produtoId: number, quantidade?: number) => Promise<CartItem | false>;
  updateQuantity: (produtoId: number, quantidade: number) => Promise<boolean>;
  loadCartItems: () => Promise<void>;
  removeItem: (produtoId: number) => Promise<boolean>;
  removeSelectedItems: () => Promise<void>;
  calculateSummary: () => OrderSummary;
  toggleItemSelection: (produtoId: number) => void;
  toggleSelectAll: () => void;
  validarParaCheckout: () => Promise<any>;
  sincronizarCarrinho: () => Promise<any>;
  verificarConexao: () => Promise<boolean>;
  refreshCart: () => void;
  clearCart: () => Promise<void>;
  iniciarCheckoutDoCarrinho: () => Promise<any>;
};

  const OFFLINE_CART_KEY = '@Carrinho:itensOffline';

  export const useCarrinho = (): UseCarrinhoReturn => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOnline, setIsOnline] = useState(false);

    /* =========================
       CONEXÃO
    ========================== */
    const checkConnection = useCallback(async () => {
      try {
        const state = await NetInfo.fetch();
        const connected = !!state.isConnected && state.isInternetReachable !== false;
        setIsOnline(connected);
        return connected;
      } catch {
        setIsOnline(false);
        return false;
      }
    }, []);

    const verificarConexao = useCallback(async () => {
      return await checkConnection();
    }, [checkConnection]);

    /* =========================
       OFFLINE STORAGE
    ========================== */
    const loadOfflineCart = useCallback(async (): Promise<CartItem[]> => {
      try {
        const data = await AsyncStorage.getItem(OFFLINE_CART_KEY);
        if (!data) return [];
      
        const items: CartItem[] = JSON.parse(data);
        // Garantir que todos os produtoIds são números
        return items.map(item => ({
          ...item,
          produtoId: Number(item.produtoId)
        }));
      } catch (error) {
        console.error('Erro ao carregar carrinho offline:', error);
        return [];
      }
    }, []);

    const saveOfflineCart = useCallback(async (items: CartItem[]) => {
      try {
        await AsyncStorage.setItem(OFFLINE_CART_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Erro ao salvar carrinho offline:', error);
      }
    }, []);

    /* =========================
       ADD ITEM
    ========================== */
    const addToCart = async (
      produtoId: number,
      quantidade = 1
    ): Promise<CartItem | false> => {
      try {
        setIsLoading(true);
        const connected = await checkConnection();

        if (connected) {
          try {
            const item = await CarrinhoService.adicionarItem(produtoId, quantidade);

            const cartItem: CartItem = {
              ...item,
              id: String(item.produtoId),
              produtoId: item.produtoId,
              selecionado: true,
              subtotal: item.preco * item.quantidade
            };

            setCartItems(prev => {
              const exists = prev.find(i => i.produtoId === produtoId);

              const updated = exists
                ? prev.map(i =>
                    i.produtoId === produtoId
                      ? {
                          ...i,
                          quantidade: i.quantidade + quantidade,
                          subtotal: i.preco * (i.quantidade + quantidade)
                        }
                      : i
                  )
                : [...prev, cartItem];

              saveOfflineCart(updated);
              return updated;
            });

            return cartItem;
          } catch (error: any) {
            console.error('Erro ao adicionar no servidor:', error.message || error);
            // cai para offline
          }
        }

        // OFFLINE
        const offlineItem: CartItem = {
          id: `offline-${produtoId}-${Date.now()}`,
          produtoId: produtoId,
          nome: `Produto #${produtoId}`,
          imagem: 'https://via.placeholder.com/150',
          preco: 0,
          precoUnitario: 0,
          quantidade,
          subtotal: 0,
          disponivel: true,
          selecionado: true
        };

        setCartItems(prev => {
          const exists = prev.find(i => i.produtoId === produtoId);

          const updated = exists
            ? prev.map(i =>
                i.produtoId === produtoId
                  ? {
                      ...i,
                      quantidade: i.quantidade + quantidade,
                      subtotal: i.preco * (i.quantidade + quantidade)
                    }
                  : i
              )
            : [...prev, offlineItem];

          saveOfflineCart(updated);
          return updated;
        });

        return offlineItem;
      } catch (error: any) {
        console.error('Erro ao adicionar ao carrinho:', error);
        Alert.alert('Erro', 'Não foi possível adicionar ao carrinho');
        return false;
      } finally {
        setIsLoading(false);
      }
    };

    /* =========================
       UPDATE QUANTITY
    ========================== */
    const updateQuantity = async (produtoId: number, quantidade: number) => {
      if (quantidade < 1) return false;

      setCartItems(prev => {
        const updated = prev.map(item =>
          item.produtoId === produtoId
            ? {
                ...item,
                quantidade,
                subtotal: item.preco * quantidade
              }
            : item
        );
        saveOfflineCart(updated);
        return updated;
      });

      if (isOnline) {
        try {
          await CarrinhoService.atualizarQuantidade(produtoId, quantidade);
        } catch (error: any) {
          console.error('Erro ao atualizar quantidade no servidor:', error.message || error);
        }
      }

      return true;
    };

    /* =========================
       LOAD CART
    ========================== */
    const loadCartItems = useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);
        const connected = await checkConnection();

        if (connected) {
          try {
            const serverItems = await CarrinhoService.listarCarrinho();

            const formatted: CartItem[] = serverItems.map(item => ({
              ...item,
              id: String(item.produtoId),
              produtoId: item.produtoId,
              selecionado: true,
              subtotal: item.preco * item.quantidade
            }));

            setCartItems(formatted);
            setSelectAll(formatted.length > 0);
            await saveOfflineCart(formatted);
            return;
          } catch (error: any) {
            console.error('Erro ao carregar do servidor:', error.message || error);
            // fallback offline
          }
        }

        const offline = await loadOfflineCart();
        setCartItems(offline);
        setSelectAll(offline.length > 0);
      } catch (error: any) {
        console.error('Erro ao carregar carrinho:', error);
        setError('Erro ao carregar carrinho. Tente novamente.');
      
        // Tentar carregar offline mesmo com erro
        try {
          const offline = await loadOfflineCart();
          setCartItems(offline);
          setSelectAll(offline.length > 0);
        } catch (offlineError) {
          console.error('Erro ao carregar offline também:', offlineError);
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }, [checkConnection, loadOfflineCart, saveOfflineCart]);

    /* =========================
       REMOVE ITEM
    ========================== */
    const removeItem = async (produtoId: number): Promise<boolean> => {
      try {
        setCartItems(prev => {
          const updated = prev.filter(item => item.produtoId !== produtoId);
          saveOfflineCart(updated);
          return updated;
        });

        if (isOnline) {
          try {
            await CarrinhoService.removerItem(produtoId);
          } catch (error: any) {
            console.error('Erro ao remover do servidor:', error.message || error);
          }
        }

        return true;
      } catch (error: any) {
        console.error('Erro ao remover item:', error);
        return false;
      }
    };

    /* =========================
       REMOVE SELECTED
    ========================== */
    const removeSelectedItems = async () => {
      const selected = cartItems.filter(i => i.selecionado);

      setCartItems(prev => {
        const updated = prev.filter(i => !i.selecionado);
        saveOfflineCart(updated);
        return updated;
      });

      if (isOnline) {
        await Promise.allSettled(
          selected.map(i => CarrinhoService.removerItem(i.produtoId))
        );
      }

      setSelectAll(false);
    };

    /* =========================
       SUMMARY
    ========================== */
    const calculateSummary = useCallback((): OrderSummary => {
      const selected = cartItems.filter(i => i.selecionado);

      const subtotal = selected.reduce((total, item) => total + item.subtotal, 0);
      const frete = subtotal > 0 ? 10 : 0;

      return {
        subtotal,
        frete,
        total: subtotal + frete,
        quantidadeSelecionada: selected.length,
        totalItens: cartItems.length
      };
    }, [cartItems]);

    /* =========================
       SELECTION
    ========================== */
    const toggleItemSelection = (produtoId: number) => {
      setCartItems(prev => {
        const updated = prev.map(item =>
          item.produtoId === produtoId
            ? { ...item, selecionado: !item.selecionado }
            : item
        );
        saveOfflineCart(updated);
        return updated;
      });
    };

    const toggleSelectAll = () => {
      setSelectAll(prev => {
        const newState = !prev;

        setCartItems(items => {
          const updated = items.map(i => ({ ...i, selecionado: newState }));
          saveOfflineCart(updated);
          return updated;
        });

        return newState;
      });
    };

    /* =========================
       VALIDAÇÃO PARA CHECKOUT
    ========================== */
    const validarParaCheckout = useCallback(async () => {
      try {
        const connected = await checkConnection();
      
        if (connected) {
          try {
            return await CarrinhoService.validarParaCheckout();
          } catch (error: any) {
            console.error('Erro ao validar no servidor:', error.message || error);
          }
        }
      
        // Offline: validar localmente
        const itensIndisponiveis = cartItems.filter(item => !item.disponivel);
        return {
          valido: itensIndisponiveis.length === 0 && cartItems.length > 0,
          itensIndisponiveis,
          mensagem: itensIndisponiveis.length > 0 
            ? `${itensIndisponiveis.length} item(s) podem não estar disponíveis`
            : cartItems.length === 0 ? 'Carrinho vazio' : undefined
        };
      } catch (error: any) {
        console.error('Erro ao validar carrinho:', error);
        return {
          valido: false,
          itensIndisponiveis: [],
          mensagem: 'Erro ao validar carrinho'
        };
      }
    }, [cartItems, checkConnection]);

    /* =========================
       SINCRONIZAÇÃO
    ========================== */
    const sincronizarCarrinho = async () => {
      try {
        setIsLoading(true);
      
        const connected = await checkConnection();
      
        if (!connected) {
          Alert.alert('Sem conexão', 'Conecte-se à internet para sincronizar o carrinho.');
          return cartItems;
        }
      
        if (cartItems.length === 0) {
          Alert.alert('Carrinho vazio', 'Não há itens para sincronizar.');
          return cartItems;
        }
      
        try {
          // Primeiro, tentar carregar o que tem no servidor
          const serverItems = await CarrinhoService.listarCarrinho();
        
          // Converter para números para comparação
          const localProdutoIds = new Set(cartItems.map(item => item.produtoId));
          const serverProdutoIds = new Set(serverItems.map(item => item.produtoId));
        
          // Itens que estão apenas locais (para adicionar ao servidor)
          const itemsToAdd = cartItems.filter(item => !serverProdutoIds.has(item.produtoId));
        
          // Itens que estão apenas no servidor (para adicionar localmente)
          const itemsToSyncFromServer = serverItems.filter(item => !localProdutoIds.has(item.produtoId));
        
          // Adicionar itens locais ao servidor
          if (itemsToAdd.length > 0) {
            const addPromises = itemsToAdd.map(item =>
              CarrinhoService.adicionarItem(item.produtoId, item.quantidade)
            );
          
            await Promise.allSettled(addPromises);
          }
        
          // Atualizar estado local com itens do servidor
          const mergedItems = [
            ...cartItems.filter(item => serverProdutoIds.has(item.produtoId)),
            ...itemsToSyncFromServer.map(item => ({
              ...item,
              id: String(item.produtoId),
              produtoId: item.produtoId,
              selecionado: true
            }))
          ];
        
          setCartItems(mergedItems);
          await saveOfflineCart(mergedItems);
        
          Alert.alert(
            'Sincronização concluída!',
            `Carrinho sincronizado. ${itemsToAdd.length} item(s) enviados ao servidor.`,
            [{ text: 'OK' }]
          );
        
          return mergedItems;
        
        } catch (error: any) {
          console.error('Erro na sincronização:', error.message || error);
          Alert.alert('Erro', 'Não foi possível sincronizar o carrinho. Verifique sua conexão.');
          return cartItems;
        }
      
      } catch (error: any) {
        console.error('Erro ao sincronizar carrinho:', error);
        Alert.alert('Erro', 'Erro durante a sincronização');
        return cartItems;
      } finally {
        setIsLoading(false);
      }
    };

    /* =========================
       INICIAR CHECKOUT (CARRINHO)
    ========================== */
    const iniciarCheckoutDoCarrinho = async () => {
      const connected = await checkConnection();
      if (!connected) {
        Alert.alert('Sem conexão', 'Conecte-se à internet para finalizar o checkout.');
        throw new Error('Sem conexão');
      }

      setIsLoading(true);
      try {
        // success/cancel serão preenchidos no serviço se necessário
        console.log('[useCarrinho] iniciarCheckoutDoCarrinho: iniciando chamada de checkout (connected=', connected, ', isOnline=', isOnline, ')');
        console.log('[useCarrinho] iniciando pagamentoService.createCheckoutFromCart()');
        const resp = await pagamentoService.createCheckoutFromCart();
        console.log('[useCarrinho] resposta createCheckoutFromCart:', resp);
        return resp;
      } catch (error: any) {
        console.error('Erro ao iniciar checkout do carrinho:', error.message || error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    /* =========================
       REFRESH & CLEAR
    ========================== */
    const refreshCart = () => {
      setIsRefreshing(true);
      loadCartItems();
    };

    const clearCart = async () => {
      setCartItems([]);
      setSelectAll(false);
      await AsyncStorage.removeItem(OFFLINE_CART_KEY);

      if (isOnline) {
        try {
          await CarrinhoService.limparCarrinho();
        } catch (error: any) {
          console.error('Erro ao limpar carrinho no servidor:', error.message || error);
        }
      }
    };

    /* =========================
       EFFECTS
    ========================== */
    useEffect(() => {
      loadCartItems();
    }, [loadCartItems]);

    useEffect(() => {
      const unsub = NetInfo.addEventListener(state => {
        const connected = !!state.isConnected && state.isInternetReachable !== false;
        setIsOnline(connected);
      });

      return () => unsub();
    }, []);

    useEffect(() => {
      if (cartItems.length > 0) {
        const allSelected = cartItems.every(item => item.selecionado);
        const noneSelected = cartItems.every(item => !item.selecionado);
      
        if (allSelected && !selectAll) {
          setSelectAll(true);
        } else if (noneSelected && selectAll) {
          setSelectAll(false);
        }
      } else {
        setSelectAll(false);
      }
    }, [cartItems, selectAll]);

    return {
      cartItems,
      selectAll,
      isLoading,
      isRefreshing,
      error,
      isOnline,
      addToCart,
      updateQuantity,
      loadCartItems,
      removeItem,
      removeSelectedItems,
      calculateSummary,
      toggleItemSelection,
      toggleSelectAll,
      validarParaCheckout,
      sincronizarCarrinho,
      verificarConexao,
      refreshCart,
      clearCart,
      iniciarCheckoutDoCarrinho
    };
  };
