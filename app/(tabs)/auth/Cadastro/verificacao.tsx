// screens/auth/Cadastro/TelaVerificacaoEmail.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TelaVerificacaoEmailStyles } from '../../../src/styles/TelaCadastro/TelaVerificacaoEmailStyles';
import { theme } from '../../../src/theme/theme';

const TelaVerificacaoEmail = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Recebe todos os dados das telas anteriores
  const dadosCadastro = {
    nome: params.nome as string,
    tipoConta: params.tipoConta as string,
    cpf: params.cpf as string,
    email: params.email as string,
    senha: params.senha as string,
    endereco: {
      cep: params.cep as string,
      rua: params.rua as string,
      numero: params.numero as string,
      complemento: params.complemento as string,
      bairro: params.bairro as string,
      cidade: params.cidade as string,
      estado: params.estado as string,
    },
  };

  const [tempoRestante, setTempoRestante] = useState(120);
  const [podeReenviar, setPodeReenviar] = useState(false);
  const [emailReenviado, setEmailReenviado] = useState(false);
  const [codigoVerificacao, setCodigoVerificacao] = useState('');

  // Contador regressivo
  useEffect(() => {
    if (tempoRestante > 0) {
      const timer = setTimeout(() => setTempoRestante((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setPodeReenviar(true);
    }
  }, [tempoRestante]);

  // Simular envio do código de verificação
  useEffect(() => {
    // Gerar código aleatório de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    setCodigoVerificacao(codigo);

    // Simular envio do email
    console.log(
      `Código de verificação enviado para ${dadosCadastro.email}: ${codigo}`
    );

    // Em produção, aqui você faria a chamada API para enviar o email
  }, []);

  const reenviarEmail = () => {
    // Gerar novo código
    const novoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
    setCodigoVerificacao(novoCodigo);

    setEmailReenviado(true);
    setTempoRestante(120);
    setPodeReenviar(false);

    console.log(`Novo código enviado para ${dadosCadastro.email}: ${novoCodigo}`);

    setTimeout(() => setEmailReenviado(false), 3000);
  };

  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  };

  const verificarEmail = () => {
    // Aqui você faria a verificação do código com o back-end
    // Por enquanto, vamos simular a verificação bem-sucedida

    // Preparar dados completos para envio ao back-end
    const dadosCompletos = {
      usuario: {
        nome: dadosCadastro.nome,
        email: dadosCadastro.email,
        senha: dadosCadastro.senha,
        cpf: dadosCadastro.cpf,
        tipoConta: dadosCadastro.tipoConta,
      },
      endereco: dadosCadastro.endereco,
    };

    console.log('Dados para cadastro no back-end:', dadosCompletos);

    // Simular cadastro no back-end
    Alert.alert('Sucesso', 'Cadastro realizado com sucesso! Verificação simulada.', [
      { text: 'OK', onPress: () => router.replace('/(tabs)') },
    ]);
  };

  const voltar = () => {
    router.back();
  };

  return (
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
                  name="send"
                  type="material"
                  size={48}
                  color={theme.colors.primary[500]}
                />
              </View>
              <Text style={TelaVerificacaoEmailStyles.title}>
                Verifique seu e-mail
              </Text>
              <Text style={TelaVerificacaoEmailStyles.subtitle}>
                Você precisa concluir uma etapa rápida antes de criar sua conta.
              </Text>
            </View>

            <View style={TelaVerificacaoEmailStyles.emailSection}>
              <Text style={TelaVerificacaoEmailStyles.instructionText}>
                Clique no link que enviamos para:
              </Text>
              <Text style={TelaVerificacaoEmailStyles.emailText}>
                {dadosCadastro.email}
              </Text>
              {/* Apenas para demonstração - mostrar código no console */}
              <Text style={TelaVerificacaoEmailStyles.demoText}>
                (Para teste: código {codigoVerificacao} foi gerado - ver console)
              </Text>
            </View>

            <View style={TelaVerificacaoEmailStyles.infoSection}>
              <TouchableOpacity>
                <View style={TelaVerificacaoEmailStyles.infoRow}>
                  <Icon
                    name="schedule"
                    type="material"
                    size={20}
                    color={theme.colors.gray600}
                  />
                  <Text style={TelaVerificacaoEmailStyles.infoText}>
                    O e-mail pode levar até 2 minutos para chegar
                  </Text>
                </View>
              </TouchableOpacity>

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
                  <TouchableOpacity onPress={reenviarEmail}>
                    <Text style={TelaVerificacaoEmailStyles.resendLink}>
                      Reenviar e-mail
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={TelaVerificacaoEmailStyles.infoRow}>
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

            {/* Botão para simular verificação concluída */}
            <TouchableOpacity
              style={TelaVerificacaoEmailStyles.verifyButton}
              onPress={verificarEmail}
              activeOpacity={0.8}
            >
              <Text style={TelaVerificacaoEmailStyles.verifyButtonText}>
                Já verifiquei meu e-mail
              </Text>
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
  );
};

export default TelaVerificacaoEmail;