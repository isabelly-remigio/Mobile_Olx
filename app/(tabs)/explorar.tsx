// screens/TelaPesquisa.tsx - VERSÃO CORRIGIDA
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Card, Image } from '@rneui/themed';
import BarraPesquisa from '../src/components/ui/BarraPesquisa';
import { theme } from '../src/theme/theme';
import { produtoService, FiltrosProduto } from '../src/services/produtoService';
import { Produto } from '../src/@types/home';

interface Filtro {
  precoMin?: number;
  precoMax?: number;
  estado?: string;
  categoria?: string;
  disponivel?: boolean;
}

const TelaPesquisa: React.FC = () => {
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [filtrosAtivos, setFiltrosAtivos] = useState<Filtro>({});
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [resultadosCount, setResultadosCount] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [mostrarResultadosVazios, setMostrarResultadosVazios] = useState(false);
  
  // Flag para controlar se já fez uma busca
  const [jaBuscou, setJaBuscou] = useState(false);

  // Função para buscar produtos com os filtros atuais
  const buscarProdutos = useCallback(async () => {
    console.log('🔍 Buscando produtos com:', {
      termo: termoPesquisa,
      filtros: filtrosAtivos
    });

    // Se não tem termo nem filtros, não busca
    if (!termoPesquisa.trim() && Object.keys(filtrosAtivos).length === 0) {
      console.log('📊 Sem termo nem filtros, limpando resultados');
      setProdutos([]);
      setResultadosCount(0);
      setMostrarResultadosVazios(false);
      setJaBuscou(false);
      return;
    }

    try {
      setCarregando(true);
      setMostrarResultadosVazios(true);
      setJaBuscou(true);
      
      // Converte filtros do modal para formato da API
      const filtrosAPI: FiltrosProduto = {
        termo: termoPesquisa.trim() || undefined,
        categoria: filtrosAtivos.categoria || undefined,
        precoMin: filtrosAtivos.precoMin || undefined,
        precoMax: filtrosAtivos.precoMax || undefined,
        uf: filtrosAtivos.estado || undefined
      };

      console.log('📡 Enviando para API:', filtrosAPI);

      // Faz pesquisa avançada
      const resultados = await produtoService.pesquisarAvancado(filtrosAPI);
      
      console.log(`✅ ${resultados.length} produtos encontrados`);
      setProdutos(resultados);
      setResultadosCount(resultados.length);
      
    } catch (error) {
      console.error('❌ Erro na pesquisa:', error);
      Alert.alert('Erro', 'Não foi possível realizar a pesquisa');
      setProdutos([]);
      setResultadosCount(0);
    } finally {
      setCarregando(false);
    }
  }, [termoPesquisa, filtrosAtivos]);

  // Buscar quando termo ou filtros mudam
  useEffect(() => {
    // Debounce para evitar muitas chamadas
    const timer = setTimeout(() => {
      buscarProdutos();
    }, 500); // 500ms de delay

    return () => clearTimeout(timer);
  }, [buscarProdutos]);

  const handleSearch = (texto: string) => {
    console.log('📝 Termo alterado para:', texto);
    setTermoPesquisa(texto);
  };

  const handleFiltrosChange = (novosFiltros: Filtro) => {
    console.log('⚙️ Filtros alterados (substituindo):', novosFiltros);
    
    // Substitui TODOS os filtros anteriores pelos novos
    setFiltrosAtivos(novosFiltros);
  };

  // Função para limpar TUDO (chamada pelo BarraPesquisa quando o usuário clica em "Limpar Todos")
  const handleLimparTodosFiltros = () => {
    console.log('🧹 Limpando tudo (chamado do BarraPesquisa)');
    setTermoPesquisa('');
    setFiltrosAtivos({});
    // Não precisa limpar produtos aqui - a busca vai ser disparada automaticamente pelo useEffect
  };

  const renderProduto = ({ item }: { item: Produto }) => (
    <Card containerStyle={styles.card}>
      <View style={styles.cardContent}>
        <Image
          source={{ uri: item.imagem }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.nome}
          </Text>
          <Text style={styles.productPrice}>
            R$ {item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
          <Text style={styles.productLocation}>📍 {item.localizacao}</Text>
          {item.destaque && (
            <Text style={styles.productHighlight}>⭐ Destaque</Text>
          )}
        </View>
      </View>
    </Card>
  );

  const renderEmptyState = () => {
    if (carregando) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Buscando produtos...</Text>
        </View>
      );
    }

    if (!jaBuscou) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>O que você está procurando?</Text>
          <Text style={styles.emptyText}>
            Digite na barra de busca ou use os filtros para encontrar produtos
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Nenhum resultado encontrado</Text>
        <Text style={styles.emptyText}>
          {termoPesquisa 
            ? `Não encontramos resultados para "${termoPesquisa}" com os filtros aplicados`
            : 'Nenhum produto encontrado com os filtros selecionados'}
        </Text>

      </View>
    );
  };

  // Verifica se há filtros ativos
  const temFiltrosAtivos = Object.keys(filtrosAtivos).length > 0;
  
  // Texto dos filtros ativos para exibir
  const getTextoFiltrosAtivos = () => {
    const filtrosTexto = [];
    
    if (filtrosAtivos.categoria) {
      const categoria = filtrosAtivos.categoria;
      filtrosTexto.push(`Categoria: ${categoria}`);
    }
    
    if (filtrosAtivos.estado) {
      filtrosTexto.push(`Estado: ${filtrosAtivos.estado}`);
    }
    
    if (filtrosAtivos.precoMin) {
      filtrosTexto.push(`Mín: R$ ${filtrosAtivos.precoMin.toFixed(2)}`);
    }
    
    if (filtrosAtivos.precoMax) {
      filtrosTexto.push(`Máx: R$ ${filtrosAtivos.precoMax.toFixed(2)}`);
    }
    
    return filtrosTexto.join(' • ');
  };

  return (
   <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
    
    {/* Barra de Pesquisa - PASSA A FUNÇÃO handleLimparTodosFiltros */}
    <BarraPesquisa
      placeholder="Buscar produtos..."
      onSearch={handleSearch}
      onFiltrosChange={handleFiltrosChange}
      resultadosCount={resultadosCount}
      mostrarResultadosVazios={mostrarResultadosVazios && resultadosCount === 0}
      onLimparTodosFiltros={handleLimparTodosFiltros}
    />

    {/* Lista de Resultados */}
    {carregando ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Buscando produtos...</Text>
      </View>
    ) : (
      <FlatList
        data={produtos}
        renderItem={renderProduto}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    )}
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray50,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexGrow: 1,
  },
  card: {
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    backgroundColor: theme.colors.white,
  },
  cardContent: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.sm,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.gray900,
    marginBottom: theme.spacing.xs,
  },
  productPrice: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary[500],
    marginBottom: theme.spacing.xs,
  },
  productLocation: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray600,
    marginBottom: theme.spacing.xs,
  },
  productHighlight: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.success,
    fontWeight: theme.typography.weights.medium,
    backgroundColor: theme.colors.successLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing['3xl'],
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.gray800,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.gray500,
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.gray600,
  },
  searchInfoContainer: {
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  searchInfoText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray700,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  resultsCount: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray600,
    fontWeight: theme.typography.weights.medium,
  },
  // Removidos os estilos do botão clearAllButton
});

export default TelaPesquisa;