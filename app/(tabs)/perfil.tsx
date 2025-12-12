import React, { useState, useEffect } from 'react';
import {
  View,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../src/theme/theme';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/src/context/AuthContext';
import { usuarioService, Usuario, AtualizarUsuarioDTO } from '../src/services/usuarioService';
import styles from '../src/styles/TelaPerfilStyles';

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
  const { user, updateUser } = useAuth();
  
  // Estado inicial explícito
  const [usuario, setUsuario] = useState<DadosUsuario>({
    id: '',
    nome: user?.nome || 'Carregando...',
    email: user?.email || '',
    telefone: '',
    dataNascimento: '',
    endereco: {
      rua: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
    },
  });

  const [modalEditarVisivel, setModalEditarVisivel] = useState(false);
  
  // Estado inicial explícito para dadosEdicao
  const [dadosEdicao, setDadosEdicao] = useState<DadosUsuario>({
    id: '',
    nome: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    endereco: {
      rua: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
    },
  });
  
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Buscar dados do usuário ao carregar a tela
  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  // Sincronizar dadosEdicao quando usuario mudar
  useEffect(() => {
    if (usuario.id && !carregando) {
      console.log('🔄 Sincronizando dadosEdicao com usuario');
      setDadosEdicao({
        ...usuario,
        endereco: { ...usuario.endereco }
      });
    }
  }, [usuario, carregando]);

  const carregarDadosUsuario = async () => {
    try {
      setCarregando(true);
      console.log('🔄 Carregando dados do usuário...');
      
      const dadosAPI = await usuarioService.buscarMeusDados();
      console.log('✅ Dados da API:', dadosAPI);
      
      // Log detalhado dos campos
      console.log('🔍 Detalhes da API:');
      console.log('- dataNascimento:', dadosAPI.dataNascimento);
      console.log('- cep:', dadosAPI.cep);
      console.log('- logradouro:', dadosAPI.logradouro);
      console.log('- numero:', dadosAPI.numero);
      console.log('- bairro:', dadosAPI.bairro);
      console.log('- cidade:', dadosAPI.cidade);
      console.log('- uf:', dadosAPI.uf);
      
      const usuarioFormatado: DadosUsuario = {
        id: dadosAPI.id?.toString() || '1',
        nome: dadosAPI.nome || user?.nome || 'Usuário',
        email: dadosAPI.email || user?.email || '',
        telefone: dadosAPI.telefone ? usuarioService.formatarTelefone(dadosAPI.telefone) : '',
        dataNascimento: dadosAPI.dataNascimento ? 
          usuarioService.formatarDataNascimento(dadosAPI.dataNascimento) : '',
        endereco: {
          rua: dadosAPI.logradouro || '',
          bairro: dadosAPI.bairro || '',
          cidade: dadosAPI.cidade || '',
          estado: dadosAPI.uf || '',
          cep: dadosAPI.cep || '',
          logradouro: dadosAPI.logradouro || '',
          numero: dadosAPI.numero || '',
          complemento: dadosAPI.complemento || '',
        },
      };
      
      console.log('📊 Usuário formatado:', usuarioFormatado);
      setUsuario(usuarioFormatado);
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
      
      setUsuario({
        id: '1',
        nome: user?.nome || 'Usuário',
        email: user?.email || '',
        telefone: '',
        dataNascimento: '',
        endereco: {
          rua: '',
          bairro: '',
          cidade: '',
          estado: '',
          cep: '',
          logradouro: '',
          numero: '',
          complemento: '',
        },
      });
    } finally {
      setCarregando(false);
    }
  };

  const voltar = () => {
    router.push('/(tabs)/menu');
  };

  const compartilhar = () => {
    console.log('Compartilhando perfil...');
  };

  const abrirModalEditar = () => {
    if (carregando) {
      Alert.alert('Aguarde', 'Carregando dados do perfil...');
      return;
    }
    
    console.log('📋 Abrindo modal com dados:', usuario);
    
    // Cópia profunda garantida
    const dadosParaEdicao: DadosUsuario = JSON.parse(JSON.stringify(usuario));
    setDadosEdicao(dadosParaEdicao);
    setModalEditarVisivel(true);
  };

  const cancelarEdicao = () => {
    // Resetar para os dados atuais do usuário
    setDadosEdicao(JSON.parse(JSON.stringify(usuario)));
    setModalEditarVisivel(false);
  };

  // Função auxiliar para formatar data
  const formatarDataParaAPI = (data: string): string => {
    if (!data) return '';
    
    // Se já está no formato YYYY-MM-DD
    if (data.includes('-') && data.split('-')[0].length === 4) {
      return data;
    }
    
    // Se está no formato DD/MM/YYYY
    if (data.includes('/')) {
      const partes = data.split('/');
      if (partes.length === 3) {
        const [dia, mes, ano] = partes;
        return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
      }
    }
    
    return data;
  };

  const salvarEdicao = async () => {
    try {
      setSalvando(true);
      console.log('💾 Salvando dados editados...');
      
      const dadosAPI: AtualizarUsuarioDTO = {
        nome: dadosEdicao.nome !== usuario.nome ? dadosEdicao.nome : undefined,
        telefone: dadosEdicao.telefone !== usuario.telefone ? 
          (dadosEdicao.telefone || '').replace(/\D/g, '') : undefined,
        dataNascimento: dadosEdicao.dataNascimento !== usuario.dataNascimento ? 
          formatarDataParaAPI(dadosEdicao.dataNascimento || '') : undefined,
        cep: dadosEdicao.endereco.cep !== usuario.endereco.cep ? 
          (dadosEdicao.endereco.cep || '').replace(/\D/g, '') : undefined,
        logradouro: dadosEdicao.endereco.logradouro !== usuario.endereco.logradouro ? 
          (dadosEdicao.endereco.logradouro || '') : undefined,
        numero: dadosEdicao.endereco.numero !== usuario.endereco.numero ? 
          (dadosEdicao.endereco.numero || '') : undefined,
        bairro: dadosEdicao.endereco.bairro !== usuario.endereco.bairro ? 
          (dadosEdicao.endereco.bairro || '') : undefined,
        cidade: dadosEdicao.endereco.cidade !== usuario.endereco.cidade ? 
          (dadosEdicao.endereco.cidade || '') : undefined,
        uf: dadosEdicao.endereco.estado !== usuario.endereco.estado ? 
          (dadosEdicao.endereco.estado || '').toUpperCase() : undefined,
        complemento: dadosEdicao.endereco.complemento !== usuario.endereco.complemento ? 
          (dadosEdicao.endereco.complemento || '') : undefined,
      };
      
      // Filtrar campos undefined/vazios
      const dadosLimpos = Object.fromEntries(
        Object.entries(dadosAPI).filter(([_, value]) => 
          value !== undefined && value !== null && value !== ''
        )
      );
      
      console.log('📤 Dados para enviar:', dadosLimpos);
      
      if (Object.keys(dadosLimpos).length === 0) {
        Alert.alert('Aviso', 'Nenhuma alteração detectada.');
        setModalEditarVisivel(false);
        return;
      }
      
      const usuarioAtualizado = await usuarioService.atualizarMeusDados(dadosLimpos);
      console.log('✅ Usuário atualizado:', usuarioAtualizado);
      
      // ✅ ATUALIZA O CONTEXTO AQUI
      if (updateUser) {
        await updateUser({
          nome: dadosEdicao.nome,
          telefone: dadosEdicao.telefone,
          dataNascimento: dadosEdicao.dataNascimento,
        });
      } else {
        // Fallback: atualizar manualmente o AsyncStorage
        const userData = {
          id: user?.id || usuario.id,
          nome: dadosEdicao.nome,
          email: dadosEdicao.email,
          telefone: dadosEdicao.telefone,
          dataNascimento: dadosEdicao.dataNascimento,
        };
        await AsyncStorage.setItem('@Auth:user', JSON.stringify(userData));
      }
      
      // Recarrega os dados da API
      await carregarDadosUsuario();
      
      setModalEditarVisivel(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    } finally {
      setSalvando(false);
    }
  };

  const atualizarCampo = (campo: keyof DadosUsuario, valor: string) => {
    setDadosEdicao(prev => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const atualizarEndereco = (campo: keyof DadosUsuario['endereco'], valor: string) => {
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
            <Icon name="arrow-back" type="material" size={24} color={theme.colors.gray800} />
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
      
      <View style={styles.header}>
        <TouchableOpacity onPress={voltar} style={styles.headerButton}>
          <Icon name="arrow-back" type="material" size={24} color={theme.colors.gray800} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <TouchableOpacity onPress={compartilhar} style={styles.headerButton}>
          <Icon name="share" type="material" size={24} color={theme.colors.gray800} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.userHeader}>
            <Avatar
              size={48}
              rounded
              title={getIniciais(usuario.nome)}
              containerStyle={styles.avatar}
              titleStyle={styles.avatarTitle}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{usuario.nome}</Text>
            </View>
          </View>

          {(usuario.endereco.bairro || usuario.endereco.cidade || usuario.endereco.estado) && (
            <View style={styles.infoRow}>
              <Icon name="location-on" type="material" size={16} color={theme.colors.gray600} containerStyle={styles.infoIcon} />
              <Text style={styles.infoText}>
                {usuario.endereco.bairro && `${usuario.endereco.bairro}, `}
                {usuario.endereco.cidade && `${usuario.endereco.cidade} `}
                {usuario.endereco.estado && `— ${usuario.endereco.estado}`}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.contactRow}>
            <View style={styles.statusIndicator} />
            <Icon name="email" type="material" size={18} color={theme.colors.gray600} containerStyle={styles.contactIcon} />
            <Text style={styles.contactText}>{usuario.email}</Text>
          </View>

          {usuario.telefone && (
            <View style={styles.contactRow}>
              <View style={styles.statusIndicator} />
              <Icon name="phone" type="material" size={18} color={theme.colors.gray600} containerStyle={styles.contactIcon} />
              <Text style={styles.contactText}>{usuario.telefone}</Text>
            </View>
          )}

          <Button
            title="Editar Perfil"
            onPress={abrirModalEditar}
            buttonStyle={styles.editButton}
            titleStyle={styles.editButtonText}
            icon={{ name: 'edit', type: 'material', size: 18, color: theme.colors.white }}
            iconPosition="left"
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* MODAL DE EDIÇÃO */}
      <Overlay
        isVisible={modalEditarVisivel}
        onBackdropPress={cancelarEdicao}
        overlayStyle={styles.modalOverlay}
        animationType="slide"
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Editar Perfil</Text>
                <TouchableOpacity onPress={cancelarEdicao}>
                  <Icon name="close" type="material" size={24} color={theme.colors.gray700} />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Nome *</Text>
                <TextInput
                  style={styles.input}
                  value={dadosEdicao.nome || ''}
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
                  value={dadosEdicao.email || ''}
                  editable={false}
                />
                <Text style={styles.inputHint}>E-mail não pode ser alterado</Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Telefone</Text>
                <TextInput
                  style={styles.input}
                  value={dadosEdicao.telefone || ''}
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
                  value={dadosEdicao.dataNascimento || ''}
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
                  value={dadosEdicao.endereco.cep || ''}
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
                  value={dadosEdicao.endereco.logradouro || ''}
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
                  value={dadosEdicao.endereco.numero || ''}
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
                  value={dadosEdicao.endereco.bairro || ''}
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
                  value={dadosEdicao.endereco.cidade || ''}
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
                  value={dadosEdicao.endereco.estado || ''}
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
                  value={dadosEdicao.endereco.complemento || ''}
                  onChangeText={(text) => atualizarEndereco('complemento', text)}
                  placeholder="Apartamento, bloco, etc."
                  placeholderTextColor={theme.colors.gray400}
                  editable={!salvando}
                />
              </View>

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

export default TelaPerfil;