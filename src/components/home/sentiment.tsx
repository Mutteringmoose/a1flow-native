import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Section, SectionError, SectionSkeleton } from '@/components/section';
import { formatScore, formatUpdatedAt } from '@/lib/format';
import type { DashboardSectionProps, SentimentSection } from '@/lib/home';
import { useTheme } from '@/theme/use-theme';

/** CNN's own bands. Used for the dot only, never to recolour the arc. */
function bandColor(
  rating: string,
  theme: ReturnType<typeof useTheme>
): string {
  const normalized = rating.toLowerCase();
  if (normalized.includes('greed')) return theme.color.signalUp;
  if (normalized.includes('fear')) return theme.color.signalDown;
  return theme.color.textSecondary;
}

export function Sentiment({ state, retry }: DashboardSectionProps) {
  if (state.status === 'loading') {
    return (
      <Section title="Market Sentiment">
        <SectionSkeleton rows={1} />
      </Section>
    );
  }

  if (state.status === 'error') {
    return (
      <Section title="Market Sentiment">
        <SectionError error={state.error} onRetry={retry} />
      </Section>
    );
  }

  const section = state.data.sentiment;
  if (!section || !section.data) return null;

  return (
    <Section title="Market Sentiment" note={formatUpdatedAt(section.updated_at)}>
      <Gauge sentiment={section.data} />
    </Section>
  );
}

function Gauge({ sentiment }: { sentiment: SentimentSection }) {
  const theme = useTheme();

  const score = Math.min(100, Math.max(0, sentiment.score));
  const fraction = score / 100;

  // Semicircle, 180deg sweeping left to right over the top.
  const cx = 100;
  const cy = 100;
  const r = 78;
  const angle = Math.PI + fraction * Math.PI;
  const dotX = cx + r * Math.cos(angle);
  const dotY = cy + r * Math.sin(angle);

  const delta = sentiment.score - sentiment.previousClose;

  return (
    <View style={[styles.wrap, { paddingHorizontal: theme.space[4], paddingVertical: theme.space[4] }]}>
      <View style={styles.chart}>
        {/* No preserveAspectRatio="none" — §5 forbids it, and a squashed arc
            would misreport the needle position anyway. */}
        <Svg width="100%" height={110} viewBox="0 0 200 112">
          <Path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            stroke={theme.color.surfaceElevated}
            strokeWidth={10}
            strokeLinecap="round"
            fill="none"
          />
          {/* The single status-coloured dot §5 allows, because it encodes a
              state rather than decorating one. The track stays grey. */}
          <Circle cx={dotX} cy={dotY} r={7} fill={bandColor(sentiment.rating, theme)} />
        </Svg>
        {/* Anchored ends (§4 rule 4). A gauge with no scale is unreadable. */}
        <View style={styles.scale}>
          <Text style={[theme.text.caption, theme.tabularNums, { color: theme.color.textMuted }]}>0</Text>
          <Text style={[theme.text.caption, theme.tabularNums, { color: theme.color.textMuted }]}>100</Text>
        </View>
      </View>

      <View style={[styles.readout, { gap: theme.space[1] }]}>
        <Text style={[theme.text.headerLarge, theme.tabularNums, { color: theme.color.textPrimary }]}>
          {formatScore(sentiment.score, 1)}
        </Text>
        <Text style={[theme.text.body, styles.rating, { color: theme.color.textSecondary }]}>
          {sentiment.rating}
        </Text>
        <Text style={[theme.text.caption, theme.tabularNums, { color: theme.color.textMuted }]}>
          {`prev close ${formatScore(sentiment.previousClose, 1)} (${delta >= 0 ? '+' : '-'}${Math.abs(delta).toFixed(1)})`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chart: {
    flex: 1,
  },
  scale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  readout: {
    alignItems: 'flex-end',
    minWidth: 108,
  },
  rating: {
    textTransform: 'capitalize',
  },
});
