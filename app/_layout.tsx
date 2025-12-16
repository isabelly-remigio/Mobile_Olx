import { Stack, usePathname, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AppProvider } from './src/AppProvider';
import Footer from './src/components/ui/Footer';
import { useAuth } from './src/context/AuthContext';

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // Rotas que precisam estar autenticado
  const protectedRoutes = [
    '(tabs)/favoritos',
    '(tabs)/menu',
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading || !isReady) return;

    const currentRoute = segments.join('/');
    const isAuthStack = segments[0] === 'auth';

    // Se NÃO logado e entrou em rota protegida -> enviar login
    if (!user && protectedRoutes.includes(currentRoute)) {
      router.replace('/auth/Login/login');
      return;
    }

    // Se logado e acessou área de login -> home
    if (user && isAuthStack) {
      router.replace('/');
      return;
    }

  }, [user, segments, loading, isReady, router]);

  if (loading || !isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // =============================
  // FOOTER DEVE APARECER EM:
  // '/', '/(tabs)/explorar', '/(tabs)/favoritos', '/(tabs)/carrinho', '/(tabs)/menu'
  // =============================

  const shouldShowFooter =
    !pathname.startsWith("/auth") && 
    !pathname.includes("/perfil") &&
    !pathname.includes("/compras");

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="perfil" />
        <Stack.Screen name="compras" />
        <Stack.Screen name="(tabs)" />
      </Stack>

      {shouldShowFooter && (
        <Footer />
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootLayoutNav />
    </AppProvider>
  );
}
