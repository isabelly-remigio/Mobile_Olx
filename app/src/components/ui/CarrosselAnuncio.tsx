// components/ui/CarrosselAnuncio.tsx
import { Icon, Text } from '@rneui/themed';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    View,
} from 'react-native';
import { CarrosselAnuncioProps } from '../../@types/anuncio';
import { CarrosselAnuncioStyles } from '../../styles/components/CarrosselAnuncioStyles';

const { width: screenWidth } = Dimensions.get('window');

export const CarrosselAnuncio: React.FC<CarrosselAnuncioProps> = ({ imagens }) => {
  const [imagemAtual, setImagemAtual] = useState(0);
  const [imagensCarregadas, setImagensCarregadas] = useState<Set<number>>(new Set());
  const scrollViewRef = useRef<ScrollView>(null);
  const loadingRefs = useRef<Record<number, boolean>>({});

  // Reset quando as imagens mudarem
  useEffect(() => {
    setImagensCarregadas(new Set());
    loadingRefs.current = {};
  }, [imagens]);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setImagemAtual(index);
  };

  const marcarComoCarregada = (index: number) => {
    // Evita atualizações múltiplas
    if (loadingRefs.current[index]) {
      return;
    }
    loadingRefs.current[index] = true;
    
    setImagensCarregadas(prev => {
      const novo = new Set(prev);
      novo.add(index);
      return novo;
    });
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
        {imagens.map((imagem, index) => {
          const estaCarregada = imagensCarregadas.has(index);
          
          return (
            <View key={index} style={CarrosselAnuncioStyles.imageContainer}>
              <Image
                source={{ uri: imagem }}
                style={CarrosselAnuncioStyles.image}
                resizeMode="contain"
                onLoadEnd={() => {
                  marcarComoCarregada(index);
                }}
                onError={() => {
                  marcarComoCarregada(index);
                }}
              />
              {!estaCarregada && (
                <View style={CarrosselAnuncioStyles.loadingOverlay}>
                  <ActivityIndicator size="large" color="#6D0AD6" />
                </View>
              )}
            </View>
          );
        })}
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