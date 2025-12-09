// styles/Screens/TelaCadastroStyles.ts
import { StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

export const TelaCadastroStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  
  scrollView: {
    flex: 1,
  },
  
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },

  
  
  backButton: {
    padding: theme.spacing.xs,
  },
  
  headerTitle: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.gray700,
    fontFamily: theme.fonts.body,
  },
  
  socialSection: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  
  socialTitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray500,
    fontFamily: theme.fonts.body,
  },
  
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  
  googleButton: {
    backgroundColor: theme.colors.tertiary[500],
  },
  
  facebookButton: {
    backgroundColor: theme.colors.tertiary[600],
  },
  
  socialButtonText: {
    color: theme.colors.white,
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.lg,
  },
  
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.gray200,
  },
  
  dividerText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray400,
    fontFamily: theme.fonts.body,
  },
  
  infoText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.gray600,
    textAlign: 'center',
    fontFamily: theme.fonts.body,
    marginVertical: theme.spacing.sm,
  },
  
  formSection: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  
  inputLabel: {
    color: theme.colors.gray700,
    fontFamily: theme.fonts.body,
    marginBottom: theme.spacing.xs,
  },
  
  input: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.fonts.body,
  },
  
  focusedInput: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.white,
  },
  
  helperText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.gray500,
    fontFamily: theme.fonts.body,
    marginTop: theme.spacing.xs,
  },
  
  accountTypeContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  
  accountTypeButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  
  selectedAccountType: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.primary[50],
  },
  
  unselectedAccountType: {
    borderColor: theme.colors.gray300,
    backgroundColor: theme.colors.white,
  },
  
  accountTypeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  selectedRadioCircle: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.primary[500],
  },
  
  unselectedRadioCircle: {
    borderColor: theme.colors.gray400,
    backgroundColor: 'transparent',
  },
  
  radioInnerCircle: {
    width: 6,
    height: 6,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.white,
  },
  
  accountTypeText: {
    fontFamily: theme.fonts.body,
  },
  
  selectedAccountTypeText: {
    color: theme.colors.primary[700],
  },
  
  unselectedAccountTypeText: {
    color: theme.colors.gray600,
  },
  
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  passwordInput: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.fonts.body,
  },
  
  passwordToggleButton: {
    position: 'absolute',
    right: theme.spacing.md,
    padding: theme.spacing.xs,
  },
  
  validationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  
  validationText: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fonts.body,
  },
  

    errorInput: {
    borderColor: theme.colors.error,
    borderWidth: 2,
  },
  
  registerButton: {
    backgroundColor: theme.colors.secondary[500],
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  
  registerButtonText: {
    color: theme.colors.white,
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.md,
    textAlign: 'center',
    fontFamily: theme.fonts.body,
  },
  
  disabledButton: {
    backgroundColor: theme.colors.gray300,
  },
  
  disabledButtonText: {
    color: theme.colors.gray500,
  },
  
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
  },
  
  loginText: {
    color: theme.colors.gray600,
    fontFamily: theme.fonts.body,
  },
  
  loginLink: {
    color: theme.colors.primary[500],
    fontFamily: theme.fonts.body,
  },
  
  termsText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.gray500,
    textAlign: 'center',
    fontFamily: theme.fonts.body,
    marginTop: theme.spacing.lg,
  },
  
  termsLink: {
    color: theme.colors.primary[500],
  },
});