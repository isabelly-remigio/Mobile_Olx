// styles/Componentes/CarrosselAnuncioStyles.ts
import { Dimensions, StyleSheet } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const CarrosselAnuncioStyles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 300,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  
  scrollView: {
    width: '100%',
    height: '100%',
  },
  
  scrollContent: {
    flexGrow: 1,
  },
  
  imageContainer: {
    width: screenWidth,
    height: 300,
    position: 'relative',
  },
  
  image: {
    width: '100%',
    height: '100%',
  },
  
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    zIndex: 1,
  },
  
  badgeContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    minWidth: 60,
    alignItems: 'center',
  },
  
  badgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
  },
  
  placeholderText: {
    marginTop: 8,
    color: '#6B7280',
    fontSize: 14,
  },
});