import { Tabs, usePathname } from 'expo-router';
import Footer from './src/components/ui/Footer';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

export default function TabLayout() {
  const pathname = usePathname();
  const router = useRouter();

  // Mapear o caminho para o id do footer
  const getActiveTab = (path: string) => {
    if (path.startsWith('/')) return 'inicio';
    if (path.startsWith('/(tabs)/explorar')) return 'explorar';
    if (path.startsWith('/(tabs)/favoritos')) return 'favoritos';
    if (path.startsWith('/(tabs)/carrinho')) return 'carrinho';
    if (path.startsWith('/(tabs)/menu')) return 'menu';
    return 'inicio';
  };

  const activeTab = getActiveTab(pathname);

  const handleFooterNavigate = (itemId: string) => {
    switch (itemId) {
      case 'inicio':
        router.push('/');
        break;
      case 'explorar':
        router.push('/(tabs)/explorar');
        break;
      case 'favoritos':
        router.push('/(tabs)/favoritos');
        break;
      case 'carrinho':
        router.push('/(tabs)/carrinho');
        break;
      case 'menu':
        router.push('/(tabs)/menu');
        break;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="explorar" />
        <Tabs.Screen name="favoritos" />
        <Tabs.Screen name="carrinho" />
        <Tabs.Screen name="menu" />
      </Tabs>
      <Footer
        ativo={activeTab}
        onNavigate={handleFooterNavigate}
      />
    </View>
  );
}