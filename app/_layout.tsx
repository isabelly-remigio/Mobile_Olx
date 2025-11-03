import { Slot } from 'expo-router';
import { NativeBaseProvider, Box } from 'native-base';
import { AppProvider } from './src/AppProvider';
import { theme } from './src/theme/theme';

export default function RootLayout() {
  return (
    <NativeBaseProvider theme={theme}>
      <AppProvider>
        <Box flex={1}>
          <Slot />
        </Box>
      </AppProvider>
    </NativeBaseProvider>
  );
}
