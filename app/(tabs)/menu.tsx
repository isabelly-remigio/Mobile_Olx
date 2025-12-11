import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Avatar, Icon, Overlay, Button } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/src/context/AuthContext';
import { theme } from '../src/theme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Tipos
interface ItemMenu {
  id: string;
  titulo: string;
  icone: string;
  onPress: () => void;
  cor?: string;
}

const TelaMenu: React.FC = () => {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [modalLogoutVisivel, setModalLogoutVisivel] = useState(false);

  // Verificar se o usuário está logado
  useEffect(() => {
    if (!loading && !user) {
      Alert.alert(
        'Acesso restrito',
        'Faça login para acessar o menu.',
        [{ text: 'OK', onPress: () => router.push('/auth/Login/login') }]
      );
    }
  }, [user, loading, router]);

  // screens/TelaMenu.tsx
useEffect(() => {
  const checkStoredUser = async () => {
    const storedUser = await AsyncStorage.getItem('@Auth:user');
    console.log('Usuário no AsyncStorage:', storedUser);
  };
  checkStoredUser();
}, []);

  const navegarParaPerfil = () => {
    router.push('/perfil');
  };

  const navegarParaMinhasCompras = () => {
    router.push('/(tabs)/compras');
  };

  const confirmarLogout = () => {
    setModalLogoutVisivel(false);
    signOut();
    router.push('/');
  };

  const cancelarLogout = () => {
    setModalLogoutVisivel(false);
  };

  const getIniciais = (nome: string): string => {
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
    return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
  };

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
      </View>
    );
  }

  // Se não estiver logado, não renderizar nada (será redirecionado)
  if (!user) {
    return null;
  }

  const opcoesMenu: ItemMenu[] = [
    {
      id: 'perfil',
      titulo: 'Meu perfil',
      icone: 'person',
      onPress: navegarParaPerfil,
    },
  
    {
      id: 'compras',
      titulo: 'Minhas compras',
      icone: 'shopping-bag',
      onPress: navegarParaMinhasCompras,
    },
    
  ];

  const renderItemMenu = (item: ItemMenu) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <Icon
          name={item.icone}
          type="material"
          size={24}
          color={item.cor || theme.colors.gray700}
        />
        <Text style={[
          styles.menuItemText,
          item.cor && { color: item.cor }
        ]}>
          {item.titulo}
        </Text>
      </View>
      <Icon
        name="chevron-right"
        type="material"
        size={24}
        color={theme.colors.gray400}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme.colors.white} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header com Informações do Usuário */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Avatar
              size={44}
              rounded
              title={getIniciais(user.nome)}
              containerStyle={styles.avatar}
              titleStyle={styles.avatarTitle}
            />
            <View style={styles.userText}>
              <Text style={styles.userName}>{user.nome}</Text>
              <TouchableOpacity onPress={navegarParaPerfil}>
                <Text style={styles.profileLink}>Meu perfil</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bloco 1 - Opções Principais */}
        <View style={styles.menuBlock}>
          {opcoesMenu.map(item => renderItemMenu(item))}
        </View>

        {/* Divisor */}
        <View style={styles.divider} />

        {/* Bloco de Saída */}
        <View style={styles.menuBlock}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setModalLogoutVisivel(true)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Icon
                name="logout"
                type="material"
                size={24}
                color="#C30000"
              />
              <Text style={[styles.menuItemText, styles.logoutText]}>
                Sair
              </Text>
            </View>
            <Icon
              name="chevron-right"
              type="material"
              size={24}
              color={theme.colors.gray400}
            />
          </TouchableOpacity>
        </View>

        {/* Espaço para o bottom navigation */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Modal de Confirmação de Logout */}
      <Overlay
        isVisible={modalLogoutVisivel}
        onBackdropPress={cancelarLogout}
        overlayStyle={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Deseja sair?</Text>
          <Text style={styles.modalText}>
            Você precisará fazer login novamente para acessar sua conta.
          </Text>
          
          <View style={styles.modalButtons}>
            <Button
              title="Confirmar"
              onPress={confirmarLogout}
              buttonStyle={styles.confirmButton}
              titleStyle={styles.confirmButtonText}
            />
            <Button
              title="Cancelar"
              onPress={cancelarLogout}
              buttonStyle={styles.cancelButton}
              titleStyle={styles.cancelButtonText}
            />
          </View>
        </View>
      </Overlay>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  scrollView: {
    flex: 1,
  },
  
  // Header
  header: {
    height: 60,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: theme.colors.primary[500],
  },
  avatarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userText: {
    marginLeft: 12,
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  profileLink: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#007AFF',
  },

  // Menu Items
  menuBlock: {
    paddingHorizontal: 16,
    backgroundColor: theme.colors.white,
  },
  menuItem: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#000000',
  },
  logoutText: {
    color: '#C30000',
  },

  // Divisor
  divider: {
    height: 12,
    backgroundColor: '#F2F2F2',
    width: '100%',
  },

  // Modal de Logout
  modalOverlay: {
    width: '90%',
    borderRadius: 12,
    padding: 24,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.gray900,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: theme.colors.gray700,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    width: '100%',
    gap: 12,
  },
  confirmButton: {
    backgroundColor: '#D60000',
    height: 44,
    borderRadius: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    height: 44,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TelaMenu;