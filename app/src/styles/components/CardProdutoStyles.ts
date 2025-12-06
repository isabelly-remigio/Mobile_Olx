// styles/Componentes/CardProdutoStyles.ts
import { StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

export const CardProdutoStyles = StyleSheet.create({
  // Container principal
  cardContainer: {
    width: 170,
    height: 240,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    marginRight: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  
  // Estado pressionado
  pressedContainer: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  
  // Container da imagem
  imageContainer: {
    position: 'relative',
    height: 120,
  },
  
  imagem: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  // Badge de destaque
  destaqueBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: theme.colors.primary[500],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  
  destaqueText: {
    fontSize: 10,
    color: theme.colors.white,
    fontWeight: 'bold',
    fontFamily: theme.fonts.body,
  },
  
  // Botão de favorito
  favoritoButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing.xs,
  },
  
  pressedFavoritoButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Container do conteúdo
  contentContainer: {
    padding: theme.spacing.md,
    flex: 1,
    flexDirection: 'column',
    gap: theme.spacing.sm,
  },
  
  // Título
  titulo: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.gray800,
    fontFamily: theme.fonts.body,
    lineHeight: 18,
    height: 36, // Para limitar a 2 linhas
  },
  
  // Preço
  preco: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981', // Mantendo verde para o preço como no original
    fontFamily: theme.fonts.body,
  },
  
  // Descrição
  descricao: {
    fontSize: 12,
    color: theme.colors.gray600,
    fontFamily: theme.fonts.body,
    lineHeight: 16,
    height: 32, // Para limitar a 2 linhas
  },
  
  // Localização
  localizacaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: 'auto',
  },
  
  localizacaoText: {
    fontSize: 12,
    color: theme.colors.gray500,
    fontFamily: theme.fonts.body,
  },
});

export const CardProdutoConstants = {
  colors: {
    primary: theme.colors.primary[500],
    white: theme.colors.white,
    black: theme.colors.black,
    gray300: theme.colors.gray300,
    gray500: theme.colors.gray500,
    gray600: theme.colors.gray600,
    gray800: theme.colors.gray800,
    green600: '#10B981', // Mantendo verde para preço
    red500: '#EF4444', // Para coração vermelho
  },
  iconSizes: {
    small: 12,
    medium: 16,
    large: 20,
    favorito: 20,
    localizacao: 12,
  },
  dimensoes: {
    cardWidth: 170,
    cardHeight: 240,
    imagemHeight: 120,
  },
};