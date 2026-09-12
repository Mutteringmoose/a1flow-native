import { DataRow } from '@/components/data-row';
import { Section, SectionError, SectionMessage, SectionSkeleton } from '@/components/section';
import { getConvictionBoard } from '@/lib/conviction';
import { formatScore } from '@/lib/format';
import { useEndpoint } from '@/lib/use-endpoint';

const MAX_ROWS = 6;

/**
 * Daily Conviction — names confirmed across three or more screeners.
 *
 * `gate` is the top band and is empty most days; the watchlist is the body of
 * the board. Falling back from one to the other is normal, not degraded.
 */
export function ConvictionTeaser() {
  const { state, retry } = useEndpoint(getConvictionBoard);

  if (state.status === 'loading') {
    return (
      <Section title="Daily Conviction">
        <SectionSkeleton rows={4} />
      </Section>
    );
  }

  if (state.status === 'error') {
    return (
      <Section title="Daily Conviction">
        <SectionError error={state.error} onRetry={retry} />
      </Section>
    );
  }

  const board = state.data;
  const names = board.gate?.length ? board.gate : (board.watchlist ?? []);
  const band = board.gate?.length ? 'gate' : 'watchlist';

  return (
    <Section title="Daily Conviction" note={names.length ? band : null}>
      {names.length === 0 ? (
        <SectionMessage text="No names cleared the board today." />
      ) : (
        names.slice(0, MAX_ROWS).map((name, index) => (
          <DataRow
            key={name.ticker}
            label={name.ticker}
            detail={name.sector}
            // Grey. A conviction score is a ranking, not a fired signal (§3).
            value={formatScore(name.score)}
            showDivider={index > 0}
          />
        ))
      )}
    </Section>
  );
}
