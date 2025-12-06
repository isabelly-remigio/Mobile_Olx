import { StyleSheet, Platform } from 'react-native';
import { theme } from '../../theme/theme'; // Ajuste o caminho conforme necessário

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
    ...Platform.select({
      ios: {
        paddingTop: 50,
      },
      android: {
        paddingTop: 40,
      },
    }),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.gray800,
    marginLeft: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.gray800,
    marginBottom: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary[600],
    marginBottom: 8,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerName: {
    fontSize: 14,
    color: theme.colors.gray600,
    marginLeft: 8,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.gray800,
    marginBottom: 12,
  },
  descriptionSection: {
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: theme.colors.gray600,
    lineHeight: 20,
    marginBottom: 8,
  },
  seeMoreText: {
    fontSize: 14,
    color: theme.colors.primary[600],
    fontWeight: '600',
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: theme.colors.gray600,
    textTransform: 'capitalize',
  },
  detailValue: {
    fontSize: 14,
    color: theme.colors.gray800,
    fontWeight: '500',
  },
  securityTips: {
    backgroundColor: '#FEF3C7', // yellow.50
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A', // yellow.200
    marginTop: 16,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E', // yellow.800
    marginLeft: 8,
  },
  securityTipsList: {
    paddingLeft: 8,
  },
  securityTip: {
    fontSize: 12,
    color: '#92400E', // yellow.800
    marginBottom: 4,
  },
  spacer: {
    height: 80,
  },
});