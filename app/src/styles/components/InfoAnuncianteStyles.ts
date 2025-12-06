// styles/Componentes/InfoAnuncianteStyles.ts
import { StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';  

export const InfoAnuncianteStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.gray50,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.md,
  },
  
  title: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.gray800,
    fontFamily: theme.fonts.heading,
  },
  
  anuncianteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.primary[600],
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  avatarText: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
    fontFamily: theme.fonts.heading,
  },
  
  infoContainer: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  
  nome: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.gray800,
    fontFamily: theme.fonts.body,
  },
  
  dataCadastro: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.gray600,
    fontFamily: theme.fonts.body,
  },
  
  badgesContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  
  emailBadge: {
    backgroundColor: '#D1FAE5', // green.100
  },
  
  telefoneBadge: {
    backgroundColor: '#DBEAFE', // blue.100
  },
  
  badgeText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.fonts.body,
  },
  
  emailBadgeText: {
    color: '#047857', // green.700
  },
  
  telefoneBadgeText: {
    color: '#1E40AF', // blue.700
  },
  
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  
  infoText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.gray700,
    fontFamily: theme.fonts.body,
  },
  
  button: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.primary[600],
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
  },
  
  buttonText: {
    color: theme.colors.primary[600],
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fonts.body,
    textAlign: 'center',
  },
});