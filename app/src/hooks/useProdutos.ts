import { useState, useEffect } from 'react';
import { useProduct } from '../context/ProductContext';

export const useProdutos = (categoriaId?: string) => {
  const { produtos, buscarProdutos } = useProduct();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarProdutos();
  }, [categoriaId]);

  const carregarProdutos = async () => {
    try {
      setCarregando(true);
      await buscarProdutos(categoriaId);
    } catch (error) {
      setErro('Erro ao carregar produtos');
    } finally {
      setCarregando(false);
    }
  };

  return { 
    produtos, 
    carregando, 
    erro, 
    recarregar: carregarProdutos 
  };
};