// components/ui/CarrosselAnuncio.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
} from 'react-native';
import { Text, Icon } from '@rneui/themed';
import { CarrosselAnuncioProps } from '../../@types/anuncio';
import { CarrosselAnuncioStyles } from '../../styles/components/CarrosselAnuncioStyles';

const { width: screenWidth } = Dimensions.get('window');

export const CarrosselAnuncio: React.FC<CarrosselAnuncioProps> = ({ imagens }) => {
  const [imagemAtual, setImagemAtual] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setImagemAtual(index);
  };

  // Se não tiver imagens
  if (!imagens || imagens.length === 0) {
    return (
      <View style={CarrosselAnuncioStyles.container}>
        <View style={[CarrosselAnuncioStyles.imageContainer, CarrosselAnuncioStyles.placeholderContainer]}>
          <Icon
            name="image"
            type="material"
            size={60}
            color="#9CA3AF"
          />
          <Text style={CarrosselAnuncioStyles.placeholderText}>Sem imagens</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={CarrosselAnuncioStyles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        style={CarrosselAnuncioStyles.scrollView}
        contentContainerStyle={CarrosselAnuncioStyles.scrollContent}
      >
        {imagens.map((imagem, index) => (
          <View key={index} style={CarrosselAnuncioStyles.imageContainer}>
            <Image
              source={{ uri: imagem }}
              style={CarrosselAnuncioStyles.image}
              resizeMode="cover"
              onLoadStart={() => setCarregando(true)}
              onLoadEnd={() => setCarregando(false)}
              onError={() => {
                console.log('Erro ao carregar imagem:', imagem);
                setCarregando(false);
              }}
            />
            {carregando && (
              <View style={CarrosselAnuncioStyles.loadingOverlay}>
                <ActivityIndicator size="large" color="#6D0AD6" />
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Badge de quantidade */}
      <View style={CarrosselAnuncioStyles.badgeContainer}>
        <Text style={CarrosselAnuncioStyles.badgeText}>
          {imagemAtual + 1}/{imagens.length}
        </Text>
      </View>
    </View>
  );
};