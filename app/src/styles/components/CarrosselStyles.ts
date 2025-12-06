// styles/Componentes/CarrosselStyles.ts
import { StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

export const CarrosselStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    marginTop: theme.spacing.sm,
    position: 'relative',
  },
  
  imageContainer: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomLeftRadius: theme.borderRadius.md,
    borderBottomRightRadius: theme.borderRadius.md,
  },
  
  title: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
    fontFamily: theme.fonts.heading,
  },
  
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.white,
    fontFamily: theme.fonts.body,
    marginTop: theme.spacing.xs,
    opacity: 0.9,
  },
  
  // Para múltiplos banners (se quiser implementar dots)
  dotsContainer: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  
  dot: {
    width: 8,
    height: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.white,
    opacity: 0.5,
  },
  
  activeDot: {
    opacity: 1,
    width: 10,
    height: 10,
  },
});

export const CarrosselConstants = {
  height: 200,
  overlayOpacity: 0.6,
  transitionDuration: 300,
  autoplayInterval: 5000, // 5 segundos
};