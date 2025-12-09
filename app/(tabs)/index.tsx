import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Alert,
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

import {
  Categoria,
  Banner,
  Produto,
} from '../src/@types/home';

// Categorias para os ícones
const categorias: Categoria[] = [
  { id: 'tudo', nome: 'Tudo', icone: 'apps' },
  { id: 'celulares', nome: 'Celulares', icone: 'smartphone' },
  { id: 'eletrodomesticos', nome: 'Eletro', icone: 'kitchen' },
  { id: 'casa', nome: 'Casa', icone: 'home' },
  { id: 'moda', nome: 'Moda', icone: 'checkroom' },
];

const banners: Banner[] = [
  {
    id: '1',
    titulo: 'Ofertas Imperdíveis',
    subtitulo: 'Produtos com até 70% de desconto',
    imagem: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=400&h=200&fit=crop',
  },
];

const produtosDiversos: Produto[] = [
  // Celulares
  {
    id: '1',
    imagem: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=170&h=100&fit=crop',
    titulo: 'iPhone 13 Pro Max',
    descricao: '256GB, perfeito estado',
    preco: 4500,
    localizacao: 'Boa Viagem, PE',
    destaque: true,
  },
  // Eletrodomésticos
  {
    id: '2',
    imagem: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=170&h=100&fit=crop',
    titulo: 'Geladeira Brastemp',
    descricao: '375L, seminova',
    preco: 1200,
    localizacao: 'Rio de Janeiro, RJ',
    destaque: false,
  },
  // Moda
  {
    id: '3',
    imagem: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=170&h=100&fit=crop',
    titulo: 'Tênis Nike Air Max',
    descricao: 'Número 42, original',
    preco: 250,
    localizacao: 'Curitiba, PR',
    destaque: false,
  },
  // Eletrônicos
  {
    id: '4',
    imagem: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=170&h=100&fit=crop',
    titulo: 'Notebook Dell Inspiron',
    descricao: 'i5, 8GB, SSD 256GB',
    preco: 2200,
    localizacao: 'São Paulo, SP',
    destaque: true,
  },
  // Casa
  {
    id: '5',
    imagem: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=170&h=100&fit=crop',
    titulo: 'Sofá 3 lugares',
    descricao: 'Estofado novo',
    preco: 800,
    localizacao: 'Belo Horizonte, MG',
    destaque: true,
  },
  {
    id: '6',
    imagem: 'https://images.unsplash.com/photo-1536922246289-88c42f957773?w=170&h=100&fit=crop',
    titulo: 'Bicicleta Caloi Aro 29',
    descricao: '18 marchas, suspensão',
    preco: 900,
    localizacao: 'Curitiba, PR',
    destaque: false,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [categoriaAtiva, setCategoriaAtiva] = useState('tudo');
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>(produtosDiversos);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [buscando, setBuscando] = useState(false);

  const handleToggleLogin = () => {
    if (user) {
      // Se está logado, mostrar opções
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
      // Se não está logado, redirecionar para login
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
  };

  const handleSearch = useCallback((texto: string) => {
    setTermoPesquisa(texto);
    setBuscando(!!texto.trim());

    if (!texto.trim()) {
      setProdutosFiltrados(produtosDiversos);
      return;
    }

    const resultados = produtosDiversos.filter(
      (produto) =>
        produto.titulo.toLowerCase().includes(texto.toLowerCase()) ||
        produto.descricao.toLowerCase().includes(texto.toLowerCase())
    );
    setProdutosFiltrados(resultados);
  }, []);

  const handleFiltrosChange = useCallback((filtros: any) => {
    console.log('Filtros aplicados:', filtros);
  }, []);

  const handleAbrirDetalhesAnuncio = (produtoId: string) => {
    // Verificar se precisa de login para ver detalhes
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

  const produtosEmDestaque = produtosDiversos.filter((p) => p.destaque);

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

      <NavCategorias
        categorias={categorias}
        ativa={categoriaAtiva}
        onChangeCategoria={setCategoriaAtiva}
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