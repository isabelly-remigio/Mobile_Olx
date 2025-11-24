// @types/anuncio.ts
export interface Anunciante {
  nome: string;
  dataCadastro: string;
  regiao: string;
  cidade: string;
  estado: string;
  tempoResposta: string;
  emailVerificado: boolean;
  telefoneVerificado: boolean;
  telefone: string;
}

export interface Localizacao {
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface DetalhesProduto {
  cor: string;
  condicao: string;
  marca: string;
  modelo: string;
  armazenamento: string;
  memoria: string;
}

export interface Anuncio {
  id: string;
  nome: string;
  preco: number;
  anunciante: Anunciante;
  imagens: string[];
  descricao: string;
  detalhes: DetalhesProduto;
  localizacao: Localizacao;
}

export interface CarrosselAnuncioProps {
  imagens: string[];
}


export interface AcoesAnuncioProps {
  onWhatsApp: () => void;
  onComprarAgora: () => void;
  onAdicionarCarrinho: () => void;
}
