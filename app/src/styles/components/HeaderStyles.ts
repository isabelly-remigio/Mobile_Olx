import { StyleSheet, Platform } from 'react-native';
import { theme } from '../../theme/theme'; // Ajuste o caminho conforme necessário

export default StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.white,
    ...Platform.select({
      ios: {
        paddingTop: 0, // SafeAreaView já lida com isso
      },
      android: {
        paddingTop: Platform.Version >= 21 ? 0 : 0, // Para versões antigas do Android
      },
    }),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    height: 64, // 16 * 4 = 64px
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray300,
  },
  locationButton: {
    flex: 1,
    marginRight: 8,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    color: theme.colors.gray800,
    fontWeight: '500',
    flex: 1,
    marginRight: 4,
  },
  arrowIcon: {
    marginLeft: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});