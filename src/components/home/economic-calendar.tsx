import { DataRow } from '@/components/data-row';
import { Section, SectionError, SectionMessage, SectionSkeleton } from '@/components/section';
import { formatMonthDay, formatUpdatedAt } from '@/lib/format';
import type { DashboardSectionProps } from '@/lib/home';

const MAX_ROWS = 6;

type CalendarEvent = {
  date: string;
  country: string;
  event: string;
  impact: string;
};

/**
 * Economic calendar.
 *
 * The `calendar` section of the home dashboard is null as of 2026-09-12 — the
 * poster publishes futures and sentiment but not this. A null section renders
 * nothing at all, so on the device today this component is invisible. That is
 * the intended behaviour, not a bug: an empty box that says "no events" would
 * claim the calendar is clear when the truth is that it was never posted.
 */
export function EconomicCalendar({ state, retry }: DashboardSectionProps) {
  if (state.status === 'loading') {
    return (
      <Section title="Economic Calendar">
        <SectionSkeleton rows={3} />
      </Section>
    );
  }

  if (state.status === 'error') {
    return (
      <Section title="Economic Calendar">
        <SectionError error={state.error} onRetry={retry} />
      </Section>
    );
  }

  const section = state.data.calendar;
  if (!section || !section.data) return null;

  const payload = section.data as { events?: CalendarEvent[]; count?: number };
  const events = payload.events ?? [];

  return (
    <Section title="Economic Calendar" note={formatUpdatedAt(section.updated_at)}>
      {events.length === 0 ? (
        <SectionMessage text="No events in this window." />
      ) : (
        events.slice(0, MAX_ROWS).map((event, index) => (
          <DataRow
            key={`${event.date}-${event.event}`}
            label={event.event}
            detail={event.country}
            value={formatMonthDay(event.date)}
            showDivider={index > 0}
          />
        ))
      )}
    </Section>
  );
}
