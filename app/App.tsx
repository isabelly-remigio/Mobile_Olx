import React from 'react';
import { StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { AuthProvider } from './src/context/AuthContext';
import { ProductProvider } from './src/context/ProductContext';
import { theme } from './src/theme/theme';

export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <AuthProvider>
        <ProductProvider>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        </ProductProvider>
      </AuthProvider>
    </NativeBaseProvider>
  );
}