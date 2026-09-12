import { DataRow } from '@/components/data-row';
import {
  LockedNote,
  Section,
  SectionError,
  SectionMessage,
  SectionSkeleton,
} from '@/components/section';
import { getUndervalued } from '@/lib/screener';
import { useEndpoint } from '@/lib/use-endpoint';

const MAX_ROWS = 6;

/**
 * Undervalued screener teaser.
 *
 * The free window returns real rows with `uvs: null` — the name is shown, the
 * score is withheld. So there is no right-hand column here: a column of dashes
 * would imply the data failed rather than that it is locked. Rank plus ticker
 * is what the server actually gave us, and §4 exempts `#N` from the
 * unlabelled-metric ban precisely for this.
 */
export function UndervaluedTeaser() {
  const { state, retry } = useEndpoint(getUndervalued);

  if (state.status === 'loading') {
    return (
      <Section title="Undervalued">
        <SectionSkeleton rows={4} />
      </Section>
    );
  }

  if (state.status === 'error') {
    return (
      <Section title="Undervalued">
        <SectionError error={state.error} onRetry={retry} />
      </Section>
    );
  }

  const board = state.data;
  const rows = board.visible ?? [];
  const note = board.eligible_count ? `${board.eligible_count} eligible` : null;

  return (
    <Section title="Undervalued" note={note}>
      {rows.length === 0 ? (
        <SectionMessage text="No names in the visible window." />
      ) : (
        rows
          .slice(0, MAX_ROWS)
          .map((row, index) => (
            <DataRow
              key={row.ticker}
              rank={row.rank}
              label={row.ticker}
              showDivider={index > 0}
            />
          ))
      )}
      {board.locked_above && board.locked_above.count > 0 ? (
        <LockedNote text={board.locked_above.cta} />
      ) : null}
    </Section>
  );
}
