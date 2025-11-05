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


  return (
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
            >
              Verificação E-mail
            </Text>
          </HStack>
        </Box>

        <Center flex={1}>
          <VStack space={8} alignItems="center" w="100%" maxW="400px">
            
            <VStack space={6} alignItems="center">

              <Box bg="purple.100" borderRadius="full" p={6} shadow={2}>
                <Icon as={MaterialIcons} name="send" size="3xl" color="purple.600" />
              </Box>
              
              <VStack space={3} alignItems="center">
                <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                  Verifique seu e-mail
                </Text>
                <Text fontSize="md" color="gray.600" textAlign="center">
                  Você precisa concluir uma etapa rápida antes de criar sua conta.
                </Text>
              </VStack>
            </VStack>


            <VStack space={4} alignItems="center">
              <Text fontSize="lg" color="gray.600" textAlign="center">
                Clique no link que enviamos para:
              </Text>
              <Text fontSize="xl" fontWeight="bold" color="primary.500">
                {emailUsuario}
              </Text>
            </VStack>


            <VStack space={4} w="100%" alignItems="center">
              <Pressable>
                <HStack alignItems="center" space={2}>
                  <Icon as={MaterialIcons} name="schedule" size={5} color="gray.600" />
                  <Text fontSize="sm" color="gray.600">
                    O e-mail pode levar até 2 minutos para chegar
                  </Text>
                </HStack>
              </Pressable>

              <VStack space={2} alignItems="center">
                {emailReenviado && (
                  <HStack bg="green.100" px={4} py={3} borderRadius="lg" alignItems="center" space={2}>
                    <Icon as={MaterialIcons} name="check-circle" size={5} color="green.600" />
                    <Text fontSize="sm" color="green.700" fontWeight="medium">
                      E-mail reenviado com sucesso!
                    </Text>
                  </HStack>
                )}

                <Text fontSize="sm" color="gray.600">
                  Não recebeu o e-mail?
                </Text>

                {podeReenviar ? (
                  <Pressable onPress={reenviarEmail}>
                    <Text fontSize="sm" color="primary.500" fontWeight="bold">
                      Reenviar e-mail
                    </Text>
                  </Pressable>
                ) : (
                  <HStack alignItems="center" space={1}>
                    <Text fontSize="sm" color="gray.400">
                      Reenviar em
                    </Text>
                    <Text fontSize="sm" color="primary.500" fontWeight="bold">
                      {formatarTempo(tempoRestante)}
                    </Text>
                  </HStack>
                )}
              </VStack>
            </VStack>

         

            <Text fontSize="xs" color="gray.400" textAlign="center">
              Ao verificar seu e-mail, você concorda com nossos{' '}
              <Text color="purple.600" fontWeight="medium">
                Termos de Uso
              </Text>
            </Text>
          </VStack>
        </Center>
      </VStack>
    </ScrollView>
  );
};

export default TelaVerificacaoEmail;