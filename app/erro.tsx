import { Icon } from '@rneui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
  SafeAreaView, 
  Text, 
  TouchableOpacity, 
  View, 
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform
} from 'react-native';
import { theme } from '@/app/src/theme/theme';

export default function PaginaErro() {
  const router = useRouter();
  const localParams = useLocalSearchParams() as Record<string, any>;
  const error = (typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('error')
    : undefined) || localParams.error;

  const session_id = (typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('session_id')
    : undefined) || localParams.session_id || localParams.sessionId;

  const [produtoId, setProdutoId] = useState<number | null>(null);
  const [produtoNome, setProdutoNome] = useState<string | null>(null);

  useEffect(() => {
    const qpProdutoId = (typeof window !== 'undefined') ? new URLSearchParams(window.location.search).get('produtoId') : undefined;
    const qpProdutoNome = (typeof window !== 'undefined') ? new URLSearchParams(window.location.search).get('produtoNome') : undefined;

    if (qpProdutoId) setProdutoId(Number(qpProdutoId));
    if (qpProdutoNome) setProdutoNome(qpProdutoNome);

    if (localParams.produtoId) setProdutoId(Number(localParams.produtoId));
    if (localParams.produtoNome) setProdutoNome(localParams.produtoNome);
  }, [session_id, localParams]);

  const getErrorMessage = () => {
    if (!error) return 'Ocorreu um erro durante o processamento do pagamento.';
    
    const errorStr = String(error).toLowerCase();
    
    if (errorStr.includes('cancel') || errorStr.includes('usuário')) {
      return 'Pagamento cancelado pelo usuário.';
    } else if (errorStr.includes('card') || errorStr.includes('cartão')) {
      return 'Problema com o cartão de crédito. Verifique os dados e tente novamente.';
    } else if (errorStr.includes('timeout') || errorStr.includes('tempo')) {
      return 'Tempo limite excedido. Tente novamente.';
    } else if (errorStr.includes('insufficient') || errorStr.includes('saldo')) {
      return 'Saldo insuficiente.';
    } else {
      return error;
    }
  };

  const getErrorTitle = () => {
    const errorStr = String(error).toLowerCase();
    
    if (errorStr.includes('cancel') || errorStr.includes('usuário')) {
      return 'Pagamento Cancelado';
    } else if (errorStr.includes('card') || errorStr.includes('cartão')) {
      return 'Problema no Cartão';
    } else if (errorStr.includes('timeout') || errorStr.includes('tempo')) {
      return 'Tempo Esgotado';
    } else {
      return 'Pagamento não Concluído';
    }
  };

  const getErrorIcon = () => {
    const errorStr = String(error).toLowerCase();
    
    if (errorStr.includes('cancel') || errorStr.includes('usuário')) {
      return 'do-not-disturb-alt';
    } else if (errorStr.includes('card') || errorStr.includes('cartão')) {
      return 'credit-card-off';
    } else if (errorStr.includes('timeout') || errorStr.includes('tempo')) {
      return 'timer-off';
    } else {
      return 'error-outline';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.replace('/')} 
          style={styles.backButton}
          activeOpacity={theme.opacity.active}
        >
          <Icon 
            name="arrow-back" 
            type="material" 
            size={24} 
            color={theme.colors.gray700} 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getErrorTitle()}</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ícone de Erro */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Icon 
              name={getErrorIcon()} 
              type="material" 
              size={64} 
              color={theme.colors.error} 
            />
          </View>
        </View>

        {/* Mensagem Principal */}
        <View style={styles.messageContainer}>
          <Text style={styles.mainMessage}>
            {getErrorMessage()}
          </Text>
          
          <View style={styles.separator} />

          {/* Informações do Produto */}
          {(produtoNome || produtoId) && (
            <View style={styles.productInfo}>
              <Text style={styles.productInfoTitle}>Produto:</Text>
              <View style={styles.productDetails}>
                {produtoNome && (
                  <Text style={styles.productName} numberOfLines={2}>
                    {produtoNome}
                  </Text>
                )}
                {produtoId && (
                  <Text style={styles.productId}>
                    ID: #{produtoId}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Dicas para o Usuário */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>O que fazer agora?</Text>
            
            <View style={styles.tipItem}>
              <View style={styles.tipIcon}>
                <Icon name="check-circle" type="material" size={16} color={theme.colors.success} />
              </View>
              <Text style={styles.tipText}>
                Verifique os dados do seu cartão de crédito
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <View style={styles.tipIcon}>
                <Icon name="check-circle" type="material" size={16} color={theme.colors.success} />
              </View>
              <Text style={styles.tipText}>
                Confirme se há saldo suficiente
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <View style={styles.tipIcon}>
                <Icon name="check-circle" type="material" size={16} color={theme.colors.success} />
              </View>
              <Text style={styles.tipText}>
                Tente novamente ou escolha outro método de pagamento
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <View style={styles.tipIcon}>
                <Icon name="check-circle" type="material" size={16} color={theme.colors.success} />
              </View>
              <Text style={styles.tipText}>
                Entre em contato com seu banco se o problema persistir
              </Text>
            </View>
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            onPress={() => {
              if (produtoId) {
                router.push(`/(tabs)/anuncio/${produtoId}`);
              } else {
                router.replace('/');
              }
            }}
            style={styles.primaryButton}
            activeOpacity={theme.opacity.active}
          >
            <Icon 
              name="refresh" 
              type="material" 
              size={20} 
              color={theme.colors.white} 
              style={styles.buttonIcon}
            />
            <Text style={styles.primaryButtonText}>
              {produtoId ? 'Tentar Novamente' : 'Voltar para Início'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/compras')}
            style={styles.secondaryButton}
            activeOpacity={theme.opacity.active}
          >
            <Icon 
              name="receipt" 
              type="material" 
              size={20} 
              color={theme.colors.gray700} 
              style={styles.buttonIcon}
            />
            <Text style={styles.secondaryButtonText}>Ver Minhas Compras</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => Alert.alert('Suporte', 'Entre em contato pelo email: suporte@exemplo.com')}
            style={styles.supportButton}
            activeOpacity={theme.opacity.active}
          >
            <Icon 
              name="help" 
              type="material" 
              size={20} 
              color={theme.colors.gray600} 
              style={styles.buttonIcon}
            />
            <Text style={styles.supportButtonText}>Precisa de Ajuda?</Text>
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
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
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
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing['2xl'],
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing['2xl'],
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FECACA',
  },
  messageContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.md,
  },
  mainMessage: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.gray700,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.gray200,
    marginBottom: theme.spacing.lg,
  },
  productInfo: {
    marginBottom: theme.spacing.xl,
  },
  productInfoTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.gray600,
    marginBottom: theme.spacing.sm,
  },
  productDetails: {
    backgroundColor: theme.colors.gray50,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  productName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.gray800,
    marginBottom: theme.spacing.xs,
  },
  productId: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray600,
  },
  tipsContainer: {
    marginTop: theme.spacing.sm,
  },
  tipsTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.gray800,
    marginBottom: theme.spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  tipIcon: {
    marginRight: theme.spacing.md,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray700,
    lineHeight: 20,
  },
  buttonsContainer: {
    marginTop: theme.spacing.sm,
  },
  primaryButton: {
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
  primaryButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.white,
    marginLeft: theme.spacing.sm,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
  },
  secondaryButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.gray700,
    marginLeft: theme.spacing.sm,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
  },
  supportButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.gray600,
    marginLeft: theme.spacing.sm,
  },
  buttonIcon: {
    marginRight: theme.spacing.sm,
  },
});