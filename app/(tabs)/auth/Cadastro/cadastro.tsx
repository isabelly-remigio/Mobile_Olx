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
  Alert,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/src/context/AuthContext';
import { TelaCadastroStyles } from '@/app/src/styles/TelaCadastro/TelaCadastroStyles';
import { theme } from '@/app/src/theme/theme';

const TelaCadastro = () => {
  const router = useRouter();
  const { savePersonalData } = useAuth();

  const [nome, setNome] = useState('');
  const [tipoConta, setTipoConta] = useState('fisica');
  const [documento, setDocumento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // -----------------------------
  // Funções de formatação
  // -----------------------------
  const formatarDocumento = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    
    if (tipoConta === 'fisica') {
      return apenasNumeros
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      return apenasNumeros
        .slice(0, 14)
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
  };

  const formatarTelefone = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    
    if (apenasNumeros.length <= 10) {
      return apenasNumeros
        .slice(0, 10)
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      return apenasNumeros
        .slice(0, 11)
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
  };

 const formatarDataNascimento = (valor: string) => {
  const apenasNumeros = valor.replace(/\D/g, '').slice(0, 8);

  if (apenasNumeros.length <= 2) {
    return apenasNumeros;
  } else if (apenasNumeros.length <= 4) {
    return apenasNumeros.replace(/(\d{2})(\d{1,2})/, '$1/$2');
  } else {
    return apenasNumeros.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
  }
};

  React.useEffect(() => {
    setDocumento('');
  }, [tipoConta]);

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

  const validarDocumento = () => {
    const apenasNumeros = documento.replace(/\D/g, '');
    
    if (tipoConta === 'fisica') {
      return apenasNumeros.length === 11;
    } else {
      return apenasNumeros.length === 14;
    }
  };

  const validarTelefone = () => {
    const apenasNumeros = telefone.replace(/\D/g, '');
    return apenasNumeros.length === 10 || apenasNumeros.length === 11;
  };

  const validarDataNascimento = () => {
    if (!dataNascimento) return false;
    const partes = dataNascimento.split('/');
    if (partes.length !== 3) return false;
    
    const [dia, mes, ano] = partes;
    const data = new Date(`${ano}-${mes}-${dia}`);
    return data instanceof Date && !isNaN(data.getTime());
  };

  const podeEnviar = () =>
    nome.trim() &&
    validarDocumento() &&
    validarEmail(email) &&
    validarTelefone() &&
    validarDataNascimento() &&
    senha.length >= 6 &&
    senha === confirmarSenha;

  // -----------------------------
  // Ações
  // -----------------------------
  const cadastrar = async () => {
    if (!podeEnviar()) return;

    console.log('📝 [CADASTRO] Iniciando processo de cadastro...');
    console.log('📝 [CADASTRO] Dados coletados:');
    console.log('- Nome:', nome);
    console.log('- Email:', email);
    console.log('- CPF/CNPJ:', documento);
    console.log('- Telefone:', telefone);
    console.log('- Data Nascimento:', dataNascimento);

    setCarregando(true);
    try {
      // Converter data de DD/MM/AAAA para AAAA-MM-DD
      const [dia, mes, ano] = dataNascimento.split('/');
    const dataNascimentoFormatada = `${dia}/${mes}/${ano}`;
      const dadosPessoais = { 
        nome, 
        email,
        senha,
        cpfCnpj: documento,
        telefone: telefone,
        dataNascimento: dataNascimentoFormatada
      };

      console.log('💾 [CADASTRO] Salvando dados pessoais no contexto...');
      console.log('💾 [CADASTRO] Dados formatados para envio:', {
        ...dadosPessoais,
        senha: '***'
      });

      savePersonalData(dadosPessoais);
      
      console.log('✅ [CADASTRO] Dados salvos com sucesso!');
      console.log('➡️ [CADASTRO] Redirecionando para tela de endereço...');
      
      router.push('/auth/Cadastro/endereco');
    } catch (error) {
      console.error('❌ [CADASTRO] Erro ao salvar dados:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados. Tente novamente.');
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

            {/* CPF/CNPJ */}
            <View>
              <Text style={TelaCadastroStyles.inputLabel}>
                {tipoConta === 'fisica' ? 'CPF' : 'CNPJ'}
              </Text>
              <TextInput
                style={[
                  TelaCadastroStyles.input,
                  focusedInput === 'documento' && TelaCadastroStyles.focusedInput,
                  !validarDocumento() && documento && TelaCadastroStyles.errorInput,
                ]}
                placeholder={tipoConta === 'fisica' ? "000.000.000-00" : "00.000.000/0000-00"}
                value={documento}
                onChangeText={(v) => setDocumento(formatarDocumento(v))}
                keyboardType="numeric"
                maxLength={tipoConta === 'fisica' ? 14 : 18}
                onFocus={() => setFocusedInput('documento')}
                onBlur={() => setFocusedInput(null)}
              />
              {documento && !validarDocumento() && (
                <View style={TelaCadastroStyles.validationContainer}>
                  <Icon
                    name="error"
                    type="material"
                    size={16}
                    color={theme.colors.error}
                  />
                  <Text style={[TelaCadastroStyles.validationText, { color: theme.colors.error }]}>
                    {tipoConta === 'fisica' 
                      ? 'CPF inválido (11 dígitos necessários)' 
                      : 'CNPJ inválido (14 dígitos necessários)'}
                  </Text>
                </View>
              )}
            </View>

            {/* Email */}
            <View>
              <Text style={TelaCadastroStyles.inputLabel}>E-mail</Text>
              <TextInput
                style={[
                  TelaCadastroStyles.input,
                  focusedInput === 'email' && TelaCadastroStyles.focusedInput,
                  !validarEmail(email) && email && TelaCadastroStyles.errorInput,
                ]}
                placeholder="seuemail@exemplo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
              />
              {email && !validarEmail(email) && (
                <View style={TelaCadastroStyles.validationContainer}>
                  <Icon
                    name="error"
                    type="material"
                    size={16}
                    color={theme.colors.error}
                  />
                  <Text style={[TelaCadastroStyles.validationText, { color: theme.colors.error }]}>
                    E-mail inválido
                  </Text>
                </View>
              )}
            </View>

            {/* Telefone */}
            <View>
              <Text style={TelaCadastroStyles.inputLabel}>Telefone</Text>
              <TextInput
                style={[
                  TelaCadastroStyles.input,
                  focusedInput === 'telefone' && TelaCadastroStyles.focusedInput,
                  !validarTelefone() && telefone && TelaCadastroStyles.errorInput,
                ]}
                placeholder="(00) 00000-0000"
                value={telefone}
                onChangeText={(v) => setTelefone(formatarTelefone(v))}
                keyboardType="phone-pad"
                maxLength={15}
                onFocus={() => setFocusedInput('telefone')}
                onBlur={() => setFocusedInput(null)}
              />
              {telefone && !validarTelefone() && (
                <View style={TelaCadastroStyles.validationContainer}>
                  <Icon
                    name="error"
                    type="material"
                    size={16}
                    color={theme.colors.error}
                  />
                  <Text style={[TelaCadastroStyles.validationText, { color: theme.colors.error }]}>
                    Telefone inválido (10 ou 11 dígitos)
                  </Text>
                </View>
              )}
              <Text style={TelaCadastroStyles.helperText}>
                Usaremos para contato sobre suas compras e vendas
              </Text>
            </View>

            {/* Data de Nascimento */}
            <View>
              <Text style={TelaCadastroStyles.inputLabel}>Data de Nascimento</Text>
              <TextInput
                style={[
                  TelaCadastroStyles.input,
                  focusedInput === 'dataNascimento' && TelaCadastroStyles.focusedInput,
                  !validarDataNascimento() && dataNascimento && TelaCadastroStyles.errorInput,
                ]}
                placeholder="DD/MM/AAAA"
                value={dataNascimento}
                onChangeText={(v) => setDataNascimento(formatarDataNascimento(v))}
                keyboardType="numeric"
                maxLength={10}
                onFocus={() => setFocusedInput('dataNascimento')}
                onBlur={() => setFocusedInput(null)}
              />
              {dataNascimento && !validarDataNascimento() && (
                <View style={TelaCadastroStyles.validationContainer}>
                  <Icon
                    name="error"
                    type="material"
                    size={16}
                    color={theme.colors.error}
                  />
                  <Text style={[TelaCadastroStyles.validationText, { color: theme.colors.error }]}>
                    Data inválida (DD/MM/AAAA)
                  </Text>
                </View>
              )}
              <Text style={TelaCadastroStyles.helperText}>
                Para verificação de idade
              </Text>
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
                  {carregando ? 'Salvando...' : 'Continuar'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Link para login */}
            <View style={TelaCadastroStyles.loginLinkContainer}>
              <Text style={TelaCadastroStyles.loginText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/Login/login')}>
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