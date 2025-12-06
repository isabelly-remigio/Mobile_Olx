// screens/auth/Cadastro/TelaEndereco.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/app/src/context/AuthContext';

import { TelaEnderecoStyles } from '@/app/src/styles/TelaCadastro/TelaEnderecoStyles';
import { theme } from '@/app/src/theme/theme';

const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO',
];

export default function TelaEndereco() {
  const { nome, tipoConta, cpf, email, senha } = useLocalSearchParams();
  const router = useRouter();
  const { salvarEndereco } = useAuth();

  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showEstadoModal, setShowEstadoModal] = useState(false);

  const formatarCEP = (valor: string) =>
    valor
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 9);

  const handleCep = async (valor: string) => {
    const novo = formatarCEP(valor);
    setCep(novo);
    if (novo.length !== 9) return;

    setCarregando(true);
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${novo.replace('-', '')}/json/`
      );
      const data = await response.json();
      if (!data.erro) {
        setRua(data.logradouro || '');
        setBairro(data.bairro || '');
        setCidade(data.localidade || '');
        setEstado(data.uf || '');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setCarregando(false);
    }
  };

  const podeEnviar = Boolean(
    cep.length === 9 &&
    rua &&
    numero &&
    bairro &&
    cidade &&
    estado
  );

  const finalizar = async () => {
    if (!podeEnviar) return;

    try {
      await salvarEndereco({
        cep,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
      });
      router.push('/auth/Cadastro/verificacao');
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
    }
  };

  const renderEstadoItem = (estadoItem: string) => (
    <TouchableOpacity
      key={estadoItem}
      style={TelaEnderecoStyles.estadoItem}
      onPress={() => {
        setEstado(estadoItem);
        setShowEstadoModal(false);
      }}
    >
      <Text
        style={[
          TelaEnderecoStyles.estadoText,
          estado === estadoItem && TelaEnderecoStyles.selectedEstadoText,
        ]}
      >
        {estadoItem}
      </Text>
      {estado === estadoItem && (
        <Icon
          name="check"
          type="material"
          size={20}
          color={theme.colors.primary[500]}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        style={TelaEnderecoStyles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={TelaEnderecoStyles.content}>
          {/* Header */}
          <View style={TelaEnderecoStyles.header}>
            <TouchableOpacity
              style={TelaEnderecoStyles.backButton}
              onPress={() => router.back()}
            >
              <Icon
                name="arrow-back"
                type="ionicon"
                size={24}
                color={theme.colors.gray700}
              />
            </TouchableOpacity>
            <Text style={TelaEnderecoStyles.headerTitle}>Seu endereço</Text>
          </View>

          <Text style={TelaEnderecoStyles.infoText}>
            Informe seu endereço para entrega e localização dos anúncios
          </Text>

          {/* Formulário */}
          <View style={TelaEnderecoStyles.formSection}>
            {/* CEP */}
            <View>
              <Text style={TelaEnderecoStyles.inputLabel}>CEP</Text>
              <View style={TelaEnderecoStyles.inputWithIcon}>
                <TextInput
                  style={[
                    TelaEnderecoStyles.input,
                    { flex: 1 },
                    focusedInput === 'cep' && TelaEnderecoStyles.focusedInput,
                  ]}
                  placeholder="00000-000"
                  value={cep}
                  onChangeText={handleCep}
                  keyboardType="numeric"
                  maxLength={9}
                  onFocus={() => setFocusedInput('cep')}
                  onBlur={() => setFocusedInput(null)}
                />
                {carregando && (
                  <View style={TelaEnderecoStyles.loadingIcon}>
                    <Icon
                      name="refresh"
                      type="ionicon"
                      size={20}
                      color={theme.colors.gray500}
                    />
                  </View>
                )}
              </View>
            </View>

            {/* Rua */}
            <View>
              <Text style={TelaEnderecoStyles.inputLabel}>Rua</Text>
              <TextInput
                style={[
                  TelaEnderecoStyles.input,
                  focusedInput === 'rua' && TelaEnderecoStyles.focusedInput,
                ]}
                placeholder="Nome da rua"
                value={rua}
                onChangeText={setRua}
                onFocus={() => setFocusedInput('rua')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            {/* Número e Complemento */}
            <View style={TelaEnderecoStyles.rowContainer}>
              <View style={TelaEnderecoStyles.flex2}>
                <Text style={TelaEnderecoStyles.inputLabel}>Número</Text>
                <TextInput
                  style={[
                    TelaEnderecoStyles.input,
                    focusedInput === 'numero' && TelaEnderecoStyles.focusedInput,
                  ]}
                  placeholder="123"
                  value={numero}
                  onChangeText={setNumero}
                  keyboardType="numeric"
                  onFocus={() => setFocusedInput('numero')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>

              <View style={TelaEnderecoStyles.flex3}>
                <Text style={TelaEnderecoStyles.inputLabel}>Complemento</Text>
                <TextInput
                  style={[
                    TelaEnderecoStyles.input,
                    focusedInput === 'complemento' && TelaEnderecoStyles.focusedInput,
                  ]}
                  placeholder="Apto, bloco, etc."
                  value={complemento}
                  onChangeText={setComplemento}
                  onFocus={() => setFocusedInput('complemento')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Bairro */}
            <View>
              <Text style={TelaEnderecoStyles.inputLabel}>Bairro</Text>
              <TextInput
                style={[
                  TelaEnderecoStyles.input,
                  focusedInput === 'bairro' && TelaEnderecoStyles.focusedInput,
                ]}
                placeholder="Nome do bairro"
                value={bairro}
                onChangeText={setBairro}
                onFocus={() => setFocusedInput('bairro')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            {/* Cidade e Estado */}
            <View style={TelaEnderecoStyles.rowContainer}>
              <View style={TelaEnderecoStyles.flex3}>
                <Text style={TelaEnderecoStyles.inputLabel}>Cidade</Text>
                <TextInput
                  style={[
                    TelaEnderecoStyles.input,
                    focusedInput === 'cidade' && TelaEnderecoStyles.focusedInput,
                  ]}
                  placeholder="Nome da cidade"
                  value={cidade}
                  onChangeText={setCidade}
                  onFocus={() => setFocusedInput('cidade')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>

              <View style={TelaEnderecoStyles.flex2}>
                <Text style={TelaEnderecoStyles.inputLabel}>Estado</Text>
                <TouchableOpacity
                  style={[
                    TelaEnderecoStyles.estadoButton,
                    focusedInput === 'estado' && TelaEnderecoStyles.focusedInput,
                  ]}
                  onPress={() => {
                    setFocusedInput('estado');
                    setShowEstadoModal(true);
                  }}
                  onBlur={() => setFocusedInput(null)}
                >
                  <Text
                    style={[
                      TelaEnderecoStyles.estadoButtonText,
                      !estado && TelaEnderecoStyles.estadoPlaceholderText,
                    ]}
                  >
                    {estado || 'UF'}
                  </Text>
                  <Icon
                    name="keyboard-arrow-down"
                    type="material"
                    size={20}
                    color={theme.colors.gray500}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Botão Finalizar */}
            <TouchableOpacity
              style={[
                TelaEnderecoStyles.finalizarButton,
                !podeEnviar && TelaEnderecoStyles.disabledButton,
              ]}
              onPress={finalizar}
              disabled={!podeEnviar}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  TelaEnderecoStyles.finalizarButtonText,
                  !podeEnviar && TelaEnderecoStyles.disabledButtonText,
                ]}
              >
                Finalizar Cadastro
              </Text>
            </TouchableOpacity>

            <Text style={TelaEnderecoStyles.footerText}>
              Seu endereço será usado para calcular fretes e mostrar anúncios
              próximos a você.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal para seleção de estado */}
      <Modal
        visible={showEstadoModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEstadoModal(false)}
      >
        <TouchableOpacity
          style={TelaEnderecoStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowEstadoModal(false)}
        >
          <View style={TelaEnderecoStyles.modalContent}>
            <View style={TelaEnderecoStyles.modalHeader}>
              <Text style={TelaEnderecoStyles.modalTitle}>Selecione o Estado</Text>
              <TouchableOpacity onPress={() => setShowEstadoModal(false)}>
                <Icon name="close" type="material" size={24} color={theme.colors.gray700} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {ESTADOS.map((estadoItem) => renderEstadoItem(estadoItem))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}