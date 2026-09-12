import * as Haptics from 'expo-haptics';
import type { TabTriggerSlotProps } from 'expo-router/ui';
import type { LucideIcon } from 'lucide-react-native';
import type { Ref } from 'react';
import { Pressable, StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useTheme } from '@/theme/use-theme';

export type TabButtonProps = TabTriggerSlotProps & {
  icon: LucideIcon;
  ref?: Ref<View>;
};

/**
 * One tab in the unboxed row.
 *
 * Deliberately not a `Pocket`: a pocket is a recessed *fill*, and the tab row
 * has no fill by §4 DE-FRAME. What it does reuse is `theme.motion`, so the
 * press feel is identical to every other touch target in the app, and the
 * haptic is the selection tick §13.1 assigns to tab changes rather than the
 * light impact it assigns to presses.
 */
export function TabButton({
  icon: Icon,
  children,
  isFocused,
  onPress,
  ref,
  // Dropped on purpose. TabTrigger forwards `flexDirection: 'row'` plus
  // `justifyContent: 'space-between'`, which would shove our single child to
  // the leading edge instead of centering it in the tab's slot.
  style: _tabTriggerLayout,
  ...props
}: TabButtonProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const tint = isFocused ? theme.color.navActive : theme.color.textSecondary;

  const handlePress = (event: GestureResponderEvent) => {
    // Only on an actual change — re-tapping the active tab is not a selection.
    if (!isFocused) {
      Haptics.selectionAsync().catch(() => {});
    }
    onPress?.(event);
  };

  return (
    <Pressable
      {...props}
      ref={ref}
      onPress={handlePress}
      onPressIn={() => {
        scale.value = withSpring(theme.motion.pressScale, theme.motion.press);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, theme.motion.press);
      }}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      style={styles.pressable}>
      <Animated.View style={[styles.content, { gap: theme.space[1] }, animatedStyle]}>
        <Icon size={20} strokeWidth={1.75} color={tint} />
        <Text
          style={[
            theme.text.caption,
            { color: tint, fontWeight: isFocused ? theme.fontWeight.semibold : theme.fontWeight.medium },
          ]}>
          {children}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
