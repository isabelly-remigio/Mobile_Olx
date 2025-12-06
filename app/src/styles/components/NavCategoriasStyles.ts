// styles/Componentes/NavCategoriasStyles.ts
import { StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

export const NavCategoriasStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
    paddingVertical: theme.spacing.md, // Aumentado o padding vertical
  },
  
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.md, // Adiciona gap entre os itens no ScrollView
  },
  
  categoriasContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  
  categoriaButton: {
    alignItems: 'center',
    minWidth: 70, // Aumentado um pouco a largura mínima
    paddingHorizontal: theme.spacing.xs,
  },
  
  categoriaContent: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  
  iconContainer: {
    width: 48, // Tamanho do container do ícone
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  
  iconContainerAtiva: {
    backgroundColor: theme.colors.primary[500],
  },
  
  categoriaText: {
    fontSize: theme.typography.sizes.xs,
    textAlign: 'center',
    fontFamily: theme.fonts.body,
    fontWeight: theme.typography.weights.medium,
  },
  
  categoriaAtivaText: {
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary[500],
  },
  
  categoriaInativaText: {
    color: theme.colors.gray600,
  },
});