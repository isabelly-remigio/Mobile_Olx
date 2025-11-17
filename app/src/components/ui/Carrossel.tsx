// components/ui/Carrossel.tsx
import React from 'react';
import { Box, Image, Text, VStack, Pressable, HStack } from 'native-base';
import { CarrosselPromocionalProps } from '../../@types/home';

const Carrossel: React.FC<CarrosselPromocionalProps> = ({ banners, onClick }) => {
  if (!banners || banners.length === 0) return null;

  return (
    <Box width="100%" height={200} mt={2}>
      <Pressable onPress={() => onClick(banners[0])} flex={1}>
        <Image
          source={{ uri: banners[0].imagem || 'https://via.placeholder.com/400x200' }}
          alt={banners[0].titulo}
          width="100%"
          height="100%"
          resizeMode="cover"
        />
        <Box 
          position="absolute" 
          bottom={0} 
          left={0} 
          right={0} 
          bg="rgba(0,0,0,0.6)" 
          px={4} 
          py={3}
        >
          <Text fontSize="lg" fontWeight="bold" color="white">
            {banners[0].titulo}
          </Text>
          <Text fontSize="sm" color="white" mt={1}>
            {banners[0].subtitulo}
          </Text>
        </Box>
      </Pressable>
    </Box>
  );
};

export default Carrossel;