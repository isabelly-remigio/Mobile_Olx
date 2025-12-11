import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Text, Icon } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/src/context/AuthContext';
import Header from '../src/components/layout/Header';
import NavCategorias from '../src/components/ui/NavCategorias';
import BarraPesquisa from '../src/components/ui/BarraPesquisa';
import Carrossel from '../src/components/ui/Carrossel';
import CardProduto from '../src/components/ui/CardProduto';
import { HomeScreenStyles } from '../src/styles/HomeScreenStyles';
import { theme } from '../src/theme/theme';
import { produtoService, CATEGORIAS_FRONTEND, FiltrosProduto } from '../src/services/produtoService';
import {
  Categoria,
  Banner,
  Produto,
  Filtro, // ADICIONE ESTE IMPORT
} from '../src/@types/home';

// Categorias para os ícones
const categorias: Categoria[] = CATEGORIAS_FRONTEND.map(cat => ({
  id: cat.id,
  nome: cat.nome,
  icone: cat.icone
}));

const banners: Banner[] = [
  {
    id: '1',
    titulo: 'Ofertas Imperdíveis',
    subtitulo: 'Produtos com até 70% de desconto',
    imagem: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=400&h=200&fit=crop',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [categoriaAtiva, setCategoriaAtiva] = useState('tudo');
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);
  const [produtosDiversos, setProdutosDiversos] = useState<Produto[]>([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtrosAtivos, setFiltrosAtivos] = useState<FiltrosProduto>({});

  // DEBUG: Adicione este useEffect para monitorar
  useEffect(() => {
    console.log('Produtos diversos:', produtosDiversos);
    console.log('Carregando:', carregando);
  }, [produtosDiversos, carregando]);

  // Carregar produtos ao iniciar
  useEffect(() => {
    console.log('=== INICIANDO CARREGAMENTO ===');
    carregarProdutos();
  }, []);

  // Função para carregar todos os produtos
  const carregarProdutos = async () => {
    try {
      console.log('Chamando API para carregar produtos...');
      setCarregando(true);
      setErro(null);
      
      // Busca produtos da API (já transformados pelo serviço)
      const produtos = await produtoService.listarTodosAtivos();
      console.log('Produtos recebidos da API:', produtos.length);
      
      // Log dos primeiros produtos para debug
      produtos.slice(0, 3).forEach((produto, index) => {
        console.log(`Produto ${index + 1}:`, {
          id: produto.id,
          nome: produto.nome, // CORRIGIDO: estava 'titulo'
          localizacao: produto.localizacao,
          preco: produto.preco,
          temImagem: !!produto.imagem,
          destaque: produto.destaque
        });
      });
      
      setProdutosDiversos(produtos);
      setProdutosFiltrados(produtos);
      
      console.log('Produtos carregados com sucesso:', produtos.length);
      
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setErro('Erro ao carregar produtos. Tente novamente.');
      
      // Usa fallback se a API falhar
      const produtosFallback = getProdutosFallback();
      console.log('Usando fallback:', produtosFallback.length, 'produtos');
      
      setProdutosDiversos(produtosFallback);
      setProdutosFiltrados(produtosFallback);
    } finally {
      setCarregando(false);
      console.log('Carregamento finalizado');
    }
  };

  // Quando a categoria muda
  const handleChangeCategoria = async (categoriaId: string) => {
    console.log('🔘 Usuário clicou na categoria:', categoriaId);
    setCategoriaAtiva(categoriaId);
    setBuscando(false);
    
    try {
      setCarregando(true);
      
      // Se for "tudo", mostra todos os produtos
      if (categoriaId === 'tudo') {
        console.log('📊 Mostrando todos os produtos (tudo)');
        setProdutosFiltrados(produtosDiversos);
        return;
      }
      
      console.log(`🔄 Buscando produtos da categoria ${categoriaId}...`);
      
      // Para outras categorias, busca da API
      const produtos = await produtoService.buscarPorCategoria(categoriaId);
      
      console.log(`✅ Encontrados ${produtos.length} produtos na categoria ${categoriaId}`);
      
      // Verifique se os produtos têm localização
      produtos.forEach((produto, index) => {
        console.log(`   ${index + 1}. ${produto.nome} - ${produto.localizacao}`);
      });
      
      setProdutosFiltrados(produtos);
      
    } catch (error) {
      console.error('❌ Erro ao buscar por categoria:', error);
      
      // Fallback: volta para "tudo"
      setCategoriaAtiva('tudo');
      setProdutosFiltrados(produtosDiversos);
      
      Alert.alert(
        'Categoria vazia',
        'Não há produtos nesta categoria no momento.',
        [{ text: 'OK' }]
      );
    } finally {
      setCarregando(false);
    }
  };

  const handleSearch = useCallback(async (texto: string) => {
    console.log('🔍 Pesquisando:', texto);
    setTermoPesquisa(texto);
    const estaBuscando = !!texto.trim();
    setBuscando(estaBuscando);

    if (!texto.trim() && Object.keys(filtrosAtivos).length === 0) {
      console.log('📊 Sem texto nem filtros, mostrando todos os produtos');
      setProdutosFiltrados(produtosDiversos);
      return;
    }

    try {
      setCarregando(true);
      let resultados: Produto[] = [];
      
      // Se tem texto OU filtros, faz pesquisa
      if (texto.trim() || Object.keys(filtrosAtivos).length > 0) {
        console.log('🎯 Fazendo pesquisa com:', { texto, filtrosAtivos });
        
        // Combina termo de pesquisa com filtros ativos
        const filtrosCombinados: FiltrosProduto = {
          ...filtrosAtivos,
          termo: texto.trim() || undefined
        };
        
        // Remove categoria se for "tudo" (já é tratado separadamente)
        if (categoriaAtiva === 'tudo' && filtrosCombinados.categoria) {
          delete filtrosCombinados.categoria;
        }
        
        // Faz pesquisa avançada
        resultados = await produtoService.pesquisarAvancado(filtrosCombinados);
      } else {
        // Sem texto nem filtros, mostra produtos da categoria atual
        if (categoriaAtiva === 'tudo') {
          resultados = produtosDiversos;
        } else {
          resultados = await produtoService.buscarPorCategoria(categoriaAtiva);
        }
      }
      
      console.log(`✅ ${resultados.length} produtos encontrados`);
      setProdutosFiltrados(resultados);
      
    } catch (error) {
      console.error('❌ Erro na pesquisa:', error);
      Alert.alert('Erro', 'Não foi possível realizar a pesquisa');
      
      // Fallback: mostra produtos da categoria atual
      if (categoriaAtiva === 'tudo') {
        setProdutosFiltrados(produtosDiversos);
      }
    } finally {
      setCarregando(false);
    }
  }, [produtosDiversos, filtrosAtivos, categoriaAtiva]);

  // CORREÇÃO: Esta função recebe Filtro (do Modal) e converte para FiltrosProduto (da API)
  const handleFiltrosChange = useCallback(async (filtrosModal: Filtro) => {
    console.log('⚙️ Filtros alterados (do modal):', filtrosModal);
    
    // Converte Filtro do modal para FiltrosProduto (formato da API)
    const filtrosAPI: FiltrosProduto = {
      termo: termoPesquisa || undefined,
      categoria: filtrosModal.categoria || undefined,
      precoMin: filtrosModal.precoMin || undefined,
      precoMax: filtrosModal.precoMax || undefined,
      uf: filtrosModal.estado || undefined
    };
    
    console.log('📡 Filtros convertidos para API:', filtrosAPI);
    setFiltrosAtivos(filtrosAPI);
    
    // Se não há termo de pesquisa nem filtros, volta aos produtos normais
    const temFiltrosAtivos = Object.values(filtrosAPI).some(valor => valor !== undefined);
    
    if (!termoPesquisa.trim() && !temFiltrosAtivos) {
      console.log('📊 Sem filtros ativos, mostrando produtos normais');
      if (categoriaAtiva === 'tudo') {
        setProdutosFiltrados(produtosDiversos);
      } else {
        await handleChangeCategoria(categoriaAtiva);
      }
      return;
    }
    
    // Aplica os filtros
    try {
      setCarregando(true);
      console.log('🎯 Aplicando filtros na API:', filtrosAPI);
      
      const resultados = await produtoService.pesquisarAvancado(filtrosAPI);
      console.log(`✅ ${resultados.length} produtos encontrados com filtros`);
      
      setProdutosFiltrados(resultados);
    } catch (error) {
      console.error('❌ Erro ao aplicar filtros:', error);
      Alert.alert('Erro', 'Não foi possível aplicar os filtros');
      
      // Fallback: mostra produtos sem filtros
      if (categoriaAtiva === 'tudo') {
        setProdutosFiltrados(produtosDiversos);
      } else {
        await handleChangeCategoria(categoriaAtiva);
      }
    } finally {
      setCarregando(false);
    }
  }, [termoPesquisa, categoriaAtiva, produtosDiversos]);

  // Função para limpar todos os filtros
  const handleLimparFiltros = useCallback(async () => {
    console.log('🧹 Limpando todos os filtros');
    setFiltrosAtivos({});
    setTermoPesquisa('');
    setBuscando(false);
    
    if (categoriaAtiva === 'tudo') {
      setProdutosFiltrados(produtosDiversos);
    } else {
      await handleChangeCategoria(categoriaAtiva);
    }
  }, [categoriaAtiva, produtosDiversos]);

  const handleToggleLogin = () => {
    if (user) {
      Alert.alert(
        `Olá, ${user.nome}!`,
        'O que você gostaria de fazer?',
        [
          { text: 'Ver Perfil', onPress: () => router.push('/(tabs)/perfil') },
          { text: 'Favoritos', onPress: () => router.push('/(tabs)/favoritos') },
          { text: 'Sair', onPress: signOut, style: 'destructive' },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
    } else {
      router.push('/auth/Login/login');
    }
  };

  const handleNotificacoes = () => {
    if (!user) {
      Alert.alert(
        'Acesso restrito',
        'Você precisa fazer login para ver notificações.',
        [
          { text: 'Fazer Login', onPress: () => router.push('/auth/Login/login') },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
      return;
    }
    
    Alert.alert(
      'Notificações',
      'Você não tem novas notificações no momento.',
      [{ text: 'OK' }]
    );
  };

  const handleAbrirDetalhesAnuncio = (produtoId: string) => {
    console.log('Abrindo detalhes do produto:', produtoId);
    
    if (!user) {
      Alert.alert(
        'Login necessário',
        'Faça login para ver detalhes dos anúncios.',
        [
          { text: 'Fazer Login', onPress: () => router.push('/auth/Login/login') },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
      return;
    }
    
    router.push(`/(tabs)/anuncio/${produtoId}`);
  };

  const handleCarrosselClick = (banner: Banner) => {
    if (!user) {
      Alert.alert(
        'Login necessário',
        'Faça login para ver as ofertas.',
        [
          { text: 'Fazer Login', onPress: () => router.push('/auth/Login/login') },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
      return;
    }
    alert(banner.titulo);
  };

  const renderProdutosVazios = () => (
    <View style={HomeScreenStyles.emptyStateContainer}>
      <Icon
        name="search-off"
        type="material"
        size={64}
        color={theme.colors.gray400}
        style={HomeScreenStyles.emptyStateIcon}
      />
      <Text style={HomeScreenStyles.emptyStateTitle}>
        Nenhum produto encontrado
      </Text>
      <Text style={HomeScreenStyles.emptyStateSubtitle}>
        {termoPesquisa
          ? `Não encontramos resultados para "${termoPesquisa}"`
          : 'Tente ajustar os filtros'}
      </Text>
    </View>
  );

  const renderProdutoHorizontal = ({ item }: { item: Produto }) => {
    console.log('🎴 Renderizando card para:', {
      id: item.id,
      nome: item.nome, // CORRIGIDO: estava item.titulo
      localizacao: item.localizacao,
      temNome: !!item.nome
    });
    
    return (
      <View style={HomeScreenStyles.produtoWrapper}>
        <CardProduto
          produto={item}
          onPress={() => handleAbrirDetalhesAnuncio(item.id)}
        />
      </View>
    );
  };

  // Produtos em destaque (filtrando da lista geral)
  const produtosEmDestaque = produtosDiversos.filter((p) => p.destaque);
  // Produtos mais recentes (últimos 6 produtos)
  const novosAnuncios = produtosDiversos.slice(0, 6);

  console.log('📊 Renderizando HomeScreen:');
  console.log('- Total produtos:', produtosDiversos.length);
  console.log('- Produtos destaque:', produtosEmDestaque.length);
  console.log('- Novos anúncios:', novosAnuncios.length);
  console.log('- Produtos filtrados:', produtosFiltrados.length);
  console.log('- Filtros ativos:', filtrosAtivos);
  console.log('- Buscando:', buscando);
  console.log('- Categoria ativa:', categoriaAtiva);

  // Tela de loading
  if (carregando && !buscando) {
    return (
      <View style={HomeScreenStyles.container}>
        <Header
          usuarioLogado={user}
          onToggleLogin={handleToggleLogin}
          onNotificacoes={handleNotificacoes}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 10, color: theme.colors.gray600 }}>
            Carregando produtos...
          </Text>
        </View>
      </View>
    );
  }

  // Tela de erro
  if (erro && produtosDiversos.length === 0) {
    return (
      <View style={HomeScreenStyles.container}>
        <Header
          usuarioLogado={user}
          onToggleLogin={handleToggleLogin}
          onNotificacoes={handleNotificacoes}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Icon
            name="error-outline"
            type="material"
            size={64}
            color={theme.colors.error}
          />
          <Text style={{ marginTop: 10, textAlign: 'center', color: theme.colors.error }}>
            {erro}
          </Text>
          <Text
            style={{ marginTop: 20, color: theme.colors.primary, textDecorationLine: 'underline' }}
            onPress={carregarProdutos}
          >
            Tentar novamente
          </Text>
        </View>
      </View>
    );
  }

  // Verifique se deve mostrar contador de resultados
  const deveMostrarResultados = buscando || Object.keys(filtrosAtivos).length > 0;
  const resultadosCount = produtosFiltrados.length;

  return (
    <View style={HomeScreenStyles.container}>
      <Header
        usuarioLogado={user}
        onToggleLogin={handleToggleLogin}
        onNotificacoes={handleNotificacoes}
      />

<BarraPesquisa
  placeholder="O que você está procurando?"
  onSearch={handleSearch}
  onFiltrosChange={handleFiltrosChange} // Esta função já está corrigida
  resultadosCount={(buscando || Object.keys(filtrosAtivos).length > 0) ? produtosFiltrados.length : 0}
  mostrarResultadosVazios={(buscando || Object.keys(filtrosAtivos).length > 0) && produtosFiltrados.length === 0}
/>

      <NavCategorias
        categorias={categorias}
        ativa={categoriaAtiva}
        onChangeCategoria={handleChangeCategoria}
        carregando={carregando && !buscando}
      />

      <View style={HomeScreenStyles.content}>
        {buscando ? (
          produtosFiltrados.length === 0 ? (
            renderProdutosVazios()
          ) : (
            <ScrollView
              style={HomeScreenStyles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              <View style={HomeScreenStyles.sectionContainer}>
                <Text style={HomeScreenStyles.searchResultsTitle}>
                  {`${produtosFiltrados.length} resultado${
                    produtosFiltrados.length !== 1 ? 's' : ''
                  } ${termoPesquisa ? `para "${termoPesquisa}"` : 'encontrados'}`}
                </Text>
                <FlatList
                  data={produtosFiltrados}
                  renderItem={renderProdutoHorizontal}
                  keyExtractor={(item) => `search-${item.id}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={HomeScreenStyles.produtosContainer}
                  ListEmptyComponent={() => (
                    <Text style={{ padding: 20, textAlign: 'center', color: theme.colors.gray500 }}>
                      Nenhum produto encontrado
                    </Text>
                  )}
                />
              </View>
            </ScrollView>
          )
        ) : (
          <ScrollView
            style={HomeScreenStyles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={HomeScreenStyles.scrollContent}
          >
            {/* Carrossel - mostra apenas quando não há filtros e categoria é "tudo" */}
            {categoriaAtiva === 'tudo' && Object.keys(filtrosAtivos).length === 0 && (
              <Carrossel
                banners={banners}
                onClick={handleCarrosselClick}
              />
            )}

            <View style={HomeScreenStyles.sectionContainer}>
              <Text style={HomeScreenStyles.sectionTitle}>
                {categoriaAtiva === 'tudo' && Object.keys(filtrosAtivos).length === 0 
                  ? 'Produtos em Destaque' 
                  : categoriaAtiva === 'tudo'
                    ? 'Produtos Encontrados'
                    : `Produtos em ${categoriaAtiva}`}
                {Object.keys(filtrosAtivos).length > 0 && ' (Filtrados)'}
              </Text>
              
              {produtosFiltrados.length > 0 ? (
                <FlatList
                  data={produtosFiltrados}
                  renderItem={renderProdutoHorizontal}
                  keyExtractor={(item) => `filtered-${item.id}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={HomeScreenStyles.produtosContainer}
                  ListEmptyComponent={() => (
                    <View style={{ width: 200, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ color: theme.colors.gray500 }}>
                        Nenhum produto encontrado
                      </Text>
                    </View>
                  )}
                />
              ) : (
                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                  <Text style={{ color: theme.colors.gray500 }}>
                    Nenhum produto encontrado
                  </Text>
                  <Text style={{ color: theme.colors.gray400, fontSize: 12, marginTop: 8 }}>
                    Tente ajustar os filtros ou buscar outro termo
                  </Text>
                </View>
              )}
            </View>

            {/* Apenas mostra Novos Anúncios se estiver em "tudo" e sem filtros */}
            {categoriaAtiva === 'tudo' && Object.keys(filtrosAtivos).length === 0 && (
              <View style={HomeScreenStyles.sectionContainer}>
                <Text style={HomeScreenStyles.sectionTitle}>
                  Novos Anúncios
                </Text>
                {novosAnuncios.length > 0 ? (
                  <FlatList
                    data={novosAnuncios}
                    renderItem={renderProdutoHorizontal}
                    keyExtractor={(item) => `novo-${item.id}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={HomeScreenStyles.produtosContainer}
                  />
                ) : (
                  <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                    <Text style={{ color: theme.colors.gray500 }}>
                      Nenhum novo anúncio
                    </Text>
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

// Função de fallback para desenvolvimento
function getProdutosFallback(): Produto[] {
  const produtos = [
    {
      id: '1',
      nome: 'iPhone 13 Pro Max 256GB',
      descricao: 'Perfeito estado, com capa e película',
      preco: 4500,
      localizacao: 'Boa Viagem, Recife - PE',
      destaque: true,
      imagem: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=170&h=170&fit=crop&crop=faces',
      categoria: 'CELULAR_TELEFONIA',
      condicao: 'NOVO',
      dataPublicacao: '2025-12-10',
      vendedor: {
        nome: 'João Silva',
        telefone: '(11) 99999-9999'
      }
    },
    {
      id: '2',
      nome: 'Geladeira Brastemp Frost Free',
      descricao: '375L, seminova, funciona perfeitamente',
      preco: 1200,
      localizacao: 'Copacabana, Rio de Janeiro - RJ',
      destaque: false,
      imagem: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=170&h=170&fit=crop',
      categoria: 'ELETRODOMESTICOS',
      condicao: 'SEMINOVO',
      dataPublicacao: '2025-12-09',
      vendedor: {
        nome: 'Maria Santos',
        telefone: '(21) 98888-8888'
      }
    },
    {
      id: '3',
      nome: 'Tênis Nike Air Max 270',
      descricao: 'Número 42, original, pouco usado',
      preco: 250,
      localizacao: 'Centro, Curitiba - PR',
      destaque: true,
      imagem: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=170&h=170&fit=crop',
      categoria: 'MODA',
      condicao: 'SEMINOVO',
      dataPublicacao: '2025-12-10',
      vendedor: {
        nome: 'Carlos Oliveira',
        telefone: '(41) 97777-7777'
      }
    },
  ];
  
  console.log('Fallback gerado com', produtos.length, 'produtos');
  return produtos;
}