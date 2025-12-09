import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Icon, Button } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/src/context/AuthContext';
import styles from '@/app/src/styles/TelaLogin/TelaLoginStyles';

const TelaLogin = () => {
  const router = useRouter();
  const { signIn, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loginEmProgresso, setLoginEmProgresso] = useState(false);

  const validarEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const podeEntrar = () => validarEmail(email) && senha.length >= 6;

  const voltar = () => router.back();

  const entrar = async () => {
    if (!podeEntrar()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos corretamente.');
      return;
    }

    setLoginEmProgresso(true);
    try {
      await signIn(email, senha);
      // O redirecionamento para home será feito automaticamente pelo AuthContext
      // ou pelo layout principal após o login bem-sucedido
    } catch (error: any) {
      // Mostrar mensagem de erro específica da API
      Alert.alert(
        'Erro no login',
        error.message || 'Não foi possível fazer login. Verifique suas credenciais.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoginEmProgresso(false);
    }
  };

  const loginGoogle = () => Alert.alert('Info', 'Login com Google');
  const loginFacebook = () => Alert.alert('Info', 'Login com Facebook');
  const abrirTermos = () => Alert.alert('Info', 'Abrindo Termos de Uso...');
  const abrirPrivacidade = () => Alert.alert('Info', 'Abrindo Política de Privacidade...');

  const irParaCadastro = () => {
    router.push('/auth/Cadastro/cadastro');
  };

  const esqueceuSenha = () => {
    router.push('/auth/EsqueceuSenha/esqueceuSenha');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={voltar}
        >
          <Icon 
            name="arrow-back" 
            type="material" 
            color="#FFFFFF"
            size={24}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Entrar</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={[
                  styles.input,
                  email && !validarEmail(email) && styles.inputError
                ]}
                placeholder="seu@email.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {email && !validarEmail(email) && (
                <Text style={styles.errorText}>E-mail inválido</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.passwordHeader}>
                <Text style={styles.label}>Senha</Text>
                <TouchableOpacity onPress={esqueceuSenha}>
                  <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    senha.length > 0 && senha.length < 6 && styles.inputError
                  ]}
                  placeholder="Sua senha"
                  placeholderTextColor="#9CA3AF"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!mostrarSenha}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setMostrarSenha(!mostrarSenha)}
                >
                  <Icon 
                    name={mostrarSenha ? 'visibility' : 'visibility-off'} 
                    type="material" 
                    color="#6B7280"
                    size={20}
                  />
                </TouchableOpacity>
              </View>
              {senha.length > 0 && senha.length < 6 && (
                <Text style={styles.errorText}>A senha deve ter pelo menos 6 caracteres</Text>
              )}
            </View>

            <Button
              title={loginEmProgresso ? "Entrando..." : "Entrar"}
              buttonStyle={[styles.loginButton, !podeEntrar() && styles.disabledButton]}
              titleStyle={styles.loginButtonText}
              onPress={entrar}
              disabled={!podeEntrar() || loginEmProgresso || loading}
              disabledStyle={styles.disabledButton}
              disabledTitleStyle={styles.disabledText}
              icon={loginEmProgresso ? <ActivityIndicator color="#FFFFFF" size="small" /> : undefined}
            />
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Ou conecte com</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity 
              style={styles.socialButtonGoogle}
              onPress={loginGoogle}
            >
              <Text style={styles.socialButtonText}>G</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialButtonFacebook}
              onPress={loginFacebook}
            >
              <Text style={styles.socialButtonText}>f</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Não tem uma conta? </Text>
            <TouchableOpacity onPress={irParaCadastro}>
              <Text style={styles.registerLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              Ao continuar, você concorda com os{' '}
              <Text style={styles.termsLink} onPress={abrirTermos}>
                Termos de Uso
              </Text>
              {' '}e a{' '}
              <Text style={styles.termsLink} onPress={abrirPrivacidade}>
                Política de Privacidade
              </Text>
              {' '}da OLX e seus parceiros.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default TelaLogin;