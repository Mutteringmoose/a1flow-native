import { DataRow } from '@/components/data-row';
import { Section, SectionError, SectionMessage, SectionSkeleton } from '@/components/section';
import { getEarningsCalendar, type EarningsRow } from '@/lib/earnings';
import { formatMonthDay } from '@/lib/format';
import { useEndpoint } from '@/lib/use-endpoint';

const MAX_ROWS = 6;

/** "bmo" and "amc" are wire shorthand. Spell them out (§1, high-schooler test). */
function sessionLabel(session: string): string {
  if (session === 'bmo') return 'before open';
  if (session === 'amc') return 'after close';
  return session;
}

function rowDetail(row: EarningsRow): string {
  const parts = [sessionLabel(row.session)];
  if (row.mega) parts.push('mega cap');
  return parts.join(' · ');
}

/**
 * Upcoming earnings.
 *
 * Sorted by date ascending — the payload arrives in its own order and the
 * soonest report is the only ordering that makes sense above the fold.
 */
export function EarningsCalendar() {
  const { state, retry } = useEndpoint(getEarningsCalendar);

  if (state.status === 'loading') {
    return (
      <Section title="Upcoming Earnings">
        <SectionSkeleton rows={5} />
      </Section>
    );
  }

  if (state.status === 'error') {
    return (
      <Section title="Upcoming Earnings">
        <SectionError error={state.error} onRetry={retry} />
      </Section>
    );
  }

  const calendar = state.data;
  const rows = [...(calendar.rows ?? [])].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Section title="Upcoming Earnings" note={calendar.count ? `${calendar.count} scheduled` : null}>
      {rows.length === 0 ? (
        <SectionMessage text="No earnings scheduled in this window." />
      ) : (
        rows.slice(0, MAX_ROWS).map((row, index) => (
          <DataRow
            key={`${row.symbol}-${row.date}`}
            label={row.symbol}
            detail={rowDetail(row)}
            value={formatMonthDay(row.date)}
            showDivider={index > 0}
          />
        ))
      )}
    </Section>
  );
}
