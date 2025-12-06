// components/ModalFiltros.tsx
import React, { useState } from 'react';
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
const { height } = Dimensions.get('window');
const { ESTADOS_BRASILEIROS, CATEGORIAS_FIXAS } = constants;

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

  React.useEffect(() => {
    if (isOpen) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
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
      precoMin: precoMinInput ? parseFloat(precoMinInput) : undefined,
      precoMax: precoMaxInput ? parseFloat(precoMaxInput) : undefined,
    };
    onAplicarFiltros(filtrosFormatados);
    onClose();
  };

  const handleLimpar = () => {
    setFiltros({});
    setPrecoMinInput('');
    setPrecoMaxInput('');
  };

  const selecionarEstado = (estado: Estado) => {
    setFiltros(prev => ({ ...prev, estado: estado.sigla }));
    setShowEstados(false);
  };

  const selecionarCategoria = (categoriaId: string) => {
    setFiltros(prev => ({ ...prev, categoria: categoriaId }));
    setShowCategorias(false);
  };

  const estadoSelecionado = ESTADOS_BRASILEIROS.find(e => e.sigla === filtros.estado);
  const categoriaSelecionada = CATEGORIAS_FIXAS.find(c => c.id === filtros.categoria);

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

  const renderItemCategoria = ({ item }: { item: typeof CATEGORIAS_FIXAS[0] }) => (
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
      {filtros.categoria === item.id && (
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
              <View style={styles.inputWrapper}>
                <Text style={styles.currencySymbol}>R$</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0,00"
                  value={precoMinInput}
                  onChangeText={setPrecoMinInput}
                  keyboardType="numeric"
                  placeholderTextColor={constants.COLORS.gray500}
                />
              </View>
            </View>
            <View style={[styles.inputContainer, { marginLeft: 12 }]}>
              <Text style={styles.inputLabel}>Máximo</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.currencySymbol}>R$</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0,00"
                  value={precoMaxInput}
                  onChangeText={setPrecoMaxInput}
                  keyboardType="numeric"
                  placeholderTextColor={constants.COLORS.gray500}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Localização */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização</Text>
          <Text style={styles.inputLabel}>Estado</Text>
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => setShowEstados(true)}
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
            onPress={() => setShowCategorias(true)}
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
            data={CATEGORIAS_FIXAS}
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