// screens/compras.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { theme } from '../src/theme/theme';
import { Icon } from '@rneui/themed';

// Tipos em português
type StatusCompra = 'entregue' | 'enviado' | 'cancelado' | 'aguardando_pagamento' | 'aguardando_envio';

interface ItemCompra {
  id: string;
  imagem: string;
  titulo: string;
  preco: number;
  data: string;
  status: StatusCompra;
}

interface ComprasScreenProps {
  navegacao: any;
}

// Dados de exemplo
const comprasMock: ItemCompra[] = [
  {
    id: '1',
    imagem: 'https://via.placeholder.com/150',
    titulo: 'TV LG 50 Polegadas',
    preco: 2499.00,
    data: '25/05/2024',
    status: 'entregue',
  },
  {
    id: '2',
    imagem: 'https://via.placeholder.com/150',
    titulo: 'Notebook Dell Inspiron',
    preco: 3900.00,
    data: '10/01/2025',
    status: 'aguardando_envio',
  },
  {
    id: '3',
    imagem: 'https://via.placeholder.com/150',
    titulo: 'iPhone 15 Pro Max',
    preco: 8999.00,
    data: '05/02/2025',
    status: 'enviado',
  },
  {
    id: '4',
    imagem: 'https://via.placeholder.com/150',
    titulo: 'Monitor Samsung 27"',
    preco: 1299.90,
    data: '15/03/2025',
    status: 'aguardando_pagamento',
  },
];

