import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Card, Image, Button, Icon } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/src/context/AuthContext';
import { useFavoritos } from '@/app/src/hooks/useFavoritos';
import { Produto } from '@/app/src/@types/home';
import styles from '../src/styles/TelaFavoritosStyles';

// Interface estendida para incluir status de vendido
interface ProdutoComStatus extends Produto {
  vendido?: boolean;
  disponivel?: boolean;
  status?: string;
}

const TelaFavoritos: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const {
    favoritos,
    loading,
    error,
    removerFavoritoPorIdString,
    recarregarFavoritos,
    hasError,
    isRemoving,
  } = useFavoritos();
  const [refreshing, setRefreshing] = useState(false);
  const [produtosComStatus, setProdutosComStatus] = useState<ProdutoComStatus[]>([]);

  // Transformar favoritos em produtos com status
  useEffect(() => {
    if (favoritos.length > 0) {
      const produtosTransformados = favoritos.map(produto => {
        // Verificar log para ver estrutura real
        console.log('Produto recebido:', {
          id: produto.id,
          nome: produto.nome,
          imagem: produto.imagem,
          // Verificar se tem propriedades extras
          temVendido: 'vendido' in produto,
          temDisponivel: 'disponivel' in produto,
          temStatus: 'status' in produto,
          todasChaves: Object.keys(produto)
        });

        return {
          ...produto,
          vendido: (produto as any).vendido || 
                   (produto as any).status === 'VENDIDO' || 
                   (produto as any).disponivel === false || 
                   false,
          disponivel: (produto as any).disponivel ?? true,
          status: (produto as any).status || 'ativo'
        };
      });
      setProdutosComStatus(produtosTransformados);
    } else {
      setProdutosComStatus([]);
    }
  }, [favoritos]);

  // Função para debug
  const debugProdutos = () => {
    console.log('=== DEBUG PRODUTOS ===');
    console.log('Total de favoritos:', favoritos.length);
    console.log('Produtos com status:', produtosComStatus.length);
    
    if (favoritos.length > 0) {
      const primeiroProduto = favoritos[0];
      console.log('Primeiro produto RAW:', primeiroProduto);
      console.log('Tipo da imagem:', typeof primeiroProduto.imagem);
      console.log('Valor da imagem:', primeiroProduto.imagem);
      console.log('Todas as chaves:', Object.keys(primeiroProduto));
      
      // Verificar se é uma string URL válida
      if (primeiroProduto.imagem) {
        console.log('É string URL?', typeof primeiroProduto.imagem === 'string');
        console.log('Começa com http?', primeiroProduto.imagem.startsWith('http'));
        console.log('Começa com /?', primeiroProduto.imagem.startsWith('/'));
        console.log('Contém http?', primeiroProduto.imagem.includes('http'));
      }
    }
  };

  const handleRemoverFavorito = async (produtoId: string) => {
    Alert.alert(
      'Remover Favorito',
      'Tem certeza que deseja remover este item dos favoritos?',
      [
        { 
          text: 'Cancelar', 
          style: 'cancel',
        },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            const success = await removerFavoritoPorIdString(produtoId);
            if (!success && !hasError) {
              Alert.alert('Erro', 'Não foi possível remover o favorito');
            }
          },
        },
      ]
    );
  };

  const abrirDetalhes = (produtoId: string, vendido: boolean = false) => {
    if (vendido) {
      Alert.alert('Produto Vendido', 'Este produto já foi vendido e não está mais disponível.');
      return;
    }
    
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

  const explorarProdutos = () => {
    router.push('/(tabs)');
  };

  const formatarPreco = (valor: number) => {
    return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await recarregarFavoritos();
    setRefreshing(false);
  };

  // Função para corrigir URL da imagem
  const corrigirUrlImagem = (url: string): string => {
    if (!url || url.trim() === '') {
      return 'https://via.placeholder.com/170x100/6C2BD9/FFFFFF?text=Produto';
    }
    
    // Se já for uma URL completa
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Se começar com // (protocolo relativo)
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    
    // Se for um caminho absoluto
    if (url.startsWith('/')) {
      // Substitua pelo seu domínio real
      return `https://api.seuservidor.com${url}`;
    }
    
    // Se não for nenhum dos casos acima, retornar fallback
    console.warn('URL de imagem inválida:', url);
    return 'https://via.placeholder.com/170x100/6C2BD9/FFFFFF?text=Produto';
  };

  const renderCardFavorito = ({ item }: { item: ProdutoComStatus }) => {
    const estaRemovendo = isRemoving === item.id;
    const localizacao = item.localizacao || 'Local não informado';
    const vendido = item.vendido || false;
    
    // Obter URL da imagem corrigida
    const imagemUrl = corrigirUrlImagem(item.imagem);
    
    return (
      <TouchableOpacity 
        activeOpacity={vendido ? 1 : 0.7} 
        onPress={() => abrirDetalhes(item.id, vendido)}
        disabled={estaRemovendo || vendido}
      >
        <Card containerStyle={[
          styles.card,
          estaRemovendo && styles.removingCard,
          vendido && styles.vendidoCard
        ]}>
          {estaRemovendo && (
            <View style={styles.removingOverlay}>
              <ActivityIndicator size="small" color="#FF3B30" />
              <Text style={styles.removingText}>Removendo...</Text>
            </View>
          )}
          
          {vendido && (
            <View style={styles.vendidoOverlay}>
              <Text style={styles.vendidoText}>VENDIDO</Text>
            </View>
          )}
          
          <View style={styles.cardContent}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: imagemUrl }}
                style={[
                  styles.productImage,
                  vendido && styles.productImageVendido
                ]}
                resizeMode="cover"
                PlaceholderContent={<ActivityIndicator color="#6C2BD9" />}
                onError={(e) => {
                  console.log('Erro ao carregar imagem:', {
                    produtoId: item.id,
                    urlOriginal: item.imagem,
                    urlCorrigida: imagemUrl,
                    erro: e.nativeEvent.error
                  });
                }}
              />
              {item.destaque && !vendido && (
                <View style={styles.destaqueTag}>
                  <Text style={styles.destaqueText}>DESTAQUE</Text>
                </View>
              )}
            </View>

            <View style={styles.infoContainer}>
              <TouchableOpacity
                style={[
                  styles.favoriteButton,
                  estaRemovendo && styles.favoriteButtonDisabled,
                  vendido && styles.favoriteButtonVendido
                ]}
                onPress={() => !estaRemovendo && !vendido && handleRemoverFavorito(item.id)}
                activeOpacity={estaRemovendo || vendido ? 1 : 0.7}
                disabled={estaRemovendo || vendido}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {estaRemovendo ? (
                  <ActivityIndicator size="small" color="#FF3B30" />
                ) : (
                  <Icon
                    name="favorite"
                    type="material"
                    size={22}
                    color={vendido ? "#999" : "#FF3B30"}
                  />
                )}
              </TouchableOpacity>

              <View style={styles.textContent}>
                <Text style={[
                  styles.productName,
                  vendido && styles.productNameVendido
                ]} numberOfLines={2}>
                  {item.nome || 'Sem nome'}
                </Text>
                
                <Text style={[
                  styles.productPrice,
                  vendido && styles.productPriceVendido
                ]}>
                  {formatarPreco(item.preco || 0)}
                </Text>
                
                {/* Mensagem de vendido */}
                {vendido && (
                  <Text style={styles.vendidoMessage}>
                    Este produto já foi vendido
                  </Text>
                )}
                
                <View style={styles.locationContainer}>
                  <Icon
                    name="location-on"
                    type="material"
                    size={16}
                    color={vendido ? "#999" : "#666"}
                  />
                  <Text style={[
                    styles.productLocation,
                    vendido && styles.productLocationVendido
                  ]} numberOfLines={1}>
                    {localizacao}
                  </Text>
                </View>
                
                {item.categoria && !vendido && (
                  <View style={styles.categoriaContainer}>
                    <Text style={styles.categoriaText} numberOfLines={1}>
                      {item.categoria}
                    </Text>
                  </View>
                )}
                
                {item.condicao && !vendido && (
                  <View style={styles.condicaoContainer}>
                    <Text style={styles.condicaoText} numberOfLines={1}>
                      {item.condicao}
                    </Text>
                  </View>
                )}
                
                {/* Data de publicação se disponível */}
                {item.dataPublicacao && !vendido && (
                  <Text style={styles.dataPublicacao}>
                    Publicado em: {new Date(item.dataPublicacao).toLocaleDateString('pt-BR')}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Icon
          name="favorite-border"
          type="material"
          size={48}
          color="#9CA3AF"
        />
      </View>

      <Text style={styles.emptyTitle}>
        Você ainda não salvou nenhum anúncio
      </Text>

      <Text style={styles.emptyText}>
        Explore e salve anúncios que você gostar!
      </Text>

      <Button
        title="Explorar Produtos"
        onPress={explorarProdutos}
        buttonStyle={styles.exploreButton}
        titleStyle={styles.exploreButtonText}
        icon={{
          name: 'search',
          type: 'material',
          size: 20,
          color: "#FFFFFF",
        }}
        iconPosition="left"
      />
    </View>
  );

  // Mostrar loading enquanto transforma os dados
  if (loading && produtosComStatus.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C2BD9" />
          <Text style={styles.loadingText}>Carregando favoritos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={styles.container.backgroundColor} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favoritos</Text>
        <View style={styles.headerRight}>
          {produtosComStatus.length > 0 && (
            <Text style={styles.headerCount}>
              {produtosComStatus.length} {produtosComStatus.length === 1 ? 'item' : 'itens'}
            </Text>
          )}
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={debugProdutos}
          >
            <Icon
              name="bug-report"
              type="material"
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={produtosComStatus}
        renderItem={renderCardFavorito}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContainer,
          produtosComStatus.length === 0 && styles.listContainerEmpty
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6C2BD9"]}
            tintColor="#6C2BD9"
          />
        }
        ListHeaderComponent={
          error ? (
            <View style={styles.errorContainer}>
              <Icon name="error-outline" type="material" size={24} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default TelaFavoritos;