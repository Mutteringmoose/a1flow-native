import { StyleSheet, Text, View } from 'react-native';

import { Hairline } from '@/components/section';
import { Pocket } from '@/components/pocket';
import { useTheme } from '@/theme/use-theme';

type DataRowProps = {
  /** Rank badge. §4 exempts `#N` from the unlabelled-metric ban. */
  rank?: number;
  label: string;
  /** Muted trailing context on the same line — a firm, a sector, a date. */
  detail?: string;
  /** The one right-hand column. Fixed width, tabular. */
  value?: string;
  /**
   * False for a textual right column such as a grade change. Tabular figures
   * and a fixed column exist to stop digits jittering (§3); applied to prose
   * they just clip it.
   */
  numeric?: boolean;
  showDivider?: boolean;
  onPress?: () => void;
};

/**
 * ROW GRAMMAR (§4): one line, identifier left, one fixed-width tabular column
 * right, hairline divider, no box.
 *
 * `flat` on the Pocket is deliberate — a row is content, and content gets no
 * fill. The Pocket is here for the press feel only.
 */
export function DataRow({
  rank,
  label,
  detail,
  value,
  numeric = true,
  showDivider,
  onPress,
}: DataRowProps) {
  const theme = useTheme();

  return (
    <View>
      {showDivider ? <Hairline /> : null}
      <Pocket flat radius="row" onPress={onPress} style={styles.row} accessibilityLabel={label}>
        <View style={[styles.left, { gap: theme.space[2] }]}>
          {rank !== undefined ? (
            <Text
              style={[
                theme.text.caption,
                theme.tabularNums,
                styles.rank,
                { color: theme.color.textMuted },
              ]}>
              {rank}
            </Text>
          ) : null}
          <Text
            style={[theme.text.bodyLarge, { color: theme.color.textPrimary }]}
            numberOfLines={1}>
            {label}
          </Text>
          {detail ? (
            <Text
              style={[theme.text.body, styles.detail, { color: theme.color.textMuted }]}
              numberOfLines={1}>
              {detail}
            </Text>
          ) : null}
        </View>
        {value !== undefined ? (
          <Text
            numberOfLines={1}
            style={[
              theme.text.bodyLarge,
              numeric ? theme.tabularNums : null,
              numeric ? styles.value : styles.valueText,
              { color: theme.color.textPrimary },
            ]}>
            {value}
          </Text>
        ) : null}
      </Pocket>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  rank: {
    // Fixed so tickers start on the same x whether the rank is 9 or 30.
    minWidth: 22,
  },
  detail: {
    flexShrink: 1,
  },
  value: {
    minWidth: 76,
    textAlign: 'right',
  },
  valueText: {
    textAlign: 'right',
    flexShrink: 0,
    paddingLeft: 8,
  },
});
