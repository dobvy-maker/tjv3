import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TripsProvider } from './context/TripsContext';

export const unstable_settings = { anchor: '(tabs)' };

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <TripsProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="add-trip" options={{ title: 'Add Trip', headerBackTitle: 'Trips' }} />
          <Stack.Screen name="trip/[id]" options={{ title: 'Trip Details', headerBackTitle: 'Trips' }} />
          <Stack.Screen name="edit-trip/[id]" options={{ title: 'Edit Trip', headerBackTitle: 'Details' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </TripsProvider>
  );
}
