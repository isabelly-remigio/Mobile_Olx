// components/ui/InfoAnunciante.tsx
import React from 'react';
import { VStack, HStack, Text, Box, Badge, Icon, Button } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Anunciante } from '../../@types/anuncio';

interface InfoAnuncianteProps {
  anunciante: Anunciante;
  onAbrirPerfil: () => void;
}

export const InfoAnunciante: React.FC<InfoAnuncianteProps> = ({ anunciante, onAbrirPerfil }) => {
  return (
    <VStack space={3} bg="gray.50" p={4} borderRadius="md">
      <Text fontSize="md" fontWeight="semibold" color="gray.800">
        Sobre o Anunciante
      </Text>
      
      <HStack alignItems="center" space={3}>
        <Box
          w={12}
          h={12}
          bg="primary.600"
          borderRadius="full"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="xl" fontWeight="bold" color="white">
            {anunciante.nome.charAt(0)}
          </Text>
        </Box>
        <VStack flex={1}>
          <Text fontSize="md" fontWeight="semibold" color="gray.800">
            {anunciante.nome}
          </Text>
          <Text fontSize="xs" color="gray.600">
            Membro desde {new Date(anunciante.dataCadastro).getFullYear()}
          </Text>
        </VStack>
      </HStack>

      <HStack space={2}>
        {anunciante.emailVerificado && (
          <Badge
            bg="green.100"
            _text={{ color: 'green.700', fontSize: 'xs', fontWeight: 'semibold' }}
            borderRadius="full"
            px={2}
            py={1}
          >
            <HStack alignItems="center" space={1}>
              <Icon as={MaterialIcons} name="check-circle" size={3} color="green.700" />
              <Text fontSize="xs" color="green.700" fontWeight="semibold">E-mail verificado</Text>
            </HStack>
          </Badge>
        )}
        {anunciante.telefoneVerificado && (
          <Badge
            bg="blue.100"
            _text={{ color: 'blue.700', fontSize: 'xs', fontWeight: 'semibold' }}
            borderRadius="full"
            px={2}
            py={1}
          >
            <HStack alignItems="center" space={1}>
              <Icon as={MaterialIcons} name="check-circle" size={3} color="blue.700" />
              <Text fontSize="xs" color="blue.700" fontWeight="semibold">Telefone verificado</Text>
            </HStack>
          </Badge>
        )}
      </HStack>

      <VStack space={1.5}>
        <HStack alignItems="center" space={2}>
          <Icon as={MaterialIcons} name="location-on" size={4} color="gray.600" />
          <Text fontSize="xs" color="gray.700">
            {anunciante.regiao}, {anunciante.cidade} - {anunciante.estado}
          </Text>
        </HStack>
        <HStack alignItems="center" space={2}>
          <Icon as={MaterialIcons} name="access-time" size={4} color="gray.600" />
          <Text fontSize="xs" color="gray.700">
            Responde em cerca de {anunciante.tempoResposta}
          </Text>
        </HStack>
      </VStack>

      <Button
        bg="white"
        borderWidth={1}
        borderColor="primary.600"
        _pressed={{ bg: 'primary.50' }}
        _text={{ color: 'primary.600', fontWeight: 'semibold', fontSize: 'sm' }}
        size="md"
        borderRadius="md"
        onPress={onAbrirPerfil}
      >
        Acessar perfil do anunciante
      </Button>
    </VStack>
  );
};