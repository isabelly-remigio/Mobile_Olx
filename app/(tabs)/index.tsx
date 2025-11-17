import React, { useState, useCallback } from 'react';
import { Box, VStack, Text, ScrollView, Center, Icon, FlatList, Pressable, HStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

// Components
import Header from '../src/components/layout/Header';
import NavCategorias from '../src/components/ui/NavCategorias';
import BarraPesquisa from '../src/components/ui/BarraPesquisa';
import Carrossel from '../src/components/ui/Carrossel';
import CardProduto from '../src/components/ui/CardProduto';
import Footer from '../src/components/ui/Footer';

// Types
import { Categoria, Banner, Produto, Usuario, Filtro } from '../src/@types/home';

// Categorias para os ícones
const categorias: Categoria[] = [
  { id: 'tudo', nome: 'Tudo', icone: 'apps' },
  { id: 'celulares', nome: 'Celulares', icone: 'smartphone' },
  { id: 'eletrodomesticos', nome: 'Eletro', icone: 'kitchen' },
  { id: 'casa', nome: 'Casa', icone: 'home' },
  { id: 'moda', nome: 'Moda', icone: 'checkroom' },
  { id: 'eletronicos', nome: 'Eletrônicos', icone: 'devices' },
  { id: 'esportes', nome: 'Esportes', icone: 'sports' }
];

const banners: Banner[] = [
  {
    titulo: 'Ofertas Imperdíveis',
    subtitulo: 'Produtos com até 70% de desconto',
    imagem: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=400&h=200&fit=crop'
  }
];

// PRODUTOS DIVERSOS - Misturados de várias categorias (como um marketplace real)
const produtosDiversos: Produto[] = [
  // Celulares
  {
    imagem: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=170&h=100&fit=crop',
    titulo: 'iPhone 13 Pro Max',
    descricao: '256GB, perfeito estado',
    preco: 4500,
    localizacao: 'São Paulo, SP',
    destaque: true,
    favoritado: false
  },
  // Eletrodomésticos
  {
    imagem: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=170&h=100&fit=crop',
    titulo: 'Geladeira Brastemp',
    descricao: '375L, seminova',
    preco: 1200,
    localizacao: 'Rio de Janeiro, RJ',
    destaque: false,
    favoritado: true
  },
  // Moda
  {
    imagem: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=170&h=100&fit=crop',
    titulo: 'Tênis Nike Air Max',
    descricao: 'Número 42, original',
    preco: 250,
    localizacao: 'Curitiba, PR',
    destaque: false,
    favoritado: true
  },
  // Eletrônicos
  {
    imagem: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=170&h=100&fit=crop',
    titulo: 'Notebook Dell Inspiron',
    descricao: 'i5, 8GB, SSD 256GB',
    preco: 2200,
    localizacao: 'São Paulo, SP',
    destaque: true,
    favoritado: false
  },
  // Casa
  {
    imagem: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=170&h=100&fit=crop',
    titulo: 'Sofá 3 lugares',
    descricao: 'Estofado novo',
    preco: 800,
    localizacao: 'Belo Horizonte, MG',
    destaque: true,
    favoritado: false
  },
  // Esportes
  {
    imagem: 'https://images.unsplash.com/photo-1536922246289-88c42f957773?w=170&h=100&fit=crop',
    titulo: 'Bicicleta Caloi Aro 29',
    descricao: '18 marchas, suspensão',
    preco: 900,
    localizacao: 'Curitiba, PR',
    destaque: false,
    favoritado: false
  }
];

export default function HomeScreen() {
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);
  const [categoriaAtiva, setCategoriaAtiva] = useState('tudo');
  const [navegacaoAtiva, setNavegacaoAtiva] = useState('inicio');
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>(produtosDiversos);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [buscando, setBuscando] = useState(false);

  const simularLogin = () => {
    setUsuarioLogado(usuarioLogado ? null : { nome: 'Maria' });
  };

  const handleSearch = useCallback((texto: string) => {
    setTermoPesquisa(texto);
    setBuscando(!!texto.trim());
    
    if (!texto.trim()) {
      setProdutosFiltrados(produtosDiversos);
      return;
    }

    const resultados = produtosDiversos.filter(produto =>
      produto.titulo.toLowerCase().includes(texto.toLowerCase()) ||
      produto.descricao.toLowerCase().includes(texto.toLowerCase())
    );
    setProdutosFiltrados(resultados);
  }, []);

  const handleFiltrosChange = useCallback((filtros: Filtro) => {
    console.log('Filtros aplicados:', filtros);
  }, []);

  const renderProdutosVazios = () => (
    <Center py={10} px={4}>
      <Icon as={MaterialIcons} name="search-off" size={16} color="gray.400" />
      <Text fontSize="lg" fontWeight="medium" color="gray.600" mt={4} textAlign="center">
        Nenhum produto encontrado
      </Text>
      <Text fontSize="sm" color="gray.500" textAlign="center" mt={2}>
        {termoPesquisa 
          ? `Não encontramos resultados para "${termoPesquisa}"`
          : "Tente ajustar os filtros"
        }
      </Text>
    </Center>
  );

  const renderProdutoHorizontal = ({ item }: { item: Produto }) => (
    <Box mr={4}>
      <CardProduto
        produto={item}
        onClick={() => alert(`Produto: ${item.titulo}`)}
      />
    </Box>
  );

  return (
    <Box flex={1} bg="gray.50">
      <Header
        usuarioLogado={usuarioLogado}
        onToggleLogin={simularLogin}
        onNotificacoes={() => alert('Notificações')}
      />

      <BarraPesquisa
        placeholder="O que você está procurando?"
        onSearch={handleSearch}
        onFiltrosChange={handleFiltrosChange}
        resultadosCount={buscando ? produtosFiltrados.length : 0}
        mostrarResultadosVazios={buscando && produtosFiltrados.length === 0}
      />

      {/* ÍCONES DE CATEGORIA - Para navegação rápida */}
      <NavCategorias
        categorias={categorias}
        ativa={categoriaAtiva}
        onChangeCategoria={setCategoriaAtiva}
      />

      <Box flex={1}>
        {buscando ? (
          // MODO BUSCA
          produtosFiltrados.length === 0 ? (
            renderProdutosVazios()
          ) : (
            <ScrollView flex={1} showsVerticalScrollIndicator={false}>
              <VStack space={4} py={4}>
                <Text fontSize="lg" fontWeight="bold" color="gray.800" px={4}>
                  {`${produtosFiltrados.length} resultado${produtosFiltrados.length !== 1 ? 's' : ''} para "${termoPesquisa}"`}
                </Text>
                <FlatList
                  data={produtosFiltrados}
                  renderItem={renderProdutoHorizontal}
                  keyExtractor={(item, index) => `search-${index}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 16 }}
                />
              </VStack>
            </ScrollView>
          )
        ) : (
          // MODO NORMAL - Produtos diversos (como um feed)
          <ScrollView 
            flex={1} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* Carrossel */}
            <Carrossel
              banners={banners}
              onClick={(banner) => alert(banner.titulo)}
            />

            {/* PRODUTOS EM DESTAQUE - Misturados */}
            <VStack space={4} mt={4}>
              <Text fontSize="lg" fontWeight="bold" color="gray.800" px={4}>
                Produtos em Destaque
              </Text>
              <FlatList
                data={produtosDiversos.filter(p => p.destaque)}
                renderItem={renderProdutoHorizontal}
                keyExtractor={(item, index) => `destaque-${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              />
            </VStack>

            {/* TODOS OS PRODUTOS - Misturados */}
            <VStack space={4} mt={6}>
              <Text fontSize="lg" fontWeight="bold" color="gray.800" px={4}>
                Novos Anúncios
              </Text>
              <FlatList
                data={produtosDiversos}
                renderItem={renderProdutoHorizontal}
                keyExtractor={(item, index) => `todos-${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              />
            </VStack>
          </ScrollView>
        )}
      </Box>

      <Footer
        ativo={navegacaoAtiva}
        onNavigate={setNavegacaoAtiva}
      />
    </Box>
  );
}