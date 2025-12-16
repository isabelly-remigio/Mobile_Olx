// screens/compras.tsx - VERSÃO COMPLETA COM CANCELAMENTO
import { Icon } from '@rneui/themed';
import { useRouter } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  StatusBar,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { apiService } from '../src/services/api';
import { theme } from '../src/theme/theme';
import { useAuth } from '../src/context/AuthContext';

// Tipos atualizados
type StatusCompra = 'entregue' | 'enviado' | 'cancelado' | 'aguardando_pagamento' | 'aguardando_envio' | 'concluido' | 'pendente' | 'aprovado' | 'falhou';

interface ProdutoInfo {
  id: string;
  nome: string;
  imagem?: string;
  preco: number;
  vendido?: boolean;
  disponivel?: boolean;
}

interface PagamentoResponse {
  id: string;
  pagamentoId: string;
  paymentId: string;
  produtoId: string;
  produtoNome: string;
  produtoImagem?: string;
  amountCents: number;
  status: string;
  statusPagamento: string;
  dataCriacao: string;
  dataConfirmacao?: string;
  checkoutUrl?: string;
  produto?: ProdutoInfo;
  vendido?: boolean;
  stripeSessionId?: string;
}

interface ItemCompra {
  id: string;
  pagamentoId: string;
  imagem: string;
  titulo: string;
  preco: number;
  data: string;
  status: StatusCompra;
  statusOriginal: string;
  produtoId: string;
  vendido: boolean;
  checkoutUrl?: string;
  podeCancelar?: boolean;
  stripeSessionId?: string;
}

const ComprasScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [compras, setCompras] = useState<ItemCompra[]>([]);
  const [estaCarregando, setEstaCarregando] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalCancelarVisivel, setModalCancelarVisivel] = useState(false);
  const [pagamentoParaCancelar, setPagamentoParaCancelar] = useState<ItemCompra | null>(null);
  const [cancelando, setCancelando] = useState(false);

  // Mapeamento dos status
  const mapStatus = useCallback((raw?: string | null): StatusCompra => {
    if (!raw) return 'pendente';
    const s = String(raw).toUpperCase().trim();

    switch (s) {
      case 'PENDENTE':
      case 'PENDING':
        return 'pendente';
      case 'APROVADO':
      case 'APPROVED':
      case 'PAID':
      case 'PAGO':
      case 'CONCLUIDO':
      case 'COMPLETED':
        return 'concluido';
      case 'ENVIADO':
      case 'SHIPPED':
        return 'enviado';
      case 'ENTREGUE':
      case 'DELIVERED':
        return 'entregue';
      case 'CANCELADO':
      case 'CANCELED':
      case 'REJECTED':
      case 'FALHOU':
      case 'FAILED':
        return 'cancelado';
      case 'AGUARDANDO_ENVIO':
      case 'AWAITING_SHIPMENT':
        return 'aguardando_envio';
      default:
        if (s.includes('ENTREG') || s.includes('DELIVER')) return 'entregue';
        if (s.includes('ENVIAD') || s.includes('SHIP')) return 'enviado';
        if (s.includes('APROV') || s.includes('APPROV') || s.includes('PAID')) return 'concluido';
        if (s.includes('CANCEL') || s.includes('REJECT')) return 'cancelado';
        if (s.includes('PEND') || s.includes('WAITING')) return 'pendente';
        return 'pendente';
    }
  }, []);

  const formatarDataIso = (iso?: string | null) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return String(iso);
    }
  };

  // Função para verificar se pode cancelar
  const verificarPodeCancelar = async (pagamentoId: string): Promise<boolean> => {
    try {
      const response = await apiService.get(`/pagamento/${pagamentoId}/pode-cancelar`);
      return response.podeCancelar === true;
    } catch (error) {
      console.warn('Erro ao verificar se pode cancelar:', error);
      return false;
    }
  };

  const fetchCompras = useCallback(async () => {
    if (!user) {
      Alert.alert('Login necessário', 'Faça login para ver suas compras.');
      router.push('/auth/Login/login');
      return;
    }

    setEstaCarregando(true);
    setError(null);
    
    try {
      console.log('Buscando compras...');
      const resp: any[] = await apiService.get('/pagamento/me');
      console.log('Resposta da API:', resp.length, 'itens');
      
      if (!Array.isArray(resp)) {
        throw new Error('Resposta inválida do servidor');
      }

      // Processa cada compra
      const comprasProcessadas = await Promise.all(
        resp.map(async (p: PagamentoResponse) => {
          const produto = p.produto || {};
          const produtoId = String(p.produtoId || produto.id || '');
          const titulo = p.produtoNome || produto.nome || produto.titulo || 'Produto sem nome';
          const imagem = p.produtoImagem || produto.imagem || 'https://via.placeholder.com/150/6C2BD9/FFFFFF?text=Produto';
          const preco = (p.amountCents || produto.preco || 0) / 100;
          const data = formatarDataIso(p.dataConfirmacao || p.dataCriacao || new Date().toISOString());
          const statusOriginal = p.status || p.statusPagamento || 'PENDENTE';
          const status = mapStatus(statusOriginal);
          
          const vendido = status === 'concluido' || 
                          status === 'entregue' || 
                          status === 'enviado' ||
                          produto.vendido === true ||
                          produto.disponivel === false;

          // Verifica se pode cancelar (apenas para compras pendentes)
          const podeCancelar = status === 'pendente' || status === 'aguardando_pagamento';

          return {
            id: String(p.id || p.pagamentoId || p.paymentId || Math.random()),
            pagamentoId: String(p.id || p.pagamentoId || ''),
            imagem,
            titulo,
            preco: Number(preco || 0),
            data,
            status,
            statusOriginal,
            produtoId,
            vendido,
            checkoutUrl: p.checkoutUrl,
            podeCancelar,
            stripeSessionId: p.stripeSessionId,
          } as ItemCompra;
        })
      );

      console.log('Compras processadas:', comprasProcessadas.length);
      setCompras(comprasProcessadas);
      
    } catch (error: any) {
      console.error('[compras] erro ao carregar compras', error);
      setError(error?.message || 'Não foi possível carregar compras.');
    } finally {
      setEstaCarregando(false);
    }
  }, [user, mapStatus, router]);

  // Função para cancelar pagamento
  const cancelarPagamento = async (compra: ItemCompra) => {
    if (!compra.podeCancelar) {
      Alert.alert('Não pode cancelar', 'Este pagamento não pode ser cancelado.');
      return;
    }

    setCancelando(true);
    try {
      console.log('Cancelando pagamento:', compra.pagamentoId);
      
      const response = await apiService.post(`/pagamento/${compra.pagamentoId}/cancelar`, {});
      
      if (response.success) {
        Alert.alert(
          'Cancelado com sucesso!',
          'Seu pagamento foi cancelado e o produto está disponível novamente.',
          [
            {
              text: 'OK',
              onPress: () => {
                setModalCancelarVisivel(false);
                fetchCompras(); // Atualiza a lista
              }
            }
          ]
        );
      } else {
        Alert.alert('Erro', response.error || 'Não foi possível cancelar o pagamento.');
      }
    } catch (error: any) {
      console.error('Erro ao cancelar pagamento:', error);
      Alert.alert(
        'Erro ao cancelar',
        error?.message || 'Não foi possível cancelar o pagamento. Tente novamente mais tarde.'
      );
    } finally {
      setCancelando(false);
    }
  };

  // Abrir modal de confirmação de cancelamento
  const abrirModalCancelar = (compra: ItemCompra) => {
    setPagamentoParaCancelar(compra);
    setModalCancelarVisivel(true);
  };

  // Função para obter a cor do status
  const obterCorStatus = (status: StatusCompra): string => {
    switch (status) {
      case 'entregue':
      case 'concluido':
        return theme.colors.success;
      case 'enviado':
        return theme.colors.secondary[500];
      case 'aprovado':
        return '#10B981';
      case 'cancelado':
      case 'falhou':
        return theme.colors.error;
      case 'aguardando_pagamento':
      case 'pendente':
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
      case 'concluido':
      case 'aprovado':
        return 'Concluído';
      case 'enviado':
        return 'Enviado';
      case 'cancelado':
      case 'falhou':
        return 'Cancelado';
      case 'aguardando_pagamento':
      case 'pendente':
        return 'Aguardando Pagamento';
      case 'aguardando_envio':
        return 'Aguardando Envio';
      default:
        return status;
    }
  };

  // Função para formatar preço
  const formatarPreco = (preco: number): string => {
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Função para navegar para detalhes da compra
  const navegarParaDetalhesCompra = (compra: ItemCompra) => {
    router.push({
      pathname: '/compras/[id]',
      params: { 
        id: compra.pagamentoId || compra.id,
        produtoId: compra.produtoId,
        status: compra.status
      }
    });
  };

  // Renderizar item da lista
  const renderizarItemCompra = ({ item }: { item: ItemCompra }) => {
    const precisaPagar = item.status === 'pendente' || item.status === 'aguardando_pagamento';
    const podeCancelarItem = item.podeCancelar && !item.vendido;
    
    return (
      <TouchableOpacity
        style={[
          estilos.itemCompra,
          item.vendido && estilos.itemVendido,
          item.status === 'cancelado' && estilos.itemCancelado
        ]}
        onPress={() => navegarParaDetalhesCompra(item)}
        activeOpacity={theme.opacity.active}
      >
        {item.vendido && (
          <View style={estilos.vendidoBadge}>
            <Text style={estilos.vendidoText}>VENDIDO</Text>
          </View>
        )}
        
        {item.status === 'cancelado' && (
          <View style={estilos.canceladoBadge}>
            <Icon name="close" type="material" size={12} color={theme.colors.white} />
            <Text style={estilos.canceladoText}>CANCELADO</Text>
          </View>
        )}
        
        <View style={estilos.containerImagem}>
          <Image
            source={{ uri: item.imagem }}
            style={estilos.imagemProduto}
            defaultSource={{ uri: 'https://via.placeholder.com/150/6C2BD9/FFFFFF?text=Produto' }}
          />
        </View>
        
        <View style={estilos.infoProduto}>
          <Text style={[
            estilos.tituloProduto,
            (item.vendido || item.status === 'cancelado') && estilos.tituloVendido
          ]} numberOfLines={2}>
            {item.titulo}
          </Text>
          
          <Text style={[
            estilos.precoProduto,
            (item.vendido || item.status === 'cancelado') && estilos.precoVendido
          ]}>
            {formatarPreco(item.preco)}
          </Text>
          
          <Text style={estilos.dataCompra}>
            {item.status === 'concluido' ? 'Concluído em ' : 'Comprado em '}{item.data}
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
            
            {/* Botões de ação */}
            <View style={estilos.botoesAcao}>
              {precisaPagar && item.checkoutUrl && (
                <TouchableOpacity
                  style={estilos.botaoCheckout}
                  onPress={() => {
                    Alert.alert(
                      'Concluir Pagamento',
                      'Deseja concluir o pagamento agora?',
                      [
                        { text: 'Cancelar', style: 'cancel' },
                        { 
                          text: 'Continuar', 
                          onPress: () => {
                            // Implementar navegação para checkout
                            console.log('Abrindo checkout:', item.checkoutUrl);
                          }
                        }
                      ]
                    );
                  }}
                  activeOpacity={theme.opacity.active}
                >
                  <Text style={estilos.textoBotaoCheckout}>Pagar</Text>
                </TouchableOpacity>
              )}
              
              {podeCancelarItem && (
                <TouchableOpacity
                  style={estilos.botaoCancelar}
                  onPress={() => abrirModalCancelar(item)}
                  activeOpacity={theme.opacity.active}
                >
                  <Icon name="close" type="material" size={14} color={theme.colors.error} />
                  <Text style={estilos.textoBotaoCancelar}>Cancelar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        
        <Icon
          name="chevron-right"
          type="material-community"
          color={item.vendido || item.status === 'cancelado' ? theme.colors.gray400 : theme.colors.gray600}
          size={24}
        />
      </TouchableOpacity>
    );
  };

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
        onPress={() => router.push('/(tabs)')}
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
        onPress={() => router.push('/menu') }
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
      
      <TouchableOpacity
        onPress={fetchCompras}
        style={estilos.botaoAtualizar}
        activeOpacity={theme.opacity.active}
      >
        <Icon
          name="refresh"
          type="material-community"
          size={24}
          color={theme.colors.primary[500]}
        />
      </TouchableOpacity>
    </View>
  );

  // Modal de confirmação de cancelamento
  const renderModalCancelar = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalCancelarVisivel}
      onRequestClose={() => setModalCancelarVisivel(false)}
    >
      <View style={estilos.modalOverlay}>
        <View style={estilos.modalContainer}>
          <View style={estilos.modalHeader}>
            <Icon name="warning" type="material" size={32} color={theme.colors.warning} />
            <Text style={estilos.modalTitulo}>Cancelar Pagamento</Text>
          </View>
          
          <Text style={estilos.modalMensagem}>
            Tem certeza que deseja cancelar o pagamento do produto{'\n'}
            <Text style={estilos.modalProdutoNome}>
              "{pagamentoParaCancelar?.titulo}"
            </Text>
            {'\n\n'}
            • O produto ficará disponível para outros compradores{'\n'}
            • Você pode comprá-lo novamente se desejar{'\n'}
            • Esta ação não pode ser desfeita
          </Text>
          
          <View style={estilos.modalBotoes}>
            <TouchableOpacity
              style={estilos.modalBotaoCancelar}
              onPress={() => setModalCancelarVisivel(false)}
              disabled={cancelando}
            >
              <Text style={estilos.modalTextoBotaoCancelar}>Voltar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={estilos.modalBotaoConfirmar}
              onPress={() => pagamentoParaCancelar && cancelarPagamento(pagamentoParaCancelar)}
              disabled={cancelando}
            >
              {cancelando ? (
                <ActivityIndicator size="small" color={theme.colors.white} />
              ) : (
                <>
                  <Icon name="close" type="material" size={18} color={theme.colors.white} />
                  <Text style={estilos.modalTextoBotaoConfirmar}>Cancelar Pagamento</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  useEffect(() => {
    fetchCompras();
  }, [fetchCompras]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCompras();
    setRefreshing(false);
  }, [fetchCompras]);

  return (
    <SafeAreaView style={estilos.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
      
      {renderizarHeader()}
      {renderModalCancelar()}
      
      {error ? (
        <View style={estilos.erroContainer}>
          <Icon name="alert-circle" type="material-community" size={24} color={theme.colors.error} />
          <Text style={estilos.erroTexto}>{error}</Text>
          <TouchableOpacity onPress={fetchCompras} style={estilos.botaoTentarNovamente}>
            <Text style={estilos.textoBotaoTentar}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={compras}
          renderItem={renderizarItemCompra}
          keyExtractor={(item) => item.id}
          contentContainerStyle={estilos.listaConteudo}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderizarEstadoVazio}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary[500]]}
              tintColor={theme.colors.primary[500]}
            />
          }
          ListHeaderComponent={
            compras.length > 0 && (
              <View style={estilos.headerLista}>
                <Text style={estilos.totalCompras}>
                  {compras.length} {compras.length === 1 ? 'compra' : 'compras'}
                </Text>
                <Text style={estilos.legendaStatus}>
                  Pagamentos pendentes podem ser cancelados
                </Text>
              </View>
            )
          }
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
    ...theme.shadows.sm,
  },
  botaoVoltar: {
    padding: theme.spacing.xs,
  },
  botaoAtualizar: {
    padding: theme.spacing.xs,
  },
  tituloHeader: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.fonts.heading,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.gray800,
  },
  listaConteudo: {
    paddingBottom: theme.spacing.xl,
  },
  headerLista: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
    backgroundColor: theme.colors.gray50,
  },
  totalCompras: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.fonts.body,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.gray700,
    marginBottom: theme.spacing.xs,
  },
  legendaStatus: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fonts.body,
    color: theme.colors.gray500,
  },
  itemCompra: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
    backgroundColor: theme.colors.white,
    minHeight: 100,
    position: 'relative',
  },
  itemVendido: {
    backgroundColor: theme.colors.gray50,
    opacity: 0.9,
  },
  itemCancelado: {
    backgroundColor: '#FEF2F2',
  },
  vendidoBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.gray600,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    zIndex: 10,
  },
  vendidoText: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fonts.body,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
  },
  canceladoBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  canceladoText: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fonts.body,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
    marginLeft: 4,
  },
  containerImagem: {
    marginRight: theme.spacing.md,
  },
  imagemProduto: {
    width: 70,
    height: 70,
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
    color: theme.colors.gray800,
    marginBottom: 4,
  },
  tituloVendido: {
    color: theme.colors.gray600,
    textDecorationLine: 'line-through',
  },
  precoProduto: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.fonts.body,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary[600],
    marginBottom: 4,
  },
  precoVendido: {
    color: theme.colors.gray500,
    textDecorationLine: 'line-through',
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
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
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
  botoesAcao: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botaoCheckout: {
    backgroundColor: theme.colors.secondary[500],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
  },
  textoBotaoCheckout: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fonts.body,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.white,
  },
  botaoCancelar: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoBotaoCancelar: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fonts.body,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.error,
    marginLeft: 4,
  },
  containerVazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing['3xl'],
  },
  iconeContainer: {
    marginBottom: theme.spacing.lg,
  },
  textoVazioTitulo: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.fonts.heading,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.gray800,
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
  erroContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  erroTexto: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.fonts.body,
    color: theme.colors.error,
    textAlign: 'center',
    marginVertical: theme.spacing.md,
  },
  botaoTentarNovamente: {
    backgroundColor: theme.colors.primary[500],
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.md,
  },
  textoBotaoTentar: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.fonts.body,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
  },
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 400,
    ...theme.shadows.lg,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitulo: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.fonts.heading,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.gray800,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  modalMensagem: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.fonts.body,
    color: theme.colors.gray600,
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  modalProdutoNome: {
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.gray800,
  },
  modalBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  modalBotaoCancelar: {
    flex: 1,
    backgroundColor: theme.colors.gray100,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  modalTextoBotaoCancelar: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.fonts.body,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.gray700,
  },
  modalBotaoConfirmar: {
    flex: 1,
    backgroundColor: theme.colors.error,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  modalTextoBotaoConfirmar: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.fonts.body,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.white,
  },
});

export default ComprasScreen;