// @types/anuncio.ts
export interface Anuncio {
  id: string;
  nome: string;
  preco: number;
  anunciante: {
    nome: string;
    dataCadastro?: string;
    regiao?: string;
    cidade?: string;
    estado?: string;
    tempoResposta?: string;
    emailVerificado?: boolean;
    telefoneVerificado?: boolean;
    telefone?: string;
    id?: number;
  };
  imagens: string[];
  descricao: string;
  detalhes: {
    cor?: string;
    condicao?: string;
    marca?: string;
    modelo?: string;
    armazenamento?: string;
    memoria?: string;
    [key: string]: any; // Para características dinâmicas
  };
  localizacao: {
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };
  categoria?: string;
  dataPublicacao?: string;
  status?: string;
}

// Interface para a resposta do backend
export interface ProdutoBackend {
  id: number;
  nome: string;
  descricao: string;
  condicao: string;
  preco: number;
  dataPublicacao: string;
  status: string;
  categoriaProduto: string;
  caracteristicas: Record<string, any> | null;
  vendedor: {
    id: number;
    nome: string;
    telefone: string;
    email: string;
    endereco?: {
      cep: string;
      logradouro: string;
      numero: string;
      complemento: string;
      bairro: string;
      cidade: string;
      uf: string;
    };
  };
  imagem: string | null;
}

export interface CarrosselAnuncioProps {
  imagens: string[];
}


export interface AcoesAnuncioProps {
  onWhatsApp: () => void;
  onComprarAgora: () => void;
  onAdicionarCarrinho: () => void;
}
