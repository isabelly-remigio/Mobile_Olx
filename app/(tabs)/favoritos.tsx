// screens/TelaFavoritos.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Card, Image, Button, Icon } from '@rneui/themed';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../src/theme/theme';

// Tipos
interface ProdutoFavorito {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
  localizacao: string;
  cidade: string;
  estado: string;
  destaque?: boolean;
}

const TelaFavoritos: React.FC = () => {
  const [favoritos, setFavoritos] = useState<ProdutoFavorito[]>([
    {
      id: '1',
      nome: 'iPhone 13 Pro Max 256GB em excelente estado',
      preco: 4500,
      imagem: 'https://via.placeholder.com/150/6C2BD9/FFFFFF?text=iPhone',
      localizacao: 'Boa Viagem',
      cidade: 'Recife',
      estado: 'PE',
      destaque: true,
    },
    {
      id: '2',
      nome: 'Samsung Galaxy S23 Ultra',
      preco: 3200,
      imagem: 'https://via.placeholder.com/150/E9E1F9/333333?text=Samsung',
      localizacao: 'Pinheiros',
      cidade: 'São Paulo',
      estado: 'SP',
    },
    {
      id: '3',
      nome: 'Notebook Dell Inspiron i15 8GB',
      preco: 2800,
      imagem: 'https://via.placeholder.com/150/6C2BD9/FFFFFF?text=Dell',
      localizacao: 'Centro',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      destaque: true,
    },
  ]);

  const removerFavorito = (id: string) => {
    // Animação de remoção seria implementada aqui
    setFavoritos(favoritos.filter(item => item.id !== id));
  };

  const abrirDetalhes = (produto: ProdutoFavorito) => {
    console.log('Abrindo detalhes:', produto.nome);
    // Navegação para tela de detalhes
  };

  const explorarProdutos = () => {
    console.log('Navegando para explorar produtos');
    // Navegação para tela de explorar/home
  };

  const formatarPreco = (valor: number) => {
    return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const renderCardFavorito = ({ item }: { item: ProdutoFavorito }) => (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={() => abrirDetalhes(item)}
    >
      <Card containerStyle={styles.card}>
        <View style={styles.cardContent}>
          {/* Imagem do Produto */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.imagem }}
              style={styles.productImage}
              resizeMode="cover"
            />
            {item.destaque && (
              <View style={styles.destaqueTag}>
                <Text style={styles.destaqueText}>DESTAQUE</Text>
              </View>
            )}
          </View>

          {/* Informações do Produto */}
          <View style={styles.infoContainer}>
            <View style={styles.textContent}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.nome}
              </Text>
              
              <Text style={styles.productPrice}>
                {formatarPreco(item.preco)}
              </Text>
              
              <View style={styles.locationContainer}>
                <Icon
                  name="location-on"
                  type="material"
                  size={theme.iconSizes.localizacao}
                  color={theme.colors.gray500}
                />
                <Text style={styles.productLocation}>
                  {item.localizacao}, {item.cidade} - {item.estado}
                </Text>
              </View>
            </View>

            {/* Botão Remover Favorito */}
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => removerFavorito(item.id)}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                name="favorite"
                type="material"
                size={theme.iconSizes.favorito}
                color={theme.colors.error}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {/* Ícone/Emoji ilustrativo */}
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyEmoji}>💜</Text>
      </View>

      {/* Texto principal */}
      <Text style={styles.emptyTitle}>
        Você ainda não salvou nenhum anúncio
      </Text>

      {/* Texto secundário */}
      <Text style={styles.emptyText}>
        Explore e salve anúncios que você gostar!
      </Text>

      {/* Botão CTA */}
      <Button
        title="Explorar Produtos"
        onPress={explorarProdutos}
        buttonStyle={styles.exploreButton}
        titleStyle={styles.exploreButtonText}
        icon={{
          name: 'search',
          type: 'material',
          size: 20,
          color: theme.colors.white,
        }}
        iconPosition="left"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favoritos</Text>
        {favoritos.length > 0 && (
          <Text style={styles.headerCount}>
            {favoritos.length} {favoritos.length === 1 ? 'item' : 'itens'}
          </Text>
        )}
      </View>

      {/* Lista de Favoritos ou Estado Vazio */}
      <FlatList
        data={favoritos}
        renderItem={renderCardFavorito}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          favoritos.length === 0 && styles.listContainerEmpty
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
    backgroundColor: theme.colors.white,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.gray900,
  },
  headerCount: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray600,
    marginTop: theme.spacing.xs,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  listContainerEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    borderRadius: theme.borderRadius.md,
    padding: 0,
    margin: 0,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  cardContent: {
    flexDirection: 'row',
    height: 120,
  },
  imageContainer: {
    width: '38%',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: theme.borderRadius.md,
    borderBottomLeftRadius: theme.borderRadius.md,
  },
  destaqueTag: {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: theme.colors.primary[500],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  destaqueText: {
    color: theme.colors.white,
    fontSize: 9,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: 0.5,
  },
  infoContainer: {
    flex: 1,
    padding: theme.spacing.md,
    justifyContent: 'space-between',
  },
  textContent: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  productName: {
    fontSize: 15,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.gray900,
    lineHeight: 20,
  },
  productPrice: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.black,
    marginTop: theme.spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 'auto',
  },
  productLocation: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray600,
  },
  favoriteButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.sm,
  },
  
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyEmoji: {
    fontSize: 48,
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
    color: theme.colors.gray600,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  exploreButton: {
    backgroundColor: theme.colors.primary[500],
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    minWidth: 200,
  },
  exploreButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    marginLeft: theme.spacing.sm,
  },
});

export default TelaFavoritos;