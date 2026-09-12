import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Pocket } from '@/components/pocket';
import { Skeleton } from '@/components/skeleton';
import { ApiError } from '@/lib/api';
import { formatSignedPercent, formatUpdatedAt } from '@/lib/format';
import { getHomeDashboard, type FuturesQuote } from '@/lib/home';
import { useTheme } from '@/theme/use-theme';

/** Above the fold, so the list is capped rather than scrolled. */
const MAX_ROWS = 5;

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; quotes: FuturesQuote[]; updatedAt: string | null }
  /** The section came back null — distinct from an empty list. */
  | { status: 'absent' }
  | { status: 'error'; error: ApiError };

export function MarketFuturesSection() {
  const theme = useTheme();
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    // No setState('loading') here: it is the initial state on mount, and on a
    // retry the handler sets it before bumping `attempt`. Doing it in the
    // effect body would just cascade an extra render.
    getHomeDashboard({ signal: controller.signal })
      .then((dashboard) => {
        if (!active) return;
        const section = dashboard.futures;
        if (!section || !section.data) {
          setState({ status: 'absent' });
          return;
        }
        setState({
          status: 'ready',
          // Double-nested: the section wrapper's `data` holds an object whose
          // own `data` is the row array.
          quotes: section.data.data ?? [],
          updatedAt: section.updated_at ?? null,
        });
      })
      .catch((cause: unknown) => {
        if (!active || controller.signal.aborted) return;
        setState({
          status: 'error',
          error:
            cause instanceof ApiError
              ? cause
              : new ApiError('network', '/home/dashboard', String(cause)),
        });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ status: 'loading' });
    setAttempt((n) => n + 1);
  }, []);

  const headerNote =
    state.status === 'ready' ? formatUpdatedAt(state.updatedAt) : null;

  return (
    <View>
      <View style={[styles.header, { paddingHorizontal: theme.space[4], paddingVertical: theme.space[3] }]}>
        <Text style={[theme.text.caption, { color: theme.color.textSecondary }]}>Market Futures</Text>
        {headerNote ? (
          <Text
            style={[
              theme.text.caption,
              theme.tabularNums,
              { color: theme.color.textMuted },
            ]}>
            {headerNote}
          </Text>
        ) : null}
      </View>

      <View style={{ height: theme.hairline.width, backgroundColor: theme.hairline.color }} />

      {state.status === 'loading' ? <LoadingRows /> : null}

      {state.status === 'ready' && state.quotes.length === 0 ? (
        <Message text="No futures quotes in this run." />
      ) : null}

      {state.status === 'ready' && state.quotes.length > 0
        ? state.quotes.slice(0, MAX_ROWS).map((quote, index) => (
            <QuoteRow key={quote.id} quote={quote} showDivider={index > 0} />
          ))
        : null}

      {/* Absent is not empty. The poster ran and this section had nothing in
          it, which is not the same as the run returning zero quotes. */}
      {state.status === 'absent' ? <Message text="Futures data unavailable." /> : null}

      {state.status === 'error' ? (
        <View style={{ paddingHorizontal: theme.space[4], paddingVertical: theme.space[3], gap: theme.space[3] }}>
          <Text style={[theme.text.body, { color: theme.color.textSecondary }]}>
            {state.error.userMessage}
          </Text>
          <View style={styles.retryRow}>
            <Pocket onPress={retry} accessibilityLabel="Retry loading market futures">
              <Text style={[theme.text.body, { color: theme.color.textPrimary }]}>Retry</Text>
            </Pocket>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function QuoteRow({ quote, showDivider }: { quote: FuturesQuote; showDivider: boolean }) {
  const theme = useTheme();

  return (
    <View>
      {showDivider ? (
        <View style={{ height: theme.hairline.width, backgroundColor: theme.hairline.color }} />
      ) : null}
      {/* `flat` — a row is content, and §4 gives content no fill. The Pocket is
          here for the press feel, not for a surface. */}
      <Pocket flat radius="row" style={styles.row} accessibilityLabel={quote.label}>
        <Text style={[theme.text.bodyLarge, { color: theme.color.textPrimary }]} numberOfLines={1}>
          {quote.label}
        </Text>
        {/* Grey, not green or red. This is a routine tick and the payload
            carries no signal field — direction is read off the sign (§3). */}
        <Text
          style={[
            theme.text.bodyLarge,
            theme.tabularNums,
            styles.numeric,
            { color: theme.color.textPrimary },
          ]}>
          {quote.error ? '—' : formatSignedPercent(quote.changePct)}
        </Text>
      </Pocket>
    </View>
  );
}

function LoadingRows() {
  const theme = useTheme();

  return (
    <View>
      {[0, 1, 2].map((row) => (
        <View key={row}>
          {row > 0 ? (
            <View style={{ height: theme.hairline.width, backgroundColor: theme.hairline.color }} />
          ) : null}
          <View
            style={[
              styles.row,
              { paddingHorizontal: theme.space[4], paddingVertical: theme.space[3] },
            ]}>
            <Skeleton width={88} />
            <Skeleton width={56} />
          </View>
        </View>
      ))}
    </View>
  );
}

function Message({ text }: { text: string }) {
  const theme = useTheme();

  return (
    <Text
      style={[
        theme.text.body,
        {
          color: theme.color.textSecondary,
          paddingHorizontal: theme.space[4],
          paddingVertical: theme.space[3],
        },
      ]}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  numeric: {
    // Fixed width so the decimal points line up down the column (§4).
    minWidth: 76,
    textAlign: 'right',
  },
  retryRow: {
    flexDirection: 'row',
  },
});
