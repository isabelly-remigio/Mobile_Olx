import { StyleSheet, Dimensions, Platform } from 'react-native';
import { theme } from '../../theme/theme';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    backgroundColor: theme.colors.primary[500], // roxo principal
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.white,
    fontFamily: theme.fonts.heading,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing['2xl'],
  },
  formSection: {
    marginBottom: theme.spacing.xl,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.gray700,
    marginBottom: theme.spacing.sm,
    fontFamily: theme.fonts.body,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    borderRadius: theme.borderRadius.lg,
    fontSize: theme.typography.sizes.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md - 4, // 12px
    color: theme.colors.gray900,
    fontFamily: theme.fonts.body,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  forgotPassword: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary[500],
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.fonts.body,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    borderRadius: theme.borderRadius.lg,
  },
  passwordInput: {
    flex: 1,
    fontSize: theme.typography.sizes.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md - 4, // 12px
    color: theme.colors.gray900,
    fontFamily: theme.fonts.body,
  },
  eyeIcon: {
    paddingRight: theme.spacing.md,
    paddingLeft: theme.spacing.sm,
  },
  loginButton: {
    backgroundColor: theme.colors.secondary[500], // laranja principal
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  loginButtonText: {
    color: theme.colors.white,
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.fonts.body,
  },
  disabledButton: {
    backgroundColor: theme.colors.gray300,
  },
  disabledText: {
    color: theme.colors.gray500,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: theme.colors.gray300,
  },
  dividerText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.gray500,
    fontWeight: theme.typography.weights.medium,
    marginHorizontal: theme.spacing.md,
    fontFamily: theme.fonts.body,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing['2xl'],
  },
  socialButtonGoogle: {
    width: theme.spacing['3xl'],
    height: theme.spacing['3xl'],
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.tertiary[500], // azul claro
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
    ...theme.shadows.md,
  },
  socialButtonFacebook: {
    width: theme.spacing['3xl'],
    height: theme.spacing['3xl'],
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.tertiary[600], // azul escuro
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
    ...theme.shadows.md,
  },
  socialButtonText: {
    color: theme.colors.white,
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.xl,
    textAlign: 'center',
    fontFamily: theme.fonts.body,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  registerText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray600,
    fontFamily: theme.fonts.body,
  },
  registerLink: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary[500],
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.fonts.body,
  },
  termsContainer: {
    paddingHorizontal: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  termsText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.gray500,
    textAlign: 'center',
    lineHeight: 14,
    fontFamily: theme.fonts.body,
  },
  termsLink: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary[500],
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.fonts.body,
  },
});