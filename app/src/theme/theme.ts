// theme/theme.ts
export const theme = {
  colors: {
    primary: {
      50: '#F5F0FF',
      100: '#E9D8FD',
      200: '#D6BCFA',
      300: '#B794F4',
      400: '#9F7AEA',
      500: '#6D0AD6', // roxo principal
      600: '#5B21B6',
      700: '#4C1D95',
      800: '#44337A',
      900: '#322659',
    },

envelope: {
      background: '#E9E1F9',
      border: '#6C2BD9',
      check: '#6C2BD9',
    },

    secondary: {
      50: '#FFF7ED',
      100: '#FFEDD5',
      200: '#FED7AA',
      300: '#FDBA74',
      400: '#FB923C',
      500: '#F27405', // laranja botões
      600: '#EA580C',
      700: '#C2410C',
      800: '#9A3412',
      900: '#7C2D12',
    },
    tertiary: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#448FF2', // azul
      600: '#39548B', // azul escuro
      700: '#1E40AF',
      800: '#1E3A8A',
      900: '#172554',
    },
    // Cores utilitárias
    whatsapp: '#25D366',
    white: '#FFFFFF',
    black: '#000000',
    
    // Escala completa de cinza
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    
    // Cores de feedback
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  fonts: {
    heading: 'Roboto',
    body: 'Roboto',
    mono: 'RobotoMono',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
  },
  
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  },
  
 iconSizes: {
  small: 12,
  medium: 16,
  large: 20,
  favorito: 20,
  localizacao: 12,
},

typography: {
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 18,
    xl: 22,
    '2xl': 28,
    '3xl': 34,
  },
  weights: {
    bold: '700',
    semibold: '600',
    medium: '500',
    normal: '400',
  }
}
,
  
  opacity: {
    active: 0.7,
    disabled: 0.5,
    hover: 0.9,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
  },
} as const;

export type Theme = typeof theme;