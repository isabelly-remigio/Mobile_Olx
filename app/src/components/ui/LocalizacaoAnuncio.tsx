// components/ui/LocalizacaoAnuncio.tsx
import React from 'react';
import { VStack, HStack, Text, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

interface LocalizacaoAnuncioProps {
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export const LocalizacaoAnuncio: React.FC<LocalizacaoAnuncioProps> = ({ 
  bairro, 
  cidade, 
  estado, 
  cep 
}) => {
  return (
    <VStack space={2}>
      <Text fontSize="md" fontWeight="semibold" color="gray.800">
        Localização
      </Text>
      <HStack alignItems="center" space={2}>
        <Icon as={MaterialIcons} name="location-on" size={5} color="primary.600" />
        <VStack>
          <Text fontSize="sm" color="gray.800" fontWeight="medium">
            {bairro}
          </Text>
          <Text fontSize="xs" color="gray.600">
            {cidade} - {estado}
          </Text>
          <Text fontSize="xs" color="gray.500">
            CEP: {cep}
          </Text>
        </VStack>
      </HStack>
    </VStack>
  );
};