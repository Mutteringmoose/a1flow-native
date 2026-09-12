import { useCallback, useMemo } from 'react';

import { DataRow } from '@/components/data-row';
import { Section, SectionError, SectionMessage, SectionSkeleton } from '@/components/section';
import { formatMonthDay, formatSignedPercent } from '@/lib/format';
import { getSectorRange, rankSectors } from '@/lib/sector';
import { useEndpoint } from '@/lib/use-endpoint';
import type { ApiGetOptions } from '@/lib/api';

const MAX_ROWS = 6;

/** First of the month, `YYYY-MM-01`, `monthsBack` months from now. */
function monthStartISO(monthsBack: number): string {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

/**
 * Sector performance over a range, ranked.
 *
 * Defaults to the web's default span of one month back to the current month.
 * The web exposes two month pickers to change it; those are deferred — see the
 * deviation note in the commit. The data layer already takes an arbitrary
 * range, so adding the control later does not change this component's shape.
 */
export function SectorHistory() {
  const start = useMemo(() => monthStartISO(1), []);
  const end = useMemo(() => monthStartISO(0), []);

  const fetcher = useCallback(
    (options: ApiGetOptions) => getSectorRange(start, end, options),
    [start, end]
  );

  const { state, retry } = useEndpoint(fetcher);

  if (state.status === 'loading') {
    return (
      <Section title="Sector History">
        <SectionSkeleton rows={5} />
      </Section>
    );
  }

  if (state.status === 'error') {
    return (
      <Section title="Sector History">
        <SectionError error={state.error} onRetry={retry} />
      </Section>
    );
  }

  const range = state.data;
  if (!range.sectors) return null;

  const ranked = rankSectors(range.sectors);
  const span = `${formatMonthDay(range.start_date)} – ${formatMonthDay(range.end_date)}`;

  return (
    <Section title="Sector History" note={span}>
      {ranked.length === 0 ? (
        <SectionMessage text="No sector history for this range." />
      ) : (
        ranked.slice(0, MAX_ROWS).map((row, index) => (
          <DataRow
            key={row.etf}
            label={row.name}
            detail={row.etf}
            value={formatSignedPercent(row.entry.change_pct)}
            showDivider={index > 0}
          />
        ))
      )}
    </Section>
  );
}
