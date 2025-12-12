// src/styles/screens/TelaPesquisaStyles.ts
import { StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray50,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexGrow: 1,
  },
  card: {
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    backgroundColor: theme.colors.white,
  },
  cardContent: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.sm,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.gray900,
    marginBottom: theme.spacing.xs,
  },
  productPrice: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary[500],
    marginBottom: theme.spacing.xs,
  },
  productLocation: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray600,
    marginBottom: theme.spacing.xs,
  },
  productHighlight: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.success,
    fontWeight: theme.typography.weights.medium,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing['3xl'],
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.gray800,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.gray500,
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.gray600,
  },
  searchInfoContainer: {
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  searchInfoText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray700,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  resultsCount: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray600,
    fontWeight: theme.typography.weights.medium,
  },
});