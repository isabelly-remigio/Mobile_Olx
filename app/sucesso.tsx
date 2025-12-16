import { Icon } from '@rneui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { theme } from './src/theme/theme'; // ajuste o caminho conforme necessário

export default function PaginaSucesso() {
  const router = useRouter();
  const localParams = useLocalSearchParams() as Record<string, any>;
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

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.replace('/')} 
            style={styles.backButton}
          >
            <Icon 
              name="arrow-back" 
              type="material" 
              size={26} 
              color={theme.colors.gray700} 
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pagamento concluído</Text>
        </View>

        {/* Conteúdo principal */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Icon 
                name="check-circle" 
                type="material" 
                size={80} 
                color={theme.colors.success} 
              />
            </View>
            <Text style={styles.title}>Pagamento realizado com sucesso!</Text>
            <Text style={styles.subtitle}>
              Obrigado pela sua compra. Seu pedido foi processado e você receberá 
              todas as informações em breve.
            </Text>
          </View>

          {/* Detalhes da compra */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Detalhes da compra</Text>
            
            {session_id && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ID da sessão:</Text>
                <Text style={styles.detailValue}>{String(session_id)}</Text>
              </View>
            )}

            {(produtoNome || produtoId) && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Produto:</Text>
                <Text style={styles.detailValue}>
                  {produtoNome ? produtoNome : `ID: ${produtoId}`}
                </Text>
              </View>
            )}
          </View>

          {/* Botão de ação (único) */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              onPress={() => router.replace('/')} 
              style={[styles.button, styles.orangeButton]}
              activeOpacity={theme.opacity.active}
            >
              <Icon 
                name="home" 
                type="material" 
                size={20} 
                color={theme.colors.white} 
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Voltar para o início</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray50,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    marginRight: theme.spacing.sm,
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.gray800,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  iconBackground: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.gray900,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.gray600,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: theme.spacing.md,
  },
  detailsCard: {
    backgroundColor: theme.colors.white,
    width: '100%',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  detailsTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.gray800,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  detailLabel: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.gray600,
  },
  detailValue: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.gray800,
  },
  actionsContainer: {
    width: '100%',
    marginTop: theme.spacing.xl,
  },
  button: {
    paddingVertical: theme.spacing.md, // Menor altura
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl, // Bordas mais arredondadas
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    ...theme.shadows.sm,
  },
  orangeButton: {
    backgroundColor: theme.colors.secondary[500], // Laranja do tema
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
  },
  buttonIcon: {
    marginRight: theme.spacing.sm,
  },
});