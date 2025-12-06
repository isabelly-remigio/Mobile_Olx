// styles/Componentes/AcoesAnuncioStyles.ts
import { StyleSheet, Platform } from 'react-native';
import { theme } from '../../theme/theme';

export const AcoesAnuncioStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray200,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.xl : theme.spacing.sm,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  touchableButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  carrinhoTouchable: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.white,
  },
  carrinhoTouchableText: {
    color: theme.colors.primary[500],
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 6,
    fontFamily: theme.fonts.body,
  },
  comprarTouchable: {
    backgroundColor: theme.colors.secondary[500],
    shadowColor: theme.colors.secondary[500],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  comprarTouchableText: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 6,
    fontFamily: theme.fonts.body,
  },
  touchableIcon: {
    marginRight: 4,
  },
  whatsappTouchable: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginLeft: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
  },
});

// Exportando constantes específicas do componente
export const AcoesAnuncioColors = {
  primary: theme.colors.primary[500],
  secondary: theme.colors.secondary[500],
  tertiary: theme.colors.tertiary[500],
  tertiaryDark: theme.colors.tertiary[600],
  whatsapp: theme.colors.whatsapp,
  white: theme.colors.white,
  border: theme.colors.gray200,
};

export const AcoesAnuncioIconSizes = {
  small: theme.iconSizes.small,
  large: theme.iconSizes.large,
};

export const AcoesAnuncioOpacity = {
  active: theme.opacity.active,
  disabled: theme.opacity.disabled,
};