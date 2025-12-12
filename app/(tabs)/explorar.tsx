// screens/TelaPesquisa.tsx - VERSÃO CORRIGIDA
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
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
import { styles } from '../src/styles/TelaPesquisaStyles';

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
  const [jaBuscou, setJaBuscou] = useState(false);

  const buscarProdutos = useCallback(async () => {
    console.log('🔍 Buscando produtos com:', {
      termo: termoPesquisa,
      filtros: filtrosAtivos
    });

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
      
      const filtrosAPI: FiltrosProduto = {
        termo: termoPesquisa.trim() || undefined,
        categoria: filtrosAtivos.categoria || undefined,
        precoMin: filtrosAtivos.precoMin || undefined,
        precoMax: filtrosAtivos.precoMax || undefined,
        uf: filtrosAtivos.estado || undefined
      };

      console.log('📡 Enviando para API:', filtrosAPI);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      buscarProdutos();
    }, 500);

    return () => clearTimeout(timer);
  }, [buscarProdutos]);

  const handleSearch = (texto: string) => {
    console.log('📝 Termo alterado para:', texto);
    setTermoPesquisa(texto);
  };

  const handleFiltrosChange = (novosFiltros: Filtro) => {
    console.log('⚙️ Filtros alterados (substituindo):', novosFiltros);
    setFiltrosAtivos(novosFiltros);
  };

  const handleLimparTodosFiltros = () => {
    console.log('🧹 Limpando tudo (chamado do BarraPesquisa)');
    setTermoPesquisa('');
    setFiltrosAtivos({});
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

  const temFiltrosAtivos = Object.keys(filtrosAtivos).length > 0;
  
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
      <StatusBar  backgroundColor={theme.colors.white} />
      
      <BarraPesquisa
        placeholder="Buscar produtos..."
        onSearch={handleSearch}
        onFiltrosChange={handleFiltrosChange}
        resultadosCount={resultadosCount}
        mostrarResultadosVazios={mostrarResultadosVazios && resultadosCount === 0}
        // onLimparTodosFiltros={handleLimparTodosFiltros}
      />

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

export default TelaPesquisa;