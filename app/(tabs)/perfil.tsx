// screens/TelaPerfil.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Avatar, Icon, Overlay, Button } from '@rneui/themed';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../src/theme/theme';
import { useRouter } from 'expo-router';

// Tipos
interface DadosUsuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  foto?: string;
  endereco: {
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
}

const TelaPerfil: React.FC = () => {
  const [usuario, setUsuario] = useState<DadosUsuario>({
    id: '1',
    nome: 'Maria Silva',
    email: 'maria.silva@email.com',
    telefone: '(81) 98765-4321',
    foto: undefined,
    endereco: {
      rua: 'Rua das Flores, 123',
      bairro: 'Capibaribe',
      cidade: 'São Lourenço da Mata',
      estado: 'PE',
    },
  });

  const [modalEditarVisivel, setModalEditarVisivel] = useState(false);
  const [dadosEdicao, setDadosEdicao] = useState<DadosUsuario>(usuario);
const router = useRouter();
  const voltar = () => {
    console.log('Voltando...');
    router.back();
  };

  const compartilhar = () => {
    console.log('Compartilhando perfil...');
  };

  const abrirModalEditar = () => {
    setDadosEdicao(usuario);
    setModalEditarVisivel(true);
  };

  const cancelarEdicao = () => {
    setDadosEdicao(usuario);
    setModalEditarVisivel(false);
  };

  const salvarEdicao = () => {
    setUsuario(dadosEdicao);
    setModalEditarVisivel(false);
    console.log('Dados salvos:', dadosEdicao);
  };

  const atualizarCampo = (campo: string, valor: string) => {
    setDadosEdicao(prev => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const atualizarEndereco = (campo: string, valor: string) => {
    setDadosEdicao(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [campo]: valor,
      },
    }));
  };

  const getIniciais = (nome: string): string => {
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
    return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={voltar} style={styles.headerButton}>
          <Icon
            name="arrow-back"
            type="material"
            size={24}
            color={theme.colors.gray800}
          />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Perfil</Text>
        
        <TouchableOpacity onPress={compartilhar} style={styles.headerButton}>
          <Icon
            name="share"
            type="material"
            size={24}
            color={theme.colors.gray800}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Card de Informações */}
        <View style={styles.card}>
          {/* Foto + Nome */}
          <View style={styles.userHeader}>
            <Avatar
              size={48}
              rounded
              title={getIniciais(usuario.nome)}
              containerStyle={styles.avatar}
              source={usuario.foto ? { uri: usuario.foto } : undefined}
              titleStyle={styles.avatarTitle}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{usuario.nome}</Text>
            </View>
          </View>

          {/* Localização */}
          <View style={styles.infoRow}>
            <Icon
              name="location-on"
              type="material"
              size={16}
              color={theme.colors.gray600}
              containerStyle={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              {usuario.endereco.bairro}, {usuario.endereco.cidade} — {usuario.endereco.estado}
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Email */}
          <View style={styles.contactRow}>
            <View style={styles.statusIndicator} />
            <Icon
              name="email"
              type="material"
              size={18}
              color={theme.colors.gray600}
              containerStyle={styles.contactIcon}
            />
            <Text style={styles.contactText}>{usuario.email}</Text>
          </View>

          {/* Telefone */}
          <View style={styles.contactRow}>
            <View style={styles.statusIndicator} />
            <Icon
              name="phone"
              type="material"
              size={18}
              color={theme.colors.gray600}
              containerStyle={styles.contactIcon}
            />
            <Text style={styles.contactText}>{usuario.telefone}</Text>
          </View>

          {/* Botão Editar */}
          <Button
            title="Editar Perfil"
            onPress={abrirModalEditar}
            buttonStyle={styles.editButton}
            titleStyle={styles.editButtonText}
            icon={{
              name: 'edit',
              type: 'material',
              size: 18,
              color: theme.colors.white,
            }}
            iconPosition="left"
          />
        </View>

        {/* Espaço extra */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal de Edição */}
      <Overlay
        isVisible={modalEditarVisivel}
        onBackdropPress={cancelarEdicao}
        overlayStyle={styles.modalOverlay}
        animationType="slide"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalContent}>
              {/* Header do Modal */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Editar Perfil</Text>
                <TouchableOpacity onPress={cancelarEdicao}>
                  <Icon
                    name="close"
                    type="material"
                    size={24}
                    color={theme.colors.gray700}
                  />
                </TouchableOpacity>
              </View>

              {/* Campos de Edição */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                  style={styles.input}
                  value={dadosEdicao.nome}
                  onChangeText={(text) => atualizarCampo('nome', text)}
                  placeholder="Digite seu nome"
                  placeholderTextColor={theme.colors.gray400}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                  style={styles.input}
                  value={dadosEdicao.email}
                  onChangeText={(text) => atualizarCampo('email', text)}
                  placeholder="Digite seu e-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={theme.colors.gray400}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Telefone</Text>
                <TextInput
                  style={styles.input}
                  value={dadosEdicao.telefone}
                  onChangeText={(text) => atualizarCampo('telefone', text)}
                  placeholder="(XX) XXXXX-XXXX"
                  keyboardType="phone-pad"
                  placeholderTextColor={theme.colors.gray400}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Bairro</Text>
                <TextInput
                  style={styles.input}
                  value={dadosEdicao.endereco.bairro}
                  onChangeText={(text) => atualizarEndereco('bairro', text)}
                  placeholder="Digite o bairro"
                  placeholderTextColor={theme.colors.gray400}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Cidade</Text>
                <TextInput
                  style={styles.input}
                  value={dadosEdicao.endereco.cidade}
                  onChangeText={(text) => atualizarEndereco('cidade', text)}
                  placeholder="Digite a cidade"
                  placeholderTextColor={theme.colors.gray400}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Estado</Text>
                <TextInput
                  style={styles.input}
                  value={dadosEdicao.endereco.estado}
                  onChangeText={(text) => atualizarEndereco('estado', text)}
                  placeholder="UF"
                  maxLength={2}
                  autoCapitalize="characters"
                  placeholderTextColor={theme.colors.gray400}
                />
              </View>

              {/* Botões */}
              <View style={styles.modalButtons}>
                <Button
                  title="Cancelar"
                  onPress={cancelarEdicao}
                  buttonStyle={styles.cancelButton}
                  titleStyle={styles.cancelButtonText}
                  containerStyle={styles.buttonContainer}
                />
                <Button
                  title="Salvar"
                  onPress={salvarEdicao}
                  buttonStyle={styles.saveButton}
                  titleStyle={styles.saveButtonText}
                  containerStyle={styles.buttonContainer}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Overlay>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray50,
  },
  
  // Header
  header: {
    height: 56,
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.gray900,
  },
  
  // Scroll
  scrollView: {
    flex: 1,
  },
  
  // Card
  card: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    marginTop: 8,
  },
  
  // User Header
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: theme.colors.primary[500],
  },
  avatarTitle: {
    fontSize: 18,
    fontWeight: theme.typography.weights.bold,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.black,
  },
  
  // Info Row
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#444',
    flex: 1,
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: theme.colors.gray200,
    marginVertical: 12,
  },
  
  // Contact Row
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    marginBottom: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
    marginRight: 8,
  },
  contactIcon: {
    marginRight: 8,
  },
  contactText: {
    fontSize: 14,
    color: theme.colors.gray800,
  },
  
  // Edit Button
  editButton: {
    backgroundColor: theme.colors.secondary[500],
    height: 44,
    borderRadius: 8,
    marginTop: 16,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
    marginLeft: 8,
  },
  
  // Modal
  modalOverlay: {
    width: '95%',
    maxHeight: '90%',
    borderRadius: 12,
    padding: 0,
  },
  modalContainer: {
    maxHeight: '100%',
  },
  modalContent: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.gray900,
  },
  
  // Form
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.gray700,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: theme.colors.gray900,
    backgroundColor: theme.colors.white,
  },
  
  // Modal Buttons
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  buttonContainer: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: theme.colors.gray300,
    height: 48,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.gray700,
  },
  saveButton: {
    backgroundColor: theme.colors.secondary[500],
    height: 48,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.white,
  },
});

export default TelaPerfil;