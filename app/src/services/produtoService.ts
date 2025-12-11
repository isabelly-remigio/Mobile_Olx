import { apiService, publicApi } from './api';
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

export interface ProdutoAPI {
  id: number;
  nome: string;
  descricao: string;
  condicao: string;
  preco: number;
  dataPublicacao: string;
  status: string;
  categoriaProduto: string;
  caracteristicas: Record<string, any>;
  vendedor: {
    id: number;
    nome: string;
    telefone?: string;
    endereco: {
      cidade: string;
      uf: string;
      bairro?: string;
    };
  };
  imagem: string;
}

// Adicione esta função para transformar API -> Frontend
export function transformarProdutoAPI(produtoAPI: ProdutoAPI): Produto {
  return {
    id: produtoAPI.id.toString(),
    nome: produtoAPI.nome,
    descricao: produtoAPI.descricao,
    preco: produtoAPI.preco,
    localizacao: `${produtoAPI.vendedor.endereco.cidade}, ${produtoAPI.vendedor.endereco.uf}`,
    destaque: produtoAPI.status === 'ATIVO', // Ou alguma lógica para destaque
    imagem: produtoAPI.imagem,
    categoria: produtoAPI.categoriaProduto,
    condicao: produtoAPI.condicao,
    dataPublicacao: produtoAPI.dataPublicacao,
    vendedor: {
      id: produtoAPI.vendedor.id,
      nome: produtoAPI.vendedor.nome,
      telefone: produtoAPI.vendedor.telefone
    }
  };
}


export const produtoService = {
  // Listar todos os produtos ativos
async listarTodosAtivos(): Promise<Produto[]> {
  try {
    console.log('🔍 Chamando API /produtos...');
    const response = await publicApi.get('/produtos');
    console.log('📦 Dados brutos da API:', response.data);
    
    // TRANSFORME os dados como nas outras funções
    const produtosTransformados = response.data.map((produtoBackend: any) => 
      this.transformarProduto(produtoBackend)
    );
    
    console.log('✨ Produtos transformados:', produtosTransformados);
    return produtosTransformados;
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    throw error;
  }
},
  // Pesquisar produtos simples
  async pesquisarProdutos(termo: string): Promise<Produto[]> {
    try {
      console.log(`🔍 Pesquisando por: "${termo}"`);
      
      const response = await publicApi.get('/produtos/pesquisar', {
        params: { termo }
      });
      
      console.log(`✅ Resultados da pesquisa: ${response.data.length} produtos`);
      
      // Transforma os produtos
      return response.data.map((produtoBackend: any) => 
        this.transformarProduto(produtoBackend)
      );
    } catch (error) {
      console.error('Erro ao pesquisar produtos:', error);
      throw error;
    }
  },

  // Pesquisa avançada com filtros
  async pesquisarAvancado(filtros: FiltrosProduto): Promise<Produto[]> {
    try {
      console.log('🎯 Pesquisa avançada com filtros:', filtros);
      
      // Remove filtros vazios/undefined
      const params: any = {};
      
      if (filtros.termo && filtros.termo.trim()) {
        params.termo = filtros.termo;
      }
      
      if (filtros.categoria) {
        params.categoria = filtros.categoria;
      }
      
      if (filtros.precoMin !== undefined && filtros.precoMin > 0) {
        params.precoMin = filtros.precoMin;
      }
      
      if (filtros.precoMax !== undefined && filtros.precoMax > 0) {
        params.precoMax = filtros.precoMax;
      }
      
      if (filtros.uf) {
        params.uf = filtros.uf;
      }
      
      console.log('📡 Parâmetros da pesquisa:', params);
      
      // Faz a requisição
      const response = await publicApi.get('/produtos/pesquisar-avancado', { params });
      
      console.log(`✅ Resultados: ${response.data.length} produtos`);
      
      // Transforma os produtos
      return response.data.map((produtoBackend: any) => 
        this.transformarProduto(produtoBackend)
      );
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
    console.log(`📡 Chamando API: /produtos/categoria/${categoriaBackend}`);
    const response = await publicApi.get(`/produtos/categoria/${categoriaBackend}`);
    
    console.log(`📦 Resposta da API para categoria ${categoriaBackend}:`, response.data);
    
    // Transforma os produtos
    const produtosTransformados = response.data.map((produtoBackend: any) => 
      this.transformarProduto(produtoBackend)
    );
    
    console.log(`✨ ${produtosTransformados.length} produtos transformados`);
    return produtosTransformados;
  } catch (error) {
    console.error(`❌ Erro ao listar por categoria ${categoriaBackend}:`, error);
    throw error;
  }
},

 // No produtoService, ajuste o método buscarPorCategoria:
async buscarPorCategoria(categoriaId: string): Promise<Produto[]> {
  console.log(`🎯 Buscando por categoria ID do frontend: ${categoriaId}`);
  
  // Encontra a categoria no mapeamento
  const categoriaFrontend = CATEGORIAS_FRONTEND.find(cat => cat.id === categoriaId);
  
  console.log('📋 Categoria frontend encontrada:', categoriaFrontend);
  
  if (!categoriaFrontend || categoriaFrontend.id === 'tudo') {
    console.log('📦 Categoria "tudo" selecionada, retornando todos os produtos');
    return this.listarTodosAtivos();
  }

  // Verifica se tem o valor do backend
  if (categoriaFrontend.backendValue) {
    console.log(`🔄 Convertendo para backend: ${categoriaFrontend.backendValue}`);
    
    try {
      // Tenta usar a rota específica de categoria
      const produtos = await this.listarPorCategoria(categoriaFrontend.backendValue);
      console.log(`✅ ${produtos.length} produtos retornados da categoria ${categoriaFrontend.backendValue}`);
      return produtos;
    } catch (error) {
      console.log(`⚠️ Rota específica falhou:`, error);
      
      // Fallback: tenta pesquisa avançada
      console.log(`🔄 Tentando pesquisa avançada como fallback...`);
      try {
        const produtos = await this.pesquisarAvancado({
          categoria: categoriaFrontend.backendValue
        });
        console.log(`✅ ${produtos.length} produtos retornados (fallback)`);
        return produtos;
      } catch (fallbackError) {
        console.log(`❌ Fallback também falhou:`, fallbackError);
        throw fallbackError;
      }
    }
  }

  console.log('⚠️ Categoria sem backendValue, retornando todos os produtos');
  return this.listarTodosAtivos();
},

 transformarProduto(produtoBackend: any): Produto {
  console.log('🔄 Transformando produto backend:', {
    id: produtoBackend.id,
    nome: produtoBackend.nome,
    temVendedor: !!produtoBackend.vendedor,
    temEndereco: !!produtoBackend.vendedor?.endereco,
    cidade: produtoBackend.vendedor?.endereco?.cidade,
    uf: produtoBackend.vendedor?.endereco?.uf
  });

  // CORREÇÃO: Use 'nome' em vez de 'titulo'
  const produtoTransformado: Produto = {
    id: produtoBackend.id.toString(),
    nome: produtoBackend.nome, // AGORA É 'nome' em vez de 'titulo'
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

  console.log('✅ Produto transformado:', {
    nome: produtoTransformado.nome,
    localizacao: produtoTransformado.localizacao,
    imagem: produtoTransformado.imagem
  });

  return produtoTransformado;
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