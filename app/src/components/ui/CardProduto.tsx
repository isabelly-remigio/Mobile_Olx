import React, { useState } from 'react';
import { Box, VStack, Text, Image, IconButton, Icon, Pressable, HStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { CardProdutoProps } from '../../@types/home';
import { formatarPreco } from '../../utils/formatters';

const CardProduto = ({ produto, onClick }: CardProdutoProps) => {
  const [favorito, setFavorito] = useState(produto.favoritado || false);
  
  return (
    <Pressable onPress={onClick} mr={3}>
      <Box
        w={170}
        h={240}
        bg="white"
        borderRadius="md"
        borderWidth={1}
        borderColor="gray.300"
        shadow={1}
        overflow="hidden"
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
          <IconButton
            position="absolute"
            top={2}
            right={2}
            icon={
              <Icon
                as={MaterialIcons}
                name={favorito ? 'favorite' : 'favorite-border'}
                size={5}
                color={favorito ? 'red.500' : 'white'}
              />
            }
            onPress={() => setFavorito(!favorito)}
            bg="rgba(0,0,0,0.3)"
            borderRadius="full"
            _pressed={{ bg: 'rgba(0,0,0,0.5)' }}
            size={7}
          />
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
    </Pressable>
  );
};

export default CardProduto;