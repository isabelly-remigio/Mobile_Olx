// screens/compras.tsx
import { Icon } from '@rneui/themed';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiService } from '../src/services/api';
import { theme } from '../src/theme/theme';
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

// Inicialmente vazio — carregaremos do backend
const comprasMock: ItemCompra[] = [];

const ComprasScreen: React.FC<ComprasScreenProps> = ({ navegacao }) => {
  const [compras, setCompras] = React.useState<ItemCompra[]>(comprasMock);
  const [estaCarregando, setEstaCarregando] = React.useState(false);
  const [estaVazio, setEstaVazio] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    fetchCompras();
  }, []);

  const mapStatus = (raw?: string | null): StatusCompra => {
    if (!raw) return 'aguardando_pagamento';
    const s = String(raw).toUpperCase().trim();

    // Mapeamento explícito para o enum do backend
    if (s === 'PENDENTE') return 'aguardando_pagamento';
    if (s === 'APROVADO') return 'aguardando_envio';
    if (s === 'FALHOU') return 'aguardando_pagamento';
    if (s === 'CANCELADO') return 'cancelado';

    // Fallback heurístico (mantido para compatibilidade com outras strings)
    if (s.includes('ENTREG') || s.includes('COMPLET')) return 'entregue';
    if (s.includes('ENVIAD')) return 'enviado';
    if (s.includes('ENVIO')) return 'aguardando_envio';
    if (s.includes('PAG') || s.includes('PEND') || s.includes('FAL')) return 'aguardando_pagamento';
    return 'aguardando_pagamento';
  };

  const formatarDataIso = (iso?: string | null) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('pt-BR');
    } catch (e) {
      return String(iso);
    }
  };

  const fetchCompras = async () => {
    setEstaCarregando(true);
    try {
      const resp: any[] = await apiService.get('/pagamento/me');
      if (!Array.isArray(resp)) {
        throw new Error('Resposta inválida do servidor');
      }

      const mapped: ItemCompra[] = resp.map((p: any) => {
        const produto = p.produto || p.produtoDto || p.produtoResponse || {};
        const titulo = produto.titulo || produto.nome || produto.title || produto.name || produto.descricao || 'Produto';
        const imagem = produto.imagem || produto.imagemUrl || produto.imagemPrincipal || produto.imagens?.[0] || 'https://via.placeholder.com/150';
        const preco = (p.amountCents ?? produto.preco ?? produto.price ?? 0) / 100;
        const data = formatarDataIso(p.dataConfirmacao || p.dataCriacao || p.createdAt || p.data);
        const status = mapStatus(p.status || p.statusPagamento || p.statusPagamento?.name || produto.status);

        return {
          id: String(p.id || p.pagamentoId || p.paymentId || produto.id || Math.random()),
          imagem,
          titulo,
          preco: Number(preco || 0),
          data,
          status,
        } as ItemCompra;
      });

      setCompras(mapped);
      setEstaVazio(mapped.length === 0);
    } catch (error: any) {
      console.error('[compras] erro ao carregar compras', error);
      Alert.alert('Erro', error?.message || 'Não foi possível carregar compras.');
      setEstaVazio(true);
    } finally {
      setEstaCarregando(false);
    }
  };

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
        onPress={() => router.back()}
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
            fetchCompras();
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