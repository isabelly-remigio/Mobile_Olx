import { View, Text, Button } from 'native-base';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function DetalhesProduto() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();

  return (
    <View flex={1} justifyContent="center" alignItems="center">
      <Text fontSize="2xl">📦 Produto ID: {params.id}</Text>
      <Button mt={4} onPress={() => router.back()}>Voltar</Button>
    </View>
  );
}
