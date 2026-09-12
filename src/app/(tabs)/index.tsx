import { ScrollView } from 'react-native';

import { MarketFutures } from '@/components/home/market-futures';
import { Sentiment } from '@/components/home/sentiment';
import { UndervaluedTeaser } from '@/components/home/undervalued-teaser';
import { LeapTeaser } from '@/components/home/leap-teaser';
import { ConvictionTeaser } from '@/components/home/conviction-teaser';
import { SectorFlow } from '@/components/home/sector-flow';
import { SectorSeasonality } from '@/components/home/sector-seasonality';
import { SectorHistory } from '@/components/home/sector-history';
import { AnalystTape } from '@/components/home/analyst-tape';
import { EarningsCalendar } from '@/components/home/earnings-calendar';
import { EconomicCalendar } from '@/components/home/economic-calendar';
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
        <LeapTeaser />
        <ConvictionTeaser />
        <SectorFlow />
        <SectorSeasonality />
        <SectorHistory />
        <AnalystTape />
        <EarningsCalendar />
        <EconomicCalendar state={dashboard.state} retry={dashboard.retry} />
      </ScrollView>
    </Screen>
  );
}
