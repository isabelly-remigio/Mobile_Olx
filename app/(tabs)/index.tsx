import { Box, Text, Button, VStack } from 'native-base';
import { useRouter } from 'expo-router';
import { Carrossel } from '../src/components/ui/Carrossel';

import { BarraPesquisa } from '../src/components/ui/BarraPesquisa';

export default function Home() {
  const router = useRouter();

  return (
    <VStack flex={1} p={4} space={4}>
      <BarraPesquisa placeholder="Buscar produtos..." />
      <Carrossel />
      <Button onPress={() => router.push('/anuncio/123')}>Ir para Detalhes do Produto</Button>
    </VStack>
  );
}
