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

const carregarFavoritos = useCallback(async () => {
  if (!user) {
    setFavoritos([]);
    return;
  }

  console.log('🔄 Iniciando carregamento de favoritos...');
  setLoading(true);
  setError(null);
  
  try {
    const produtos = await favoritoService.listarFavoritos();
    
    console.log('✅ Produtos recebidos da API:', produtos.length);
    
    // DEBUG: Verificar estrutura do primeiro produto
    if (produtos.length > 0) {
      const primeiro = produtos[0];
      console.log('📋 ESTRUTURA COMPLETA DO PRIMEIRO PRODUTO:', {
        ...primeiro,
        // Verificar URL da imagem
        imagemTipo: typeof primeiro.imagem,
        imagemValor: primeiro.imagem,
        // Verificar outras propriedades
        todasChaves: Object.keys(primeiro)
      });
      
      // Verificar se a imagem é válida
      if (primeiro.imagem) {
        console.log('🔗 Teste de URL da imagem:');
        console.log('É string?', typeof primeiro.imagem === 'string');
        console.log('Tem conteúdo?', primeiro.imagem.length > 0);
        console.log('Começa com http?', primeiro.imagem.startsWith('http'));
        console.log('Começa com /?', primeiro.imagem.startsWith('/'));
      }
    }
    
    // Mapear produtos
    const produtosMapeados = produtos.map(produto => ({
      ...produto,
      id: produto.id.toString(),
      localizacao: produto.localizacao || 'Local não informado',
      // Se a imagem for vazia ou inválida, usar fallback
      imagem: produto.imagem && produto.imagem.trim() !== '' 
        ? produto.imagem 
        : 'https://via.placeholder.com/170x100/6C2BD9/FFFFFF?text=Produto',
    }));
    
    setFavoritos(produtosMapeados);
    
  } catch (err: any) {
    console.error('❌ Erro ao carregar favoritos:', err);
    setError(err.message || 'Erro ao carregar favoritos');
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