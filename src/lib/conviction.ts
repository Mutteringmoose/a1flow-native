import { apiGet, type ApiGetOptions } from '@/lib/api';

/**
 * Daily Conviction board — names confirmed across three or more independent
 * screeners. Rebuilt 7:00am ET on trading days.
 */

export type ConvictionName = {
  ticker: string;
  score: number;
  entry_price: number;
  sector: string;
  industry: string;
  /** Which screeners produced this name, e.g. ["UV#14", "RR#6"]. */
  receipts: string[];
  bull: number;
  cyclical: boolean;
  conflict: boolean;
};

export type ConvictionBoard = {
  built_at: string;
  board_date: string;
  engine_version: string;
  /** The top band. Empty is normal — the gate does not fire most days. */
  gate: ConvictionName[];
  watchlist: ConvictionName[];
  cyclical: ConvictionName[];
  /** Upstream complaints from the build, e.g. "leap: reader returned 0 rows". */
  problems: string[];
};

export function getConvictionBoard(options?: ApiGetOptions): Promise<ConvictionBoard> {
  return apiGet<ConvictionBoard>('/conviction/board', options);
}
