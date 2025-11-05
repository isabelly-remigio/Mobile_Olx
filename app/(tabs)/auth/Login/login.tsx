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

  const voltar = () => router.back();
  const entrar = () => podeEntrar() ? router.push('/(tabs)') : alert('Dados inválidos');
  const loginGoogle = () => alert('Login com Google');
  const loginFacebook = () => alert('Login com Facebook');
  const abrirTermos = () => alert('Abrindo Termos de Uso...');
  const abrirPrivacidade = () => alert('Abrindo Política de Privacidade...');

  const irParaCadastro = () => {
    router.push('/auth/Cadastro/cadastro');
  };

  const esqueceuSenha = () => {
    router.push('/auth/EsqueceuSenha/esqueceuSenha');
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Box flex={1} bg="white">
        
        <Box bg="primary.500" safeAreaTop>
          <HStack alignItems="center" px={4} py={4} space={4}>
            <IconButton
              icon={<Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />}
              onPress={voltar}
              _pressed={{ bg: 'primary.600' }}
              borderRadius="full"
            />
            <Text flex={1} textAlign="center" fontSize="lg" fontWeight="semibold" color="white">
              Entrar
            </Text>
            <Box w={10} />
          </HStack>
        </Box>

        <ScrollView 
          flex={1} 
          contentContainerStyle={{ flexGrow: 1 }} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <VStack space={6} px={6} py={8}>
            
            <VStack space={5}>

              <VStack space={2}>
                <Text fontSize="sm" fontWeight="medium" color="gray.700">E-mail</Text>
                <Input
                  placeholder="seu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  borderColor="gray.300"
                  borderWidth={1}
                  borderRadius="lg"
                  fontSize="md"
                  px={4}
                  py={3}
                  _focus={{ 
                    bg: 'white',
                    borderColor: 'gray.300', 
                  }}
                />
              </VStack>

              <VStack space={2}>
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">Senha</Text>
                  <Pressable onPress={esqueceuSenha}>
                    <Text fontSize="xs" color="primary.500" fontWeight="medium">
                      Esqueceu sua senha?
                    </Text>
                  </Pressable>
                </HStack>
                <Input
                  placeholder="Sua senha"
                  value={senha}
                  onChangeText={setSenha}
                  type={mostrarSenha ? 'text' : 'password'}
                  borderColor="gray.300"
                  borderWidth={1}
                  borderRadius="lg"
                  fontSize="md"
                  px={4}
                  py={3}
                  _focus={{ 
                    bg: 'white',
                    borderColor: 'gray.300', 
                  }}
                  InputRightElement={
                    <Pressable onPress={() => setMostrarSenha(!mostrarSenha)} pr={4}>
                      <Icon 
                        as={MaterialIcons} 
                        name={mostrarSenha ? 'visibility' : 'visibility-off'} 
                        size={5} 
                        color="gray.500" 
                      />
                    </Pressable>
                  }
                />
              </VStack>

              <Button
                bg="secondary.500"
                _pressed={{ bg: 'orange.600' }}
                _text={{ 
                  color: 'white', 
                  fontWeight: 'bold', 
                  fontSize: 'md',
                }}
                borderRadius="lg"
                py={4}
                onPress={entrar}
                isDisabled={!podeEntrar()}
                _disabled={{ 
                  bg: 'gray.300', 
                  _text: { color: 'gray.500' },
                }}
                mt={2}
              >
                Entrar
              </Button>
            </VStack>

            <HStack alignItems="center" space={3} my={4}>
              <Box flex={1} h="0.5px" bg="gray.300" />
              <Text fontSize="xs" color="gray.500" fontWeight="medium">Ou conecte com</Text>
              <Box flex={1} h="0.5px" bg="gray.300" />
            </HStack>

      
<HStack justifyContent="center" space={8} my={2}>
  <Pressable onPress={loginGoogle}>
    <Box
      w={12}  
      h={12}  
      borderRadius="full"
      bg="tertiary.500"
      alignItems="center"
      justifyContent="center"
      _pressed={{ opacity: 0.8 }}
      shadow={3}
    >
      <Text 
        color="white" 
        fontWeight="bold" 
        fontSize="xl"  
        textAlign="center"
        lineHeight="sm"  
      >
        G
      </Text>
    </Box>
  </Pressable>

  <Pressable onPress={loginFacebook}>
    <Box
      w={12}  
      h={12} 
      borderRadius="full"
      bg="tertiary.600"
      alignItems="center"
      justifyContent="center"
      _pressed={{ opacity: 0.8 }}
      shadow={3}
    >
      <Text 
        color="white" 
        fontWeight="bold" 
        fontSize="xl" 
        textAlign="center"
        lineHeight="sm" 
      >
        f
      </Text>
    </Box>
  </Pressable>
</HStack>

            <HStack justifyContent="center" mt={6} py={2}>
              <Text fontSize="sm" color="gray.600">Não tem uma conta? </Text>
              <Pressable onPress={irParaCadastro}>
                <Text fontSize="sm" color="primary.500" fontWeight="bold">
                  Cadastre-se
                </Text>
              </Pressable>
            </HStack>

            <Box mt={4} px={2}>
              <Text fontSize="2xs" color="gray.500" textAlign="center" lineHeight="sm">
                Ao continuar, você concorda com os{' '}
                <Text 
                  fontSize="2xs" 
                  color="primary.500" 
                  fontWeight="medium" 
                  onPress={abrirTermos}
                >
                  Termos de Uso
                </Text>
                {' '}e a{' '}
                <Text 
                  fontSize="2xs" 
                  color="primary.500" 
                  fontWeight="medium" 
                  onPress={abrirPrivacidade}
                >
                  Política de Privacidade
                </Text>
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