// components/ui/CardProdutoRNE.tsx
import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Icon, Card } from '@rneui/themed';
import { CardProdutoProps } from '../../@types/home';
import { formatarPreco } from '../../utils/formatters';
import { useFavoritos } from '../../hooks/useFavoritos';
import { CardProdutoStyles, CardProdutoConstants } from '../../styles/components/CardProdutoStyles';

const CardProduto = ({ produto, onPress }: CardProdutoProps) => {
  const { toggleFavorito, isFavorito } = useFavoritos();
  const favorito = isFavorito(produto.id);

  const handleToggleFavorito = (event: any) => {
    event.stopPropagation();
    toggleFavorito(produto.id);
  };

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      CardProdutoStyles.cardContainer,
      pressed && CardProdutoStyles.pressedContainer,
    ]}>
      <View style={CardProdutoStyles.imageContainer}>
        <Image source={{ uri: produto.imagem }} style={CardProdutoStyles.imagem} />
        
        {produto.destaque && (
          <View style={CardProdutoStyles.destaqueBadge}>
            <Text style={CardProdutoStyles.destaqueText}>DESTAQUE</Text>
          </View>
        )}
        
        <Pressable onPress={handleToggleFavorito} style={CardProdutoStyles.favoritoButton}>
          <Icon
            name={favorito ? 'favorite' : 'favorite-border'}
            type="material"
            size={CardProdutoConstants.iconSizes.favorito}
            color={favorito ? CardProdutoConstants.colors.red500 : CardProdutoConstants.colors.white}
          />
        </Pressable>
      </View>
      
      <View style={CardProdutoStyles.contentContainer}>
        <Text style={CardProdutoStyles.titulo} numberOfLines={2}>
          {produto.titulo}
        </Text>
        
        <Text style={CardProdutoStyles.preco}>
          {formatarPreco(produto.preco)}
        </Text>
        
        <Text style={CardProdutoStyles.descricao} numberOfLines={2}>
          {produto.descricao}
        </Text>
        
        <View style={CardProdutoStyles.localizacaoContainer}>
          <Icon
            name="location-on"
            type="material"
            size={CardProdutoConstants.iconSizes.localizacao}
            color={CardProdutoConstants.colors.gray500}
          />
          <Text style={CardProdutoStyles.localizacaoText} numberOfLines={1}>
            {produto.localizacao}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default CardProduto;