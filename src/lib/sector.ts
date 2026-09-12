import { apiGet, type ApiGetOptions } from '@/lib/api';

/**
 * Sector readers. `sectors` is an object keyed by ETF symbol, not an array —
 * order is whatever JSON key order happens to be, so callers must sort.
 */

export type SectorLiveEntry = {
  close: number;
  change_pct: number;
  ref_close: number;
  ref_date: string;
};

export type SectorLive = {
  lookback: string;
  live: boolean;
  latest_date: string;
  updated_at: string;
  sectors: Record<string, SectorLiveEntry>;
};

export function getSectorLive(options?: ApiGetOptions): Promise<SectorLive> {
  return apiGet<SectorLive>('/sector/live', options);
}

export type SectorRangeEntry = {
  start_close: number;
  start_date: string;
  end_close: number;
  end_date: string;
  change_pct: number;
};

export type SectorRange = {
  start_date: string;
  end_date: string;
  sectors: Record<string, SectorRangeEntry>;
};

export function getSectorRange(
  start: string,
  end: string,
  options?: ApiGetOptions
): Promise<SectorRange> {
  return apiGet<SectorRange>(
    `/sector/heatmap/range?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
    options
  );
}

/** Full names for the SPDR set, so rows read as English not tickers. */
export const SECTOR_NAMES: Record<string, string> = {
  XLK: 'Technology',
  XLF: 'Financials',
  XLV: 'Health Care',
  XLY: 'Cons. Discretionary',
  XLP: 'Cons. Staples',
  XLE: 'Energy',
  XLI: 'Industrials',
  XLB: 'Materials',
  XLU: 'Utilities',
  XLRE: 'Real Estate',
  XLC: 'Communication',
  SPY: 'S&P 500',
};

/** Sorted best-to-worst. The benchmark is not a sector and is split out. */
export function rankSectors<T extends { change_pct: number }>(
  sectors: Record<string, T>
): { etf: string; name: string; entry: T }[] {
  return Object.entries(sectors)
    .filter(([etf]) => etf !== 'SPY')
    .map(([etf, entry]) => ({ etf, name: SECTOR_NAMES[etf] ?? etf, entry }))
    .sort((a, b) => b.entry.change_pct - a.entry.change_pct);
}
