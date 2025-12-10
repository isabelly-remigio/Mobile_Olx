import { apiService } from './api';
import { Produto } from '@/app/src/@types/home';

// Tipos para os filtros
export interface FiltrosProduto {
  termo?: string;
  categoria?: string;
  precoMin?: number;
  precoMax?: number;
  uf?: string;
}

// Categorias do backend (valores exatos que o backend espera)
export enum CategoriaBackend {
  CELULAR_TELEFONIA = 'CELULAR_TELEFONIA',
  ELETRODOMESTICOS = 'ELETRODOMESTICOS',
  CASA_DECORACAO_UTENSILIOS = 'CASA_DECORACAO_UTENSILIOS',
  MODA = 'MODA'
}

// Categorias para o frontend
export const CATEGORIAS_FRONTEND = [
  { 
    id: 'tudo', 
    nome: 'Tudo', 
    icone: 'apps',
    backendValue: null 
  },
  { 
    id: 'celulares', 
    nome: 'Celulares', 
    icone: 'smartphone',
    backendValue: CategoriaBackend.CELULAR_TELEFONIA 
  },
  { 
    id: 'eletrodomesticos', 
    nome: 'Eletro', 
    icone: 'kitchen',
    backendValue: CategoriaBackend.ELETRODOMESTICOS 
  },
  { 
    id: 'casa', 
    nome: 'Casa', 
    icone: 'home',
    backendValue: CategoriaBackend.CASA_DECORACAO_UTENSILIOS 
  },
  { 
    id: 'moda', 
    nome: 'Moda', 
    icone: 'checkroom',
    backendValue: CategoriaBackend.MODA 
  }
] as const;

// Estados brasileiros para filtros
export const ESTADOS_BRASILEIROS = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
];

export const produtoService = {
  // Listar todos os produtos ativos
  async listarTodosAtivos(): Promise<Produto[]> {
    try {
      const produtos = await apiService.get<Produto[]>('/produtos');
      return produtos.map(produto => this.transformarProduto(produto));
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      throw error;
    }
  },

  // Pesquisar produtos simples
  async pesquisarProdutos(termo: string): Promise<Produto[]> {
    try {
      const produtos = await apiService.get<Produto[]>('/produtos/pesquisar', {
        params: { termo }
      });
      return produtos.map(produto => this.transformarProduto(produto));
    } catch (error) {
      console.error('Erro ao pesquisar produtos:', error);
      throw error;
    }
  },

  // Pesquisa avançada com filtros
  async pesquisarAvancado(filtros: FiltrosProduto): Promise<Produto[]> {
    try {
      const params: any = {};
      
      if (filtros.termo) params.termo = filtros.termo;
      if (filtros.categoria) params.categoria = filtros.categoria;
      if (filtros.precoMin) params.precoMin = filtros.precoMin;
      if (filtros.precoMax) params.precoMax = filtros.precoMax;
      if (filtros.uf) params.uf = filtros.uf;

      const produtos = await apiService.get<Produto[]>('/produtos/pesquisar-avancado', { params });
      return produtos.map(produto => this.transformarProduto(produto));
    } catch (error) {
      console.error('Erro na pesquisa avançada:', error);
      throw error;
    }
  },

  // Buscar detalhes de um produto
  async visualizarDetalhes(id: number): Promise<Produto> {
    try {
      const produto = await apiService.get<Produto>(`/produtos/${id}`);
      return this.transformarProduto(produto);
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
      throw error;
    }
  },

  // Listar por categoria específica (usando rota /categoria/{categoria})
  async listarPorCategoria(categoriaBackend: string): Promise<Produto[]> {
    try {
      const produtos = await apiService.get<Produto[]>(`/produtos/categoria/${categoriaBackend}`);
      return produtos.map(produto => this.transformarProduto(produto));
    } catch (error) {
      console.error('Erro ao listar por categoria:', error);
      throw error;
    }
  },

 // No método buscarPorCategoria, adicione logs:
async buscarPorCategoria(categoriaId: string): Promise<Produto[]> {
  console.log(`🎯 Buscando por categoria: ${categoriaId}`);
  
  // Encontra a categoria no mapeamento
  const categoria = CATEGORIAS_FRONTEND.find(cat => cat.id === categoriaId);
  
  console.log(`📋 Categoria encontrada:`, categoria);
  
  if (!categoria || categoria.id === 'tudo') {
    console.log('📦 Retornando todos os produtos');
    return this.listarTodosAtivos();
  }

  if (categoria.backendValue) {
    try {
      console.log(`🔄 Usando rota específica: /produtos/categoria/${categoria.backendValue}`);
      const produtos = await this.listarPorCategoria(categoria.backendValue);
      console.log(`✅ ${produtos.length} produtos retornados`);
      return produtos;
    } catch (error) {
      console.log(`⚠️ Rota específica falhou, usando fallback:`, error);
      // Fallback: usa pesquisa avançada
      console.log(`🔄 Fallback: usando pesquisa avançada com categoria ${categoria.backendValue}`);
      const produtos = await this.pesquisarAvancado({
        categoria: categoria.backendValue
      });
      console.log(`✅ ${produtos.length} produtos retornados (fallback)`);
      return produtos;
    }
  }

  console.log('📦 Retornando todos os produtos (fallback final)');
  return this.listarTodosAtivos();
},

  // Função para transformar dados do backend para o formato do frontend
  transformarProduto(produtoBackend: any): Produto {
    return {
      id: produtoBackend.id.toString(),
      titulo: produtoBackend.nome,
      descricao: produtoBackend.descricao || '',
      preco: produtoBackend.preco || 0,
      localizacao: produtoBackend.vendedor?.endereco?.cidade 
        ? `${produtoBackend.vendedor.endereco.cidade}, ${produtoBackend.vendedor.endereco.uf}`
        : 'Localização não informada',
      destaque: produtoBackend.status === 'ATIVO',
      imagem: produtoBackend.imagem 
        ? this.getImagemUrl(produtoBackend.imagem)
        : 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=170&h=100&fit=crop',
      categoria: produtoBackend.categoriaProduto,
      condicao: produtoBackend.condicao,
      dataPublicacao: produtoBackend.dataPublicacao,
      vendedor: {
        id: produtoBackend.vendedor?.id,
        nome: produtoBackend.vendedor?.nome || 'Vendedor',
        telefone: produtoBackend.vendedor?.telefone,
      }
    };
  },

  // Gerar URL da imagem
  getImagemUrl(nomeArquivo: string): string {
    if (!nomeArquivo) return 'https://via.placeholder.com/170x100?text=Sem+Imagem';
    return `http://localhost:8080/api/produtos/imagens/${nomeArquivo}`;
  },

  // Métodos auxiliares para categorias
  getCategorias() {
    return CATEGORIAS_FRONTEND;
  },

  getEstados() {
    return ESTADOS_BRASILEIROS;
  },

  // Mapear categoria do frontend para backend
  mapearParaBackend(categoriaId: string): string | null {
    const categoria = CATEGORIAS_FRONTEND.find(cat => cat.id === categoriaId);
    return categoria?.backendValue || null;
  },

  // Mapear categoria do backend para frontend
  mapearParaFrontend(categoriaBackend: string): string {
    const categoria = CATEGORIAS_FRONTEND.find(
      cat => cat.backendValue === categoriaBackend
    );
    return categoria?.id || 'tudo';
  },

  // Verificar se uma categoria é válida
  isCategoriaValida(categoria: string): boolean {
    return Object.values(CategoriaBackend).includes(categoria as CategoriaBackend);
  }
};