const ComprasScreen: React.FC<ComprasScreenProps> = ({ navegacao }) => {
  const [compras, setCompras] = React.useState<ItemCompra[]>(comprasMock);
  const [estaCarregando, setEstaCarregando] = React.useState(false);
  const [estaVazio, setEstaVazio] = React.useState(false);

  // Função para obter a cor do status
  const obterCorStatus = (status: StatusCompra): string => {
    switch (status) {
      case 'entregue':
        return theme.colors.success;
      case 'enviado':
        return theme.colors.secondary[500];
      case 'cancelado':
        return theme.colors.error;
      case 'aguardando_pagamento':
        return theme.colors.primary[500];
      case 'aguardando_envio':
        return theme.colors.tertiary[500];
      default:
        return theme.colors.gray500;
    }
  };

  // Função para formatar o texto do status
  const formatarStatus = (status: StatusCompra): string => {
    switch (status) {
      case 'entregue':
        return 'Entregue';
      case 'enviado':
        return 'Enviado';
      case 'cancelado':
        return 'Cancelado';
      case 'aguardando_pagamento':
        return 'Aguardando Pagamento';
      case 'aguardando_envio':
        return 'Aguardando Envio';
      default:
        return status;
    }
  };

  // Função para formatar preço em Reais
  const formatarPreco = (preco: number): string => {
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Função para navegar para os anúncios
  const navegarParaAnuncios = () => {
    navegacao.navigate('Anuncios');
  };

  // Função para navegar para detalhes da compra
  const navegarParaDetalhesCompra = (compra: ItemCompra) => {
    navegacao.navigate('DetalhesCompra', { compra });
  };

  // Renderizar item da lista
  const renderizarItemCompra = ({ item }: { item: ItemCompra }) => (
    <TouchableOpacity
      style={estilos.itemCompra}
      onPress={() => navegarParaDetalhesCompra(item)}
      activeOpacity={theme.opacity.active}
    >
      <View style={estilos.containerImagem}>
        <Image
          source={{ uri: item.imagem }}
          style={estilos.imagemProduto}
        />
      </View>
      
      <View style={estilos.infoProduto}>
        <Text style={estilos.tituloProduto} numberOfLines={2}>
          {item.titulo}
        </Text>
        
        <Text style={estilos.precoProduto}>
          {formatarPreco(item.preco)}
        </Text>
        
        <Text style={estilos.dataCompra}>
          Comprado em {item.data}
        </Text>
        
        <View style={estilos.containerStatus}>
          <View 
            style={[
              estilos.badgeStatus, 
              { backgroundColor: obterCorStatus(item.status) }
            ]}
          >
            <Text style={estilos.textoStatus}>
              {formatarStatus(item.status)}
            </Text>
          </View>
        </View>
      </View>
      
      <Icon
        name="chevron-right"
        type="material-community"
        color={theme.colors.gray400}
        size={24}
      />
    </TouchableOpacity>
  );

  // Renderizar estado vazio
  const renderizarEstadoVazio = () => (
    <View style={estilos.containerVazio}>
      <View style={estilos.iconeContainer}>
        <Icon
          name="package-variant"
          type="material-community"
          size={80}
          color={theme.colors.gray300}
        />
      </View>
      
      <Text style={estilos.textoVazioTitulo}>
        Você ainda não fez compras
      </Text>
      
      <Text style={estilos.textoVazioDescricao}>
        Explore nossos anúncios e encontre produtos incríveis
      </Text>
      
      <TouchableOpacity
        style={estilos.botaoExplorar}
        onPress={navegarParaAnuncios}
        activeOpacity={theme.opacity.active}
      >
        <Text style={estilos.textoBotaoExplorar}>
          Explorar anúncios
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Header da tela
  const renderizarHeader = () => (
    <View style={estilos.header}>
      <TouchableOpacity
        onPress={() => navegacao.goBack()}
        style={estilos.botaoVoltar}
        activeOpacity={theme.opacity.active}
      >
        <Icon
          name="arrow-left"
          type="material-community"
          size={24}
          color={theme.colors.black}
        />
      </TouchableOpacity>
      
      <Text style={estilos.tituloHeader}>
        Minhas Compras
      </Text>
      
      <View style={estilos.espacoDireita} />
    </View>
  );

  return (
    <SafeAreaView style={estilos.container}>
      {renderizarHeader()}
      
      {estaVazio ? (
        <ScrollView 
          contentContainerStyle={estilos.scrollVazio}
          showsVerticalScrollIndicator={false}
        >
          {renderizarEstadoVazio()}
        </ScrollView>
      ) : (
        <FlatList
          data={compras}
          renderItem={renderizarItemCompra}
          keyExtractor={(item) => item.id}
          contentContainerStyle={estilos.listaConteudo}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderizarEstadoVazio}
          refreshing={estaCarregando}
          onRefresh={() => {
            setEstaCarregando(true);
            // Simular carregamento
            setTimeout(() => setEstaCarregando(false), 1000);
          }}
        />
      )}
    </SafeAreaView>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
    backgroundColor: theme.colors.white,
  },
  botaoVoltar: {
    padding: theme.spacing.xs,
  },
  tituloHeader: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.fonts.heading,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.black,
  },
  espacoDireita: {
    width: 40,
  },
  listaConteudo: {
    paddingBottom: theme.spacing.xl,
  },
  itemCompra: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
    backgroundColor: theme.colors.white,
    minHeight: 90,
  },
  containerImagem: {
    marginRight: theme.spacing.md,
  },
  imagemProduto: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.gray100,
  },
  infoProduto: {
    flex: 1,
    justifyContent: 'center',
  },
  tituloProduto: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.fonts.body,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.black,
    marginBottom: 2,
  },
  precoProduto: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.fonts.body,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary[600],
    marginBottom: 2,
  },
  dataCompra: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fonts.body,
    color: theme.colors.gray600,
    marginBottom: theme.spacing.xs,
  },
  containerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeStatus: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  textoStatus: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fonts.body,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.white,
  },
  containerVazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing['3xl'],
  },
  scrollVazio: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  iconeContainer: {
    marginBottom: theme.spacing.lg,
  },
  textoVazioTitulo: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.fonts.heading,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.black,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  textoVazioDescricao: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.fonts.body,
    color: theme.colors.gray600,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  botaoExplorar: {
    backgroundColor: theme.colors.primary[500],
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  textoBotaoExplorar: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.fonts.body,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
  },
});

export default ComprasScreen;