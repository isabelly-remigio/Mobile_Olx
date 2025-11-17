import React, { createContext, useContext, useState } from 'react';

interface Produto {
  id: string;
  titulo: string;
  preco: number;
  imagem: string;
  categoria: string;
  descricao: string;
  vendedor: string;
  favoritado: boolean;
}

interface ProductContextData {
  produtos: Produto[];
  favoritos: Produto[];
  carrinho: Produto[];
  adicionarFavorito: (produto: Produto) => void;
  removerFavorito: (produtoId: string) => void;
  adicionarAoCarrinho: (produto: Produto) => void;
  removerDoCarrinho: (produtoId: string) => void;
  buscarProdutos: (categoria?: string) => void;
}

const ProductContext = createContext<ProductContextData>({} as ProductContextData);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [favoritos, setFavoritos] = useState<Produto[]>([]);
  const [carrinho, setCarrinho] = useState<Produto[]>([]);

  const adicionarFavorito = (produto: Produto) => {
    setFavoritos(prev => [...prev, { ...produto, favoritado: true }]);
  };

  const removerFavorito = (produtoId: string) => {
    setFavoritos(prev => prev.filter(p => p.id !== produtoId));
  };

  const adicionarAoCarrinho = (produto: Produto) => {
    setCarrinho(prev => [...prev, produto]);
  };

  const removerDoCarrinho = (produtoId: string) => {
    setCarrinho(prev => prev.filter(p => p.id !== produtoId));
  };

  const buscarProdutos = async (categoria?: string) => {
    // Lógica para buscar produtos da API
  };

  return (
    <ProductContext.Provider value={{
      produtos,
      favoritos,
      carrinho,
      adicionarFavorito,
      removerFavorito,
      adicionarAoCarrinho,
      removerDoCarrinho,
      buscarProdutos
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);