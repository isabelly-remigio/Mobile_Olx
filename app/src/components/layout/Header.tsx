import React from 'react';
import { HStack, Text, Icon, IconButton, Pressable } from 'native-base';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { HeaderProps } from '../../@types/home'; // ← IMPORT CORRIGIDO

const Header = ({ usuarioLogado, onToggleLogin, onNotificacoes }: HeaderProps) => {
  return (
    <HStack
      bg="white"
      h={16}
      alignItems="center"
      justifyContent="space-between"
      px={4}
      borderBottomWidth={1}
      borderBottomColor="gray.300"
      safeAreaTop
    >
      <Pressable onPress={onToggleLogin}>
        <HStack alignItems="center" space={1}>
          <Text fontSize="sm" color="gray.800" fontWeight="medium">
            {usuarioLogado ? `Olá, ${usuarioLogado.nome}!` : 'Buscando em DDD 81 - Grande Recife'}
          </Text>
          <Icon as={MaterialIcons} name="keyboard-arrow-down" size={5} color="gray.500" />
        </HStack>
      </Pressable>
      <IconButton
        icon={<Icon as={Ionicons} name="notifications-outline" size={6} color="gray.500" />}
        onPress={onNotificacoes}
        _pressed={{ bg: 'gray.100' }}
        borderRadius="full"
      />
    </HStack>
  );
};

export default Header;