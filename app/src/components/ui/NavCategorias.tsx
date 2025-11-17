// components/ui/NavCategorias.tsx
import React from 'react';
import { ScrollView, HStack, Pressable, Text, VStack, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { NavCategoriasProps } from '../../@types/home';

const NavCategorias: React.FC<NavCategoriasProps> = ({ 
  categorias, 
  ativa, 
  onChangeCategoria 
}) => {
  return (
    <VStack bg="white" borderBottomWidth={1} borderBottomColor="gray.200">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      >
        <HStack space={4} alignItems="center">
          {categorias.map((categoria) => (
            <Pressable
              key={categoria.id}
              onPress={() => onChangeCategoria(categoria.id)}
              alignItems="center"
              minWidth={16}
            >
              <VStack alignItems="center" space={1}>
                <Icon
                  as={MaterialIcons}
                  name={categoria.icone as any}
                  size={6}
                  color={ativa === categoria.id ? "primary.500" : "gray.500"}
                />
                <Text
                  fontSize="xs"
                  fontWeight={ativa === categoria.id ? "bold" : "normal"}
                  color={ativa === categoria.id ? "primary.500" : "gray.600"}
                  textAlign="center"
                  numberOfLines={1}
                >
                  {categoria.nome}
                </Text>
              </VStack>
            </Pressable>
          ))}
        </HStack>
      </ScrollView>
    </VStack>
  );
};

export default NavCategorias;