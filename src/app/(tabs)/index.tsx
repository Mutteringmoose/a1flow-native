import { ScrollView } from 'react-native';

import { MarketFutures } from '@/components/home/market-futures';
import { Sentiment } from '@/components/home/sentiment';
import { UndervaluedTeaser } from '@/components/home/undervalued-teaser';
import { Screen } from '@/components/screen';
import { getHomeDashboard } from '@/lib/home';
import { useEndpoint } from '@/lib/use-endpoint';
import { useTheme } from '@/theme/use-theme';

/**
 * Home, in the same section order as the web route.
 *
 * Futures, Sentiment and the Economic Calendar share one /home/dashboard
 * request made here. Everything below self-fetches, because those posters run
 * on their own cadences and should not be tied to this one.
 */
export default function HomeScreen() {
  const theme = useTheme();
  const dashboard = useEndpoint(getHomeDashboard);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: theme.space[8] }}
        showsVerticalScrollIndicator={false}>
        <MarketFutures state={dashboard.state} retry={dashboard.retry} />
        <Sentiment state={dashboard.state} retry={dashboard.retry} />
        <UndervaluedTeaser />
      </ScrollView>
    </Screen>
  );
}
