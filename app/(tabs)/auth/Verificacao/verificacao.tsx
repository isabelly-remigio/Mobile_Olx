import React from 'react';
import { useRouter } from 'expo-router';
import {
  NativeBaseProvider,
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  IconButton,
  Center,
  Avatar
} from 'native-base';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const TelaAcesseConta = () => {
  const router = useRouter();
  const emailUsuario = 'isabelly.re••••••@gmail.com'; // Email mockado - não puxa do banco

  const voltar = () => {
    router.back(); // Navegação com Expo Router
  };


  return (
    <Box flex={1} bg="white">
      {/* Header - 56px de altura */}
      <HStack
        alignItems="center"
        justifyContent="space-between"
        px="16px"
        h="56px"
        safeAreaTop
      >
        <IconButton
          icon={
            <Icon 
              as={MaterialIcons} 
              name="arrow-back" 
              size="24px" 
              color="rgba(0, 0, 0, 0.7)" 
            />
          }
          onPress={voltar}
          _pressed={{ bg: 'gray.100' }}
          borderRadius="full"
          p={0}
        />
        
        <Text 
          fontSize="16px" 
          fontWeight="400" 
          color="#333333"
          flex={1}
          ml="8px"
        >
          Acesse sua conta
        </Text>
       
      </HStack>

      <VStack flex={1} alignItems="center" px="24px">
        {/* Ilustração do envelope - 64px do header */}
        <Box mt="64px">
          <Center
            bg="#E9E1F9"
            borderRadius="full"
            w="96px"
            h="96px"
            position="relative"
          >
            {/* Envelope */}
            <Box
              borderWidth="3px"
              borderColor="#6C2BD9"
              borderRadius="md"
              w="60px"
              h="48px"
              bg="white"
              position="relative"
            >
              {/* Tampa do envelope */}
              <Box
                position="absolute"
                top="-1px"
                left="-1px"
                right="-1px"
                borderTopWidth="24px"
                borderTopColor="#6C2BD9"
                borderLeftWidth="30px"
                borderLeftColor="transparent"
                borderRightWidth="30px"
                borderRightColor="transparent"
              />
            </Box>
            
            <Center
              position="absolute"
              top="8px"
              right="8px"
              bg="#6C2BD9"
              borderRadius="full"
              w="20px"
              h="20px"
            >
              <Icon 
                as={MaterialIcons} 
                name="check" 
                size="14px" 
                color="white" 
              />
            </Center>
          </Center>
        </Box>

        <Text
          fontSize="20px"
          fontWeight="700"
          color="#1A1A1A"
          textAlign="center"
          mt="24px"
          lineHeight="24px"
        >
          Verifique seu e-mail
        </Text>

        <Text
          fontSize="14px"
          fontWeight="400"
          color="#5F5F5F"
          textAlign="center"
          mt="8px"
        >
          Siga as instruções enviadas para o e-mail
        </Text>

        <HStack
          alignItems="center"
          mt="12px"
          h="40px"
        >
          <Avatar
            bg="#C4C4C4"
            size="28px"
          >
            <Icon as={MaterialIcons} name="person" size="16px" color="white" />
          </Avatar>
          <Text
            fontSize="14px"
            fontWeight="400"
            color="#333333"
            ml="8px"
          >
            {emailUsuario}
          </Text>
        </HStack>

        <Box
          mt="32px"
          bg="#F5F5F5"
          borderRadius="8px"
          w="312px"
          minH="60px"
          px="12px"
          py="10px"
        >
          <HStack alignItems="center" space="8px">
            <Icon
              as={Ionicons}
              name="mail-outline"
              size="20px"
              color="#757575"
            />
            <Text
              fontSize="13px"
              fontWeight="400"
              color="#4B4B4B"
              flex={1}
              lineHeight="18px"
            >
              Caso não tenha encontrado o e-mail, verifique sua caixa de Spam.
            </Text>
          </HStack>
        </Box>

        <Box h="60px" />
      </VStack>
    </Box>
  );
};

export default TelaAcesseConta;