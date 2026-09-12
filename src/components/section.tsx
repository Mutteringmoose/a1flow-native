import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Pocket } from '@/components/pocket';
import { Skeleton } from '@/components/skeleton';
import type { ApiError } from '@/lib/api';
import { useTheme } from '@/theme/use-theme';

/**
 * Section chrome, shared by every card on a tab.
 *
 * DE-FRAME (§4): no box, no card, no border. A section is a one-line header, a
 * hairline, and rows that run edge to edge.
 */
export function Section({
  title,
  note,
  children,
}: {
  title: string;
  /** Right-hand annotation — a timestamp, a count. Headers carry these (§5). */
  note?: string | null;
  children: ReactNode;
}) {
  const theme = useTheme();

  return (
    <View style={{ paddingTop: theme.space[5] }}>
      <View
        style={[
          styles.header,
          { paddingHorizontal: theme.space[4], paddingBottom: theme.space[3] },
        ]}>
        <Text style={[theme.text.caption, { color: theme.color.textSecondary }]}>{title}</Text>
        {note ? (
          <Text style={[theme.text.caption, theme.tabularNums, { color: theme.color.textMuted }]}>
            {note}
          </Text>
        ) : null}
      </View>
      <Hairline />
      {children}
    </View>
  );
}

export function Hairline() {
  const theme = useTheme();
  return <View style={{ height: theme.hairline.width, backgroundColor: theme.hairline.color }} />;
}

/** One factual sentence. No exclamation, no instruction, no apology. */
export function SectionMessage({ text }: { text: string }) {
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

export function SectionError({ error, onRetry }: { error: ApiError; onRetry: () => void }) {
  const theme = useTheme();

  return (
    <View
      style={{
        paddingHorizontal: theme.space[4],
        paddingVertical: theme.space[3],
        gap: theme.space[3],
      }}>
      <Text style={[theme.text.body, { color: theme.color.textSecondary }]}>
        {error.userMessage}
      </Text>
      <View style={styles.inlineStart}>
        <Pocket onPress={onRetry} accessibilityLabel="Retry">
          <Text style={[theme.text.body, { color: theme.color.textPrimary }]}>Retry</Text>
        </Pocket>
      </View>
    </View>
  );
}

export function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  const theme = useTheme();

  return (
    <View>
      {Array.from({ length: rows }, (_, row) => (
        <View key={row}>
          {row > 0 ? <Hairline /> : null}
          <View
            style={[
              styles.skeletonRow,
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

/**
 * A locked teaser. Asks; never pretends the data is absent (§10).
 *
 * Gold is correct here and almost nowhere else — this is the locked-feature
 * indicator the earned-colour doctrine reserves it for.
 */
export function LockedNote({ text }: { text: string }) {
  const theme = useTheme();

  return (
    <View style={{ paddingHorizontal: theme.space[4], paddingVertical: theme.space[3] }}>
      <Text style={[theme.text.body, { color: theme.color.premium }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inlineStart: {
    flexDirection: 'row',
  },
});
