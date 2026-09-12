import { DataRow } from '@/components/data-row';
import { Section, SectionError, SectionMessage, SectionSkeleton } from '@/components/section';
import { formatSignedPercent, formatUpdatedAt } from '@/lib/format';
import { getSectorLive, rankSectors } from '@/lib/sector';
import { useEndpoint } from '@/lib/use-endpoint';

/** Live SPDR sector performance, ranked best to worst. */
export function SectorFlow() {
  const { state, retry } = useEndpoint(getSectorLive);

  if (state.status === 'loading') {
    return (
      <Section title="Sector Flow">
        <SectionSkeleton rows={5} />
      </Section>
    );
  }

  if (state.status === 'error') {
    return (
      <Section title="Sector Flow">
        <SectionError error={state.error} onRetry={retry} />
      </Section>
    );
  }

  const live = state.data;
  if (!live.sectors) return null;

  const ranked = rankSectors(live.sectors);
  const benchmark = live.sectors.SPY;

  return (
    <Section title="Sector Flow" note={formatUpdatedAt(live.updated_at)}>
      {ranked.length === 0 ? (
        <SectionMessage text="No sector quotes in this run." />
      ) : (
        <>
          {ranked.map((row, index) => (
            <DataRow
              key={row.etf}
              label={row.name}
              detail={row.etf}
              value={formatSignedPercent(row.entry.change_pct)}
              showDivider={index > 0}
            />
          ))}
          {/* The benchmark is not a sector, so it sits below the ranking
              rather than competing inside it. */}
          {benchmark ? (
            <DataRow
              label="S&P 500"
              detail="SPY"
              value={formatSignedPercent(benchmark.change_pct)}
              showDivider
            />
          ) : null}
        </>
      )}
    </Section>
  );
}
