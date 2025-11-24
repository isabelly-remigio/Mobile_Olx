// components/ui/CarrosselAnuncio.tsx
import React, { useState } from 'react';
import { Box, Image, ScrollView, Text } from 'native-base';
import { CarrosselAnuncioProps } from '../../@types/anuncio';

export const CarrosselAnuncio: React.FC<CarrosselAnuncioProps> = ({ imagens }) => {
  const [imagemAtual, setImagemAtual] = useState(0);

  return (
    <Box position="relative" w="100%" h={300} overflow="hidden">
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const novoIndice = Math.round(
            e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width
          );
          setImagemAtual(novoIndice);
        }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {imagens.map((imagem, index) => (
          <Image
            key={index}
            source={{ uri: imagem }}
            alt={`Imagem ${index + 1}`}
            w="100%"
            h="100%"
            flexShrink={0}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Badge de quantidade */}
      <Box
        position="absolute"
        bottom={3}
        right={3}
        bg="rgba(0,0,0,0.6)"
        px={3}
        py={1.5}
        borderRadius="full"
      >
        <Text fontSize="xs" color="white" fontWeight="semibold">
          {imagemAtual + 1}/{imagens.length}
        </Text>
      </Box>
    </Box>
  );
};
