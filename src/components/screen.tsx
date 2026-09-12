import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/use-theme';

type ScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Canvas + top safe area for every tab screen.
 *
 * Only the top edge is claimed here — the tab row owns the bottom inset, and
 * claiming it in both places double-pads above the home indicator. Insets come
 * from safe-area-context rather than constants because Dynamic Island and
 * home-indicator geometry vary per device (§10b).
 */
export function Screen({ children, style }: ScreenProps) {
  const theme = useTheme();

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.root, { backgroundColor: theme.color.surfaceCanvas }, style]}>
      {children}
    </SafeAreaView>
  );
}

/** A tab that exists but has no content yet. No "coming soon" — just the name. */
export function PlaceholderScreen({ name }: { name: string }) {
  const theme = useTheme();

  return (
    <Screen>
      <View style={[styles.placeholder, { padding: theme.space[4] }]}>
        <Text style={[theme.text.body, { color: theme.color.textSecondary }]}>{name}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
  },
});
