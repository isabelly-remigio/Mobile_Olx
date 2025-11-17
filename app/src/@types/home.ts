// @types/home.ts
export interface Categoria {
  id: string;
  nome: string;
  icone: string;
}

export interface Banner {
  titulo: string;
  subtitulo: string;
  imagem?: string;
}

export interface Produto {
  imagem: string;
  titulo: string;
  descricao: string;
  preco: number;
  localizacao: string;
  destaque?: boolean;
  favoritado?: boolean;
}

export interface Usuario {
  nome: string;
}

export interface Filtro {
  precoMin?: number;
  precoMax?: number;
  estado?: string;
  categoria?: string;
  disponivel?: boolean;
}

export interface Estado {
  sigla: string;
  nome: string;
}

export interface FiltroAtivo {
  tipo: string;
  valor: string | number;
  label: string;
}

// Props dos componentes
export interface NavCategoriasProps {
  categorias: Categoria[];
  ativa: string;
  onChangeCategoria: (id: string) => void;
}

export interface BarraPesquisaProps {
  placeholder?: string;
  onSearch: (texto: string) => void;
  onFiltrosChange?: (filtros: Filtro) => void;
  resultadosCount?: number;
  mostrarResultadosVazios?: boolean;
}

export interface CarrosselPromocionalProps {
  banners: Banner[];
  onClick: (banner: Banner) => void;
}

export interface CardProdutoProps {
  produto: Produto;
  onClick: () => void;
}

export interface FooterNavigationProps {
  ativo: string;
  onNavigate: (id: string) => void;
}

export interface HeaderProps {
  usuarioLogado?: Usuario | null;
  onToggleLogin: () => void;
  onNotificacoes: () => void;
}

export interface ModalFiltrosProps {
  isOpen: boolean;
  onClose: () => void;
  onAplicarFiltros: (filtros: Filtro) => void;
  categorias: Categoria[];
}