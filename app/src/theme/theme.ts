import { extendTheme } from 'native-base';

export const theme = extendTheme({
  colors: {
    primary: { 500: '#ff8000', 600: '#e67300' },
    secondary: { 500: '#1E90FF' },
  },
  fonts: {
    heading: 'Roboto',
    body: 'Roboto',
  },
});
