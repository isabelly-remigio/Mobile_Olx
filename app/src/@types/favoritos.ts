export interface Produto {
  id: number;
  nome: string;
  preco: number;
  imagem?: string;
  localizacao?: string;
  cidade?: string;
  estado?: string;
  destaque?: boolean;
  descricao?: string;
  usuarioId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FavoritoResponse {
  id: number;
  usuarioId: number;
  produtoId: number;
  produto: Produto;
  createdAt: string;
}

export interface FavoritoRequest {
  produtoId: number;
}

export interface VerificarFavoritoResponse {
  isFavorito: boolean;
}