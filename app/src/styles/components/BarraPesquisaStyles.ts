// styles/Componentes/BarraPesquisaStyles.ts
import { StyleSheet } from 'react-native';

import { theme } from '../../theme/theme';

export const BarraPesquisaStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  
  // Barra principal de pesquisa
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.gray800,
    padding: 0,
    margin: 0,
    includeFontPadding: false,
  },
  
  clearButton: {
    marginLeft: theme.spacing.sm,
    padding: 4,
  },
  
  filterButton: {
    backgroundColor: theme.colors.primary[500],
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Contador de resultados
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    minHeight: 24,
  },
  
  resultsText: {
    fontSize: 14,
    color: theme.colors.gray600,
    fontFamily: theme.fonts.body,
  },
  
  clearAllButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  
  clearAllText: {
    fontSize: 12,
    color: theme.colors.primary[500],
    fontFamily: theme.fonts.body,
    fontWeight: '500',
  },
  
  // Badges de filtros ativos
  badgesContainer: {
    marginTop: theme.spacing.sm,
  },
  
  badgesScrollView: {
    flexDirection: 'row',
  },
  
  badgesContent: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingRight: theme.spacing.sm,
  },
  
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary[500],
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  
  badgeText: {
    fontSize: 12,
    color: theme.colors.white,
    fontFamily: theme.fonts.body,
    fontWeight: '500',
  },
  
  badgeCloseButton: {
    padding: 2,
  },
});

// Constantes específicas do componente
export const BarraPesquisaConstants = {
  debounceDelay: 500,
  iconSizes: {
    search: theme.iconSizes.medium,
    clear: theme.iconSizes.small,
    filter: theme.iconSizes.medium,
    badgeClose: theme.iconSizes.large,
  },
  placeholderColor: theme.colors.gray400,
};