// styles/Screens/TelaEnderecoStyles.ts
import { StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

export const TelaEnderecoStyles = StyleSheet.create({
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
    fontSize: theme.typography.sizes.sm,
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
  },
  
  rowContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  
  flex2: {
    flex: 2,
  },
  
  flex3: {
    flex: 3,
  },
  
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  loadingIcon: {
    position: 'absolute',
    right: theme.spacing.md,
  },
  
  // Modal para seleção de estado
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  
  modalContent: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    maxHeight: '80%',
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  
  modalTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.gray800,
    fontFamily: theme.fonts.heading,
  },
  
  estadoItem: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  estadoText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.gray800,
    fontFamily: theme.fonts.body,
  },
  
  selectedEstadoText: {
    color: theme.colors.primary[500],
    fontWeight: theme.typography.weights.bold,
  },
  
  // Botão customizado para abrir modal de estado
  estadoButton: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  estadoButtonText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.gray800,
    fontFamily: theme.fonts.body,
  },
  
  estadoPlaceholderText: {
    color: theme.colors.gray400,
  },
  
  finalizarButton: {
    backgroundColor: theme.colors.secondary[500],
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  
  finalizarButtonText: {
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
  
  footerText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.gray500,
    textAlign: 'center',
    fontFamily: theme.fonts.body,
    marginTop: theme.spacing.md,
  },
});