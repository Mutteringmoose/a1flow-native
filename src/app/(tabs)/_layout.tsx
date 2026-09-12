import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { Briefcase, ChartCandlestick, House, Radar, Waves } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabButton } from '@/components/tab-button';
import { useTheme } from '@/theme/use-theme';

/**
 * Home is the third tab but the first route. `TabList` order drives what the
 * user sees; `initialRouteName` drives what loads. They are independent — the
 * router reads this off the route node, not off trigger order.
 */
export const unstable_settings = {
  initialRouteName: 'index',
};

export default function TabLayout() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    // `flex: 1` is Tabs' own root style. Our style prop is spread *after* it
    // internally, so passing backgroundColor alone silently drops the flex.
    <Tabs style={{ flex: 1, backgroundColor: theme.color.surfaceCanvas }}>
      <TabSlot />
      <TabList asChild>
        <View
          // Flattened, not an array: TabList `asChild` renders through <Slot>,
          // which throws in dev if its child carries an array style.
          style={StyleSheet.flatten([
            styles.tabRow,
            {
              backgroundColor: theme.color.surfaceCanvas,
              borderTopWidth: theme.hairline.width,
              // border-default, not the hairline token. This divider separates
              // chrome from content and needs to hold at 0.10; theme.hairline
              // stays at border-subtle for content row dividers (§4 ROW GRAMMAR).
              borderTopColor: theme.color.borderDefault,
              paddingTop: theme.space[2],
              // The row owns the bottom inset so screens do not have to.
              paddingBottom: insets.bottom || theme.space[2],
            },
          ])}>
          <TabTrigger name="scan" href="/scan" asChild>
            <TabButton icon={Radar}>Scan</TabButton>
          </TabTrigger>
          <TabTrigger name="flow" href="/flow" asChild>
            <TabButton icon={Waves}>Flow</TabButton>
          </TabTrigger>
          <TabTrigger name="index" href="/" asChild>
            <TabButton icon={House}>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="analyze" href="/analyze" asChild>
            <TabButton icon={ChartCandlestick}>Analyze</TabButton>
          </TabTrigger>
          <TabTrigger name="portfolio" href="/portfolio" asChild>
            <TabButton icon={Briefcase}>Portfolio</TabButton>
          </TabTrigger>
        </View>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
