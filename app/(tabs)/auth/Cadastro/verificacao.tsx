import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Center,
  Pressable,
  ScrollView,
  
} from 'native-base';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const TelaVerificacaoEmail = () => {
  const router = useRouter();
  const [tempoRestante, setTempoRestante] = useState(120);
  const [podeReenviar, setPodeReenviar] = useState(false);
  const [emailReenviado, setEmailReenviado] = useState(false);

  const emailUsuario = 'bellymariaa@gmail.com';

  const cores = {
    primaria: 'purple.600',
    secundaria: 'purple.100',
    sucesso: 'green.600',
    texto: {
      principal: 'gray.800',
      secundario: 'gray.600',
      claro: 'gray.400',
    },
  };

  // Contador regressivo
  useEffect(() => {
    if (tempoRestante > 0) {
      const timer = setTimeout(() => setTempoRestante((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setPodeReenviar(true);
    }
  }, [tempoRestante]);

  const reenviarEmail = () => {
    setEmailReenviado(true);
    setTempoRestante(120);
    setPodeReenviar(false);
    setTimeout(() => setEmailReenviado(false), 3000);
  };

  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  };

  const voltar = () => {
    router.back();
  };

  const abrirEmail = () => {
    alert('Abrindo aplicativo de e-mail...');
  };

  // Componentes internos
  const IconeCircular = ({ nome, cor = cores.primaria }) => (
    <Box bg={cores.secundaria} borderRadius="full" p={6} shadow={2}>
      <Icon as={MaterialIcons} name={nome} size="3xl" color={cor} />
    </Box>
  );

  const BadgeInfo = ({ icone, texto, corBg, corTexto, corIcone }: any) => (
    <HStack bg={corBg} px={4} py={3} borderRadius="lg" alignItems="center" space={2}>
      <Icon as={MaterialIcons} name={icone} size={5} color={corIcone} />
      <Text fontSize="sm" color={corTexto} fontWeight="medium">
        {texto}
      </Text>
    </HStack>
  );

  const ItemAjuda = ({ icone, texto, cor = cores.texto.secundario }: any) => (
    <Pressable>
      <HStack alignItems="center" space={2}>
        <Icon as={MaterialIcons} name={icone} size={5} color={cor} />
        <Text fontSize="sm" color={cor}>
          {texto}
        </Text>
      </HStack>
    </Pressable>
  );

  return (
    <ScrollView 
      bg="white" 
      flex={1}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <VStack space={6} px={6} py={4} pb={10}>
        
        {/* Header */}
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
            >
              Verificação E-mail
            </Text>
          </HStack>
        </Box>

        <Center flex={1}>
          <VStack space={8} alignItems="center" w="100%" maxW="400px">
            
            {/* Cabeçalho */}
            <VStack space={6} alignItems="center">
              <IconeCircular nome="send" />
              <VStack space={3} alignItems="center">
                <Text fontSize="3xl" fontWeight="bold" color={cores.texto.principal}>
                  Verifique seu e-mail
                </Text>
                <Text fontSize="md" color={cores.texto.secundario} textAlign="center">
                  Você precisa concluir uma etapa rápida antes de criar sua conta.
                </Text>
              </VStack>
            </VStack>

            {/* Mensagem */}
            <VStack space={4} alignItems="center">
              <Text fontSize="lg" color={cores.texto.secundario} textAlign="center">
                Clique no link que enviamos para:
              </Text>
              <Text fontSize="xl" fontWeight="bold" color={cores.primaria}>
                {emailUsuario}
              </Text>
            </VStack>


           
            {/* Tempo e ajuda */}
            <VStack space={4} w="100%" alignItems="center">
              <ItemAjuda icone="schedule" texto="O e-mail pode levar até 2 minutos para chegar" />

              {/* Reenviar e-mail */}
              <VStack space={2} alignItems="center">
                {emailReenviado && (
                  <BadgeInfo
                    icone="check-circle"
                    texto="E-mail reenviado com sucesso!"
                    corBg="green.100"
                    corTexto="green.700"
                    corIcone="green.600"
                  />
                )}

                <Text fontSize="sm" color={cores.texto.secundario}>
                  Não recebeu o e-mail?
                </Text>

                {podeReenviar ? (
                  <Pressable onPress={reenviarEmail}>
                    <Text fontSize="sm" color={cores.primaria} fontWeight="bold">
                      Reenviar e-mail
                    </Text>
                  </Pressable>
                ) : (
                  <HStack alignItems="center" space={1}>
                    <Text fontSize="sm" color={cores.texto.claro}>
                      Reenviar em
                    </Text>
                    <Text fontSize="sm" color={cores.primaria} fontWeight="bold">
                      {formatarTempo(tempoRestante)}
                    </Text>
                  </HStack>
                )}
              </VStack>
            </VStack>
          </VStack>
        </Center>
      </VStack>
    </ScrollView>
  );
};

export default TelaVerificacaoEmail;