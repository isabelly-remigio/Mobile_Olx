import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { apiService } from '@/app/src/services/api';
import { theme } from '@/app/src/theme/theme'; // Importando o tema

const TelaResetarSenha = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string || '';
  
  const [token, setToken] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reenviando, setReenviando] = useState(false);

  const voltar = () => {
    router.push('/auth/EsqueceuSenha/esqueceuSenha');
  };

  const cancelar = () => {
    router.replace('/auth/Login/login');
  };

  const validarSenha = (senha: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(senha);
  };

  const reenviarToken = async () => {
    if (!email) return;

    try {
      setReenviando(true);
      await apiService.post('/auth/esqueci-senha', {
        email: email.toLowerCase().trim()
      });
      
      Alert.alert('✅', 'Novo token enviado para seu e-mail.');
      
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível reenviar o token.');
    } finally {
      setReenviando(false);
    }
  };

   const resetarSenha = async () => {
    // Validação básica - ALTERADO para verificar se tem pelo menos 6 caracteres em vez de exatamente 6
    if (!token.trim() || token.trim().length < 6) {
      Alert.alert('Erro', 'Token deve ter pelo menos 6 caracteres');
      return;
    }

    if (!validarSenha(novaSenha)) {
      Alert.alert('Erro', 'Senha deve ter pelo menos 8 caracteres com letras e números');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não conferem');
      return;
    }

    try {
      setLoading(true);
      
      console.log('🔄 Tentando redefinir senha com:', {
        token: token.trim(),
        tokenLength: token.trim().length,
        novaSenha: novaSenha.trim()
      });
      
      const response = await apiService.post('/auth/resetar-senha', {
        token: token.trim(),
        novaSenha: novaSenha.trim()
      });
      
      console.log('✅ Resposta da API:', response);
      
      Alert.alert(
        '🎉 Senha redefinida!',
        'Faça login com sua nova senha.',
        [{ 
          text: 'OK', 
          onPress: () => router.replace('/auth/Login/login') 
        }]
      );
      
    } catch (error: any) {
      console.error('❌ Erro ao redefinir senha:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      let errorMessage = 'Não foi possível redefinir a senha.';
      let tokenInvalido = false;
      
      if (error.response?.status === 400) {
        errorMessage = 'Token inválido ou expirado.';
        tokenInvalido = true;
      } else if (error.response?.status === 404) {
        errorMessage = 'Token não encontrado ou já utilizado.';
        tokenInvalido = true;
      } else if (error.response?.status === 500) {
        errorMessage = 'Erro no servidor. Tente novamente.';
      }
      
      Alert.alert(
        'Erro',
        errorMessage,
        tokenInvalido ? [
          { text: 'OK', style: 'default' },
          { 
            text: 'Reenviar Token', 
            onPress: reenviarToken
          }
        ] : [
          { text: 'OK', style: 'default' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

const formValido = token.length >= 6 && validarSenha(novaSenha) && novaSenha === confirmarSenha;
  // Estilos inline usando o tema
  const styles = {
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    header: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
    },
    titulo: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: theme.colors.primary[500], // Roxo do tema
    },
    cancelButtonText: {
      color: theme.colors.primary[500], // Roxo do tema
      fontWeight: '500' as const,
    },
    botaoPrincipal: {
      backgroundColor: formValido ? theme.colors.secondary[500] : '#FBBF24', // Laranja do tema quando válido
      borderRadius: 8,
      paddingVertical: 16,
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={voltar} style={{ padding: 8 }}>
          <Icon name="arrow-back" size={24} color= '#374151' />
        </TouchableOpacity>
        
        <Text style={styles.titulo}>
          Redefinir Senha
        </Text>
        
        <TouchableOpacity onPress={cancelar} style={{ padding: 8 }}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Instruções */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Icon 
            name="lock-reset" 
            type="material-community" 
            color={theme.colors.primary[500]} 
            size={40}
            containerStyle={{ marginBottom: 16 }}
          />
          
          <Text style={{ 
            fontSize: 18, 
            fontWeight: '600', 
            color: theme.colors.gray900, // Roxo do tema
            textAlign: 'center',
            marginBottom: 8
          }}>
            Digite o token e sua nova senha
          </Text>
          
          {email && (
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginBottom: 8 
            }}>
              <Icon name="email" size={16} color={theme.colors.gray400} />
              <Text style={{ 
                marginLeft: 6, 
                color: theme.colors.gray400, // Roxo do tema
                fontSize: 14,
                fontWeight: '500'
              }}>
                {email}
              </Text>
            </View>
          )}
          
          {email && (
            <TouchableOpacity 
              onPress={reenviarToken}
              disabled={reenviando}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center',
                marginTop: 8
              }}
            >
              {reenviando ? (
                <ActivityIndicator size="small" color={theme.colors.primary[500]} /> // Laranja do tema
              ) : (
                <Icon name="refresh" size={16} color={theme.colors.primary[500]} /> // Laranja do tema
              )}
              <Text style={{ 
                marginLeft: 4, 
                color: theme.colors.primary[500], // Laranja do tema
                fontWeight: '500',
                fontSize: 14
              }}>
                {reenviando ? 'Enviando...' : 'Reenviar token'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Campo Token */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            fontSize: 14, 
            fontWeight: '500', 
            color: theme.colors.gray500, // Roxo do tema
            marginBottom: 6
          }}>
            Token
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: token.length === 6 ? '#10B981' : '#D1D5DB',
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              backgroundColor: '#F9FAFB'
            }}
            placeholder="Token de 6 dígitos"
            placeholderTextColor="#9CA3AF"
            value={token}
            onChangeText={setToken}
            keyboardType="number-pad"
            maxLength={6}
            autoCapitalize="none"
            editable={!loading}
          />
          <Text style={{ 
            fontSize: 12, 
            color: theme.colors.gray400, // Roxo do tema
            marginTop: 4
          }}>
            Digite os 6 dígitos recebidos por e-mail
          </Text>
        </View>

        {/* Campo Nova Senha */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            fontSize: 14, 
            fontWeight: '500', 
            color: theme.colors.gray500, // Roxo do tema
            marginBottom: 6
          }}>
            Nova Senha
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: validarSenha(novaSenha) ? '#10B981' : '#D1D5DB',
            borderRadius: 8,
            backgroundColor: '#F9FAFB'
          }}>
            <TextInput
              style={{
                flex: 1,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
              }}
              placeholder="Digite sua nova senha"
              placeholderTextColor="#9CA3AF"
              value={novaSenha}
              onChangeText={setNovaSenha}
              secureTextEntry={!mostrarSenha}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setMostrarSenha(!mostrarSenha)}
              style={{ paddingHorizontal: 12 }}
            >
              <Icon 
                name={mostrarSenha ? "eye-off" : "eye"} 
                type="material-community"
                size={20}
                color={theme.colors.primary[500]} // Roxo do tema
              />
            </TouchableOpacity>
          </View>
          {novaSenha && !validarSenha(novaSenha) && (
            <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>
              Mínimo 8 caracteres com letras e números
            </Text>
          )}
        </View>

        {/* Campo Confirmar Senha */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ 
            fontSize: 14, 
            fontWeight: '500', 
            color: theme.colors.gray500, // Roxo do tema
            marginBottom: 6
          }}>
            Confirmar Senha
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: confirmarSenha && novaSenha === confirmarSenha ? '#10B981' : '#D1D5DB',
            borderRadius: 8,
            backgroundColor: '#F9FAFB'
          }}>
            <TextInput
              style={{
                flex: 1,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
              }}
              placeholder="Confirme sua nova senha"
              placeholderTextColor="#9CA3AF"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={!mostrarConfirmarSenha}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
              style={{ paddingHorizontal: 12 }}
            >
              <Icon 
                name={mostrarConfirmarSenha ? "eye-off" : "eye"} 
                type="material-community"
                size={20}
                color={theme.colors.primary[500]} // Roxo do tema
              />
            </TouchableOpacity>
          </View>
          {confirmarSenha && novaSenha !== confirmarSenha && (
            <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>
              As senhas não conferem
            </Text>
          )}
        </View>

        {/* Botão Principal */}
        <Button
          title={loading ? "Processando..." : "Redefinir Senha"}
          onPress={resetarSenha}
          disabled={loading || !formValido}
          loading={loading}
          buttonStyle={styles.botaoPrincipal}
          titleStyle={{
            fontSize: 16,
            fontWeight: '600',
          }}
        />

        {/* Ajuda */}
        <TouchableOpacity
          onPress={() => Alert.alert(
            'Ajuda',
            '• Verifique sua caixa de spam\n• Token tem 6 dígitos\n• Expira em 15 minutos\n• Reenvie se necessário'
          )}
          style={{ 
            flexDirection: 'row', 
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 24
          }}
        >
          <Icon name="help-circle" type="material-community" size={16} color={theme.colors.primary[500]} />
          <Text style={{ 
            marginLeft: 6, 
            color: theme.colors.primary[500], // Roxo do tema
            fontSize: 14
          }}>
            Precisa de ajuda?
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TelaResetarSenha;