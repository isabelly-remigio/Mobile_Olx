import { View, Text, Button } from 'native-base';
import { useRouter } from 'expo-router';

export default function Menu() {
  const router = useRouter();
  return (
    <View flex={1} justifyContent="center" alignItems="center">
      <Text fontSize="2xl">👤 Menu / Perfil</Text>
      <Button mt={4} onPress={() => router.back()}>Voltar</Button>
    </View>
  );
}
