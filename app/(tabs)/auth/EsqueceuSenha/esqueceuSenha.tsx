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
import styles from '@/app/src/styles/EsqueceuSenha/TelaEsqueciSenhaStyles';

const TelaEsqueciSenha = () => {
  const router = useRouter(); 
  const [email, setEmail] = useState('');

  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const emailValido = validarEmail(email);

  const voltar = () => {
    router.push('/auth/Login/login');
  };

  const enviarEmail = () => {
    if (emailValido) {
      Alert.alert('Sucesso', `E-mail de recuperação enviado para ${email}`);
    }
    router.push('/auth/Verificacao/verificacao');
  };

  const handleSubmitEditing = () => {
    if (emailValido) {
      enviarEmail();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header com navegação */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={voltar}
          >
            <Icon 
              name="arrow-back" 
              type="material" 
              color="#374151" // gray.700
              size={24}
            />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>
            Esqueci minha senha
          </Text>
          
          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>
              Qual o e-mail da conta?
            </Text>
            <Text style={styles.subtitle}>
              Um e-mail de confirmação será enviado para criar sua nova senha.
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              E-mail
            </Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={true}
              returnKeyType="done"
              onSubmitEditing={handleSubmitEditing}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Enviar e-mail"
            buttonStyle={[
              styles.submitButton, 
              !emailValido && styles.disabledButton
            ]}
            titleStyle={[
              styles.submitButtonText, 
              !emailValido && styles.disabledButtonText
            ]}
            onPress={enviarEmail}
            disabled={!emailValido}
            disabledStyle={styles.disabledButton}
            disabledTitleStyle={styles.disabledButtonText}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default TelaEsqueciSenha;