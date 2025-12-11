// components/ui/BarraPesquisa.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BarraPesquisaProps, FiltroAtivo, Filtro } from '../../@types/home';
import ModalFiltros from './ModalFiltros';
import {
  BarraPesquisaStyles,
  BarraPesquisaConstants,
} from '../../styles/components/BarraPesquisaStyles';
import { theme } from '../../theme/theme';
import { CATEGORIAS_FRONTEND } from '../../services/produtoService';
const BarraPesquisa: React.FC<BarraPesquisaProps> = ({
  placeholder = 'Buscar...',
  onSearch,
  onFiltrosChange,
  resultadosCount = 0,
  mostrarResultadosVazios = false,
}) => {
  const [texto, setTexto] = useState('');
  const [textoPesquisa, setTextoPesquisa] = useState('');
  const [showFiltros, setShowFiltros] = useState(false);
  const [filtrosAtivos, setFiltrosAtivos] = useState<FiltroAtivo[]>([]);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounce para pesquisa
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (texto.trim() !== textoPesquisa) {
        setTextoPesquisa(texto.trim());
        onSearch(texto.trim());
      }
    }, BarraPesquisaConstants.debounceDelay);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [texto, onSearch, textoPesquisa]);

  const handleClearSearch = () => {
    setTexto('');
    setTextoPesquisa('');
    onSearch('');
  };

 const handleAplicarFiltros = (filtros: Filtro) => {
  console.log('🎯 Filtros aplicados no componente:', filtros);
  
  const novosFiltros: FiltroAtivo[] = [];

  if (filtros.precoMin)
    novosFiltros.push({
      tipo: 'precoMin',
      valor: filtros.precoMin,
      label: `Mín: R$ ${filtros.precoMin.toFixed(2).replace('.', ',')}`,
    });

  if (filtros.precoMax)
    novosFiltros.push({
      tipo: 'precoMax',
      valor: filtros.precoMax,
      label: `Máx: R$ ${filtros.precoMax.toFixed(2).replace('.', ',')}`,
    });

  if (filtros.estado)
    novosFiltros.push({
      tipo: 'estado',
      valor: filtros.estado,
      label: `Estado: ${filtros.estado}`,
    });

  if (filtros.categoria) {
    // Encontra o nome da categoria
    const categoria = CATEGORIAS_FRONTEND.find(cat => cat.backendValue === filtros.categoria);
    novosFiltros.push({
      tipo: 'categoria',
      valor: filtros.categoria,
      label: `Categoria: ${categoria?.nome || filtros.categoria}`,
    });
  }

  setFiltrosAtivos(novosFiltros);
  
  // Chama a função do parent para aplicar os filtros
  onFiltrosChange?.(filtros);
};

  const handleRemoverFiltro = (index: number) => {
    const novosFiltros = filtrosAtivos.filter((_, i) => i !== index);
    setFiltrosAtivos(novosFiltros);
    // Para uma implementação real, você reconstruiria o objeto de filtros
    // Aqui estou simplificando para limpar todos os filtros
    onFiltrosChange?.({});
  };

  const handleLimparTodosFiltros = () => {
    setFiltrosAtivos([]);
    onFiltrosChange?.({});
  };

  const deveMostrarResultados = textoPesquisa !== '' || filtrosAtivos.length > 0;

  const renderBadge = (filtro: FiltroAtivo, index: number) => (
    <View key={index} style={BarraPesquisaStyles.badge}>
      <Text style={BarraPesquisaStyles.badgeText}>{filtro.label}</Text>
      <TouchableOpacity
        style={BarraPesquisaStyles.badgeCloseButton}
        onPress={() => handleRemoverFiltro(index)}
      >
        <MaterialIcons
          name="close"
          size={BarraPesquisaConstants.iconSizes.badgeClose}
          color={theme.colors.white}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={BarraPesquisaStyles.container}>
      {/* Barra de pesquisa principal */}
      <View style={BarraPesquisaStyles.searchContainer}>
        <View style={BarraPesquisaStyles.searchInputContainer}>
          <MaterialIcons
            name="search"
            size={BarraPesquisaConstants.iconSizes.search}
            color={theme.colors.gray500}
            style={BarraPesquisaStyles.searchIcon}
          />
          <TextInput
            style={BarraPesquisaStyles.searchInput}
            placeholder={placeholder}
            placeholderTextColor={BarraPesquisaConstants.placeholderColor}
            value={texto}
            onChangeText={setTexto}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {texto.length > 0 && (
            <TouchableOpacity
              style={BarraPesquisaStyles.clearButton}
              onPress={handleClearSearch}
            >
              <MaterialIcons
                name="close"
                size={BarraPesquisaConstants.iconSizes.clear}
                color={theme.colors.gray500}
              />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={BarraPesquisaStyles.filterButton}
          onPress={() => setShowFiltros(true)}
          activeOpacity={theme.opacity.active}
        >
          <MaterialIcons
            name="filter-list"
            size={BarraPesquisaConstants.iconSizes.filter}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      </View>

      {/* Contador de resultados - SÓ MOSTRA QUANDO HÁ PESQUISA */}
      {deveMostrarResultados && (
        <View style={BarraPesquisaStyles.resultsContainer}>
          <Text style={BarraPesquisaStyles.resultsText}>
            {resultadosCount === 0 && mostrarResultadosVazios
              ? 'Nenhum resultado encontrado'
              : `${resultadosCount} resultado${
                  resultadosCount !== 1 ? 's' : ''
                } encontrado${resultadosCount !== 1 ? 's' : ''}`}
          </Text>

          {filtrosAtivos.length > 0 && (
            <TouchableOpacity
              style={BarraPesquisaStyles.clearAllButton}
              onPress={handleLimparTodosFiltros}
              activeOpacity={theme.opacity.active}
            >
              <Text style={BarraPesquisaStyles.clearAllText}>
                Limpar Todos
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Filtros ativos como badges */}
      {filtrosAtivos.length > 0 && (
        <View style={BarraPesquisaStyles.badgesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={BarraPesquisaStyles.badgesScrollView}
          >
            <View style={BarraPesquisaStyles.badgesContent}>
              {filtrosAtivos.map((filtro, index) => renderBadge(filtro, index))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Modal de Filtros */}
      <ModalFiltros
        isOpen={showFiltros}
        onClose={() => setShowFiltros(false)}
        onAplicarFiltros={handleAplicarFiltros}
      />
    </View>
  );
};

export default BarraPesquisa;