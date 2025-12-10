import { apiService } from './api';
import { Anuncio, ProdutoBackend } from '@/app/src/@types/anuncio';
import { produtoService } from './produtoService';

export const anuncioService = {
  // Buscar detalhes de um anúncio pelo ID
  async buscarPorId(id: string): Promise<Anuncio> {
    try {
      console.log(`🔍 Buscando detalhes do anúncio ID: ${id}`);
      
      // Converte string para número
      const produtoId = Number(id);
      
      if (isNaN(produtoId)) {
        throw new Error('ID do produto inválido');
      }

      // Faz a requisição para a API
      const produtoBackend = await apiService.get<ProdutoBackend>(`/produtos/${produtoId}`);
      
      // Transforma os dados do backend para o formato do frontend
      return this.transformarParaAnuncio(produtoBackend);
      
    } catch (error: any) {
      console.error('❌ Erro ao buscar detalhes do anúncio:', error);
      
      // Se houver erro na API, usa dados mockados como fallback
      if (error.message.includes('404') || error.message.includes('não encontrado')) {
        throw new Error('Produto não encontrado');
      }
      
      throw new Error(`Erro ao carregar anúncio: ${error.message}`);
    }
  },

  // Transformar dados do backend para formato do frontend
  transformarParaAnuncio(produto: ProdutoBackend): Anuncio {
    // Extrair características
    const caracteristicas = produto.caracteristicas || {};
    
    // Mapear condição
    const condicaoMap: Record<string, string> = {
      'NOVO': 'Novo',
      'USADO': 'Usado',
      'SEMINOVO': 'Seminovo'
    };

    // Criar array de imagens
    const imagens = [];
    if (produto.imagem) {
      imagens.push(produtoService.getImagemUrl(produto.imagem));
    }
    // Adiciona imagem placeholder se não houver imagens
    if (imagens.length === 0) {
      imagens.push('https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop');
    }

    return {
      id: produto.id.toString(),
      nome: produto.nome,
      preco: produto.preco,
      anunciante: {
        id: produto.vendedor.id,
        nome: produto.vendedor.nome || 'Vendedor',
        telefone: produto.vendedor.telefone || '',
        email: produto.vendedor.email || '',
        cidade: produto.vendedor.endereco?.cidade,
        estado: produto.vendedor.endereco?.uf,
        dataCadastro: produto.dataPublicacao,
        emailVerificado: true, // Pode ajustar conforme sua lógica
        telefoneVerificado: true, // Pode ajustar conforme sua lógica
        tempoResposta: '2 horas' // Mockado - pode implementar lógica real
      },
      imagens: imagens,
      descricao: produto.descricao || 'Sem descrição',
      detalhes: {
        condicao: condicaoMap[produto.condicao] || produto.condicao,
        ...caracteristicas,
        categoria: produto.categoriaProduto,
        dataPublicacao: produto.dataPublicacao
      },
      localizacao: {
        bairro: produto.vendedor.endereco?.bairro,
        cidade: produto.vendedor.endereco?.cidade,
        estado: produto.vendedor.endereco?.uf,
        cep: produto.vendedor.endereco?.cep
      },
      categoria: produto.categoriaProduto,
      dataPublicacao: produto.dataPublicacao,
      status: produto.status
    };
  },

  // Método para buscar múltiplos anúncios (opcional)
  async buscarAnunciosPorIds(ids: string[]): Promise<Anuncio[]> {
    const promessas = ids.map(id => this.buscarPorId(id).catch(() => null));
    const resultados = await Promise.all(promessas);
    return resultados.filter((anuncio): anuncio is Anuncio => anuncio !== null);
  }
};