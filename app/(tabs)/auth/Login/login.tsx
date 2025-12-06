import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert 
} from 'react-native';
import { Icon,Button } from '@rneui/themed';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from '@/app/src/styles/TelaLogin/TelaLoginStyles';

const TelaLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const validarEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const podeEntrar = () => validarEmail(email) && senha.length >= 1;

  const voltar = () => router.back();
  const entrar = () => podeEntrar() ? router.push('/(tabs)') : Alert.alert('Erro', 'Dados inválidos');
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
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
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
                  style={styles.passwordInput}
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
            </View>

            <Button
              title="Entrar"
              buttonStyle={[styles.loginButton, !podeEntrar() && styles.disabledButton]}
              titleStyle={styles.loginButtonText}
              onPress={entrar}
              disabled={!podeEntrar()}
              disabledStyle={styles.disabledButton}
              disabledTitleStyle={styles.disabledText}
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