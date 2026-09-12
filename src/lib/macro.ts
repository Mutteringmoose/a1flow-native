import { apiGet, type ApiGetOptions } from '@/lib/api';

/**
 * Seasonality. Historical tendency, not a forecast — the payload says so in its
 * own `note` field, and the voice rules say show what is, never instruct (§1).
 */

export type MonthStat = {
  month: string;
  avg_return_pct: number;
  win_rate_pct: number;
  median_pct?: number;
  best_pct?: number;
  worst_pct?: number;
  years: number;
};

export type SectorSeasonality = {
  etf: string;
  name: string;
  months: MonthStat[];
};

export type Seasonality = {
  symbol: string;
  from: string;
  to: string;
  /** Three-letter, e.g. "Sep". Matches MonthStat.month. */
  current_month: string;
  months: MonthStat[];
  sectors: SectorSeasonality[];
  note: string;
  built_at: string;
};

export function getSeasonality(options?: ApiGetOptions): Promise<Seasonality> {
  return apiGet<Seasonality>('/macro/seasonality', options);
}

/** Sectors ranked by their average return in one month, best first. */
export function rankSeasonality(
  data: Seasonality,
  month: string
): { etf: string; name: string; stat: MonthStat }[] {
  return data.sectors
    .map((sector) => ({
      etf: sector.etf,
      name: sector.name,
      stat: sector.months.find((m) => m.month === month),
    }))
    .filter((row): row is { etf: string; name: string; stat: MonthStat } => row.stat !== undefined)
    .sort((a, b) => b.stat.avg_return_pct - a.stat.avg_return_pct);
}
