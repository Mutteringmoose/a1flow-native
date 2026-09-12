import { apiGet, type ApiGetOptions } from '@/lib/api';

/** Upcoming earnings, roughly five weeks forward. */

export type EarningsRow = {
  symbol: string;
  /** ISO date, no time. */
  date: string;
  epsEstimated: number | null;
  revenueEstimated: number | null;
  marketCap: number | null;
  mega: boolean;
  /** Whether the name is in the screener universe (§13.4). */
  inUniverse: boolean;
  /** "bmo" before the open, "amc" after the close. */
  session: string;
  ivNow: number | null;
  ivDeltaPts: number | null;
  climbing: boolean;
};

export type EarningsCalendar = {
  asOf: string;
  from: string;
  to: string;
  count: number;
  rows: EarningsRow[];
};

export function getEarningsCalendar(options?: ApiGetOptions): Promise<EarningsCalendar> {
  return apiGet<EarningsCalendar>('/earnings/calendar', options);
}
