import { DataRow } from '@/components/data-row';
import { LockedNote, Section, SectionError, SectionSkeleton } from '@/components/section';
import { getLeap } from '@/lib/screener';
import { useEndpoint } from '@/lib/use-endpoint';

/** Bands run 4/4 down to 1/4. Zero passes is not a setup and is not shown. */
const BANDS = ['4', '3', '2', '1'] as const;

/**
 * LEAP screener teaser.
 *
 * `visible` is empty on the free window — every LEAP name sits above the tier.
 * That is the one case §10 is explicit about: this must never render "no
 * setups found", because the truth is "locked", and a fake empty state lies.
 *
 * So the section shows what the server does give anonymously: how many setups
 * exist in each band. Real numbers, no names.
 */
export function LeapTeaser() {
  const { state, retry } = useEndpoint(getLeap);

  if (state.status === 'loading') {
    return (
      <Section title="LEAP Setups">
        <SectionSkeleton rows={4} />
      </Section>
    );
  }

  if (state.status === 'error') {
    return (
      <Section title="LEAP Setups">
        <SectionError error={state.error} onRetry={retry} />
      </Section>
    );
  }

  const board = state.data;
  const counts = board.bucket_counts ?? {};
  const bands = BANDS.map((band) => ({ band, count: counts[band] ?? 0 })).filter(
    (row) => row.count > 0
  );

  return (
    <Section
      title="LEAP Setups"
      note={board.eligible_count ? `${board.eligible_count} screened` : null}>
      {board.visible && board.visible.length > 0
        ? board.visible.map((row, index) => (
            <DataRow key={row.ticker} label={row.ticker} showDivider={index > 0} />
          ))
        : bands.map((row, index) => (
            <DataRow
              key={row.band}
              label={`${row.band}/4 checks`}
              value={String(row.count)}
              showDivider={index > 0}
            />
          ))}
      {board.locked_above && board.locked_above.count > 0 ? (
        <LockedNote text={board.locked_above.cta} />
      ) : null}
    </Section>
  );
}
