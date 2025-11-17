// components/ModalFiltros.tsx
import React, { useState } from 'react';
import { 
  Modal, 
  VStack, 
  HStack, 
  Text, 
  Button, 
  FormControl,
  Input,
  Checkbox,
  Divider,
  ScrollView,
  Pressable,
  Icon,
  Box,
  FlatList
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { ModalFiltrosProps, Filtro, Estado } from '../../@types/home';

const ESTADOS_BRASILEIROS: Estado[] = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
];

const ModalFiltros: React.FC<ModalFiltrosProps> = ({ 
  isOpen, 
  onClose, 
  onAplicarFiltros,
  categorias 
}) => {
  const [filtros, setFiltros] = useState<Filtro>({});
  const [precoMinInput, setPrecoMinInput] = useState('');
  const [precoMaxInput, setPrecoMaxInput] = useState('');
  const [showEstados, setShowEstados] = useState(false);
  const [showCategorias, setShowCategorias] = useState(false);

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
  const categoriaSelecionada = categorias.find(c => c.id === filtros.categoria);

  return (
    <>
      {/* Modal Principal de Filtros */}
      <Modal isOpen={isOpen} onClose={onClose} size="full" animationPreset="slide">
        <Modal.Content height="90%" marginBottom={0} marginTop="auto">
          <Modal.Header borderBottomWidth={1} borderBottomColor="gray.200">
            <HStack justifyContent="space-between" alignItems="center" width="100%">
              <Text fontSize="lg" fontWeight="bold">Filtros</Text>
              <Pressable onPress={onClose}>
                <Icon as={MaterialIcons} name="close" size={6} color="gray.500" />
              </Pressable>
            </HStack>
          </Modal.Header>
          
          <Modal.Body flex={1}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <VStack space={6} py={2}>
                
                {/* Preço */}
                <VStack space={3}>
                  <Text fontSize="md" fontWeight="bold" color="gray.800">Preço</Text>
                  <HStack space={3}>
                    <FormControl flex={1}>
                      <FormControl.Label>Mínimo</FormControl.Label>
                      <Input
                        placeholder="0,00"
                        value={precoMinInput}
                        onChangeText={setPrecoMinInput}
                        keyboardType="numeric"
                        InputLeftElement={
                          <Text ml={2} color="gray.500">R$</Text>
                        }
                      />
                    </FormControl>
                    <FormControl flex={1}>
                      <FormControl.Label>Máximo</FormControl.Label>
                      <Input
                        placeholder="0,00"
                        value={precoMaxInput}
                        onChangeText={setPrecoMaxInput}
                        keyboardType="numeric"
                        InputLeftElement={
                          <Text ml={2} color="gray.500">R$</Text>
                        }
                      />
                    </FormControl>
                  </HStack>
                </VStack>

                <Divider />

                {/* Localização */}
                <VStack space={3}>
                  <Text fontSize="md" fontWeight="bold" color="gray.800">Localização</Text>
                  <FormControl>
                    <FormControl.Label>Estado</FormControl.Label>
                    <Pressable 
                      onPress={() => setShowEstados(true)}
                      bg="gray.50"
                      borderWidth={1}
                      borderColor="gray.300"
                      borderRadius="md"
                      px={3}
                      py={3}
                    >
                      <HStack justifyContent="space-between" alignItems="center">
                        <Text color={estadoSelecionado ? "gray.800" : "gray.500"}>
                          {estadoSelecionado ? estadoSelecionado.nome : "Selecione um estado"}
                        </Text>
                        <Icon as={MaterialIcons} name="keyboard-arrow-down" size={5} color="gray.500" />
                      </HStack>
                    </Pressable>
                  </FormControl>
                </VStack>

                <Divider />

                {/* Categoria */}
                <VStack space={3}>
                  <Text fontSize="md" fontWeight="bold" color="gray.800">Categoria</Text>
                  <FormControl>
                    <FormControl.Label>Categoria</FormControl.Label>
                    <Pressable 
                      onPress={() => setShowCategorias(true)}
                      bg="gray.50"
                      borderWidth={1}
                      borderColor="gray.300"
                      borderRadius="md"
                      px={3}
                      py={3}
                    >
                      <HStack justifyContent="space-between" alignItems="center">
                        <Text color={categoriaSelecionada ? "gray.800" : "gray.500"}>
                          {categoriaSelecionada ? categoriaSelecionada.nome : "Selecione uma categoria"}
                        </Text>
                        <Icon as={MaterialIcons} name="keyboard-arrow-down" size={5} color="gray.500" />
                      </HStack>
                    </Pressable>
                  </FormControl>
                </VStack>

                <Divider />

                {/* Status */}
                <VStack space={3}>
                  <Text fontSize="md" fontWeight="bold" color="gray.800">Status</Text>
                  <Checkbox
                    isChecked={filtros.disponivel}
                    onChange={(valor) => setFiltros(prev => ({ ...prev, disponivel: valor }))}
                    value="disponivel"
                  >
                    <Text ml={2} fontSize="md">Apenas produtos disponíveis</Text>
                  </Checkbox>
                </VStack>
              </VStack>
            </ScrollView>
          </Modal.Body>

          <Modal.Footer borderTopWidth={1} borderTopColor="gray.200">
            <HStack space={3} width="100%" justifyContent="space-between">
              <Button 
                variant="outline" 
                flex={1} 
                onPress={handleLimpar}
                borderColor="primary.500"
              >
                <Text color="primary.500">Limpar</Text>
              </Button>
              <Button 
                flex={1} 
                onPress={handleAplicar}
                bg="primary.500"
              >
                <Text color="white">Aplicar Filtros</Text>
              </Button>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Modal de Seleção de Estados */}
      <Modal isOpen={showEstados} onClose={() => setShowEstados(false)} size="full" animationPreset="slide">
        <Modal.Content height="90%" marginBottom={0} marginTop="auto">
          <Modal.Header borderBottomWidth={1} borderBottomColor="gray.200">
            <HStack justifyContent="space-between" alignItems="center" width="100%">
              <Text fontSize="lg" fontWeight="bold">Selecionar Estado</Text>
              <Pressable onPress={() => setShowEstados(false)}>
                <Icon as={MaterialIcons} name="close" size={6} color="gray.500" />
              </Pressable>
            </HStack>
          </Modal.Header>
          
          <Modal.Body flex={1}>
            <FlatList
              data={ESTADOS_BRASILEIROS}
              keyExtractor={(item) => item.sigla}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => selecionarEstado(item)}
                  borderBottomWidth={1}
                  borderBottomColor="gray.100"
                  py={3}
                  px={2}
                >
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="md">{item.nome}</Text>
                    {filtros.estado === item.sigla && (
                      <Icon as={MaterialIcons} name="check" size={5} color="primary.500" />
                    )}
                  </HStack>
                </Pressable>
              )}
              showsVerticalScrollIndicator={false}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>

      {/* Modal de Seleção de Categorias */}
      <Modal isOpen={showCategorias} onClose={() => setShowCategorias(false)} size="full" animationPreset="slide">
        <Modal.Content height="90%" marginBottom={0} marginTop="auto">
          <Modal.Header borderBottomWidth={1} borderBottomColor="gray.200">
            <HStack justifyContent="space-between" alignItems="center" width="100%">
              <Text fontSize="lg" fontWeight="bold">Selecionar Categoria</Text>
              <Pressable onPress={() => setShowCategorias(false)}>
                <Icon as={MaterialIcons} name="close" size={6} color="gray.500" />
              </Pressable>
            </HStack>
          </Modal.Header>
          
          <Modal.Body flex={1}>
            <FlatList
              data={categorias}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => selecionarCategoria(item.id)}
                  borderBottomWidth={1}
                  borderBottomColor="gray.100"
                  py={3}
                  px={2}
                >
                  <HStack justifyContent="space-between" alignItems="center">
                    <HStack alignItems="center" space={3}>
                      <Icon as={MaterialIcons} name={item.icone as any} size={5} color="gray.600" />
                      <Text fontSize="md">{item.nome}</Text>
                    </HStack>
                    {filtros.categoria === item.id && (
                      <Icon as={MaterialIcons} name="check" size={5} color="primary.500" />
                    )}
                  </HStack>
                </Pressable>
              )}
              showsVerticalScrollIndicator={false}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default ModalFiltros;