import { extendTheme } from 'native-base';

export const theme = extendTheme({
  colors: {
    primary: { 500: '#6D0AD6' }, //roxo principal
    secondary: { 500: '#F27405' }, //botões
    tertiary: { 500: '#448FF2', 600:'#39548B' }, //google cor, facebbok cor icones 
  },
  fonts: {
    heading: 'Roboto',
    body: 'Roboto',
  },
});
