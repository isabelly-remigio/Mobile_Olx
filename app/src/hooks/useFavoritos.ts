// hooks/useFavoritos.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Produto } from '../@types/home';

const FAVORITOS_KEY = 'favoritos';

export const useFavoritos = () => {
  const [favoritos, setFavoritos] = useState<string[]>([]); // Array de IDs dos produtos favoritados

  // Carregar favoritos do AsyncStorage
  useEffect(() => {
    carregarFavoritos();
  }, []);

  const carregarFavoritos = async () => {
    try {
      const favoritosSalvos = await AsyncStorage.getItem(FAVORITOS_KEY);
      if (favoritosSalvos) {
        setFavoritos(JSON.parse(favoritosSalvos));
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  };

  const salvarFavoritos = async (novosFavoritos: string[]) => {
    try {
      await AsyncStorage.setItem(FAVORITOS_KEY, JSON.stringify(novosFavoritos));
      setFavoritos(novosFavoritos);
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  };

  const adicionarFavorito = async (produtoId: string) => {
    const novosFavoritos = [...favoritos, produtoId];
    await salvarFavoritos(novosFavoritos);
  };

  const removerFavorito = async (produtoId: string) => {
    const novosFavoritos = favoritos.filter(id => id !== produtoId);
    await salvarFavoritos(novosFavoritos);
  };

  const toggleFavorito = async (produtoId: string) => {
    if (favoritos.includes(produtoId)) {
      await removerFavorito(produtoId);
    } else {
      await adicionarFavorito(produtoId);
    }
  };

  const isFavorito = (produtoId: string) => {
    return favoritos.includes(produtoId);
  };

  return {
    favoritos,
    adicionarFavorito,
    removerFavorito,
    toggleFavorito,
    isFavorito
  };
};