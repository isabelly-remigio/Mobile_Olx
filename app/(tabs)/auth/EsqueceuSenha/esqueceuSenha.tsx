import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  SafeAreaView
} from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { apiService } from '@/app/src/services/api';
import styles from '@/app/src/styles/EsqueceuSenha/TelaEsqueciSenhaStyles';

const TelaEsqueciSenha = () => {
  const router = useRouter(); 
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);

  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const emailValido = validarEmail(email);

  const voltar = () => {
    router.replace('/auth/Login/login');
  };

  const enviarEmail = async () => {
    if (!emailValido) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    try {
      setLoading(true);
      await apiService.post('/auth/esqueci-senha', {
        email: email.toLowerCase().trim()
      });
      setEmailEnviado(true);
      
    } catch (error: any) {
      if (error.response?.status === 404) {
        Alert.alert('E-mail não encontrado', 'Este e-mail não está cadastrado.');
      } else {
        Alert.alert('Erro', 'Não foi possível enviar o e-mail.');
      }
    } finally {
      setLoading(false);
    }
  };

  const irParaRedefinirSenha = () => {
    router.push({
      pathname: '/auth/EsqueceuSenha/redefinir-senha',
      params: { email }
    });
  };

  // TELA DE SUCESSO - SIMPLES
  if (emailEnviado) {
    return (
      <SafeAreaView style={[styles.container, { padding: 20 }]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          
          {/* Ícone simples */}
          <Icon 
            name="check-circle" 
            type="material" 
            color="#10B981" 
            size={64}
            style={{ marginBottom: 24 }}
          />
          
          {/* Título simples */}
          <Text style={{ 
            fontSize: 22, 
            fontWeight: '600', 
            color: '#1F2937',
            textAlign: 'center',
            marginBottom: 8
          }}>
            E-mail enviado
          </Text>
          
          {/* Mensagem simples */}
          <Text style={{ 
            fontSize: 16, 
            color: '#6B7280',
            textAlign: 'center',
            marginBottom: 32,
            lineHeight: 24
          }}>
            Enviamos um token de 6 dígitos para:
          </Text>
          
          {/* E-mail destacado */}
          <View style={{ 
            backgroundColor: '#F3F4F6', 
            padding: 16,
            borderRadius: 8,
            marginBottom: 32,
            alignSelf: 'stretch'
          }}>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: '500', 
              color: '#374151',
              textAlign: 'center'
            }}>
              {email}
            </Text>
          </View>
          
          {/* Instrução única */}
          <Text style={{ 
            fontSize: 14, 
            color: '#6B7280',
            textAlign: 'center',
            marginBottom: 32
          }}>
            Verifique sua caixa de entrada e use o token para continuar.
          </Text>
          
          {/* Botão único */}
          <Button
            title="Continuar"
            buttonStyle={{
              backgroundColor: '#3B82F6',
              borderRadius: 8,
              paddingVertical: 16,
              paddingHorizontal: 32
            }}
            titleStyle={{
              fontSize: 16,
              fontWeight: '600'
            }}
            onPress={irParaRedefinirSenha}
            containerStyle={{ alignSelf: 'stretch' }}
          />
          
          {/* Opção de reenviar */}
          <TouchableOpacity 
            style={{ marginTop: 24 }}
            onPress={enviarEmail}
          >
            <Text style={{ 
              color: '#3B82F6',
              fontSize: 14
            }}>
              Reenviar e-mail
            </Text>
          </TouchableOpacity>
          
        </View>
      </SafeAreaView>
    );
  }

  // TELA ORIGINAL - TAMBÉM SIMPLIFICADA
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header limpo */}
        <View style={styles.header}>
          <TouchableOpacity onPress={voltar}>
            <Icon name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Esqueci minha senha</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Conteúdo limpo */}
        <View style={[styles.content, { paddingHorizontal: 20 }]}>
          <Text style={[styles.mainTitle, { marginBottom: 8 }]}>
            Digite seu e-mail
          </Text>
          <Text style={[styles.subtitle, { marginBottom: 32 }]}>
            Enviaremos um token para redefinir sua senha
          </Text>

          <View>
            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput
              style={[
                styles.input,
                email && !emailValido && styles.inputError
              ]}
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
            {email && !emailValido && (
              <Text style={styles.errorText}>
                Digite um e-mail válido
              </Text>
            )}
          </View>
        </View>

        {/* Footer limpo */}
        <View style={[styles.footer, { padding: 20 }]}>
          <Button
            title={loading ? "Enviando..." : "Enviar"}
            buttonStyle={[
              styles.submitButton, 
              (!emailValido || loading) && styles.disabledButton
            ]}
            onPress={enviarEmail}
            disabled={!emailValido || loading}
            loading={loading}
            containerStyle={{ width: '100%' }}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default TelaEsqueciSenha;