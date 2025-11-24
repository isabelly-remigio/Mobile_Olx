import React, { useState } from 'react';
import { Box, VStack, HStack, Text, Icon, IconButton, ScrollView, Divider, Pressable } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Linking } from 'react-native';
import { useCart } from '@/app/src/context/CartContext';
import { CarrosselAnuncio } from '@/app/src/components/ui/CarrosselAnuncio';
import { InfoAnunciante } from '@/app/src/components/ui/InfoAnunciante';
import { AcoesAnuncio } from '@/app/src/components/ui/AcoesAnuncio';
import { LocalizacaoAnuncio } from '@/app/src/components/ui/LocalizacaoAnuncio';

// Types
import { Anuncio } from '@/app/src/@types/anuncio';
// Dados mockados (em produção, buscaria da API pelo id)
const dadosAnuncio: Anuncio = {
  id: '12345',
  nome: 'iPhone 13 Pro Max 256GB',
  preco: 4500.00,
  anunciante: {
    nome: 'TechStore Recife',
    dataCadastro: '2022-03-15',
    regiao: 'Boa Viagem',
    cidade: 'Recife',
    estado: 'PE',
    tempoResposta: '2 horas',
    emailVerificado: true,
    telefoneVerificado: true,
    telefone: '5581987654321'
  },
  imagens: [
'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&w=1080&q=80',
'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=170&h=100&fit=crop',
'https://images.unsplash.com/photo-1612832021047-9f3f1b6b5f4c?auto=format&w=1080&q=80',  ],

  descricao: 'iPhone 13 Pro Max em excelente estado de conservação AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  detalhes: {
    cor: 'Grafite',
    condicao: 'Usado',
    marca: 'Apple',
    modelo: 'iPhone 13 Pro Max',
    armazenamento: '256GB',
    memoria: '6GB RAM'
  },
  localizacao: {
    bairro: 'Boa Viagem',
    cidade: 'Recife',
    estado: 'PE',
    cep: '51020-000'
  }
};


