import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { tokens } from '@/theme/tokens';

/**
 * Dark-only (§2, Principle 6), so the status bar is fixed light and there is no
 * scheme to read. Splash auto-hides — the starter's preventAutoHideAsync was
 * paired with an overlay that no longer exists, and left alone it would hold
 * the splash open forever.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: tokens.color.surfaceCanvas },
        }}
      />
    </SafeAreaProvider>
  );
}
