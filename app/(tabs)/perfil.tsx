import React, { useState, useEffect, useCallback } from 'react';
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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Avatar, Icon, Overlay, Button } from '@rneui/themed';
import { theme } from '../src/theme/theme';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/src/context/AuthContext';
import { usuarioService, Usuario, AtualizarUsuarioDTO } from '../src/services/usuarioService';

// Tipos
interface DadosUsuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  dataNascimento?: string;
  foto?: string;
  endereco: {
    rua?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
  };
}

const TelaPerfil: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  const [usuario, setUsuario] = useState<DadosUsuario>({
    id: '1',
    nome: user?.nome || 'Carregando...',
    email: user?.email || '',
    telefone: '',
    endereco: {
      rua: '',
      bairro: '',
      cidade: '',
      estado: '',
    },
  });

  const [modalEditarVisivel, setModalEditarVisivel] = useState(false);
  const [dadosEdicao, setDadosEdicao] = useState<DadosUsuario>(usuario);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Buscar dados do usuário ao carregar a tela
  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  const carregarDadosUsuario = async () => {
    try {
      setCarregando(true);
      console.log('🔄 Carregando dados do usuário...');
      
      // Busca dados da API
      const dadosAPI = await usuarioService.buscarMeusDados();
      console.log('✅ Dados da API:', dadosAPI);
      
      // Formata os dados para o frontend
      const usuarioFormatado: DadosUsuario = {
        id: dadosAPI.id.toString(),
        nome: dadosAPI.nome || user?.nome || 'Usuário',
        email: dadosAPI.email || user?.email || '',
        telefone: dadosAPI.telefone ? usuarioService.formatarTelefone(dadosAPI.telefone) : '',
        dataNascimento: dadosAPI.dataNascimento ? usuarioService.formatarDataNascimento(dadosAPI.dataNascimento) : undefined,
        endereco: {
          rua: dadosAPI.endereco?.logradouro || '',
          bairro: dadosAPI.endereco?.bairro || '',
          cidade: dadosAPI.endereco?.cidade || '',
          estado: dadosAPI.endereco?.uf || '',
          cep: dadosAPI.endereco?.cep || '',
          logradouro: dadosAPI.endereco?.logradouro || '',
          numero: dadosAPI.endereco?.numero || '',
          complemento: dadosAPI.endereco?.complemento || '',
        },
      };
      
      console.log('📊 Usuário formatado:', usuarioFormatado);
      setUsuario(usuarioFormatado);
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
      
      // Fallback com dados do contexto de autenticação
      setUsuario({
        id: '1',
        nome: user?.nome || 'Usuário',
        email: user?.email || '',
        telefone: '',
        endereco: {
          rua: '',
          bairro: '',
          cidade: '',
          estado: '',
        },
      });
    } finally {
      setCarregando(false);
    }
  };

  const voltar = () => {
    console.log('Voltando...');
    router.push('/(tabs)/menu');
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

  const salvarEdicao = async () => {
    try {
      setSalvando(true);
      console.log('💾 Salvando dados editados...');
      
      // Preparar dados para a API
      const dadosAPI: AtualizarUsuarioDTO = {
        nome: dadosEdicao.nome !== usuario.nome ? dadosEdicao.nome : undefined,
        telefone: dadosEdicao.telefone !== usuario.telefone ? 
          dadosEdicao.telefone?.replace(/\D/g, '') : undefined,
        dataNascimento: dadosEdicao.dataNascimento !== usuario.dataNascimento ? 
          dadosEdicao.dataNascimento?.split('/').reverse().join('-') : undefined,
        cep: dadosEdicao.endereco.cep !== usuario.endereco.cep ? 
          dadosEdicao.endereco.cep : undefined,
        logradouro: dadosEdicao.endereco.logradouro !== usuario.endereco.logradouro ? 
          dadosEdicao.endereco.logradouro : undefined,
        numero: dadosEdicao.endereco.numero !== usuario.endereco.numero ? 
          dadosEdicao.endereco.numero : undefined,
        bairro: dadosEdicao.endereco.bairro !== usuario.endereco.bairro ? 
          dadosEdicao.endereco.bairro : undefined,
        cidade: dadosEdicao.endereco.cidade !== usuario.endereco.cidade ? 
          dadosEdicao.endereco.cidade : undefined,
        uf: dadosEdicao.endereco.estado !== usuario.endereco.estado ? 
          dadosEdicao.endereco.estado : undefined,
        complemento: dadosEdicao.endereco.complemento !== usuario.endereco.complemento ? 
          dadosEdicao.endereco.complemento : undefined,
      };
      
      // Remove campos undefined
      const dadosLimpos = Object.fromEntries(
        Object.entries(dadosAPI).filter(([_, value]) => value !== undefined)
      );
      
      console.log('📤 Dados para API:', dadosLimpos);
      
      // Se não há nada para atualizar, apenas fecha o modal
      if (Object.keys(dadosLimpos).length === 0) {
        Alert.alert('Aviso', 'Nenhuma alteração detectada.');
        setModalEditarVisivel(false);
        return;
      }
      
      // Chama a API
      const usuarioAtualizado = await usuarioService.atualizarMeusDados(dadosLimpos);
      
      // Atualiza o estado local
      setUsuario(dadosEdicao);
      setModalEditarVisivel(false);
      
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      
      // Recarrega os dados da API para garantir sincronização
      await carregarDadosUsuario();
      
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações. Tente novamente.');
    } finally {
      setSalvando(false);
    }
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
    return usuarioService.getIniciais(nome);
  };

  // Tela de loading
  if (carregando) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
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
          <View style={styles.headerButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          {(usuario.endereco.bairro || usuario.endereco.cidade || usuario.endereco.estado) && (
            <View style={styles.infoRow}>
              <Icon
                name="location-on"
                type="material"
                size={16}
                color={theme.colors.gray600}
                containerStyle={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                {usuario.endereco.bairro && `${usuario.endereco.bairro}, `}
                {usuario.endereco.cidade && `${usuario.endereco.cidade} `}
                {usuario.endereco.estado && `— ${usuario.endereco.estado}`}
              </Text>
            </View>
          )}

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
          {usuario.telefone && (
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
          )}

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
                <Text style={styles.label}>Nome *</Text>
                <TextInput
                  style={styles.input}
                  value={dadosEdicao.nome}
                  onChangeText={(text) => atualizarCampo('nome', text)}
                  placeholder="Digite seu nome"
                  placeholderTextColor={theme.colors.gray400}
                  editable={!salvando}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.gray100 }]}
                  value={dadosEdicao.email}
                  editable={false}
                  placeholderTextColor={theme.colors.gray400}
                />
                <Text style={styles.inputHint}>E-mail não pode ser alterado</Text>
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
                  editable={!salvando}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Data de Nascimento</Text>
                <TextInput
                  style={styles.input}
                  value={dadosEdicao.dataNascimento}
                  onChangeText={(text) => atualizarCampo('dataNascimento', text)}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor={theme.colors.gray400}
                  editable={!salvando}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>CEP</Text>
                <TextInput
                  style={styles.input}
                  value={dadosEdicao.endereco.cep}
                  onChangeText={(text) => atualizarEndereco('cep', text)}
                  placeholder="00000-000"
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.gray400}
                  editable={!salvando}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Logradouro</Text>
                <TextInput
                  style={styles.input}
                  value={dadosEdicao.endereco.logradouro}
                  onChangeText={(text) => atualizarEndereco('logradouro', text)}
                  placeholder="Rua, Avenida, etc."
                  placeholderTextColor={theme.colors.gray400}
                  editable={!salvando}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Número</Text>
                <TextInput
                  style={styles.input}
                  value={dadosEdicao.endereco.numero}
                  onChangeText={(text) => atualizarEndereco('numero', text)}
                  placeholder="Número"
                  placeholderTextColor={theme.colors.gray400}
                  editable={!salvando}
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
                  editable={!salvando}
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
                  editable={!salvando}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Estado (UF)</Text>
                <TextInput
                  style={styles.input}
                  value={dadosEdicao.endereco.estado}
                  onChangeText={(text) => atualizarEndereco('estado', text)}
                  placeholder="UF"
                  maxLength={2}
                  autoCapitalize="characters"
                  placeholderTextColor={theme.colors.gray400}
                  editable={!salvando}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Complemento</Text>
                <TextInput
                  style={styles.input}
                  value={dadosEdicao.endereco.complemento}
                  onChangeText={(text) => atualizarEndereco('complemento', text)}
                  placeholder="Apartamento, bloco, etc."
                  placeholderTextColor={theme.colors.gray400}
                  editable={!salvando}
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
                  disabled={salvando}
                />
                <Button
                  title={salvando ? "Salvando..." : "Salvar"}
                  onPress={salvarEdicao}
                  buttonStyle={styles.saveButton}
                  titleStyle={styles.saveButtonText}
                  containerStyle={styles.buttonContainer}
                  loading={salvando}
                  disabled={salvando}
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

   loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.gray600,
  },
  
  inputHint: {
    fontSize: 12,
    color: theme.colors.gray500,
    marginTop: 4,
    fontStyle: 'italic',
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