export default function DetalhesAnuncio() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [favoritado, setFavoritado] = useState(false);
  const [descricaoExpandida, setDescricaoExpandida] = useState(false);
  const { addToCart } = useCart();
  // Em produção, buscaria os dados do anúncio pelo id
  // const { data: anuncio, isLoading } = useAnuncio(id);
  const anuncio = dadosAnuncio; // substituir pela busca real

  const formatarPreco = (valor: number) => {
    return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const descricaoLonga = anuncio.descricao.length > 150;
  const textoDescricao = descricaoExpandida || !descricaoLonga
    ? anuncio.descricao
    : anuncio.descricao.substring(0, 150) + '...';

  const handleCompartilhar = () => {
    alert('Compartilhando anúncio...');
  };

  const handleAbrirPerfil = () => {
    alert(`Abrindo perfil de ${anuncio.anunciante.nome}`);
  };

  const handleAdicionarCarrinho = () => {
    try {
      addToCart(anuncio);
      Alert.alert('Sucesso', `${anuncio.nome} adicionado ao carrinho!`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar ao carrinho');
    }
  };

  const handleComprarAgora = () => {
    try {
      addToCart(anuncio);
      Alert.alert('Compra', `Iniciando compra de ${anuncio.nome}`);
      // router.push('/checkout'); // Descomente quando tiver tela de checkout
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível realizar a compra');
    }
  };
  const handleWhatsApp = () => {
    const numero = anuncio.anunciante.telefone;
    const mensagem = encodeURIComponent(`Olá! Tenho interesse no anúncio: ${anuncio.nome}`);
    const url = `https://wa.me/${numero}?text=${mensagem}`;

    Linking.openURL(url).catch(err => {
      alert('Erro ao abrir WhatsApp: ' + err.message);
    });
  };
  const handleBack = () => {
    router.canGoBack() ? router.back() : router.replace("/");
  };

  return (
    <Box flex={1} bg="white">
      <HStack
        bg="white"
        alignItems="center"
        justifyContent="space-between"
        px={4}
        py={3}
        safeAreaTop
        borderBottomWidth={1}
        borderBottomColor="gray.200"
      >
        <HStack alignItems="center" space={3} flex={1}>
          <IconButton
            icon={<Icon as={MaterialIcons} name="arrow-back" size={6} color="gray.700" />}
            onPress={handleBack}
            _pressed={{ bg: 'gray.100' }}
            borderRadius="full"
          />
          <Text fontSize="lg" fontWeight="semibold" color="gray.800">
            Anúncio
          </Text>
        </HStack>
        <HStack space={2}>
          <IconButton
            icon={
              <Icon
                as={MaterialIcons}
                name={favoritado ? 'favorite' : 'favorite-border'}
                size={6}
                color={favoritado ? 'red.500' : 'gray.700'}
              />
            }
            onPress={() => setFavoritado(!favoritado)}
            _pressed={{ bg: 'gray.100' }}
            borderRadius="full"
          />
          <IconButton
            icon={<Icon as={MaterialIcons} name="share" size={6} color="gray.700" />}
            onPress={handleCompartilhar}
            _pressed={{ bg: 'gray.100' }}
            borderRadius="full"
          />
        </HStack>
      </HStack>

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>

        <CarrosselAnuncio imagens={anuncio.imagens} />

        <VStack space={4} p={4}>
          <VStack space={2}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
              {anuncio.nome}
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color="primary.600">
              {formatarPreco(anuncio.preco)}
            </Text>
            <HStack alignItems="center" space={2}>
              <Icon as={MaterialIcons} name="store" size={4} color="gray.500" />
              <Text fontSize="sm" color="gray.600">
                {anuncio.anunciante.nome}
              </Text>
            </HStack>
          </VStack>

          <Divider />

          <VStack space={2}>
            <Text fontSize="md" fontWeight="semibold" color="gray.800">
              Descrição
            </Text>
            <Text fontSize="sm" color="gray.600" lineHeight={20}>
              {textoDescricao}
            </Text>
            {descricaoLonga && (
              <Pressable onPress={() => setDescricaoExpandida(!descricaoExpandida)}>
                <Text fontSize="sm" color="primary.600" fontWeight="semibold">
                  {descricaoExpandida ? 'Ver menos' : 'Ver mais'}
                </Text>
              </Pressable>
            )}
          </VStack>

          <Divider />

          <VStack space={3}>
            <Text fontSize="md" fontWeight="semibold" color="gray.800">
              Detalhes do Produto
            </Text>
            {Object.entries(anuncio.detalhes).map(([chave, valor]) => (
              <HStack key={chave} justifyContent="space-between">
                <Text fontSize="sm" color="gray.600" textTransform="capitalize">
                  {chave.replace(/([A-Z])/g, ' $1').trim()}
                </Text>
                <Text fontSize="sm" color="gray.800" fontWeight="medium">
                  {valor}
                </Text>
              </HStack>
            ))}
          </VStack>

          <Divider />

          <LocalizacaoAnuncio
            bairro={anuncio.localizacao.bairro}
            cidade={anuncio.localizacao.cidade}
            estado={anuncio.localizacao.estado}
            cep={anuncio.localizacao.cep}
          />

          <Divider />

          <InfoAnunciante
            anunciante={anuncio.anunciante}
            onAbrirPerfil={handleAbrirPerfil}
          />

          {/* Dicas de Segurança */}
          <VStack space={2} bg="yellow.50" p={4} borderRadius="md" borderWidth={1} borderColor="yellow.200">
            <HStack alignItems="center" space={2}>
              <Icon as={MaterialIcons} name="security" size={5} color="yellow.700" />
              <Text fontSize="md" fontWeight="semibold" color="yellow.800">
                Dicas de Segurança
              </Text>
            </HStack>
            <VStack space={1}>
              <Text fontSize="xs" color="yellow.800">
                • Prefira se encontrar em locais públicos e movimentados
              </Text>

              <Text fontSize="xs" color="yellow.800">
                • Desconfie de preços muito abaixo do mercado
              </Text>
              <Text fontSize="xs" color="yellow.800">
                • Verifique a procedência do produto antes de comprar
              </Text>
            </VStack>
          </VStack>

          <Box h={20} />
        </VStack>
      </ScrollView>

      <AcoesAnuncio
        onWhatsApp={handleWhatsApp}
        onComprarAgora={handleComprarAgora}
        onAdicionarCarrinho={handleAdicionarCarrinho}
      />
    </Box>
  );
}