import { DataRow } from '@/components/data-row';
import { Section, SectionError, SectionMessage, SectionSkeleton } from '@/components/section';
import { formatSignedPercent, formatUpdatedAt } from '@/lib/format';
import type { DashboardSectionProps } from '@/lib/home';

export function MarketFutures({ state, retry }: DashboardSectionProps) {
  if (state.status === 'loading') {
    return (
      <Section title="Market Futures">
        <SectionSkeleton rows={3} />
      </Section>
    );
  }

  if (state.status === 'error') {
    return (
      <Section title="Market Futures">
        <SectionError error={state.error} onRetry={retry} />
      </Section>
    );
  }

  const section = state.data.futures;
  // Null section renders nothing at all — not an empty box (NULL-not-zero).
  if (!section || !section.data) return null;

  // Double-nested: the wrapper's `data` holds an object whose own `data` is
  // the row array.
  const quotes = section.data.data ?? [];

  return (
    <Section title="Market Futures" note={formatUpdatedAt(section.updated_at)}>
      {quotes.length === 0 ? (
        <SectionMessage text="No futures quotes in this run." />
      ) : (
        quotes.map((quote, index) => (
          <DataRow
            key={quote.id}
            label={quote.label}
            // Grey, not green. A routine tick with no signal field behind it —
            // direction is read off the sign (§3).
            value={quote.error ? '—' : formatSignedPercent(quote.changePct)}
            showDivider={index > 0}
          />
        ))
      )}
    </Section>
  );
}
