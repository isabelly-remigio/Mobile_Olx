import React from 'react';
import { Box, VStack, Text, Image, Icon, Pressable, HStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { CardProdutoProps } from '../../@types/home';
import { formatarPreco } from '../../utils/formatters';
import { useFavoritos } from '../../hooks/useFavoritos';

const CardProduto = ({ produto, onPress }: CardProdutoProps) => {
  const { toggleFavorito, isFavorito } = useFavoritos();
  const favorito = isFavorito(produto.id);

  const handleToggleFavorito = (event: any) => {
    event.stopPropagation(); // Impede que o evento de clique propague para o card
    toggleFavorito(produto.id);
  };

  return (
    <Pressable onPress={onPress} mr={3}>
      {({ isPressed }) => (
        <Box
          w={170}
          h={240}
          bg="white"
          borderRadius="md"
          borderWidth={1}
          borderColor="gray.300"
          shadow={1}
          overflow="hidden"
          opacity={isPressed ? 0.9 : 1}
          transform={[{ scale: isPressed ? 0.98 : 1 }]}
        >
          <Box position="relative" h={120}>
            <Image
              source={{ uri: produto.imagem }}
              alt={produto.titulo}
              w="full"
              h="full"
              resizeMode="cover"
            />
            {produto.destaque && (
              <Box
                position="absolute"
                top={2}
                left={2}
                bg="primary.500"
                px={2}
                py={1}
                borderRadius="sm"
              >
                <Text fontSize="2xs" color="white" fontWeight="bold">
                  DESTAQUE
                </Text>
              </Box>
            )}
            <Pressable
              position="absolute"
              top={2}
              right={2}
              onPress={handleToggleFavorito}
              bg="rgba(0,0,0,0.3)"
              borderRadius="full"
              p={1.5}
              _pressed={{ bg: 'rgba(0,0,0,0.5)' }}
            >
              <Icon
                as={MaterialIcons}
                name={favorito ? 'favorite' : 'favorite-border'}
                size={5}
                color={favorito ? 'red.500' : 'white'}
              />
            </Pressable>
          </Box>
          <VStack p={3} space={2} flex={1}>
            <Text fontSize="sm" fontWeight="semibold" color="gray.800" numberOfLines={2}>
              {produto.titulo}
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="green.600">
              {formatarPreco(produto.preco)}
            </Text>
            <Text fontSize="xs" color="gray.600" numberOfLines={2}>
              {produto.descricao}
            </Text>
            <HStack alignItems="center" space={1}>
              <Icon as={MaterialIcons} name="location-on" size={3} color="gray.500" />
              <Text fontSize="xs" color="gray.500">
                {produto.localizacao}
              </Text>
            </HStack>
          </VStack>
        </Box>
      )}
    </Pressable>
  );
};

export default CardProduto;