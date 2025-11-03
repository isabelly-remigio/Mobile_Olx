import { Box, Image, Text, Button, VStack } from 'native-base';
import React from 'react';

type CardProdutoProps = {
  nome: string;
  preco: number;
  imagem?: string;
  aoAdicionar?: () => void;
};

export function CardProduto({ nome, preco, imagem, aoAdicionar }: CardProdutoProps) {
  return (
    <Box borderWidth={1} borderColor="gray.200" borderRadius="md" p={2} w="48%" mb={4}>
      {imagem && <Image source={{ uri: imagem }} alt={nome} h={100} mb={2} borderRadius="md" />}
      <VStack space={1}>
        <Text fontWeight="bold">{nome}</Text>
        <Text color="primary.500">R$ {preco.toFixed(2)}</Text>
        {aoAdicionar && (
          <Button mt={2} onPress={aoAdicionar} colorScheme="orange">
            Adicionar ao Carrinho
          </Button>
        )}
      </VStack>
    </Box>
  );
}
