import { DataRow } from '@/components/data-row';
import { Section, SectionError, SectionMessage, SectionSkeleton } from '@/components/section';
import { formatSignedPercent } from '@/lib/format';
import { getSeasonality, rankSeasonality } from '@/lib/macro';
import { useEndpoint } from '@/lib/use-endpoint';

const MAX_ROWS = 6;

/**
 * Sector seasonality for the current month.
 *
 * Descriptive, never directive (§1): this is a historical tendency and the row
 * says so by carrying its sample size. It is not a recommendation and the copy
 * must never imply one.
 */
export function SectorSeasonality() {
  const { state, retry } = useEndpoint(getSeasonality);

  if (state.status === 'loading') {
    return (
      <Section title="Sector Seasonality">
        <SectionSkeleton rows={5} />
      </Section>
    );
  }

  if (state.status === 'error') {
    return (
      <Section title="Sector Seasonality">
        <SectionError error={state.error} onRetry={retry} />
      </Section>
    );
  }

  const data = state.data;
  if (!data.sectors || !data.current_month) return null;

  const ranked = rankSeasonality(data, data.current_month);

  return (
    <Section title="Sector Seasonality" note={data.current_month}>
      {ranked.length === 0 ? (
        <SectionMessage text={`No seasonality history for ${data.current_month}.`} />
      ) : (
        ranked.slice(0, MAX_ROWS).map((row, index) => (
          <DataRow
            key={row.etf}
            label={row.name}
            detail={`${row.stat.years}y · ${row.stat.win_rate_pct}% win`}
            value={formatSignedPercent(row.stat.avg_return_pct)}
            showDivider={index > 0}
          />
        ))
      )}
    </Section>
  );
}
