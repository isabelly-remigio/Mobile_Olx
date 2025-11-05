import React, { useState } from 'react';
import { Platform } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Icon,
  IconButton,
  KeyboardAvoidingView,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const TelaEsqueciSenha = () => {
  const router = useRouter(); 
  const [email, setEmail] = useState('');

  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const emailValido = validarEmail(email);

  const voltar = () => {
    router.push('/auth/Login/login');
  };

  const enviarEmail = () => {
    if (emailValido) {
      alert(`E-mail de recuperação enviado para ${email}`);
    }
    router.push('/auth/Verificacao/verificacao');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <Box flex={1} bg="white">
        {/* Header com navegação */}
        <HStack
          alignItems="center"
          justifyContent="space-between"
          px={4}
          py={4}
          safeAreaTop
        >
          <IconButton
            icon={<Icon as={MaterialIcons} name="arrow-back" size={6} color="gray.700" />}
            onPress={voltar}
            _pressed={{ bg: 'gray.100' }}
            borderRadius="full"
          />
          
          <Text fontSize="md" fontWeight="normal" color="gray.700" flex={1} ml={3}>
            Esqueci minha senha
          </Text>
          
          <Box width={10} />
        </HStack>

        <VStack flex={1} px={6} py={8} space={6}>
          <VStack space={3}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
              Qual o e-mail da conta?
            </Text>
            <Text fontSize="sm" color="gray.500" lineHeight="md">
              Um e-mail de confirmação será enviado para criar sua nova senha.
            </Text>
          </VStack>

          <VStack space={2} mt={4}>
            <Text fontSize="sm" fontWeight="normal" color="gray.700">
              E-mail
            </Text>
            <Input
              placeholder=""
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={true}
              size="lg"
              bg="white"
              borderColor="gray.300"
              borderWidth={1}
              borderRadius="lg"
              returnKeyType="done"
              fontSize="md"
              px={4}
              py={3}
              onSubmitEditing={enviarEmail}
              _focus={{
                borderColor: 'blue.500',
                bg: 'white'
              }}
            />
          </VStack>
        </VStack>

        <Box px={6} pb={8} safeAreaBottom>
          <Button
            bg={emailValido ? 'secondary.500' : 'gray.200'}
            _pressed={{ bg: emailValido ? 'blue.600' : 'gray.200' }}
            _text={{ 
              color: emailValido ? 'white' : 'gray.400', 
              fontWeight: 'medium', 
              fontSize: 'md' 
            }}
            size="lg"
            borderRadius="md"
            py={4}
            onPress={enviarEmail}
            isDisabled={!emailValido}
          >
            Enviar e-mail
          </Button>
        </Box>
      </Box>
    </KeyboardAvoidingView>
  );
};

export default TelaEsqueciSenha;