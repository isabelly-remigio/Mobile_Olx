import React from 'react';
import { HStack, Text, Icon, Pressable } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { FooterNavigationProps } from '../../@types/home';

const Footer = ({ ativo, onNavigate }: FooterNavigationProps) => {
  const itens = [
    { id: 'inicio', icone: 'home', texto: 'Início' },
    { id: 'explorar', icone: 'search', texto: 'Explorar' },
    { id: 'favoritos', icone: 'favorite', texto: 'Favoritos' },
    { id: 'carrinho', icone: 'shopping-cart', texto: 'Carrinho' },
    { id: 'menu', icone: 'menu', texto: 'Menu' }
  ];
  
  return (
    <HStack
      bg="white"
      h={16}
      justifyContent="space-around"
      alignItems="center"
      borderTopWidth={1}
      borderTopColor="gray.300"
      safeAreaBottom
      px={2}
    >
      {itens.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => onNavigate(item.id)}
          alignItems="center"
          flex={1}
          py={2}
        >
          <Icon
            as={MaterialIcons}
            name={item.icone}
            size={6}
            color={ativo === item.id ? 'primary.500' : 'gray.500'}
          />
          <Text
            fontSize="2xs"
            fontWeight="medium"
            color={ativo === item.id ? 'primary.500' : 'gray.500'}
            mt={1}
          >
            {item.texto}
          </Text>
        </Pressable>
      ))}
    </HStack>
  );
};

export default Footer;