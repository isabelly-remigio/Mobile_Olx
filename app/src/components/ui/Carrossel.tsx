// components/ui/Carrossel.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Text } from '@rneui/themed';
import { CarrosselPromocionalProps } from '../../@types/home';
import { CarrosselStyles, CarrosselConstants } from '../../styles/components/CarrosselStyles';

const { width: screenWidth } = Dimensions.get('window');

const Carrossel: React.FC<CarrosselPromocionalProps> = ({ banners, onClick }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Se não houver banners, retorna null
  if (!banners || banners.length === 0) {
    return null;
  }

  // Auto-play para múltiplos banners
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => 
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
      }, CarrosselConstants.autoplayInterval);

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const handleScroll = (event: any) => {
    const slideWidth = screenWidth;
    const currentIndex = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
    setActiveIndex(currentIndex);
  };

  // Se houver apenas um banner, exibe uma versão simplificada
  if (banners.length === 1) {
    const banner = banners[0];
    return (
      <View style={CarrosselStyles.container}>
        <TouchableOpacity
          style={CarrosselStyles.imageContainer}
          onPress={() => onClick(banner)}
          activeOpacity={0.9}
        >
          <Image
            source={{ 
              uri: banner.imagem || 'https://via.placeholder.com/400x200',
              cache: 'force-cache'
            }}
            style={CarrosselStyles.image}
            // defaultSource={require('../../assets/placeholder-banner.png')}
            accessibilityLabel={banner.titulo}
          />
          <View style={CarrosselStyles.overlay}>
            <Text style={CarrosselStyles.title}>{banner.titulo}</Text>
            {banner.subtitulo && (
              <Text style={CarrosselStyles.subtitle}>{banner.subtitulo}</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  // Versão com múltiplos banners e carrossel
  return (
    <View style={CarrosselStyles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {banners.map((banner, index) => (
          <TouchableOpacity
            key={banner.id || index}
            style={[CarrosselStyles.imageContainer, { width: screenWidth }]}
            onPress={() => onClick(banner)}
            activeOpacity={0.9}
          >
            <Image
              source={{ 
                uri: banner.imagem || 'https://via.placeholder.com/400x200',
                cache: 'force-cache'
              }}
              style={CarrosselStyles.image}
              // defaultSource={require('../../assets/placeholder-banner.png')}
              accessibilityLabel={banner.titulo}
            />
            <View style={CarrosselStyles.overlay}>
              <Text style={CarrosselStyles.title}>{banner.titulo}</Text>
              {banner.subtitulo && (
                <Text style={CarrosselStyles.subtitle}>{banner.subtitulo}</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Indicadores (dots) */}
      {banners.length > 1 && (
        <View style={CarrosselStyles.dotsContainer}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                CarrosselStyles.dot,
                activeIndex === index && CarrosselStyles.activeDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default Carrossel;