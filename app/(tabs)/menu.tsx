// screens/TelaMenu.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { Avatar, Icon, Overlay, Button } from '@rneui/themed';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../src/theme/theme';
import { useRouter } from 'expo-router';

// Tipos
interface Usuario {
  id: string;
  nome: string;
  email: string;
  foto?: string;
}

interface ItemMenu {
  id: string;
  titulo: string;
  icone: string;
  onPress: () => void;
  cor?: string;
}

const TelaMenu: React.FC = () => {
        const router = useRouter();
  const [usuario] = useState<Usuario>({
    id: '1',
    nome: 'Maria Silva',
    email: 'maria.silva@email.com',
    foto: undefined, // Se tiver foto: 'https://...'
  });

  const [modalLogoutVisivel, setModalLogoutVisivel] = useState(false);

 const navegarParaPerfil = () => {
    console.log('Navegando para Perfil');
  router.push('/(tabs)/perfil');
};



  const navegarParaMinhasCompras = () => {
    console.log('Navegando para Minhas Compras');
    router.push('/(tabs)/compras');
  };

  const confirmarLogout = () => {
    setModalLogoutVisivel(false);
    console.log('Usuário saiu');
    // Limpar dados de sessão e navegar para login
  };

  const cancelarLogout = () => {
    setModalLogoutVisivel(false);
  };

  const getIniciais = (nome: string): string => {
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
    return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
  };

  const opcoesMenu: ItemMenu[] = [
    
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
      <StatusBar  backgroundColor={theme.colors.white} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header com Informações do Usuário */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Avatar
              size={44}
              rounded
              title={getIniciais(usuario.nome)}
              containerStyle={styles.avatar}
              source={usuario.foto ? { uri: usuario.foto } : undefined}
              titleStyle={styles.avatarTitle}
            />
            <View style={styles.userText}>
              <Text style={styles.userName}>{usuario.nome}</Text>
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
    fontWeight: theme.typography.weights.bold,
  },
  userText: {
    marginLeft: 12,
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
    color: '#333333',
  },
  profileLink: {
    fontSize: 14,
    fontWeight: theme.typography.weights.normal,
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
    fontWeight: theme.typography.weights.normal,
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
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.gray900,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    fontWeight: theme.typography.weights.normal,
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
    fontWeight: theme.typography.weights.semibold,
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
    fontWeight: theme.typography.weights.semibold,
  },
});

export default TelaMenu;