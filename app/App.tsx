import { ThemeProvider } from '@rneui/themed';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { ProductProvider } from './src/context/ProductContext';
import { theme } from './src/theme/theme';


export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <ProductProvider>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
