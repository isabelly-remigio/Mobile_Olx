import { StyleSheet, Platform } from 'react-native';
import { theme } from '../../theme/theme';

export const FooterStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray200,
    paddingVertical: theme.spacing.sm,
    ...Platform.select({
      ios: {
        paddingBottom: theme.spacing.lg,
      },
      android: {
        paddingBottom: theme.spacing.md,
      },
    }),
  },
  
  button: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: theme.spacing.xs,
  },
  
  icon: {
    marginBottom: 2,
  },
  
  text: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.fonts.body,
  },
  
  activeText: {
    color: theme.colors.primary[500],
  },
  
  inactiveText: {
    color: theme.colors.gray500,
  },
});