// screens/auth/Cadastro/TelaCadastro.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/src/context/AuthContext';
import { TelaCadastroStyles } from '@/app/src/styles/TelaCadastro/TelaCadastroStyles';
import { theme } from '@/app/src/theme/theme';

const TelaCadastro = () => {
  const router = useRouter();
  const { salvarDadosPessoais } = useAuth();

  const [nome, setNome] = useState('');
  const [tipoConta, setTipoConta] = useState('fisica');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // -----------------------------
  // Funções utilitárias
  // -----------------------------
  const formatarCPF = (v: string) =>
    v
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  const validarEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validarSenha = (s: string) => {
    if (!s) return null;
    if (s.length < 6)
      return { valida: false, mensagem: 'Senha muito curta. Use pelo menos 6 caracteres.' };
    if (s.length < 10)
      return { valida: true, mensagem: 'Senha ok. Experimente colocar mais caracteres.' };
    return { valida: true, mensagem: 'Senha forte!' };
  };

  const validarConfirmacao = () =>
    !confirmarSenha
      ? null
      : senha === confirmarSenha
        ? { valida: true, mensagem: 'Senhas coincidem!' }
        : { valida: false, mensagem: 'As senhas não coincidem.' };

  const podeEnviar = () =>
    nome.trim() &&
    cpf.length >= 14 &&
    validarEmail(email) &&
    senha.length >= 6 &&
    senha === confirmarSenha;

  // -----------------------------
  // Ações
  // -----------------------------
  const cadastrar = async () => {
    if (!podeEnviar()) return;

    setCarregando(true);
    try {
      salvarDadosPessoais({ nome, tipoConta, cpf, email, senha });
      router.push('/auth/Cadastro/endereco');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    } finally {
      setCarregando(false);
    }
  };

  const statusSenha = validarSenha(senha);
  const statusConfirmacao = validarConfirmacao();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView style={TelaCadastroStyles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={TelaCadastroStyles.content}>
          {/* Header */}
          <View style={TelaCadastroStyles.header}>
            <TouchableOpacity
              style={TelaCadastroStyles.backButton}
              onPress={() => router.back()}
            >
              <Icon
                name="arrow-back"
                type="ionicon"
                size={24}
                color={theme.colors.gray700}
              />
            </TouchableOpacity>
            <Text style={TelaCadastroStyles.headerTitle}>Cadastrar</Text>
          </View>

          {/* Login social */}
          <View style={TelaCadastroStyles.socialSection}>
            <Text style={TelaCadastroStyles.socialTitle}>Conecte com</Text>
            <View style={TelaCadastroStyles.socialButtonsContainer}>
              {/* Google */}
              <TouchableOpacity onPress={() => alert('Login Google')}>
                <View style={[TelaCadastroStyles.socialButton, TelaCadastroStyles.googleButton]}>
                  <Text style={TelaCadastroStyles.socialButtonText}>G</Text>
                </View>
              </TouchableOpacity>

              {/* Facebook */}
              <TouchableOpacity onPress={() => alert('Login Facebook')}>
                <View style={[TelaCadastroStyles.socialButton, TelaCadastroStyles.facebookButton]}>
                  <Text style={TelaCadastroStyles.socialButtonText}>f</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Divider */}
          <View style={TelaCadastroStyles.dividerContainer}>
            <View style={TelaCadastroStyles.dividerLine} />
            <Text style={TelaCadastroStyles.dividerText}>ou</Text>
            <View style={TelaCadastroStyles.dividerLine} />
          </View>

          <Text style={TelaCadastroStyles.infoText}>
            Nos informe alguns dados para melhorar sua experiência.
          </Text>

          {/* Formulário */}
          <View style={TelaCadastroStyles.formSection}>
            {/* Nome */}
            <View>
              <Text style={TelaCadastroStyles.inputLabel}>
                Como você quer ser chamado(a)?
              </Text>
              <TextInput
                style={[
                  TelaCadastroStyles.input,
                  focusedInput === 'nome' && TelaCadastroStyles.focusedInput,
                ]}
                placeholder="Digite seu nome"
                value={nome}
                onChangeText={setNome}
                onFocus={() => setFocusedInput('nome')}
                onBlur={() => setFocusedInput(null)}
              />
              <Text style={TelaCadastroStyles.helperText}>
                Aparecerá no perfil e anúncios.
              </Text>
            </View>

            {/* Tipo conta */}
            <View>
              <Text style={TelaCadastroStyles.inputLabel}>
                Escolha o tipo da sua conta
              </Text>
              <View style={TelaCadastroStyles.accountTypeContainer}>
                {[
                  { key: 'fisica', label: 'Pessoa física' },
                  { key: 'juridica', label: 'Pessoa jurídica' },
                ].map((opt) => (
                  <TouchableOpacity
                    key={opt.key}
                    style={[
                      TelaCadastroStyles.accountTypeButton,
                      tipoConta === opt.key
                        ? TelaCadastroStyles.selectedAccountType
                        : TelaCadastroStyles.unselectedAccountType,
                    ]}
                    onPress={() => setTipoConta(opt.key)}
                  >
                    <View style={TelaCadastroStyles.accountTypeContent}>
                      <View
                        style={[
                          TelaCadastroStyles.radioCircle,
                          tipoConta === opt.key
                            ? TelaCadastroStyles.selectedRadioCircle
                            : TelaCadastroStyles.unselectedRadioCircle,
                        ]}
                      >
                        {tipoConta === opt.key && (
                          <View style={TelaCadastroStyles.radioInnerCircle} />
                        )}
                      </View>
                      <Text
                        style={[
                          TelaCadastroStyles.accountTypeText,
                          tipoConta === opt.key
                            ? TelaCadastroStyles.selectedAccountTypeText
                            : TelaCadastroStyles.unselectedAccountTypeText,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* CPF */}
            <View>
              <Text style={TelaCadastroStyles.inputLabel}>CPF</Text>
              <TextInput
                style={[
                  TelaCadastroStyles.input,
                  focusedInput === 'cpf' && TelaCadastroStyles.focusedInput,
                ]}
                placeholder="000.000.000-00"
                value={cpf}
                onChangeText={(v) => setCpf(formatarCPF(v))}
                keyboardType="numeric"
                maxLength={14}
                onFocus={() => setFocusedInput('cpf')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            {/* Email */}
            <View>
              <Text style={TelaCadastroStyles.inputLabel}>E-mail</Text>
              <TextInput
                style={[
                  TelaCadastroStyles.input,
                  focusedInput === 'email' && TelaCadastroStyles.focusedInput,
                ]}
                placeholder="seuemail@exemplo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            {/* Senha */}
            <View>
              <Text style={TelaCadastroStyles.inputLabel}>Senha</Text>
              <View style={TelaCadastroStyles.passwordInputContainer}>
                <TextInput
                  style={[
                    TelaCadastroStyles.passwordInput,
                    focusedInput === 'senha' && TelaCadastroStyles.focusedInput,
                  ]}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!mostrarSenha}
                  onFocus={() => setFocusedInput('senha')}
                  onBlur={() => setFocusedInput(null)}
                />
                <TouchableOpacity
                  style={TelaCadastroStyles.passwordToggleButton}
                  onPress={() => setMostrarSenha(!mostrarSenha)}
                >
                  <Icon
                    name={mostrarSenha ? 'visibility' : 'visibility-off'}
                    type="material"
                    size={20}
                    color={theme.colors.gray500}
                  />
                </TouchableOpacity>
              </View>
              {statusSenha && (
                <View style={TelaCadastroStyles.validationContainer}>
                  <Icon
                    name={statusSenha.valida ? 'check-circle' : 'info'}
                    type="material"
                    size={16}
                    color={statusSenha.valida ? theme.colors.success : theme.colors.warning}
                  />
                  <Text
                    style={[
                      TelaCadastroStyles.validationText,
                      { color: statusSenha.valida ? theme.colors.gray600 : theme.colors.warning },
                    ]}
                  >
                    {statusSenha.mensagem}
                  </Text>
                </View>
              )}
            </View>

            {/* Confirmar senha */}
            <View>
              <Text style={TelaCadastroStyles.inputLabel}>Confirmar senha</Text>
              <View style={TelaCadastroStyles.passwordInputContainer}>
                <TextInput
                  style={[
                    TelaCadastroStyles.passwordInput,
                    focusedInput === 'confirmarSenha' && TelaCadastroStyles.focusedInput,
                  ]}
                  placeholder="Digite sua senha novamente"
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  secureTextEntry={!mostrarConfirmarSenha}
                  onFocus={() => setFocusedInput('confirmarSenha')}
                  onBlur={() => setFocusedInput(null)}
                />
                <TouchableOpacity
                  style={TelaCadastroStyles.passwordToggleButton}
                  onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                >
                  <Icon
                    name={mostrarConfirmarSenha ? 'visibility' : 'visibility-off'}
                    type="material"
                    size={20}
                    color={theme.colors.gray500}
                  />
                </TouchableOpacity>
              </View>
              {statusConfirmacao && (
                <View style={TelaCadastroStyles.validationContainer}>
                  <Icon
                    name={statusConfirmacao.valida ? 'check-circle' : 'error'}
                    type="material"
                    size={16}
                    color={statusConfirmacao.valida ? theme.colors.success : theme.colors.error}
                  />
                  <Text
                    style={[
                      TelaCadastroStyles.validationText,
                      {
                        color: statusConfirmacao.valida
                          ? theme.colors.gray600
                          : theme.colors.error,
                      },
                    ]}
                  >
                    {statusConfirmacao.mensagem}
                  </Text>
                </View>
              )}
            </View>

            {/* Botão de cadastro */}
            <TouchableOpacity
              style={[
                TelaCadastroStyles.registerButton,
                (!podeEnviar() || carregando) && TelaCadastroStyles.disabledButton,
              ]}
              onPress={cadastrar}
              disabled={!podeEnviar() || carregando}
              activeOpacity={0.8}
            >
              {carregando ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <Text
                  style={[
                    TelaCadastroStyles.registerButtonText,
                    (!podeEnviar() || carregando) && TelaCadastroStyles.disabledButtonText,
                  ]}
                >
                  {carregando ? 'Salvando...' : 'Cadastrar-se'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Link para login */}
            <View style={TelaCadastroStyles.loginLinkContainer}>
              <Text style={TelaCadastroStyles.loginText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text style={TelaCadastroStyles.loginLink}>Entrar</Text>
              </TouchableOpacity>
            </View>

            {/* Termos e condições */}
            <Text style={TelaCadastroStyles.termsText}>
              Ao continuar, você concorda com os{' '}
              <Text style={TelaCadastroStyles.termsLink}>Termos de Uso</Text> e{' '}
              <Text style={TelaCadastroStyles.termsLink}>Política de Privacidade</Text>.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default TelaCadastro;