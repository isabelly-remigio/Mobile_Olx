import { StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

export const TelaVerificacaoEmailStyles = StyleSheet.create({
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
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.gray700,
    fontFamily: theme.fonts.body,
  },
  centeredContent: {
    flex: 1,
    alignItems: 'center',
  },
  innerContent: {
    width: '100%',
    maxWidth: 400,
    gap: theme.spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: theme.colors.primary[100],
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  titleSection: {
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.sizes['3xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.gray800,
    fontFamily: theme.fonts.heading,
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.gray600,
    textAlign: 'center',
    fontFamily: theme.fonts.body,
  },
  emailSection: {
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.gray600,
    textAlign: 'center',
    fontFamily: theme.fonts.body,
  },
  emailText: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary[500],
    fontFamily: theme.fonts.body,
  },
  demoText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.gray400,
    textAlign: 'center',
    fontFamily: theme.fonts.body,
  },
  infoSection: {
    width: '100%',
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray600,
    fontFamily: theme.fonts.body,
  },
  successMessage: {
    backgroundColor: theme.colors.success + '20', // 20% opacity
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  successText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.success,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.fonts.body,
  },
  resendSection: {
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  resendText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray600,
    fontFamily: theme.fonts.body,
  },
  resendLink: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary[500],
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.fonts.body,
  },
  timerText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray400,
    fontFamily: theme.fonts.body,
  },
  timerHighlight: {
    color: theme.colors.primary[500],
    fontWeight: theme.typography.weights.bold,
  },
  verifyButton: {
    backgroundColor: theme.colors.secondary[500],
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    width: '100%',
  },
  verifyButtonText: {
    color: theme.colors.white,
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.md,
    textAlign: 'center',
    fontFamily: theme.fonts.body,
  },
  termsText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.gray400,
    textAlign: 'center',
    fontFamily: theme.fonts.body,
  },
  termsLink: {
    color: theme.colors.primary[500],
    fontWeight: theme.typography.weights.medium,
  },
});