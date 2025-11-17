// components/ui/BarraPesquisa.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  HStack, 
  Input, 
  Icon, 
  Pressable, 
  Text, 
  VStack,
  ScrollView,
  Badge,
  Button,
  Box
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { BarraPesquisaProps, FiltroAtivo, Filtro } from '../../@types/home';
import ModalFiltros from './ModalFiltros';

const BarraPesquisa: React.FC<BarraPesquisaProps> = ({ 
  placeholder = "Buscar...", 
  onSearch,
  onFiltrosChange,
  resultadosCount = 0,
  mostrarResultadosVazios = false
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
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [texto, onSearch]);

  const handleClearSearch = () => {
    setTexto('');
    setTextoPesquisa('');
    onSearch(''); // Limpa a pesquisa imediatamente
  };

  const handleAplicarFiltros = (filtros: Filtro) => {
    const novosFiltros: FiltroAtivo[] = [];
    
    if (filtros.precoMin) novosFiltros.push({ 
      tipo: 'precoMin', 
      valor: filtros.precoMin, 
      label: `Mín: R$ ${filtros.precoMin}` 
    });
    
    if (filtros.precoMax) novosFiltros.push({ 
      tipo: 'precoMax', 
      valor: filtros.precoMax, 
      label: `Máx: R$ ${filtros.precoMax}` 
    });
    
    if (filtros.estado) novosFiltros.push({ 
      tipo: 'estado', 
      valor: filtros.estado, 
      label: `Estado: ${filtros.estado}` 
    });
    
    if (filtros.categoria) novosFiltros.push({ 
      tipo: 'categoria', 
      valor: filtros.categoria, 
      label: `Categoria: ${filtros.categoria}` 
    });
    
    if (filtros.disponivel) novosFiltros.push({ 
      tipo: 'disponivel', 
      valor: 'true', 
      label: 'Disponível' 
    });

    setFiltrosAtivos(novosFiltros);
    onFiltrosChange?.(filtros);
  };

  const handleRemoverFiltro = (index: number) => {
    const novosFiltros = filtrosAtivos.filter((_, i) => i !== index);
    setFiltrosAtivos(novosFiltros);
    // Aqui você precisaria recalcular os filtros sem o removido
  };

  const handleLimparTodosFiltros = () => {
    setFiltrosAtivos([]);
    onFiltrosChange?.({});
  };

  // Só mostra resultados quando há pesquisa ou filtros ativos
  const deveMostrarResultados = textoPesquisa !== '' || filtrosAtivos.length > 0;

  return (
    <VStack space={3} bg="white" px={4} py={3} borderBottomWidth={1} borderBottomColor="gray.200">
      {/* Barra de pesquisa principal */}
      <HStack alignItems="center" space={2}>
        <HStack flex={1} bg="gray.100" borderRadius="lg" alignItems="center" px={3} py={2}>
          <Icon as={MaterialIcons} name="search" size={5} color="gray.500" />
          <Input
            placeholder={placeholder}
            value={texto}
            onChangeText={setTexto}
            flex={1}
            ml={2}
            borderWidth={0}
            fontSize="md"
            _focus={{ bg: 'transparent' }}
            variant="unstyled"
            returnKeyType="search"
          />
          {texto.length > 0 && (
            <Pressable onPress={handleClearSearch} ml={2}>
              <Icon as={MaterialIcons} name="close" size={4} color="gray.500" />
            </Pressable>
          )}
        </HStack>
        
        <Pressable 
          onPress={() => setShowFiltros(true)}
          bg="primary.500"
          px={3}
          py={2}
          borderRadius="md"
        >
          <Icon as={MaterialIcons} name="filter-list" size={5} color="white" />
        </Pressable>
      </HStack>

      {/* Contador de resultados - SÓ MOSTRA QUANDO HÁ PESQUISA */}
      {deveMostrarResultados && (
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="sm" color="gray.600">
            {resultadosCount === 0 && mostrarResultadosVazios 
              ? 'Nenhum resultado encontrado' 
              : `${resultadosCount} resultado${resultadosCount !== 1 ? 's' : ''} encontrado${resultadosCount !== 1 ? 's' : ''}`
            }
          </Text>
          
          {filtrosAtivos.length > 0 && (
            <Button variant="ghost" size="sm" onPress={handleLimparTodosFiltros}>
              <Text fontSize="xs" color="primary.500">Limpar Todos</Text>
            </Button>
          )}
        </HStack>
      )}

      {/* Filtros ativos como badges */}
      {filtrosAtivos.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack space={2}>
            {filtrosAtivos.map((filtro, index) => (
              <Badge 
                key={index}
                colorScheme="primary"
                borderRadius="full"
                variant="solid"
                px={3}
                py={1}
              >
                <HStack alignItems="center" space={1}>
                  <Text fontSize="xs" color="white">{filtro.label}</Text>
                  <Pressable onPress={() => handleRemoverFiltro(index)} ml={1}>
                    <Icon as={MaterialIcons} name="close" size={3} color="white" />
                  </Pressable>
                </HStack>
              </Badge>
            ))}
          </HStack>
        </ScrollView>
      )}

      {/* Modal de Filtros */}
      <ModalFiltros
        isOpen={showFiltros}
        onClose={() => setShowFiltros(false)}
        onAplicarFiltros={handleAplicarFiltros}
        categorias={[]}
      />
    </VStack>
  );
};

export default BarraPesquisa;