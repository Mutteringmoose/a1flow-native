import { DataRow } from '@/components/data-row';
import { Section, SectionError, SectionMessage, SectionSkeleton } from '@/components/section';
import { getAnalystTape, type TapeEntry } from '@/lib/analyst';
import { formatUpdatedAt } from '@/lib/format';
import { useEndpoint } from '@/lib/use-endpoint';

const MAX_ROWS = 6;

/** What actually changed, in as few words as the wire allows. */
function describe(entry: TapeEntry): string {
  if (entry.kind === 'grade') {
    const from = entry.prev_grade;
    const to = entry.new_grade;
    if (from && to && from !== to) return `${from} → ${to}`;
    if (to) return to;
  }
  return entry.action || entry.kind;
}

/**
 * Analyst tape.
 *
 * Served ungated anonymously — `gated: false`, full 155 rows — so this is not a
 * teaser and must not be dressed as one. It is simply capped for the tab.
 *
 * No colour: an upgrade is not one of the things §3 spends green on, and the
 * `direction` field is the wire's own classification, not a fired A1 signal.
 */
export function AnalystTape() {
  const { state, retry } = useEndpoint(getAnalystTape);

  if (state.status === 'loading') {
    return (
      <Section title="Analyst Tape">
        <SectionSkeleton rows={5} />
      </Section>
    );
  }

  if (state.status === 'error') {
    return (
      <Section title="Analyst Tape">
        <SectionError error={state.error} onRetry={retry} />
      </Section>
    );
  }

  const tape = state.data;
  const entries = tape.data ?? [];

  return (
    <Section title="Analyst Tape" note={formatUpdatedAt(tape.updated_at)}>
      {entries.length === 0 ? (
        <SectionMessage text="No analyst actions on the tape." />
      ) : (
        entries.slice(0, MAX_ROWS).map((entry, index) => (
          <DataRow
            key={entry.id}
            label={entry.symbol}
            detail={entry.firm}
            value={describe(entry)}
            numeric={false}
            showDivider={index > 0}
          />
        ))
      )}
    </Section>
  );
}
