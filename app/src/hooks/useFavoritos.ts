import { useState, useEffect, useCallback } from 'react';
import { Produto } from '@/app/src/@types/home';
import { favoritoService } from '@/app/src/services/favoritoService';
import { useAuth } from '@/app/src/context/AuthContext';

export const useFavoritos = () => {
  const [favoritos, setFavoritos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Função para verificar se é favorito (sincrona, verifica estado local)
  const isFavorito = useCallback((produtoId: string | number): boolean => {
    const idStr = produtoId.toString();
    const encontrado = favoritos.some(fav => fav.id.toString() === idStr);
    return encontrado;
  }, [favoritos]);

  // Carregar favoritos do backend
 // No hook useFavoritos, dentro da função carregarFavoritos
const carregarFavoritos = useCallback(async () => {
  if (!user) {
    setFavoritos([]);
    return;
  }

  setLoading(true);
  setError(null);
  
  try {
    const produtos = await favoritoService.listarFavoritos();
    
    // DEBUG: Verificar estrutura dos produtos
    console.log('Estrutura do primeiro produto:', produtos.length > 0 ? {
      id: produtos[0].id,
      nome: produtos[0].nome,
      localizacao: produtos[0].localizacao,
      possuiLocalizacao: !!produtos[0].localizacao,
      todasPropriedades: Object.keys(produtos[0])
    } : 'Sem produtos');
    
    // Verificar se os produtos têm dados válidos
    const produtosValidados = produtos.map(produto => ({
      ...produto,
      id: produto.id.toString(),
      // Garantir que localizacao exista
      localizacao: produto.localizacao || 'Local não informado',
      imagem: produto.imagem || 'https://via.placeholder.com/170x100?text=Sem+Imagem'
    }));
    
    setFavoritos(produtosValidados);
    
  } catch (err: any) {
    const errorMessage = err.message || 'Erro ao carregar favoritos';
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
}, [user]);

  // Função para alternar favorito (adicionar/remover)
  const toggleFavorito = useCallback(async (produtoId: string | number) => {
    if (!user) {
      setError('Faça login para favoritar');
      return false;
    }

    const idStr = produtoId.toString();
    const idNumero = parseInt(idStr);
    
    if (isNaN(idNumero)) {
      return false;
    }
    
    try {
      const jaEFavorito = isFavorito(produtoId);
      
      if (jaEFavorito) {
        await favoritoService.removerFavorito(idNumero);
        
        // Remove do estado local imediatamente
        setFavoritos(prev => prev.filter(p => p.id.toString() !== idStr));
        
      } else {
        await favoritoService.adicionarFavorito(idNumero);
        
        // Recarrega lista para ter dados completos do produto
        await carregarFavoritos();
      }
      
      return true;
      
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar favorito');
      return false;
    }
  }, [user, isFavorito, carregarFavoritos]);

  // Função específica para tela de favoritos (remove por ID string)
  const removerFavoritoPorIdString = useCallback(async (produtoId: string) => {
    return toggleFavorito(produtoId);
  }, [toggleFavorito]);

  // Carregar favoritos quando o usuário mudar
  useEffect(() => {
    if (user) {
      carregarFavoritos();
    } else {
      setFavoritos([]);
      setError(null);
    }
  }, [user, carregarFavoritos]);

  return {
    // Estado
    favoritos,
    loading,
    error,
    hasError: !!error,
    
    // Funções
    toggleFavorito,
    isFavorito,
    removerFavoritoPorIdString,
    recarregarFavoritos: carregarFavoritos,
    
    // Métodos de conveniência
    adicionarFavorito: (produtoId: string | number) => 
      !isFavorito(produtoId) ? toggleFavorito(produtoId) : Promise.resolve(false),
    
    removerFavorito: (produtoId: string | number) => 
      isFavorito(produtoId) ? toggleFavorito(produtoId) : Promise.resolve(false),
  };
};