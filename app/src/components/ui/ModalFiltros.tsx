import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Animated,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ModalFiltrosProps, Filtro, Estado } from '../../@types/home';
import { Button, ListItem } from '@rneui/themed';
import { styles, constants } from '../../styles/components/ModalFiltrosStyles';
// Importe do serviço
import { produtoService, CATEGORIAS_FRONTEND, ESTADOS_BRASILEIROS } from '../../services/produtoService';

const { height } = Dimensions.get('window');

const ModalFiltros: React.FC<ModalFiltrosProps> = ({
  isOpen,
  onClose,
  onAplicarFiltros
}) => {
  const [filtros, setFiltros] = useState<Filtro>({});
  const [precoMinInput, setPrecoMinInput] = useState('');
  const [precoMaxInput, setPrecoMaxInput] = useState('');
  const [showEstados, setShowEstados] = useState(false);
  const [showCategorias, setShowCategorias] = useState(false);
  const [slideAnim] = useState(new Animated.Value(height));
  
  // Refs para os campos de entrada
  const precoMinRef = useRef<TextInput>(null);
  const precoMaxRef = useRef<TextInput>(null);

  React.useEffect(() => {
    if (isOpen) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      // Foca automaticamente no primeiro campo quando o modal abre
      setTimeout(() => {
        precoMinRef.current?.focus();
      }, 350);
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen]);

  const handleAplicar = () => {
    const filtrosFormatados: Filtro = {
      ...filtros,
      precoMin: precoMinInput ? parseFloat(precoMinInput.replace(',', '.')) : undefined,
      precoMax: precoMaxInput ? parseFloat(precoMaxInput.replace(',', '.')) : undefined,
    };
    
    console.log('🎯 Filtros aplicados:', filtrosFormatados);
    
    // Envia os filtros formatados para o parent
    onAplicarFiltros(filtrosFormatados);
    onClose();
  };

  const handleLimpar = () => {
    setFiltros({});
    setPrecoMinInput('');
    setPrecoMaxInput('');
    // Foca no primeiro campo após limpar
    precoMinRef.current?.focus();
  };

  // Função para formatar o preço enquanto digita
  const formatarPrecoInput = (texto: string): string => {
    // Remove tudo que não é número ou vírgula
    let valor = texto.replace(/[^\d,]/g, '');
    
    // Garante que só tem uma vírgula
    const partes = valor.split(',');
    if (partes.length > 2) {
      valor = partes[0] + ',' + partes.slice(1).join('');
    }
    
    // Limita a 2 casas decimais
    if (partes.length === 2 && partes[1].length > 2) {
      valor = partes[0] + ',' + partes[1].substring(0, 2);
    }
    
    return valor;
  };

  const handlePrecoMinChange = (texto: string) => {
    const formatado = formatarPrecoInput(texto);
    setPrecoMinInput(formatado);
  };

  const handlePrecoMaxChange = (texto: string) => {
    const formatado = formatarPrecoInput(texto);
    setPrecoMaxInput(formatado);
  };

  // Navegação entre campos com "Próximo" no teclado
  const handlePrecoMinSubmit = () => {
    precoMaxRef.current?.focus();
  };

  const handlePrecoMaxSubmit = () => {
    // Se quiser, pode fazer algo quando terminar de digitar o preço máximo
    // ou simplesmente fechar o teclado
  };

  const selecionarEstado = (estado: Estado) => {
    setFiltros(prev => ({ ...prev, estado: estado.sigla }));
    setShowEstados(false);
  };

  const selecionarCategoria = (categoriaId: string) => {
    const categoria = CATEGORIAS_FRONTEND.find(cat => cat.id === categoriaId);
    if (categoria) {
      setFiltros(prev => ({ ...prev, categoria: categoria.backendValue }));
    }
    setShowCategorias(false);
  };

  const estadoSelecionado = ESTADOS_BRASILEIROS.find(e => e.sigla === filtros.estado);
  const categoriaSelecionada = CATEGORIAS_FRONTEND.find(c => c.backendValue === filtros.categoria);

  const renderItemEstado = ({ item }: { item: Estado }) => (
    <ListItem onPress={() => selecionarEstado(item)} bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.nome}</ListItem.Title>
      </ListItem.Content>
      {filtros.estado === item.sigla && (
        <MaterialIcons name="check" size={24} color={constants.COLORS.primary} />
      )}
    </ListItem>
  );

  const renderItemCategoria = ({ item }: { item: typeof CATEGORIAS_FRONTEND[0] }) => (
    <ListItem onPress={() => selecionarCategoria(item.id)} bottomDivider>
      <MaterialIcons 
        name={item.icone as any} 
        size={24} 
        color={constants.COLORS.gray600} 
        style={{ marginRight: 15 }} 
      />
      <ListItem.Content>
        <ListItem.Title>{item.nome}</ListItem.Title>
      </ListItem.Content>
      {filtros.categoria === item.backendValue && (
        <MaterialIcons name="check" size={24} color={constants.COLORS.primary} />
      )}
    </ListItem>
  );

  const ModalPrincipal = () => (
    <Animated.View 
      style={[
        styles.modalContainer,
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Filtros</Text>
        <TouchableOpacity onPress={onClose}>
          <MaterialIcons name="close" size={24} color={constants.COLORS.gray600} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
        {/* Preço */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preço</Text>
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mínimo</Text>
              <TouchableOpacity 
                style={styles.inputWrapper}
                onPress={() => precoMinRef.current?.focus()}
                activeOpacity={0.7}
              >
                <Text style={styles.currencySymbol}>R$</Text>
                <TextInput
                  ref={precoMinRef}
                  style={styles.input}
                  placeholder="0,00"
                  value={precoMinInput}
                  onChangeText={handlePrecoMinChange}
                  keyboardType="decimal-pad"
                  placeholderTextColor={constants.COLORS.gray500}
                  returnKeyType="next"
                  onSubmitEditing={handlePrecoMinSubmit}
                  clearButtonMode="while-editing"
                  selectTextOnFocus
                  autoComplete="off"
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.inputContainer, { marginLeft: 12 }]}>
              <Text style={styles.inputLabel}>Máximo</Text>
              <TouchableOpacity 
                style={styles.inputWrapper}
                onPress={() => precoMaxRef.current?.focus()}
                activeOpacity={0.7}
              >
                <Text style={styles.currencySymbol}>R$</Text>
                <TextInput
                  ref={precoMaxRef}
                  style={styles.input}
                  placeholder="0,00"
                  value={precoMaxInput}
                  onChangeText={handlePrecoMaxChange}
                  keyboardType="decimal-pad"
                  placeholderTextColor={constants.COLORS.gray500}
                  returnKeyType="done"
                  onSubmitEditing={handlePrecoMaxSubmit}
                  clearButtonMode="while-editing"
                  selectTextOnFocus
                  autoComplete="off"
                />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Dica abaixo dos campos */}
          <Text style={styles.inputHint}>
            Digite os valores e use "Próximo" para navegar entre campos
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Localização */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização</Text>
          <Text style={styles.inputLabel}>Estado</Text>
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => {
              // Esconde teclado antes de abrir o modal de estados
              precoMinRef.current?.blur();
              precoMaxRef.current?.blur();
              setShowEstados(true);
            }}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.selectorText,
              estadoSelecionado ? styles.selectorTextSelected : styles.selectorTextPlaceholder
            ]}>
              {estadoSelecionado ? estadoSelecionado.nome : "Selecione um estado"}
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={constants.COLORS.gray600} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Categoria */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categoria</Text>
          <Text style={styles.inputLabel}>Categoria</Text>
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => {
              // Esconde teclado antes de abrir o modal de categorias
              precoMinRef.current?.blur();
              precoMaxRef.current?.blur();
              setShowCategorias(true);
            }}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.selectorText,
              categoriaSelecionada ? styles.selectorTextSelected : styles.selectorTextPlaceholder
            ]}>
              {categoriaSelecionada ? categoriaSelecionada.nome : "Selecione uma categoria"}
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={constants.COLORS.gray600} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.modalFooter}>
        <Button
          title="Limpar"
          type="outline"
          buttonStyle={styles.clearButton}
          titleStyle={styles.clearButtonText}
          onPress={handleLimpar}
          containerStyle={styles.buttonContainer}
        />
        <Button
          title="Aplicar Filtros"
          buttonStyle={styles.applyButton}
          titleStyle={styles.applyButtonText}
          onPress={handleAplicar}
          containerStyle={[styles.buttonContainer, { marginLeft: 12 }]}
        />
      </View>
    </Animated.View>
  );

  // ... resto do código (ModalEstados e ModalCategorias permanecem iguais)
  const ModalEstados = () => (
    <Modal
      visible={showEstados}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowEstados(false)}
    >
      <View style={styles.subModalContainer}>
        <View style={styles.subModalContent}>
          <View style={styles.subModalHeader}>
            <Text style={styles.subModalTitle}>Selecionar Estado</Text>
            <TouchableOpacity onPress={() => setShowEstados(false)}>
              <MaterialIcons name="close" size={24} color={constants.COLORS.gray600} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={ESTADOS_BRASILEIROS}
            keyExtractor={(item) => item.sigla}
            renderItem={renderItemEstado}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );

  const ModalCategorias = () => (
    <Modal
      visible={showCategorias}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowCategorias(false)}
    >
      <View style={styles.subModalContainer}>
        <View style={styles.subModalContent}>
          <View style={styles.subModalHeader}>
            <Text style={styles.subModalTitle}>Selecionar Categoria</Text>
            <TouchableOpacity onPress={() => setShowCategorias(false)}>
              <MaterialIcons name="close" size={24} color={constants.COLORS.gray600} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={CATEGORIAS_FRONTEND.filter(cat => cat.id !== 'tudo')}
            keyExtractor={(item) => item.id}
            renderItem={renderItemCategoria}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="none"
        onRequestClose={onClose}
      >
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <ModalPrincipal />
      </Modal>
      <ModalEstados />
      <ModalCategorias />
    </>
  );
};

export default ModalFiltros;