import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/product';

type CartContextType = {
  items: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<Product[]>([]);

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
    AsyncStorage.setItem('@cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product) => {
    setItems(prev => {
      // evita duplicatas
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev;
      return [...prev, product];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(p => p.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  // 💰 Total automático
  const total = items.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart deve ser usado dentro de um CartProvider');
  return context;
};
