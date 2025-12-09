import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/app/src/context/AuthContext';
import { TelaVerificacaoEmailStyles } from '@/app/src/styles/TelaCadastro/TelaVerificacaoEmailStyles';
import { theme } from '@/app/src/theme/theme';

const TelaVerificacaoEmail = () => {
  const router = useRouter();
  const { verifyEmail, resendVerification, verificationLoading } = useAuth();
  const params = useLocalSearchParams();

  // Recebe o email dos parâmetros ou do contexto
  const email = params.email as string || '';
  
  const [tempoRestante, setTempoRestante] = useState(120);
  const [podeReenviar, setPodeReenviar] = useState(false);
  const [emailReenviado, setEmailReenviado] = useState(false);
  const [codigoVerificacao, setCodigoVerificacao] = useState('');
  const [codigoInput, setCodigoInput] = useState(['', '', '', '', '', '']);
  const [showSucessoModal, setShowSucessoModal] = useState(false);
  const [inputRefs, setInputRefs] = useState([]);

  // Contador regressivo
  useEffect(() => {
    if (tempoRestante > 0) {
      const timer = setTimeout(() => setTempoRestante((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setPodeReenviar(true);
    }
  }, [tempoRestante]);

  // Simular envio do código de verificação (em produção, a API enviaria)
  useEffect(() => {
    if (email) {
      console.log(`Código de verificação seria enviado para: ${email}`);
      // Em produção, a API enviaria o email automaticamente após o registro
    }
  }, [email]);

  const reenviarEmail = async () => {
    if (!email) {
      Alert.alert('Erro', 'Email não encontrado');
      return;
    }

    try {
      // Em produção, use a função resendVerification
      // await resendVerification(email);
      
      // Simulação
      setEmailReenviado(true);
      setTempoRestante(120);
      setPodeReenviar(false);
      
      console.log(`Email de verificação reenviado para: ${email}`);
      
      setTimeout(() => setEmailReenviado(false), 3000);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível reenviar o email');
    }
  };

  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  };

  const handleCodigoChange = (text: string, index: number) => {
    // Permitir apenas números
    const numericText = text.replace(/\D/g, '');
    
    if (numericText.length > 1) {
      // Se colar um código completo
      const codigoArray = numericText.split('').slice(0, 6);
      const newCodigoInput = [...codigoInput];
      codigoArray.forEach((char, idx) => {
        if (idx < 6) newCodigoInput[idx] = char;
      });
      setCodigoInput(newCodigoInput);
      
      // Focar no último campo
      if (codigoArray.length === 6) {
        const lastInput = inputRefs[5];
        if (lastInput) lastInput.focus();
      }
    } else {
      // Digitação normal
      const newCodigoInput = [...codigoInput];
      newCodigoInput[index] = numericText;
      setCodigoInput(newCodigoInput);
      
      // Mover para o próximo campo
      if (numericText && index < 5) {
        const nextInput = inputRefs[index + 1];
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Se pressionar backspace e o campo estiver vazio, voltar para o anterior
    if (e.nativeEvent.key === 'Backspace' && !codigoInput[index] && index > 0) {
      const prevInput = inputRefs[index - 1];
      if (prevInput) {
        prevInput.focus();
        const newCodigoInput = [...codigoInput];
        newCodigoInput[index - 1] = '';
        setCodigoInput(newCodigoInput);
      }
    }
  };

  const verificarCodigo = async () => {
    const codigoCompleto = codigoInput.join('');
    
    if (codigoCompleto.length !== 6) {
      Alert.alert('Código incompleto', 'Digite todos os 6 dígitos do código');
      return;
    }

    if (!email) {
      Alert.alert('Erro', 'Email não encontrado');
      return;
    }

    try {
      // Em produção, use a função verifyEmail
      // await verifyEmail(email, codigoCompleto);
      
      // Simulação de verificação bem-sucedida
      console.log(`Verificando código ${codigoCompleto} para email ${email}`);
      
      // Mostrar modal de sucesso
      setShowSucessoModal(true);
      
      // Em produção, após verificação bem-sucedida, redirecionar para login
      setTimeout(() => {
        setShowSucessoModal(false);
        router.replace('/auth/login');
      }, 3000);
      
    } catch (error: any) {
      Alert.alert(
        'Código inválido',
        error.message || 'O código de verificação está incorreto. Tente novamente.'
      );
      // Limpar campos em caso de erro
      setCodigoInput(['', '', '', '', '', '']);
      // Focar no primeiro campo
      const firstInput = inputRefs[0];
      if (firstInput) firstInput.focus();
    }
  };

  const voltar = () => {
    router.back();
  };

  const renderCodigoInputs = () => {
    return (
      <View style={TelaVerificacaoEmailStyles.codigoContainer}>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref && !inputRefs[index]) {
                const newRefs = [...inputRefs];
                newRefs[index] = ref;
                setInputRefs(newRefs);
              }
            }}
            style={[
              TelaVerificacaoEmailStyles.codigoInput,
              codigoInput[index] && TelaVerificacaoEmailStyles.codigoInputFilled,
            ]}
            value={codigoInput[index]}
            onChangeText={(text) => handleCodigoChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="numeric"
            maxLength={1}
            textAlign="center"
            autoFocus={index === 0}
          />
        ))}
      </View>
    );
  };

  return (
    <>
      <ScrollView
        style={TelaVerificacaoEmailStyles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={TelaVerificacaoEmailStyles.content}>
          {/* Header */}
          <View style={TelaVerificacaoEmailStyles.header}>
            <TouchableOpacity
              style={TelaVerificacaoEmailStyles.backButton}
              onPress={voltar}
            >
              <Icon
                name="arrow-back"
                type="ionicon"
                size={24}
                color={theme.colors.gray700}
              />
            </TouchableOpacity>
            <Text style={TelaVerificacaoEmailStyles.headerTitle}>
              Verificação E-mail
            </Text>
          </View>

          <View style={TelaVerificacaoEmailStyles.centeredContent}>
            <View style={TelaVerificacaoEmailStyles.innerContent}>
              <View style={TelaVerificacaoEmailStyles.titleSection}>
                <View style={TelaVerificacaoEmailStyles.iconContainer}>
                  <Icon
                    name="email"
                    type="material"
                    size={48}
                    color={theme.colors.primary[500]}
                  />
                </View>
                <Text style={TelaVerificacaoEmailStyles.title}>
                  Verifique seu e-mail
                </Text>
                <Text style={TelaVerificacaoEmailStyles.subtitle}>
                  Digite o código de 6 dígitos que enviamos para:
                </Text>
                <Text style={TelaVerificacaoEmailStyles.emailText}>
                  {email}
                </Text>
              </View>

              {/* Campo para inserir o código */}
              <View style={TelaVerificacaoEmailStyles.codigoSection}>
                <Text style={TelaVerificacaoEmailStyles.instructionText}>
                  Código de verificação
                </Text>
                {renderCodigoInputs()}
                <Text style={TelaVerificacaoEmailStyles.helperText}>
                  Digite os 6 dígitos do código recebido
                </Text>
              </View>

              <View style={TelaVerificacaoEmailStyles.infoSection}>
                <View style={TelaVerificacaoEmailStyles.resendSection}>
                  {emailReenviado && (
                    <View style={TelaVerificacaoEmailStyles.successMessage}>
                      <Icon
                        name="check-circle"
                        type="material"
                        size={20}
                        color={theme.colors.success}
                      />
                      <Text style={TelaVerificacaoEmailStyles.successText}>
                        E-mail reenviado com sucesso!
                      </Text>
                    </View>
                  )}

                  <Text style={TelaVerificacaoEmailStyles.resendText}>
                    Não recebeu o e-mail?
                  </Text>

                  {podeReenviar ? (
                    <TouchableOpacity 
                      onPress={reenviarEmail}
                      disabled={verificationLoading}
                    >
                      <Text style={TelaVerificacaoEmailStyles.resendLink}>
                        Reenviar código
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={TelaVerificacaoEmailStyles.timerContainer}>
                      <Text style={TelaVerificacaoEmailStyles.timerText}>
                        Reenviar em{' '}
                      </Text>
                      <Text
                        style={[
                          TelaVerificacaoEmailStyles.timerText,
                          { color: theme.colors.primary[500], fontWeight: 'bold' },
                        ]}
                      >
                        {formatarTempo(tempoRestante)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Botão de verificação */}
              <TouchableOpacity
                style={[
                  TelaVerificacaoEmailStyles.verifyButton,
                  (codigoInput.join('').length !== 6 || verificationLoading) && 
                  TelaVerificacaoEmailStyles.disabledButton,
                ]}
                onPress={verificarCodigo}
                disabled={codigoInput.join('').length !== 6 || verificationLoading}
                activeOpacity={0.8}
              >
                {verificationLoading ? (
                  <ActivityIndicator color={theme.colors.white} />
                ) : (
                  <Text style={TelaVerificacaoEmailStyles.verifyButtonText}>
                    Verificar Código
                  </Text>
                )}
              </TouchableOpacity>

              <Text style={TelaVerificacaoEmailStyles.termsText}>
                Ao verificar seu e-mail, você concorda com nossos{' '}
                <Text style={TelaVerificacaoEmailStyles.termsLink}>
                  Termos de Uso
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal de sucesso */}
      <Modal
        visible={showSucessoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSucessoModal(false)}
      >
        <View style={TelaVerificacaoEmailStyles.modalOverlay}>
          <View style={TelaVerificacaoEmailStyles.modalContent}>
            <View style={TelaVerificacaoEmailStyles.modalIconContainer}>
              <Icon
                name="check-circle"
                type="material"
                size={80}
                color={theme.colors.success}
              />
            </View>
            <Text style={TelaVerificacaoEmailStyles.modalTitle}>
              Conta Ativada!
            </Text>
            <Text style={TelaVerificacaoEmailStyles.modalText}>
              Sua conta foi ativada com sucesso.
              Redirecionando para a página de login...
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default TelaVerificacaoEmail;