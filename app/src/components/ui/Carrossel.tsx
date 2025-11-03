import { ScrollView, Image, Box } from 'native-base';
import React from 'react';

export function Carrossel() {
  const imagens = [
    'https://via.placeholder.com/200x100?text=Oferta+1',
    'https://via.placeholder.com/200x100?text=Oferta+2',
    'https://via.placeholder.com/200x100?text=Oferta+3',
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} space={2}>
      {imagens.map((url, idx) => (
        <Box key={idx} mr={2} borderRadius="md" overflow="hidden">
          <Image source={{ uri: url }} alt={`Oferta ${idx + 1}`} w={200} h={100} />
        </Box>
      ))}
    </ScrollView>
  );
}
