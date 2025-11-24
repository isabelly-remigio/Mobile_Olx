// context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Produto } from '../@types/home'; // Ajuste o caminho conforme necessário

interface CartItem {
  produto: Produto;
  quantidade: number;
}

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Produto) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantidade: number) => void;
  total: number;
  quantidadeTotal: number;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // ✅ Carregar carrinho salvo no AsyncStorage ao iniciar
  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await AsyncStorage.getItem('@cart');
        if (stored) {
          setItems(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Erro ao carregar o carrinho:', error);
      }
    };

    loadCart();
  }, []);

  // ✅ Salvar automaticamente no AsyncStorage quando o carrinho mudar
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('@cart', JSON.stringify(items));
      } catch (error) {
        console.error('Erro ao salvar o carrinho:', error);
      }
    };

    saveCart();
  }, [items]);

  const addToCart = (produto: Produto) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.produto.id === produto.id);
      
      if (existingIndex >= 0) {
        // Se já existe, aumenta a quantidade
        const newItems = [...prev];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantidade: newItems[existingIndex].quantidade + 1
        };
        return newItems;
      } else {
        // Se não existe, adiciona novo item
        return [...prev, { produto, quantidade: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.produto.id !== id));
  };

  const updateQuantity = (id: string, quantidade: number) => {
    if (quantidade <= 0) {
      removeFromCart(id);
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.produto.id === id ? { ...item, quantidade } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // 💰 Total automático - soma de todos os itens (preço × quantidade)
  const total = items.reduce((sum, item) => sum + (item.produto.preco * item.quantidade), 0);

  // 📦 Quantidade total de itens no carrinho
  const quantidadeTotal = items.reduce((sum, item) => sum + item.quantidade, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      updateQuantity,
      total, 
      quantidadeTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart deve ser usado dentro de um CartProvider');
  return context;
};