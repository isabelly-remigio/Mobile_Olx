import React, { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Box, VStack, HStack, Text, Input, Button, Icon,
  ScrollView, KeyboardAvoidingView, Pressable
} from 'native-base';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';

const TelaCadastro = () => {
  const router = useRouter();
  const { salvarDadosPessoais } = useAuth();

  const [nome, setNome] = useState('');
  const [tipoConta, setTipoConta] = useState('fisica');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // -----------------------------
  // Funções utilitárias
  // -----------------------------
  const formatarCPF = (v: string) =>
    v.replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  const validarEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validarSenha = (s: string) => {
    if (!s) return null;
    if (s.length < 6) return { valida: false, mensagem: 'Senha muito curta. Use pelo menos 6 caracteres.' };
    if (s.length < 10) return { valida: true, mensagem: 'Senha ok. Experimente colocar mais caracteres.' };
    return { valida: true, mensagem: 'Senha forte!' };
  };

  const validarConfirmacao = () =>
    !confirmarSenha
      ? null
      : senha === confirmarSenha
        ? { valida: true, mensagem: 'Senhas coincidem!' }
        : { valida: false, mensagem: 'As senhas não coincidem.' };

  const podeEnviar = () =>
    nome.trim() &&
    cpf.length >= 14 &&
    validarEmail(email) &&
    senha.length >= 6 &&
    senha === confirmarSenha;

  // -----------------------------
  // Ações
  // -----------------------------
  const cadastrar = async () => {
    if (!podeEnviar()) return;

    setCarregando(true);
    try {
      salvarDadosPessoais({ nome, tipoConta, cpf, email, senha });
      router.push('/auth/Cadastro/endereco');
    } finally {
      setCarregando(false);
    }
  };

  const styleInput = {
    size: "lg",
    bg: "white",
    borderColor: "gray.300",
    borderRadius: "md",
    _focus: { borderColor: 'purple.500', bg: 'white' }
  };

  const statusSenha = validarSenha(senha);
  const statusConfirmacao = validarConfirmacao();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView flex={1} bg="white" keyboardShouldPersistTaps="handled">
        <VStack space={6} px={6} py={4} pb={10}>

          {/* Header */}
          <HStack alignItems="center" space={4} pt={4}>
            <Pressable onPress={() => router.back()} p={2}>
              <Icon as={Ionicons} name="arrow-back" size="lg" color="gray.700" />
            </Pressable>
            <Text fontSize="lg" color="gray.700">Cadastrar</Text>
          </HStack>

    {/* Login social */}
<VStack space={4} alignItems="center" py={4}>
  <Text fontSize="sm" color="gray.500">Conecte com</Text>

  <HStack space={4}>
    {/* Google */}
    <Pressable onPress={() => alert("Login Google")}>
      <Box
        w={12}
        h={12}
        borderRadius="full"
        bg="tertiary.500"
        alignItems="center"
        justifyContent="center"
        shadow={2}
      >
        <Text color="white" fontWeight="bold" fontSize="lg">G</Text>
      </Box>
    </Pressable>

    {/* Facebook */}
    <Pressable onPress={() => alert("Login Facebook")}>
      <Box
        w={12}
        h={12}
        borderRadius="full"
        bg="tertiary.600"
        alignItems="center"
        justifyContent="center"
        shadow={2}
      >
        <Text color="white" fontWeight="bold" fontSize="lg">f</Text>
      </Box>
    </Pressable>
  </HStack>
</VStack>


          {/* Divider */}
          <HStack alignItems="center" space={3}>
            <Box flex={1} h="1px" bg="gray.200" />
            <Text fontSize="sm" color="gray.400">ou</Text>
            <Box flex={1} h="1px" bg="gray.200" />
          </HStack>

          <Text fontSize="md" color="gray.600" textAlign="center">
            Nos informe alguns dados para melhorar sua experiência.
          </Text>

          {/* Nome */}
          <VStack space={2}>
            <Text color="gray.700">Como você quer ser chamado(a)?</Text>
            <Input {...styleInput} placeholder="Digite seu nome" value={nome} onChangeText={setNome} />
            <Text fontSize="xs" color="gray.500">Aparecerá no perfil e anúncios.</Text>
          </VStack>

          {/* Tipo conta */}
          <VStack space={2}>
            <Text color="gray.700">Escolha o tipo da sua conta</Text>
            <HStack space={3}>
              {[
                { key: "fisica", label: "Pessoa física" },
                { key: "juridica", label: "Pessoa jurídica" }
              ].map(opt => (
                <Pressable key={opt.key} flex={1} onPress={() => setTipoConta(opt.key)}>
                  <Box
                    p={4}
                    borderWidth={2}
                    borderColor={tipoConta === opt.key ? 'purple.500' : 'gray.300'}
                    bg={tipoConta === opt.key ? 'purple.50' : 'white'}
                    borderRadius="md"
                    alignItems="center"
                  >
                    <HStack space={2} alignItems="center">
                      <Box
                        w={4} h={4} borderRadius="full" borderWidth={2}
                        borderColor={tipoConta === opt.key ? 'purple.500' : 'gray.400'}
                        bg={tipoConta === opt.key ? 'purple.500' : 'transparent'}
                      />
                      <Text color={tipoConta === opt.key ? 'purple.700' : 'gray.600'}>
                        {opt.label}
                      </Text>
                    </HStack>
                  </Box>
                </Pressable>
              ))}
            </HStack>
          </VStack>

          {/* CPF */}
          <VStack space={2}>
            <Text color="gray.700">CPF</Text>
            <Input
              {...styleInput}
              placeholder="000.000.000-00"
              value={cpf}
              onChangeText={v => setCpf(formatarCPF(v))}
              keyboardType="numeric"
              maxLength={14}
            />
          </VStack>

          {/* Email */}
          <VStack space={2}>
            <Text color="gray.700">E-mail</Text>
            <Input
              {...styleInput}
              placeholder="seuemail@exemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </VStack>

          {/* Senha */}
          <VStack space={2}>
            <Text color="gray.700">Senha</Text>
            <Input
              {...styleInput}
              placeholder="Digite sua senha"
              value={senha}
              onChangeText={setSenha}
              type={mostrarSenha ? 'text' : 'password'}
              InputRightElement={
                <Pressable onPress={() => setMostrarSenha(!mostrarSenha)} pr={3}>
                  <Icon
                    as={MaterialIcons}
                    name={mostrarSenha ? 'visibility' : 'visibility-off'}
                    size={5} color="gray.500"
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
                <Text fontSize="xs">{statusSenha.mensagem}</Text>
              </HStack>
            )}
          </VStack>

          {/* Confirmar senha */}
          <VStack space={2}>
            <Text color="gray.700">Confirmar senha</Text>
            <Input
              {...styleInput}
              placeholder="Digite sua senha novamente"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              type={mostrarConfirmarSenha ? 'text' : 'password'}
              InputRightElement={
                <Pressable onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)} pr={3}>
                  <Icon
                    as={MaterialIcons}
                    name={mostrarConfirmarSenha ? 'visibility' : 'visibility-off'}
                    size={5} color="gray.500"
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

          {/* Botão */}
          <Button
            bg="secondary.500"
            _pressed={{ bg: 'orange.600' }}
            _text={{ color: 'white', fontWeight: 'bold' }}
            size="lg"
            borderRadius="md"
            mt={4}
            onPress={cadastrar}
            isDisabled={!podeEnviar() || carregando}
            isLoading={carregando}
            _disabled={{ bg: 'gray.300', _text: { color: 'gray.500' } }}
          >
            {carregando ? 'Salvando...' : 'Cadastrar-se'}
          </Button>

          <HStack justifyContent="center" mt={2}>
            <Text color="gray.600">Já tem uma conta? </Text>
            <Pressable><Text color="purple.600">Entrar</Text></Pressable>
          </HStack>

          <Text fontSize="xs" color="gray.500" textAlign="center" mt={6}>
            Ao continuar, você concorda com os{' '}
            <Text color="purple.600">Termos de Uso</Text> e{' '}
            <Text color="purple.600">Política de Privacidade</Text>.
          </Text>

        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default TelaCadastro;
