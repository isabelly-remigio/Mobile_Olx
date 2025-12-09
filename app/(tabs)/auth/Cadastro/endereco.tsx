import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/src/context/AuthContext';
import { theme } from '@/app/src/theme/theme';
import { TelaEnderecoStyles } from '@/app/src/styles/TelaCadastro/TelaEnderecoStyles';

const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO',
];

const TelaEndereco = () => {
  const router = useRouter();
  const { register, personalData } = useAuth();
  
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [complemento, setComplemento] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showEstadoModal, setShowEstadoModal] = useState(false);

  // Verificar se há dados pessoais
  useEffect(() => {
    console.log('📍 [ENDEREÇO] Verificando dados pessoais...');
    console.log('📍 [ENDEREÇO] PersonalData recebido:', personalData);
    
    if (!personalData) {
      console.log('❌ [ENDEREÇO] Nenhum dado pessoal encontrado!');
      Alert.alert(
        'Dados incompletos',
        'Por favor, complete os dados pessoais primeiro.',
        [{ text: 'OK', onPress: () => router.push('/auth/Cadastro/cadastro') }]
      );
    } else {
      console.log('✅ [ENDEREÇO] Dados pessoais encontrados!');
      console.log('- Nome:', personalData.nome);
      console.log('- Email:', personalData.email);
    }
  }, []);

  const formatarCEP = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    return apenasNumeros
      .slice(0, 8)
      .replace(/(\d{5})(\d)/, '$1-$2');
  };

  const buscarCEP = async () => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    setBuscandoCep(true);
    try {
      console.log('🗺️ [CEP] Buscando endereço para CEP:', cepLimpo);
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (!data.erro) {
        console.log('✅ [CEP] Endereço encontrado:', data);
        setLogradouro(data.logradouro || '');
        setBairro(data.bairro || '');
        setCidade(data.localidade || '');
        setUf(data.uf || '');
      } else {
        console.log('❌ [CEP] CEP não encontrado');
        Alert.alert('CEP não encontrado', 'Verifique o CEP informado.');
      }
    } catch (error) {
      console.error('❌ [CEP] Erro ao buscar CEP:', error);
      Alert.alert('Erro', 'Não foi possível buscar o CEP. Verifique sua conexão.');
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleCepChange = (valor: string) => {
    const formatado = formatarCEP(valor);
    setCep(formatado);
    
    if (formatado.length === 9) {
      buscarCEP();
    }
  };

  const validarFormulario = () => {
    const valido = (
      cep.replace(/\D/g, '').length === 8 &&
      logradouro.trim() &&
      numero.trim() &&
      bairro.trim() &&
      cidade.trim() &&
      uf.trim()
    );
    
    console.log('✅ [VALIDAÇÃO] Formulário válido?', valido);
    console.log('- CEP válido?', cep.replace(/\D/g, '').length === 8);
    console.log('- Logradouro:', logradouro.trim());
    console.log('- Número:', numero.trim());
    console.log('- Bairro:', bairro.trim());
    console.log('- Cidade:', cidade.trim());
    console.log('- UF:', uf.trim());
    
    return valido;
  };

 const concluirCadastro = async () => {
  if (!personalData || !validarFormulario()) {
    Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
    return;
  }

  setCarregando(true);

  try {
    const dadosCompletos = {
      ...personalData,
      cep: cep.replace(/\D/g, ''),
      logradouro: logradouro.trim(),
      numero: numero.trim(),
      bairro: bairro.trim(),
      cidade: cidade.trim(),
      uf: uf.trim().toUpperCase(),
      complemento: complemento.trim() || '',
    };

    await register(dadosCompletos);

    // 🚀 independente da resposta
    router.replace(
      `/auth/Cadastro/verificacao?email=${encodeURIComponent(dadosCompletos.email)}`
    );

  } catch (error: any) {
    Alert.alert(
      'Erro no cadastro',
      error.message || 'Não foi possível completar o cadastro.'
    );
  } finally {
    setCarregando(false);
  }
};



  if (!personalData) {
    console.log('⏳ [ENDEREÇO] Aguardando dados pessoais...');
    return (
      <View style={TelaEnderecoStyles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        <Text style={{ marginTop: 10 }}>Carregando dados...</Text>
      </View>
    );
  }

  const renderEstadoItem = (estadoItem: string) => (
    <TouchableOpacity
      key={estadoItem}
      style={TelaEnderecoStyles.estadoItem}
      onPress={() => {
        setUf(estadoItem);
        setShowEstadoModal(false);
      }}
    >
      <Text
        style={[
          TelaEnderecoStyles.estadoText,
          uf === estadoItem && TelaEnderecoStyles.selectedEstadoText,
        ]}
      >
        {estadoItem}
      </Text>
      {uf === estadoItem && (
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
    <>
      <ScrollView 
        style={TelaEnderecoStyles.scrollView} 
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
            <Text style={TelaEnderecoStyles.headerTitle}>Endereço</Text>
          </View>

          <Text style={TelaEnderecoStyles.infoText}>
            Informe seu endereço para entrega e localização
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
                    focusedInput === 'cep' && TelaEnderecoStyles.focusedInput,
                  ]}
                  placeholder="00000-000"
                  value={cep}
                  onChangeText={handleCepChange}
                  keyboardType="numeric"
                  maxLength={9}
                  onFocus={() => setFocusedInput('cep')}
                  onBlur={() => {
                    setFocusedInput(null);
                    if (cep.replace(/\D/g, '').length === 8) {
                      buscarCEP();
                    }
                  }}
                />
                {buscandoCep && (
                  <View style={TelaEnderecoStyles.loadingIcon}>
                    <ActivityIndicator size="small" color={theme.colors.primary[500]} />
                  </View>
                )}
              </View>
            </View>

            {/* Logradouro */}
            <View>
              <Text style={TelaEnderecoStyles.inputLabel}>Logradouro</Text>
              <TextInput
                style={[
                  TelaEnderecoStyles.input,
                  focusedInput === 'logradouro' && TelaEnderecoStyles.focusedInput,
                ]}
                placeholder="Rua, Avenida, etc."
                value={logradouro}
                onChangeText={setLogradouro}
                onFocus={() => setFocusedInput('logradouro')}
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

            {/* Cidade */}
            <View>
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

            {/* Estado */}
            <View>
              <Text style={TelaEnderecoStyles.inputLabel}>Estado (UF)</Text>
              <TouchableOpacity
                style={[
                  TelaEnderecoStyles.estadoButton,
                  focusedInput === 'uf' && TelaEnderecoStyles.focusedInput,
                ]}
                onPress={() => {
                  setFocusedInput('uf');
                  setShowEstadoModal(true);
                }}
              >
                <Text
                  style={[
                    TelaEnderecoStyles.estadoButtonText,
                    !uf && TelaEnderecoStyles.estadoPlaceholderText,
                  ]}
                >
                  {uf || 'Selecione o estado'}
                </Text>
                <Icon
                  name="keyboard-arrow-down"
                  type="material"
                  size={20}
                  color={theme.colors.gray500}
                />
              </TouchableOpacity>
            </View>

            {/* Botão Finalizar */}
            <TouchableOpacity
              style={[
                TelaEnderecoStyles.finalizarButton,
                (!validarFormulario() || carregando) && TelaEnderecoStyles.disabledButton,
              ]}
              onPress={concluirCadastro}
              disabled={!validarFormulario() || carregando}
              activeOpacity={0.8}
            >
              {carregando ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <Text
                  style={[
                    TelaEnderecoStyles.finalizarButtonText,
                    (!validarFormulario() || carregando) && TelaEnderecoStyles.disabledButtonText,
                  ]}
                >
                  Concluir Cadastro
                </Text>
              )}
            </TouchableOpacity>

            <Text style={TelaEnderecoStyles.footerText}>
              Seu endereço será usado para calcular fretes e mostrar anúncios próximos a você.
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
    </>
  );
};

export default TelaEndereco;