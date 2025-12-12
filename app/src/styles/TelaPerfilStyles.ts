import { StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.gray50 
  },
  
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  
  loadingText: { 
    marginTop: 16, 
    fontSize: 16, 
    color: theme.colors.gray600 
  },
  
  inputHint: { 
    fontSize: 12, 
    color: theme.colors.gray500, 
    marginTop: 4, 
    fontStyle: 'italic' 
  },
  
  // Header
  header: {
    height: 56, 
    backgroundColor: theme.colors.white, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16,
    borderBottomWidth: 1, 
    borderBottomColor: theme.colors.gray200,
  },
  
  headerButton: { 
    width: 40, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  
  headerTitle: { 
    fontSize: 18, 
    fontWeight: theme.typography.weights.semibold, 
    color: theme.colors.gray900 
  },
  
  // Scroll
  scrollView: { 
    flex: 1 
  },
  
  // Card
  card: {
    backgroundColor: theme.colors.white, 
    borderWidth: 1, 
    borderColor: '#DDD',
    borderRadius: 8, 
    padding: 16, 
    margin: 16, 
    marginTop: 8,
  },
  
  // User Header
  userHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  
  avatar: { 
    backgroundColor: theme.colors.primary[500] 
  },
  
  avatarTitle: { 
    fontSize: 18, 
    fontWeight: theme.typography.weights.bold 
  },
  
  userInfo: { 
    marginLeft: 12, 
    flex: 1 
  },
  
  userName: { 
    fontSize: 16, 
    fontWeight: theme.typography.weights.semibold, 
    color: theme.colors.black 
  },
  
  // Info Row
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  
  infoIcon: { 
    marginRight: 8 
  },
  
  infoText: { 
    fontSize: 14, 
    color: '#444', 
    flex: 1 
  },
  
  // Divider
  divider: { 
    height: 1, 
    backgroundColor: theme.colors.gray200, 
    marginVertical: 12 
  },
  
  // Contact Row
  contactRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    height: 32, 
    marginBottom: 8 
  },
  
  statusIndicator: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: theme.colors.success, 
    marginRight: 8 
  },
  
  contactIcon: { 
    marginRight: 8 
  },
  
  contactText: { 
    fontSize: 14, 
    color: theme.colors.gray800 
  },
  
  // Edit Button
  editButton: { 
    backgroundColor: theme.colors.secondary[500], 
    height: 44, 
    borderRadius: 8, 
    marginTop: 16 
  },
  
  editButtonText: { 
    fontSize: 16, 
    fontWeight: theme.typography.weights.semibold, 
    marginLeft: 8 
  },
  
  // Modal
  modalOverlay: { 
    width: '95%', 
    maxHeight: '90%', 
    borderRadius: 12, 
    padding: 0 
  },
  
  modalContainer: { 
    maxHeight: '100%' 
  },
  
  modalContent: { 
    padding: 20 
  },
  
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  
  modalTitle: { 
    fontSize: 20, 
    fontWeight: theme.typography.weights.bold, 
    color: theme.colors.gray900 
  },
  
  // Form
  formGroup: { 
    marginBottom: 16 
  },
  
  label: { 
    fontSize: 14, 
    fontWeight: theme.typography.weights.medium, 
    color: theme.colors.gray700, 
    marginBottom: 8 
  },
  
  input: {
    height: 48, 
    borderWidth: 1, 
    borderColor: theme.colors.gray300, 
    borderRadius: 8,
    paddingHorizontal: 16, 
    fontSize: 15, 
    color: theme.colors.gray900, 
    backgroundColor: theme.colors.white,
  },
  
  // Modal Buttons
  modalButtons: { 
    flexDirection: 'row', 
    gap: 12, 
    marginTop: 24 
  },
  
  buttonContainer: { 
    flex: 1 
  },
  
  cancelButton: { 
    backgroundColor: theme.colors.gray300, 
    height: 48, 
    borderRadius: 8 
  },
  
  cancelButtonText: { 
    fontSize: 16, 
    fontWeight: theme.typography.weights.semibold, 
    color: theme.colors.gray700 
  },
  
  saveButton: { 
    backgroundColor: theme.colors.secondary[500], 
    height: 48, 
    borderRadius: 8 
  },
  
  saveButtonText: { 
    fontSize: 16, 
    fontWeight: theme.typography.weights.semibold, 
    color: theme.colors.white 
  },
});

export default styles;