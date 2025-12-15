// src/styles/screens/TelaMenuStyles.ts
import { StyleSheet } from 'react-native';
import { theme } from '@/app/src/theme/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  scrollView: {
    flex: 1,
  },
  
  // Header
  header: {
    height: 60,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: theme.colors.primary[500],
  },
  avatarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userText: {
    marginLeft: 12,
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  profileLink: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#007AFF',
  },

  // Menu Items
  menuBlock: {
    paddingHorizontal: 16,
    backgroundColor: theme.colors.white,
  },
  menuItem: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#000000',
  },
  logoutText: {
    color: '#C30000',
  },

  // Divisor
  divider: {
    height: 12,
    backgroundColor: '#F2F2F2',
    width: '100%',
  },

  // Modal de Logout
  modalOverlay: {
    width: '90%',
    borderRadius: 12,
    padding: 24,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.gray900,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: theme.colors.gray700,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    width: '100%',
    gap: 12,
  },
  confirmButton: {
    backgroundColor: '#D60000',
    height: 44,
    borderRadius: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    height: 44,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
});