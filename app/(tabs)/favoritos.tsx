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
import Toast from 'react-native-toast-message';

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
    recarregarFavoritos,
    hasError,
    isFavorito,
    toggleFavorito,
  } = useFavoritos();
  
  const [refreshing, setRefreshing] = useState(false);
  const [produtosComStatus, setProdutosComStatus] = useState<ProdutoComStatus[]>([]);

  // Transformar favoritos em produtos com status
  useEffect(() => {
    if (favoritos.length > 0) {
      const produtosTransformados = favoritos.map(produto => ({
        ...produto,
        vendido: (produto as any).vendido || 
                 (produto as any).status === 'VENDIDO' || 
                 (produto as any).disponivel === false || 
                 false,
        disponivel: (produto as any).disponivel ?? true,
        status: (produto as any).status || 'ativo'
      }));
      setProdutosComStatus(produtosTransformados);
    } else {
      setProdutosComStatus([]);
    }
  }, [favoritos]);

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
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    
    if (url.startsWith('/')) {
      return `https://api.seuservidor.com${url}`;
    }
    
    return 'https://via.placeholder.com/170x100/6C2BD9/FFFFFF?text=Produto';
  };

  const CardFavorito = ({ item }: { item: ProdutoComStatus }) => {
    const [favoritoLocal, setFavoritoLocal] = useState(true); // Inicia como true porque está na tela de favoritos
    const vendido = item.vendido || false;
    const localizacao = item.localizacao || 'Local não informado';
    const imagemUrl = corrigirUrlImagem(item.imagem || '');
    
    // Sincroniza com o estado global
    useEffect(() => {
      const favoritoGlobal = isFavorito(item.id);
      if (favoritoLocal !== favoritoGlobal) {
        setFavoritoLocal(favoritoGlobal);
      }
    }, [item.id, isFavorito]);

    const handleToggleFavorito = (event: any) => {
      event?.stopPropagation?.();
      
      if (!user) {
        Alert.alert(
          'Login necessário',
          'Faça login para gerenciar favoritos.',
          [
            { text: 'Fazer Login', onPress: () => router.push('/auth/Login/login') },
            { text: 'Cancelar', style: 'cancel' },
          ]
        );
        return;
      }
      
      // Atualização otimista - igual à tela principal
      const novoEstado = !favoritoLocal;
      setFavoritoLocal(novoEstado);
      
      toggleFavorito(item.id).then(success => {
        if (!success) {
          // Reverte se falhar
          setFavoritoLocal(!novoEstado);
          Alert.alert('Erro', 'Não foi possível atualizar os favoritos');
        } else if (!novoEstado) { // Se removeu (novoEstado = false)
          Toast.show({
            type: 'success',
            text1: 'Removido dos favoritos!',
            position: 'bottom',
            visibilityTime: 1500,
          });
        }
      }).catch(() => {
        setFavoritoLocal(!novoEstado);
      });
    };

    return (
      <TouchableOpacity 
        activeOpacity={vendido ? 1 : 0.7} 
        onPress={() => abrirDetalhes(item.id, vendido)}
        disabled={vendido}
      >
        <Card containerStyle={[
          styles.card,
          vendido && styles.vendidoCard
        ]}>
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
                  vendido && styles.favoriteButtonVendido
                ]}
                onPress={handleToggleFavorito}
                activeOpacity={0.7}
                disabled={vendido}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon
                  name={favoritoLocal ? 'favorite' : 'favorite-border'}
                  type="material"
                  size={22}
                  color={vendido ? "#999" : (favoritoLocal ? "#FF3B30" : "#666")}
                />
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
        </View>
      </View>

      <FlatList
        data={produtosComStatus}
        renderItem={({ item }) => <CardFavorito item={item} />}
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
      
      <Toast />
    </SafeAreaView>
  );
};

export default TelaFavoritos;