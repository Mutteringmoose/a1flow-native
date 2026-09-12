import { apiGet, type ApiGetOptions } from '@/lib/api';

/**
 * GET /home/dashboard — the Home tab's reader.
 *
 * Free-tier and unauthenticated by design (§13.2). Backed by the A1Flow-Home
 * cache table, posted hourly Mon–Fri by the a1flow-home-poster Lambda, so the
 * data is minutes-to-an-hour old and never live-fetched per user (§13.3).
 *
 * Types are transcribed from a live 2026-09-12 payload and cross-checked
 * against the web build's src/lib/homeApi.ts.
 */

export type FuturesQuote = {
  id: string;
  symbol: string;
  label: string;
  price?: number;
  prevClose?: number;
  change?: number;
  /** Already in percent units: 0.8027 means +0.80%. */
  changePct?: number;
  /** Present instead of the numbers when a single quote failed upstream. */
  error?: string;
};

export type FuturesSection = {
  data: FuturesQuote[];
  okCount: number;
  total: number;
};

export type SentimentSection = {
  score: number;
  rating: string;
  timestamp: string;
  previousClose: number;
};

/**
 * Every section is wrapped, and the wrapper's field is also called `data` — so
 * the futures rows sit at `futures.data.data`. Easy to mis-read as one level.
 */
export type DashboardSection<T> = {
  data: T;
  updated_at: string;
};

/**
 * Sections are independently nullable and a null section is normal, not an
 * error: `calendar` was `{ data: null, updated_at: null }` on 2026-09-12 while
 * futures and sentiment were fine. Absent must render differently from empty.
 */
export type HomeDashboard = {
  futures?: DashboardSection<FuturesSection> | null;
  sentiment?: DashboardSection<SentimentSection> | null;
  calendar?: DashboardSection<unknown> | null;
  _meta?: DashboardSection<unknown> | null;
};

export function getHomeDashboard(options?: ApiGetOptions): Promise<HomeDashboard> {
  return apiGet<HomeDashboard>('/home/dashboard', options);
}
