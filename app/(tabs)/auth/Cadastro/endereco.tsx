import React, { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  Box, VStack, HStack, Text, Input, Button, Icon, ScrollView,
  KeyboardAvoidingView, Pressable, Select, CheckIcon
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';

const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB',
  'PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
];

export default function TelaEndereco() {
  const { nome, tipoConta, cpf, email, senha } = useLocalSearchParams();
  const router = useRouter();
  const { salvarEndereco } = useAuth();

  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [carregando, setCarregando] = useState(false);

  const formatarCEP = (valor: string) =>
    valor.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);

  const handleCep = async (valor: string) => {
    const novo = formatarCEP(valor);
    setCep(novo);
    if (novo.length !== 9) return;

    setCarregando(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${novo.replace('-', '')}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setRua(data.logradouro || '');
        setBairro(data.bairro || '');
        setCidade(data.localidade || '');
        setEstado(data.uf || '');
      }
    } finally {
      setCarregando(false);
    }
  };

  const podeEnviar =
    cep.length === 9 && rua && numero && bairro && cidade && estado;

 const finalizar = async () => {
  if (podeEnviar) {
    await salvarEndereco({
      cep,
      rua,
      numero,
      complemento,
      bairro,
      cidade,
      estado
    });

    router.push('/auth/Cadastro/verificacao');
  }
};


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView flex={1} bg="white" contentContainerStyle={{ flexGrow: 1 }}>
        <VStack space={6} px={6} py={4} pb={10}>

          <HStack alignItems="center" space={4} pt={4}>
            <Pressable onPress={router.back} p={2}>
              <Icon as={Ionicons} name="arrow-back" size="lg" color="gray.700" />
            </Pressable>
            <Text fontSize="lg" color="gray.700">Seu endereço</Text>
          </HStack>

          <Text fontSize="md" color="gray.600" textAlign="center">
            Informe seu endereço para entrega e localização dos anúncios
          </Text>

          {/* CEP */}
          <VStack space={2}>
            <Text fontSize="sm" color="gray.700">CEP</Text>
            <Input
              placeholder="00000-000"
              value={cep}
              onChangeText={handleCep}
              keyboardType="numeric"
              maxLength={9}
              size="lg"
              bg="white"
              borderColor="gray.300"
              borderRadius="md"
              _focus={{ borderColor: 'purple.500' }}
              InputRightElement={
                carregando ? (
                  <Icon as={Ionicons} name="refresh" size={5} color="gray.500" mr={3} />
                ) : undefined
              }
            />
          </VStack>

          {/* Rua */}
          <VStack space={2}>
            <Text fontSize="sm" color="gray.700">Rua</Text>
            <Input
              placeholder="Nome da rua"
              value={rua}
              onChangeText={setRua}
              size="lg"
              bg="white"
              borderColor="gray.300"
              borderRadius="md"
              _focus={{ borderColor: 'purple.500' }}
            />
          </VStack>

          <HStack space={4}>
            <VStack space={2} flex={2}>
              <Text fontSize="sm" color="gray.700">Número</Text>
              <Input
                placeholder="123"
                value={numero}
                onChangeText={setNumero}
                keyboardType="numeric"
                size="lg"
                bg="white"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: 'purple.500' }}
              />
            </VStack>

            <VStack space={2} flex={3}>
              <Text fontSize="sm" color="gray.700">Complemento</Text>
              <Input
                placeholder="Apto, bloco, etc."
                value={complemento}
                onChangeText={setComplemento}
                size="lg"
                bg="white"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: 'purple.500' }}
              />
            </VStack>
          </HStack>

          {/* Bairro */}
          <VStack space={2}>
            <Text fontSize="sm" color="gray.700">Bairro</Text>
            <Input
              placeholder="Nome do bairro"
              value={bairro}
              onChangeText={setBairro}
              size="lg"
              bg="white"
              borderColor="gray.300"
              borderRadius="md"
              _focus={{ borderColor: 'purple.500' }}
            />
          </VStack>

          <HStack space={4}>
            <VStack space={2} flex={3}>
              <Text fontSize="sm" color="gray.700">Cidade</Text>
              <Input
                placeholder="Nome da cidade"
                value={cidade}
                onChangeText={setCidade}
                size="lg"
                bg="white"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: 'purple.500' }}
              />
            </VStack>

            <VStack space={2} flex={2}>
              <Text fontSize="sm" color="gray.700">Estado</Text>
              <Select
                selectedValue={estado}
                onValueChange={setEstado}
                placeholder="UF"
                size="lg"
                bg="white"
                borderColor="gray.300"
                borderRadius="md"
                _selectedItem={{ bg: 'purple.100', endIcon: <CheckIcon size={4} /> }}
                _focus={{ borderColor: 'purple.500' }}
              >
                {ESTADOS.map(e => (
                  <Select.Item key={e} label={e} value={e} />
                ))}
              </Select>
            </VStack>
          </HStack>

          <Button
            bg="secondary.500"
            _pressed={{ bg: 'orange.600' }}
            _text={{ color: 'white', fontWeight: 'bold', fontSize: 'md' }}
            size="lg"
            mt={6}
            onPress={finalizar}
            isDisabled={!podeEnviar}
          >
            Finalizar Cadastro
          </Button>

          <Text fontSize="xs" color="gray.500" textAlign="center" mt={4}>
            Seu endereço será usado para calcular fretes e mostrar anúncios próximos a você.
          </Text>

        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
