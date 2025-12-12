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
  } = useFavoritos();
  const [refreshing, setRefreshing] = useState(false);

  const handleRemoverFavorito = async (produtoId: string) => {
    Alert.alert(
      'Remover Favorito',
      'Tem certeza que deseja remover este item dos favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
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

  const abrirDetalhes = (produtoId: string) => {
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

const renderCardFavorito = ({ item }: { item: Produto }) => {
  // Garantir que localizacao tenha um valor válido
  const localizacao = item.localizacao || 'Local não informado';
  
  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={() => abrirDetalhes(item.id)}
    >
      <Card containerStyle={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.imageContainer}>
            <Image
              source={{ 
                uri: item.imagem || 'https://via.placeholder.com/150/6C2BD9/FFFFFF?text=Produto'
              }}
              style={styles.productImage}
              resizeMode="cover"
              PlaceholderContent={<ActivityIndicator />}
            />
            {item.destaque && (
              <View style={styles.destaqueTag}>
                <Text style={styles.destaqueText}>DESTAQUE</Text>
              </View>
            )}
          </View>

          <View style={styles.infoContainer}>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => handleRemoverFavorito(item.id)}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                name="favorite"
                type="material"
                size={22}
                color={styles.favoriteButton.color}
              />
            </TouchableOpacity>

            <View style={styles.textContent}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.nome || 'Sem nome'}
              </Text>
              
              <Text style={styles.productPrice}>
                {formatarPreco(item.preco || 0)}
              </Text>
              
              {/* LOCALIZAÇÃO - CORRIGIDO */}
              <View style={styles.locationContainer}>
                <Icon
                  name="location-on"
                  type="material"
                  size={16}
                  color={styles.locationContainer.color}
                />
                <Text style={styles.productLocation} numberOfLines={1}>
                  {localizacao}
                </Text>
              </View>
              
              {item.categoria && (
                <View style={styles.categoriaContainer}>
                  <Text style={styles.categoriaText} numberOfLines={1}>
                    {item.categoria}
                  </Text>
                </View>
              )}
              
              {item.condicao && (
                <View style={styles.condicaoContainer}>
                  <Text style={styles.condicaoText} numberOfLines={1}>
                    {item.condicao}
                  </Text>
                </View>
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
          color={styles.emptyIconContainer.color}
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
          color: styles.exploreButton.color,
        }}
        iconPosition="left"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={styles.container.backgroundColor} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favoritos</Text>
        {favoritos.length > 0 && (
          <Text style={styles.headerCount}>
            {favoritos.length} {favoritos.length === 1 ? 'item' : 'itens'}
          </Text>
        )}
      </View>

      <FlatList
        data={favoritos}
        renderItem={renderCardFavorito}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContainer,
          favoritos.length === 0 && styles.listContainerEmpty
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[styles.refreshControl.colors]}
            tintColor={styles.refreshControl.tintColor}
          />
        }
      />
    </SafeAreaView>
  );
};

export default TelaFavoritos;