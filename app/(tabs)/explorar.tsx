// screens/TelaPesquisa.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Text,
} from 'react-native';
import { Card, Image } from '@rneui/themed';
import BarraPesquisa from '../src/components/ui/BarraPesquisa';
import { theme } from '../src/theme/theme';

// Tipos
interface Produto {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
  localizacao: string;
  disponivel: boolean;
}

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

  // Dados mockados para demonstração
  const produtosMock: Produto[] = [
    {
      id: '1',
      nome: 'iPhone 13 Pro Max 256GB',
      preco: 4500,
      imagem: 'https://via.placeholder.com/150',
      localizacao: 'Recife, PE',
      disponivel: true,
    },
    {
      id: '2',
      nome: 'Samsung Galaxy S23',
      preco: 3200,
      imagem: 'https://via.placeholder.com/150',
      localizacao: 'São Paulo, SP',
      disponivel: true,
    },
    {
      id: '3',
      nome: 'Notebook Dell Inspiron',
      preco: 2800,
      imagem: 'https://via.placeholder.com/150',
      localizacao: 'Rio de Janeiro, RJ',
      disponivel: false,
    },
  ];

  const handleSearch = (texto: string) => {
    setTermoPesquisa(texto);
    
    if (texto.trim() === '' && Object.keys(filtrosAtivos).length === 0) {
      setProdutos([]);
      setResultadosCount(0);
      return;
    }

    // Simulação de busca
    const resultados = produtosMock.filter((produto) => {
      const matchTexto = texto.trim() === '' || 
        produto.nome.toLowerCase().includes(texto.toLowerCase());
      
      const matchPrecoMin = !filtrosAtivos.precoMin || 
        produto.preco >= filtrosAtivos.precoMin;
      
      const matchPrecoMax = !filtrosAtivos.precoMax || 
        produto.preco <= filtrosAtivos.precoMax;
      
      const matchDisponivel = !filtrosAtivos.disponivel || 
        produto.disponivel;

      return matchTexto && matchPrecoMin && matchPrecoMax && matchDisponivel;
    });

    setProdutos(resultados);
    setResultadosCount(resultados.length);
  };

  const handleFiltrosChange = (filtros: Filtro) => {
    setFiltrosAtivos(filtros);
    handleSearch(termoPesquisa);
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
          <Text style={styles.productLocation}>{item.localizacao}</Text>
          {!item.disponivel && (
            <Text style={styles.productUnavailable}>Indisponível</Text>
          )}
        </View>
      </View>
    </Card>
  );

  const renderEmptyState = () => {
    if (termoPesquisa === '' && Object.keys(filtrosAtivos).length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>O que você está procurando?</Text>
          <Text style={styles.emptyText}>
            Use a barra de pesquisa acima para encontrar produtos
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Nenhum resultado encontrado</Text>
        <Text style={styles.emptyText}>
          Tente ajustar sua pesquisa ou filtros
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
      
      {/* Barra de Pesquisa */}
      <BarraPesquisa
        placeholder="Buscar produtos..."
        onSearch={handleSearch}
        onFiltrosChange={handleFiltrosChange}
        resultadosCount={resultadosCount}
        mostrarResultadosVazios={termoPesquisa !== '' || Object.keys(filtrosAtivos).length > 0}
      />

      {/* Lista de Resultados */}
      <FlatList
        data={produtos}
        renderItem={renderProduto}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
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
    ...theme.shadows.sm,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
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
  },
  productUnavailable: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.error,
    fontWeight: theme.typography.weights.medium,
    marginTop: theme.spacing.xs,
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
});

export default TelaPesquisa;