import { useEffect } from 'react';
import { type DimensionValue } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/theme/use-theme';

type SkeletonProps = {
  width: DimensionValue;
  height?: number;
};

/**
 * Skeleton pulse.
 *
 * The only looping animation in the app. §13.1 bans ambient and looping motion
 * but carries the skeleton pulse over unchanged, because it encodes a state —
 * "still loading" — rather than decorating one.
 */
export function Skeleton({ width, height = 12 }: SkeletonProps) {
  const theme = useTheme();
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.set(withRepeat(withTiming(0.85, { duration: 750 }), -1, true));
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: theme.radius.sm,
          backgroundColor: theme.color.surfaceElevated,
        },
        animatedStyle,
      ]}
    />
  );
}
