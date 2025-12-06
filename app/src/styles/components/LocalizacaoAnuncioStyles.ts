// styles/Componentes/LocalizacaoAnuncioStyles.ts
import { StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

export const LocalizacaoAnuncioStyles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.gray800,
    fontFamily: theme.fonts.heading,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  textContainer: {
    gap: theme.spacing.xs,
  },
  neighborhood: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray800,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.fonts.body,
  },
  cityState: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.gray600,
    fontFamily: theme.fonts.body,
  },
  cep: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.gray500,
    fontFamily: theme.fonts.body,
  },
});