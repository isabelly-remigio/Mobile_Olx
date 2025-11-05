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
  ScrollView,
  KeyboardAvoidingView,
  Pressable,
  IconButton
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 

const TelaLogin = () => {
  const router = useRouter(); 
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const validarEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const podeEntrar = () => validarEmail(email) && senha.length >= 1;

  const voltar = () => alert('Voltando...');
  const entrar = () => podeEntrar() ? alert('Entrando...') : alert('Dados inválidos');
  const esqueceuSenha = () => alert('Redirecionando para recuperação de senha...');
  const loginGoogle = () => alert('Login com Google');
  const loginFacebook = () => alert('Login com Facebook');
  const abrirTermos = () => alert('Abrindo Termos de Uso...');
  const abrirPrivacidade = () => alert('Abrindo Política de Privacidade...');


  const irParaCadastro = () => {
    router.push('/auth/Cadastro/cadastro');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <Box flex={1} bg="white">
        
        {/* HEADER */}
        <Box bg="purple.600" safeAreaTop>
          <HStack alignItems="center" px={4} py={4}>
            <IconButton
              icon={<Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />}
              onPress={voltar}
              _pressed={{ bg: 'purple.700' }}
              borderRadius="full"
              position="absolute"
              left={4}
              zIndex={1}
            />
            <Text flex={1} textAlign="center" fontSize="lg" fontWeight="semibold" color="white">
              Entrar
            </Text>
          </HStack>
        </Box>

        {/* CONTEÚDO */}
        <ScrollView flex={1} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <VStack space={5} px={6} py={8}>
            
            {/* EMAIL */}
            <VStack space={2}>
              <Text fontSize="sm" color="gray.800">E-mail</Text>
              <Input
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                borderColor="gray.300"
                borderWidth={1}
                borderRadius="lg"
                fontSize="md"
                px={4}
                py={3}
                _focus={{ borderColor: 'purple.500', bg: 'white' }}
              />
            </VStack>

            {/* SENHA */}
            <VStack space={2}>
              <HStack justifyContent="space-between" alignItems="center">
                <Text fontSize="sm" color="gray.800">Senha</Text>
                <Pressable onPress={esqueceuSenha}>
                  <Text fontSize="xs" color="purple.600" fontWeight="medium">Esqueceu sua senha?</Text>
                </Pressable>
              </HStack>
              <Input
                value={senha}
                onChangeText={setSenha}
                type={mostrarSenha ? 'text' : 'password'}
                borderColor="gray.300"
                borderWidth={1}
                borderRadius="lg"
                fontSize="md"
                px={4}
                py={3}
                _focus={{ borderColor: 'purple.500', bg: 'white' }}
                InputRightElement={
                  <Pressable onPress={() => setMostrarSenha(!mostrarSenha)} pr={4}>
                    <Icon as={MaterialIcons} name={mostrarSenha ? 'visibility' : 'visibility-off'} size={5} color="gray.400" />
                  </Pressable>
                }
              />
            </VStack>

            {/* BOTÃO ENTRAR */}
            <Button
              bg="orange.500"
              _pressed={{ bg: 'orange.600' }}
              _text={{ color: 'white', fontWeight: 'bold', fontSize: 'md' }}
              borderRadius="md"
              py={4}
              shadow={1}
              onPress={entrar}
              isDisabled={!podeEntrar()}
              _disabled={{ bg: 'gray.300', _text: { color: 'gray.500' } }}
            >
              Entrar
            </Button>

            {/* DIVISOR */}
            <HStack alignItems="center" space={3} my={4}>
              <Box flex={1} h="1px" bg="gray.300" />
              <Text fontSize="xs" color="gray.500">Ou conecte com</Text>
              <Box flex={1} h="1px" bg="gray.300" />
            </HStack>

            {/* ÍCONES DE LOGIN SOCIAL */}
            <HStack justifyContent="center" space={6} my={2}>
              <Pressable onPress={loginGoogle}>
                <Box
                  w={12}
                  h={12}
                  borderRadius="full"
                  bg="blue.500"
                  alignItems="center"
                  justifyContent="center"
                  shadow={2}
                >
                  <Text color="white" fontWeight="bold" fontSize="lg">
                    G
                  </Text>
                </Box>
              </Pressable>

              <Pressable onPress={loginFacebook}>
                <Box
                  w={12}
                  h={12}
                  borderRadius="full"
                  bg="blue.800"
                  alignItems="center"
                  justifyContent="center"
                  shadow={2}
                >
                  <Text color="white" fontWeight="bold" fontSize="lg">
                    f
                  </Text>
                </Box>
              </Pressable>
            </HStack>

            {/* CADASTRO */}
            <HStack justifyContent="center" mt={6}>
              <Text fontSize="sm" color="gray.700">Não tem uma conta? </Text>
              <Pressable onPress={irParaCadastro}>
                <Text fontSize="sm" color="purple.600" fontWeight="bold" >
                  Cadastre-se
                </Text>
              </Pressable>
            </HStack>

            {/* RODAPÉ */}
            <Box mt={8} px={4}>
              <Text fontSize="2xs" color="gray.500" textAlign="center" lineHeight="sm">
                Ao continuar, você concorda com os{' '}
                <Text fontSize="2xs" color="purple.600" onPress={abrirTermos}>Termos de Uso</Text>
                {' '}e a{' '}
                <Text fontSize="2xs" color="purple.600" onPress={abrirPrivacidade}>Política de Privacidade</Text>
                {' '}da OLX e seus parceiros.
              </Text>
            </Box>
          </VStack>
        </ScrollView>
      </Box>
    </KeyboardAvoidingView>
  );
};

export default TelaLogin;
