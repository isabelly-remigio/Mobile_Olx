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
// Importe atualizado
import { produtoService, CATEGORIAS_FRONTEND, FiltrosProduto } from '../src/services/produtoService';

import {
  Categoria,
  Banner,
  Produto,
} from '../src/@types/home';

// Categorias para os ícones - agora usando do serviço
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

  // Carregar produtos ao iniciar
  useEffect(() => {
    carregarProdutos();
  }, []);

  // ATUALIZE ESTA FUNÇÃO - Quando a categoria muda, busca produtos
  const handleChangeCategoria = async (categoriaId: string) => {
    setCategoriaAtiva(categoriaId);
    
    // Se for "tudo", mostra todos os produtos
    if (categoriaId === 'tudo') {
      if (Object.keys(filtrosAtivos).length === 0 && !termoPesquisa.trim()) {
        setProdutosFiltrados(produtosDiversos);
      } else {
        // Aplica filtros existentes
        await aplicarFiltros();
      }
      return;
    }
    
    // Para outras categorias, busca da API
    await buscarProdutosPorCategoria(categoriaId);
  };

  // Função para buscar produtos por categoria
  const buscarProdutosPorCategoria = async (categoriaId: string) => {
    try {
      setCarregando(true);
      const produtos = await produtoService.buscarPorCategoria(categoriaId);
      setProdutosFiltrados(produtos);
    } catch (error) {
      console.error('Erro ao buscar por categoria:', error);
      
      // Fallback: mostra mensagem
      Alert.alert(
        'Erro',
        'Não foi possível carregar produtos desta categoria.',
        [{ text: 'OK' }]
      );
      
      // Volta para "tudo"
      setCategoriaAtiva('tudo');
      setProdutosFiltrados(produtosDiversos);
    } finally {
      setCarregando(false);
    }
  };

  // Função para aplicar filtros (mantém a existente)
  const aplicarFiltros = async () => {
    try {
      setCarregando(true);
      
      let resultados: Produto[] = [];
      
      // Se tem categoria ativa (não é "tudo") OU tem outros filtros
      if (categoriaAtiva !== 'tudo' || Object.keys(filtrosAtivos).length > 0) {
        // Cria filtros combinados
        const filtrosCombinados: FiltrosProduto = { ...filtrosAtivos };
        
        // Adiciona categoria se não for "tudo"
        if (categoriaAtiva !== 'tudo') {
          const categoria = CATEGORIAS_FRONTEND.find(cat => cat.id === categoriaAtiva);
          if (categoria?.backendValue) {
            filtrosCombinados.categoria = categoria.backendValue;
          }
        }
        
        // Se tem termo de pesquisa, usa pesquisa avançada
        if (termoPesquisa.trim()) {
          filtrosCombinados.termo = termoPesquisa;
          resultados = await produtoService.pesquisarAvancado(filtrosCombinados);
        } 
        // Se não tem termo mas tem filtros, também usa pesquisa avançada
        else if (Object.keys(filtrosCombinados).length > 0) {
          resultados = await produtoService.pesquisarAvancado(filtrosCombinados);
        }
        // Se só tem categoria ativa (sem outros filtros), usa rota específica
        else if (categoriaAtiva !== 'tudo') {
          resultados = await produtoService.buscarPorCategoria(categoriaAtiva);
        }
      } else {
        // Sem filtros nem categoria específica, mostra tudo
        resultados = produtosDiversos;
      }
      
      setProdutosFiltrados(resultados);
    } catch (error) {
      console.error('Erro ao aplicar filtros:', error);
      Alert.alert('Erro', 'Não foi possível aplicar os filtros');
    } finally {
      setCarregando(false);
    }
  };

  const carregarProdutos = async () => {
    try {
      setCarregando(true);
      setErro(null);
      const produtos = await produtoService.listarTodosAtivos();
      setProdutosDiversos(produtos);
      setProdutosFiltrados(produtos);
    } catch (error) {
      setErro('Erro ao carregar produtos. Tente novamente.');
      console.error('Erro ao carregar produtos:', error);
      
      // Dados de fallback para desenvolvimento
      setProdutosDiversos(getProdutosFallback());
      setProdutosFiltrados(getProdutosFallback());
    } finally {
      setCarregando(false);
    }
  };

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

  const handleSearch = useCallback(async (texto: string) => {
    setTermoPesquisa(texto);
    setBuscando(!!texto.trim());

    if (!texto.trim() && Object.keys(filtrosAtivos).length === 0 && categoriaAtiva === 'tudo') {
      setProdutosFiltrados(produtosDiversos);
      return;
    }

    try {
      let resultados: Produto[] = [];
      
      if (texto.trim()) {
        // Se tem filtros ativos, usa pesquisa avançada
        if (Object.keys(filtrosAtivos).length > 0 || categoriaAtiva !== 'tudo') {
          const filtrosCombinados: FiltrosProduto = {
            termo: texto,
            ...filtrosAtivos
          };
          
          // Adiciona categoria se não for "tudo"
          if (categoriaAtiva !== 'tudo') {
            const categoria = CATEGORIAS_FRONTEND.find(cat => cat.id === categoriaAtiva);
            if (categoria?.backendValue) {
              filtrosCombinados.categoria = categoria.backendValue;
            }
          }
          
          resultados = await produtoService.pesquisarAvancado(filtrosCombinados);
        } else {
          // Pesquisa simples
          resultados = await produtoService.pesquisarProdutos(texto);
        }
      } else {
        // Sem texto, aplica apenas os filtros existentes
        await aplicarFiltros();
        return;
      }
      
      setProdutosFiltrados(resultados);
    } catch (error) {
      console.error('Erro na pesquisa:', error);
      Alert.alert('Erro', 'Não foi possível realizar a pesquisa');
    }
  }, [produtosDiversos, filtrosAtivos, categoriaAtiva]);

  const handleFiltrosChange = useCallback(async (filtros: FiltrosProduto) => {
    setFiltrosAtivos(filtros);
    // A aplicação dos filtros será feita no useEffect
  }, []);

  const handleAbrirDetalhesAnuncio = (produtoId: string) => {
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

  const renderProdutoHorizontal = ({ item }: { item: Produto }) => (
    <View style={HomeScreenStyles.produtoWrapper}>
      <CardProduto
        produto={item}
        onPress={() => handleAbrirDetalhesAnuncio(item.id)}
      />
    </View>
  );

  // Produtos em destaque (filtrando da lista geral)
  const produtosEmDestaque = produtosDiversos.filter((p) => p.destaque);

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
        onFiltrosChange={handleFiltrosChange}
        resultadosCount={buscando ? produtosFiltrados.length : 0}
        mostrarResultadosVazios={buscando && produtosFiltrados.length === 0}
      />

      {/* MUDANÇA AQUI: Use handleChangeCategoria em vez de setCategoriaAtiva */}
      <NavCategorias
        categorias={categorias}
        ativa={categoriaAtiva}
        onChangeCategoria={handleChangeCategoria} // ← TROCAR AQUI
        carregando={carregando && !buscando} // Passa o estado de carregando

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
                  } para "${termoPesquisa}"`}
                </Text>
                <FlatList
                  data={produtosFiltrados}
                  renderItem={renderProdutoHorizontal}
                  keyExtractor={(item) => `search-${item.id}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={HomeScreenStyles.produtosContainer}
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
            {/* Carrossel */}
            <Carrossel
              banners={banners}
              onClick={handleCarrosselClick}
            />

            <View style={HomeScreenStyles.sectionContainer}>
              <Text style={HomeScreenStyles.sectionTitle}>
                Produtos em Destaque
              </Text>
              <FlatList
                data={produtosEmDestaque}
                renderItem={renderProdutoHorizontal}
                keyExtractor={(item) => `destaque-${item.id}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={HomeScreenStyles.produtosContainer}
              />
            </View>

            <View style={HomeScreenStyles.sectionContainer}>
              <Text style={HomeScreenStyles.sectionTitle}>
                Novos Anúncios
              </Text>
              <FlatList
                data={produtosDiversos}
                renderItem={renderProdutoHorizontal}
                keyExtractor={(item) => `todos-${item.id}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={HomeScreenStyles.produtosContainer}
              />
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

// Função de fallback para desenvolvimento
function getProdutosFallback(): Produto[] {
  return [
    {
      id: '1',
      imagem: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=170&h=100&fit=crop',
      titulo: 'iPhone 13 Pro Max',
      descricao: '256GB, perfeito estado',
      preco: 4500,
      localizacao: 'Boa Viagem, PE',
      destaque: true,
    },
    {
      id: '2',
      imagem: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=170&h=100&fit=crop',
      titulo: 'Geladeira Brastemp',
      descricao: '375L, seminova',
      preco: 1200,
      localizacao: 'Rio de Janeiro, RJ',
      destaque: false,
    },
    {
      id: '3',
      imagem: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=170&h=100&fit=crop',
      titulo: 'Tênis Nike Air Max',
      descricao: 'Número 42, original',
      preco: 250,
      localizacao: 'Curitiba, PR',
      destaque: false,
    },
  ];
}