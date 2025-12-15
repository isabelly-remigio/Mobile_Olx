import { StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

export const CardProdutoStyles = StyleSheet.create({
  // Container principal
  cardContainer: {
    width: 170,
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
  
  // Container do conteúdo
  contentContainer: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
  
  // Título
  titulo: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.gray800,
    fontFamily: theme.fonts.body,
    lineHeight: 18,
    minHeight: 36, // Mudei de height para minHeight
    maxHeight: 36, // Mantém máximo de 2 linhas
    overflow: 'hidden',
  },
  
  // Preço
  preco: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
    fontFamily: theme.fonts.body,
    marginTop: 2,
    marginBottom: 2,
  },
  
  // Descrição/Condição - AGORA FLEXÍVEL
  descricaoContainer: {
    minHeight: 16,
    maxHeight: 32,
    overflow: 'hidden',
    marginTop: 2,
    marginBottom: 2,
  },
  
  descricao: {
    fontSize: 12,
    color: theme.colors.gray600,
    fontFamily: theme.fonts.body,
    lineHeight: 16,
  },
  
  // Localização
  localizacaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: 4,
    minHeight: 20,
  },
  
  localizacaoText: {
    fontSize: 12,
    color: theme.colors.gray500,
    fontFamily: theme.fonts.body,
    flex: 1,
  },
});

// Ou uma versão MAIS SIMPLES e FUNCIONAL:
export const CardProdutoStylesSimple = StyleSheet.create({
  cardContainer: {
    width: 170,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    marginRight: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  
  pressedContainer: {
    opacity: 0.9,
  },
  
  imageContainer: {
    position: 'relative',
    height: 120,
  },
  
  imagem: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
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
  },
  
  favoritoButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing.xs,
  },
  
  contentContainer: {
    padding: 12,
    gap: 4, // Espaço consistente entre elementos
  },
  
  titulo: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.gray800,
    lineHeight: 18,
    height: 36, // Altura fixa para 2 linhas
    overflow: 'hidden',
  },
  
  preco: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
    marginVertical: 2,
  },
  
  condicao: {
    fontSize: 12,
    color: theme.colors.gray600,
    height: 16, // Altura de 1 linha
    overflow: 'hidden',
  },
  
  localizacaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 'auto', // Empurra para baixo
    minHeight: 20,
  },
  
  localizacaoText: {
    fontSize: 12,
    color: theme.colors.gray500,
    flex: 1,
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
    green600: '#10B981',
    red500: '#EF4444',
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