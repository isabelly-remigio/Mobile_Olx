import { Icon } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { CardProdutoProps } from '../../@types/home';
import { useFavoritos } from '../../hooks/useFavoritos';
import { formatarPreco } from '../../utils/formatters';

const CardProduto = ({ produto, onPress }: CardProdutoProps) => {
  const { toggleFavorito, isFavorito } = useFavoritos();
  const [favoritoLocal, setFavoritoLocal] = useState(false);

  useEffect(() => {
    setFavoritoLocal(isFavorito(produto.id));
  }, [produto.id, isFavorito]);

  const handleToggleFavorito = (event: any) => {
    event.stopPropagation();
    const novoEstado = !favoritoLocal;
    setFavoritoLocal(novoEstado);
    toggleFavorito(produto.id);
  };


  return (
    <Pressable 
      onPress={onPress}
      style={{
        width: 170,
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginRight: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      {/* IMAGEM */}
      <View style={{ height: 120, position: 'relative' }}>
        <Image 
          source={{ 
            uri: produto.imagem || 'https://via.placeholder.com/170x120?text=Produto'
          }} 
          style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
        />
        
        {produto.destaque && (
          <View style={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: '#7C3AED',
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
          }}>
            <Text style={{ fontSize: 10, color: 'white', fontWeight: 'bold' }}>
              DESTAQUE
            </Text>
          </View>
        )}
        
        <Pressable 
          onPress={handleToggleFavorito}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 15,
            padding: 4,
          }}
        >
          <Icon
            name={favoritoLocal ? 'favorite' : 'favorite-border'}
            type="material"
            size={20}
            color={favoritoLocal ? '#EF4444' : 'white'}
          />
        </Pressable>
      </View>
      
      {/* CONTEÚDO - LAYOUT FLEXÍVEL */}
      <View style={{ padding: 12, flex: 1 }}>
        {/* TÍTULO (altura fixa) */}
        <Text 
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#1F2937',
            lineHeight: 18,
            height: 36,
            overflow: 'hidden',
          }}
          numberOfLines={2}
        >
          {produto.nome}
        </Text>
        
        {/* PREÇO */}
        <Text 
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#10B981',
            marginTop: 4,
            marginBottom: 2,
          }}
        >
          {formatarPreco(produto.preco)}
        </Text>
        
        {/* CONDIÇÃO (se existir) */}
        {produto.condicao && (
          <Text 
            style={{
              fontSize: 12,
              color: '#6B7280',
              marginBottom: 2,
            }}
            numberOfLines={1}
          >
            {produto.condicao}
          </Text>
        )}
        
        {/* LOCALIZAÇÃO (sempre na base) */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: 4,
        }}>
          <Icon
            name="location-on"
            type="material"
            size={12}
            color="#6B7280"
          />
          <Text 
            style={{
              fontSize: 12,
              color: '#6B7280',
              marginLeft: 4,
              flex: 1,
            }}
            numberOfLines={1}
          >
            {produto.localizacao}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default CardProduto;