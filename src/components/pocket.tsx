import * as Haptics from 'expo-haptics';
import { type ReactNode, useCallback } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useTheme } from '@/theme/use-theme';

type PocketRadius = 'capsule' | 'row';

type PocketProps = {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  /**
   * `capsule` for controls — pills, chips, CTAs, teaser locks.
   * `row` for full-bleed list rows, where a capsule would fight DE-FRAME.
   */
  radius?: PocketRadius;
  /** Omit the recessed fill but keep press feel — for rows that must read flat. */
  flat?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

/**
 * The one interactive surface primitive. Flat = read, recessed = touch (§4).
 *
 * Anything the user can press is a Pocket, and nothing else gets a fill. It
 * carries the two things §13.1 approves on a press — a spring and a light
 * impact — so that neither has to be re-decided per screen.
 *
 * The spring is duration-based, which makes the 400 ms settle ceiling a
 * property of the config instead of something to be verified by eye.
 */
export function Pocket({
  children,
  onPress,
  disabled = false,
  radius = 'capsule',
  flat = false,
  style,
  accessibilityLabel,
}: PocketProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(theme.motion.pressScale, theme.motion.press);
    // Rejects when the Taptic Engine is unavailable — Low Power Mode, camera
    // active, user disabled it. Never a reason to fail a press.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, [scale, theme]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, theme.motion.press);
  }, [scale, theme]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={disabled ? undefined : handlePressIn}
      onPressOut={disabled ? undefined : handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}>
      <Animated.View
        style={[
          styles.base,
          {
            backgroundColor: flat ? 'transparent' : theme.color.surfacePocket,
            borderRadius: radius === 'capsule' ? theme.radius.full : theme.radius.md,
            paddingVertical: theme.space[2],
            paddingHorizontal: radius === 'capsule' ? theme.space[3] : theme.space[4],
            opacity: disabled ? 0.5 : 1,
          },
          animatedStyle,
          style,
        ]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
  },
});
