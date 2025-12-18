import { useState, useEffect, useCallback } from 'react';
import { Produto } from '@/app/src/@types/home';
import { favoritoService } from '@/app/src/services/favoritoService';
import { useAuth } from '@/app/src/context/AuthContext';

export const useFavoritos = () => {
  const [favoritos, setFavoritos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const isFavorito = useCallback((produtoId: string | number): boolean => {
    const idStr = produtoId.toString();
    return favoritos.some(fav => fav.id.toString() === idStr);
  }, [favoritos]);

  const carregarFavoritos = useCallback(async () => {
    if (!user) {
      setFavoritos([]);
      return;
    }

    console.log('🔄 Carregando favoritos...');
    setLoading(true);
    setError(null);
    
    try {
      const produtos = await favoritoService.listarFavoritos();
      
      const produtosMapeados = produtos.map(produto => ({
        ...produto,
        id: produto.id.toString(),
        localizacao: produto.localizacao || 'Local não informado',
        imagem: produto.imagem && produto.imagem.trim() !== '' 
          ? produto.imagem 
          : 'https://via.placeholder.com/170x100/6C2BD9/FFFFFF?text=Produto',
      }));
      
      console.log('✅ Favoritos carregados:', produtosMapeados.length);
      setFavoritos(produtosMapeados);
      
    } catch (err: any) {
      console.error('❌ Erro ao carregar favoritos:', err);
      setError(err.message || 'Erro ao carregar favoritos');
    } finally {
      setLoading(false);
    }
  }, [user]);

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
        console.log(`🗑️ Removendo favorito ${produtoId}`);
        await favoritoService.removerFavorito(idNumero);
        
        // Remove do estado local
        setFavoritos(prev => prev.filter(p => p.id.toString() !== idStr));
        return true;
      } else {
        console.log(`➕ Adicionando favorito ${produtoId}`);
        await favoritoService.adicionarFavorito(idNumero);
        
        // Recarrega lista para ter dados completos
        await carregarFavoritos();
        return true;
      }
      
    } catch (err: any) {
      console.error('❌ Erro ao atualizar favorito:', err);
      setError(err.message || 'Erro ao atualizar favorito');
      return false;
    }
  }, [user, isFavorito, carregarFavoritos]);

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
    recarregarFavoritos: carregarFavoritos,
    
    // Para compatibilidade
    removerFavoritoPorIdString: toggleFavorito,
  };
};