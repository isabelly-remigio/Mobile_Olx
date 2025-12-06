import { StyleSheet } from 'react-native';
import { theme } from '../../src/theme/theme';

export const HomeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  
  // Container para o header
  headerContainer: {
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  
  // Container para a barra de pesquisa
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  
  // Container para as categorias
  categoriesContainer: {
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  
  // Conteúdo principal
  content: {
    flex: 1,
    backgroundColor: theme.colors.gray50,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingBottom: 100, // Espaço para o footer
  },
  
  // Container para o carrossel
  carouselContainer: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing['2xl'],
    marginHorizontal: theme.spacing.md,
  },
  
  // Seções de conteúdo
  sectionContainer: {
    marginBottom: theme.spacing['2xl'],
    paddingHorizontal: theme.spacing.md,
  },
  
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.gray800,
    marginBottom: theme.spacing.md,
    fontFamily: theme.fonts.heading,
  },
  
  // Título de resultados de busca
  searchResultsTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.gray600,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    fontFamily: theme.fonts.heading,
  },
  
  // Estado vazio
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing['3xl'],
    paddingHorizontal: theme.spacing.xl,
  },
  
  emptyStateIcon: {
    marginBottom: theme.spacing.lg,
  },
  
  emptyStateTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.gray700,
    textAlign: 'center',
    fontFamily: theme.fonts.body,
    marginBottom: theme.spacing.sm,
  },
  
  emptyStateSubtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.gray500,
    textAlign: 'center',
    fontFamily: theme.fonts.body,
    lineHeight: 22,
  },
  
  // Container para produtos
  produtosContainer: {
    paddingRight: theme.spacing.md,
    gap: theme.spacing.md,
  },
  
  produtoWrapper: {
    marginRight: theme.spacing.md,
  },
  
  // Espaçamento para o footer
  footerSpacer: {
    height: 80,
  },
});