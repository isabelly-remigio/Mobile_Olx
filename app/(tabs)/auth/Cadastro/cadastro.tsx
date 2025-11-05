import React, { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
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
  Pressable
} from 'native-base';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

const TelaCadastro = () => {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [tipoConta, setTipoConta] = useState('fisica');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const formatarCPF = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    
    if (apenasNumeros.length <= 11) {
      return apenasNumeros
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return valor;
  };

  const validarSenha = (senha: string) => {
    if (senha.length === 0) return null;
    if (senha.length < 6) return { valida: false, mensagem: 'Senha muito curta. Use pelo menos 6 caracteres.' };
    if (senha.length >= 6 && senha.length < 10) return { valida: true, mensagem: 'Senha ok. Experimente colocar mais caracteres.' };
    return { valida: true, mensagem: 'Senha forte!' };
  };

  const validarConfirmacao = () => {
    if (confirmarSenha.length === 0) return null;
    if (senha !== confirmarSenha) {
      return { valida: false, mensagem: 'As senhas não coincidem.' };
    }
    return { valida: true, mensagem: 'Senhas coincidem!' };
  };

  const statusSenha = validarSenha(senha);
  const statusConfirmacao = validarConfirmacao();

  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const podeEnviar = () => {
    return (
      nome.trim() !== '' &&
      cpf.length >= 14 &&
      validarEmail(email) &&
      senha.length >= 6 &&
      senha === confirmarSenha
    );
  };

  const cadastrar = () => {
    if (podeEnviar()) {
      // Navega para a tela de verificação existente
      router.push('/auth/Cadastro/verificacao');
    }
  };

  const loginGoogle = () => {
    alert('Login com Google');
  };

  const loginFacebook = () => {
    alert('Login com Facebook');
  };

  const voltar = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        bg="white" 
        flex={1}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <VStack space={6} px={6} py={4} pb={10}>
          
          <Box bg="white" pt={4} pb={4}>
            <HStack alignItems="center" space={4}>
              <Pressable onPress={voltar} p={2}>
                <Icon
                  as={Ionicons}
                  name="arrow-back"
                  size="lg"
                  color="gray.700"
                />
              </Pressable>
              
              <Text 
                fontSize="lg" 
                color="gray.700"
                fontWeight="normal"
                fontFamily="body"
              >
                Cadastrar
              </Text>
            </HStack>
          </Box>

          <VStack space={4} alignItems="center" py={4}>
            <Text 
              fontSize="sm" 
              color="gray.500"
              textAlign="center"
            >
              Conecte com
            </Text>

            <HStack space={4} justifyContent="center">
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
          </VStack>

          <HStack alignItems="center" space={3} my={2}>
            <Box flex={1} h="1px" bg="gray.200" />
            <Text fontSize="sm" color="gray.400">
              ou
            </Text>
            <Box flex={1} h="1px" bg="gray.200" />
          </HStack>

          <VStack space={2}>
            <Text fontSize="md" color="gray.600" textAlign='center'>
              Nos informe alguns dados para que posamos melhorar a sua
              experiência na OLX.
            </Text>
          </VStack>

          {/* Campos do formulário (mantidos iguais) */}
          <VStack space={2}>
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              Como você quer ser chamado(a)?
            </Text>
            <Input
              placeholder="Digite seu nome"
              value={nome}
              onChangeText={setNome}
              size="lg"
              bg="white"
              borderColor="gray.300"
              borderRadius="md"
              autoCapitalize="words"
              returnKeyType="next"
              _focus={{
                borderColor: 'purple.500',
                bg: 'white'
              }}
            />
            <Text fontSize="xs" color="gray.500">
              Aparecerá em seu perfil, anúncios e chats.
            </Text>
          </VStack>

          <VStack space={2}>
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              Escolha o tipo da sua conta
            </Text>
            <HStack space={3}>
              <Pressable 
                flex={1}
                onPress={() => setTipoConta('fisica')}
              >
                <Box
                  p={4}
                  borderWidth={2}
                  borderColor={tipoConta === 'fisica' ? 'purple.500' : 'gray.300'}
                  borderRadius="md"
                  bg={tipoConta === 'fisica' ? 'purple.50' : 'white'}
                  alignItems="center"
                >
                  <HStack space={2} alignItems="center">
                    <Box
                      w={4}
                      h={4}
                      borderRadius="full"
                      borderWidth={2}
                      borderColor={tipoConta === 'fisica' ? 'purple.500' : 'gray.400'}
                      bg={tipoConta === 'fisica' ? 'purple.500' : 'transparent'}
                    />
                    <Text 
                      fontWeight="medium" 
                      color={tipoConta === 'fisica' ? 'purple.700' : 'gray.600'}
                    >
                      Pessoa física
                    </Text>
                  </HStack>
                </Box>
              </Pressable>
              
              <Pressable 
                flex={1}
                onPress={() => setTipoConta('juridica')}
              >
                <Box
                  p={4}
                  borderWidth={2}
                  borderColor={tipoConta === 'juridica' ? 'purple.500' : 'gray.300'}
                  borderRadius="md"
                  bg={tipoConta === 'juridica' ? 'purple.50' : 'white'}
                  alignItems="center"
                >
                  <HStack space={2} alignItems="center">
                    <Box
                      w={4}
                      h={4}
                      borderRadius="full"
                      borderWidth={2}
                      borderColor={tipoConta === 'juridica' ? 'purple.500' : 'gray.400'}
                      bg={tipoConta === 'juridica' ? 'purple.500' : 'transparent'}
                    />
                    <Text 
                      fontWeight="medium" 
                      color={tipoConta === 'juridica' ? 'purple.700' : 'gray.600'}
                    >
                      Pessoa jurídica
                    </Text>
                  </HStack>
                </Box>
              </Pressable>
            </HStack>
          </VStack>

          <VStack space={2}>
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              CPF
            </Text>
            <Input
              placeholder="000.000.000-00"
              value={cpf}
              onChangeText={(valor) => setCpf(formatarCPF(valor))}
              keyboardType="numeric"
              size="lg"
              bg="white"
              borderColor="gray.300"
              borderRadius="md"
              maxLength={14}
              returnKeyType="next"
              _focus={{
                borderColor: 'purple.500',
                bg: 'white'
              }}
            />
          </VStack>

          <VStack space={2}>
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              E-mail
            </Text>
            <Input
              placeholder="seuemail@exemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              size="lg"
              bg="white"
              borderColor="gray.300"
              borderRadius="md"
              returnKeyType="next"
              _focus={{
                borderColor: 'purple.500',
                bg: 'white'
              }}
            />
          </VStack>

          <VStack space={2}>
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              Senha
            </Text>
            <Input
              placeholder="Digite sua senha"
              value={senha}
              onChangeText={setSenha}
              type={mostrarSenha ? 'text' : 'password'}
              size="lg"
              bg="white"
              borderColor="gray.300"
              borderRadius="md"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              _focus={{
                borderColor: 'purple.500',
                bg: 'white'
              }}
              InputRightElement={
                <Pressable onPress={() => setMostrarSenha(!mostrarSenha)} pr={3}>
                  <Icon
                    as={MaterialIcons}
                    name={mostrarSenha ? 'visibility' : 'visibility-off'}
                    size={5}
                    color="gray.500"
                  />
                </Pressable>
              }
            />
            {statusSenha && (
              <HStack space={1} alignItems="center">
                <Icon
                  as={MaterialIcons}
                  name={statusSenha.valida ? 'check-circle' : 'info'}
                  size={4}
                  color={statusSenha.valida ? 'green.500' : 'orange.500'}
                />
                <Text fontSize="xs" color="gray.600">
                  {statusSenha.mensagem}
                </Text>
              </HStack>
            )}
          </VStack>

          <VStack space={2}>
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              Confirmar senha
            </Text>
            <Input
              placeholder="Digite sua senha novamente"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              type={mostrarConfirmarSenha ? 'text' : 'password'}
              size="lg"
              bg="white"
              borderColor="gray.300"
              borderRadius="md"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={cadastrar}
              _focus={{
                borderColor: 'purple.500',
                bg: 'white'
              }}
              InputRightElement={
                <Pressable onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)} pr={3}>
                  <Icon
                    as={MaterialIcons}
                    name={mostrarConfirmarSenha ? 'visibility' : 'visibility-off'}
                    size={5}
                    color="gray.500"
                  />
                </Pressable>
              }
            />
            {statusConfirmacao && (
              <HStack space={1} alignItems="center">
                <Icon
                  as={MaterialIcons}
                  name={statusConfirmacao.valida ? 'check-circle' : 'error'}
                  size={4}
                  color={statusConfirmacao.valida ? 'green.500' : 'red.500'}
                />
                <Text fontSize="xs" color={statusConfirmacao.valida ? 'gray.600' : 'red.500'}>
                  {statusConfirmacao.mensagem}
                </Text>
              </HStack>
            )}
          </VStack>

          <Button
            bg="yellow.400"
            _pressed={{ bg: 'yellow.500' }}
            _text={{ color: 'gray.800', fontWeight: 'bold', fontSize: 'md' }}
            size="lg"
            borderRadius="md"
            mt={4}
            onPress={cadastrar}
            isDisabled={!podeEnviar()}
            _disabled={{
              bg: 'gray.300',
              _text: { color: 'gray.500' }
            }}
          >
            Cadastrar-se
          </Button>

          <HStack justifyContent="center" mt={2}>
            <Text fontSize="sm" color="gray.600">
              Já tem uma conta?{' '}
            </Text>
            <Pressable>
              <Text fontSize="sm" color="purple.600" fontWeight="medium">
                Entrar
              </Text>
            </Pressable>
          </HStack>

          <Text fontSize="xs" color="gray.500" textAlign="center" mt={6}>
            Ao continuar, você concorda com os{' '}
            <Text color="purple.600" fontWeight="medium">
              Termos de Uso
            </Text>
            {' '}e{' '}
            <Text color="purple.600" fontWeight="medium">
              Política de Privacidade
            </Text>
            {' '}da OLX e com o tratamento de dados pessoais.
          </Text>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default TelaCadastro;