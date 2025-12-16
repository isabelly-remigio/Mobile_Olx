import { apiService } from '@/app/src/services/api';
import { theme } from '@/app/src/theme/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Icon } from '@rneui/themed';

export default function DetalhesCompra() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const resp: any = await apiService.get('/pagamento/me');
        const list = Array.isArray(resp) ? resp : (resp?.items || []);
        const found = list.find((p: any) => String(p.id || p.pagamentoId || p.paymentId) === String(id));
        if (!found) throw new Error('Compra não encontrada');
        setData(found);
      } catch (err: any) {
        console.error('[DetalhesCompra] erro:', err);
        setError(err?.message || 'Erro ao carregar detalhes da compra');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const openUrl = async (url?: string) => {
    if (!url) return;
    try {
      if (Platform.OS === 'web') {
        window.location.href = url;
        return;
      }
      const can = await Linking.canOpenURL(url);
      if (can) await Linking.openURL(url);
      else Alert.alert('Erro', 'Não foi possível abrir a URL');
    } catch (err) {
      console.error('[DetalhesCompra] abrir URL erro:', err);
      Alert.alert('Erro', 'Não foi possível abrir a URL');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'aprovado':
      case 'paid':
      case 'pago':
        return theme.colors.success; // Verde
      case 'pending':
      case 'pendente':
        return theme.colors.warning; // Amarelo
      case 'rejected':
      case 'recusado':
      case 'canceled':
      case 'cancelado':
        return theme.colors.error; // Vermelho
      default:
        return theme.colors.gray500; // Cinza
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'aprovado':
      case 'paid':
      case 'pago':
        return 'check-circle';
      case 'pending':
      case 'pendente':
        return 'schedule';
      case 'rejected':
      case 'recusado':
      case 'canceled':
      case 'cancelado':
        return 'cancel';
      default:
        return 'help';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'aprovado':
        return 'Aprovado';
      case 'pending':
      case 'pendente':
        return 'Pendente';
      case 'rejected':
      case 'recusado':
        return 'Recusado';
      case 'paid':
      case 'pago':
        return 'Pago';
      case 'canceled':
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
          <Text style={styles.loadingText}>Carregando detalhes da compra...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
        <ScrollView contentContainerStyle={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <Icon
              name="error-outline"
              type="material"
              size={64}
              color={theme.colors.error}
            />
          </View>
          <Text style={styles.errorTitle}>Ops! Algo deu errado</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.primaryButton}
            activeOpacity={theme.opacity.active}
          >
            <Text style={styles.primaryButtonText}>Voltar</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
        <ScrollView contentContainerStyle={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Icon
              name="search-off"
              type="material"
              size={64}
              color={theme.colors.gray400}
            />
          </View>
          <Text style={styles.emptyTitle}>Nenhum dado encontrado</Text>
          <Text style={styles.emptyMessage}>
            Não foi possível encontrar os detalhes desta compra
          </Text>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.primaryButton}
            activeOpacity={theme.opacity.active}
          >
            <Text style={styles.primaryButtonText}>Voltar</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const pagamentoId = String(data.id || data.pagamentoId || data.paymentId || '');
  const status = String(data.status || data.statusPagamento || '');
  const amountCents = Number(data.amountCents ?? data.amount ?? 0);
  const total = (amountCents / 100).toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  });

  // Formatando a data
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não informada';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={theme.opacity.active}
        >
          <Icon
            name="arrow-back"
            type="material"
            size={24}
            color={theme.colors.gray700}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da Compra</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Icon
              name={getStatusIcon(status)}
              type="material"
              size={24}
              color={getStatusColor(status)}
            />
            <Text style={styles.statusTitle}>Status do Pagamento</Text>
          </View>
          
          <View style={[
            styles.statusBadge,
            { 
              backgroundColor: getStatusColor(status) + '15',
              borderColor: getStatusColor(status) + '30'
            }
          ]}>
            <View style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(status) }
            ]} />
            <Text style={[
              styles.statusText,
              { color: getStatusColor(status) }
            ]}>
              {getStatusText(status)}
            </Text>
          </View>
          
          <Text style={styles.statusDescription}>
            {status?.toLowerCase().includes('approved') || status?.toLowerCase().includes('aprovado')
              ? 'Seu pagamento foi confirmado com sucesso!'
              : status?.toLowerCase().includes('pending') || status?.toLowerCase().includes('pendente')
              ? 'Seu pagamento está sendo processado. Aguarde a confirmação.'
              : 'Entre em contato com o suporte para mais informações.'}
          </Text>
        </View>

        {/* Detalhes da Compra */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Informações da Compra</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Icon
                name="receipt"
                type="material"
                size={20}
                color={theme.colors.gray500}
                style={styles.detailIcon}
              />
              <Text style={styles.detailLabel}>Número do Pedido</Text>
            </View>
            <Text style={styles.detailValue}>{pagamentoId}</Text>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Icon
                name="calendar-today"
                type="material"
                size={20}
                color={theme.colors.gray500}
                style={styles.detailIcon}
              />
              <Text style={styles.detailLabel}>Data</Text>
            </View>
            <Text style={styles.detailValue}>
              {formatDate(data.createdAt || data.dataCriacao)}
            </Text>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Icon
                name="attach-money"
                type="material"
                size={20}
                color={theme.colors.gray500}
                style={styles.detailIcon}
              />
              <Text style={styles.detailLabel}>Valor Total</Text>
            </View>
            <Text style={styles.totalValue}>{total}</Text>
          </View>
        </View>

        {/* Método de Pagamento (se disponível) */}
        {(data.paymentMethod || data.metodoPagamento) && (
          <View style={styles.paymentCard}>
            <Text style={styles.detailsTitle}>Método de Pagamento</Text>
            <View style={styles.paymentMethod}>
              <Icon
                name="credit-card"
                type="material"
                size={24}
                color={theme.colors.primary[500]}
              />
              <Text style={styles.paymentMethodText}>
                {data.paymentMethod || data.metodoPagamento}
              </Text>
            </View>
          </View>
        )}

        {/* Botões de Ação */}
        <View style={styles.actionsContainer}>
          {data.checkoutUrl && (
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={() => openUrl(String(data.checkoutUrl))}
              activeOpacity={theme.opacity.active}
            >
              <Icon
                name="open-in-new"
                type="material"
                size={20}
                color={theme.colors.white}
                style={styles.buttonIcon}
              />
              <Text style={styles.checkoutButtonText}>Abrir Checkout</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.back()}
            activeOpacity={theme.opacity.active}
          >
            <Text style={styles.secondaryButtonText}>Voltar</Text>
          </TouchableOpacity>
          
          {/* Suporte */}
          <TouchableOpacity 
            style={styles.supportButton}
            onPress={() => Alert.alert('Suporte', 'Entre em contato pelo email: suporte@exemplo.com')}
            activeOpacity={theme.opacity.active}
          >
            <Icon
              name="help"
              type="material"
              size={20}
              color={theme.colors.primary[500]}
              style={styles.buttonIcon}
            />
            <Text style={styles.supportButtonText}>Precisa de ajuda?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.lg,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.gray600,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorIconContainer: {
    marginBottom: theme.spacing.xl,
  },
  errorTitle: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.gray800,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.gray600,
    textAlign: 'center',
    marginBottom: theme.spacing['2xl'],
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyIconContainer: {
    marginBottom: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.gray800,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.gray600,
    textAlign: 'center',
    marginBottom: theme.spacing['2xl'],
    lineHeight: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
    ...Platform.select({
      ios: theme.shadows.sm,
      android: theme.shadows.sm,
    }),
  },
  backButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.gray800,
  },
  headerRightPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing['2xl'],
  },
  statusCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  statusTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.gray800,
    marginLeft: theme.spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
  statusText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
  },
  statusDescription: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.gray600,
    lineHeight: 22,
  },
  detailsCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  detailsTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.gray800,
    marginBottom: theme.spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    marginRight: theme.spacing.md,
  },
  detailLabel: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.gray600,
    flex: 1,
  },
  detailValue: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.gray800,
    textAlign: 'right',
  },
  totalValue: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.success,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.gray200,
    marginBottom: theme.spacing.md,
  },
  paymentCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary[50],
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
  paymentMethodText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary[500],
    marginLeft: theme.spacing.md,
  },
  actionsContainer: {
    marginTop: theme.spacing.sm,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.secondary[500], // LARANJA do tema
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.secondary[500],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  checkoutButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.white,
    marginLeft: theme.spacing.sm,
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.gray100,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
  secondaryButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.gray700,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
  },
  supportButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.primary[500],
    marginLeft: theme.spacing.sm,
  },
  buttonIcon: {
    marginRight: theme.spacing.sm,
  },
  primaryButton: {
    backgroundColor: theme.colors.secondary[500], // LARANJA do tema
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing['2xl'],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    minWidth: 200,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.secondary[500],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  primaryButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.white,
  },
});