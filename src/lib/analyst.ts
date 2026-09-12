import { apiGet, type ApiGetOptions } from '@/lib/api';

/** Analyst tape — price-target and grade changes off the wire. */

export type TapeEntry = {
  id: string;
  kind: 'grade' | 'pt' | string;
  symbol: string;
  ts: string;
  firm: string;
  action: string;
  prev_grade?: string | null;
  new_grade?: string | null;
  title: string;
  url: string;
  direction: 'up' | 'down' | 'neutral' | string;
};

export type AnalystTape = {
  count: number;
  total: number;
  tier: string;
  /** Whether the server truncated. False anonymously — this feed is open. */
  gated: boolean;
  updated_at: string;
  data: TapeEntry[];
};

export function getAnalystTape(options?: ApiGetOptions): Promise<AnalystTape> {
  return apiGet<AnalystTape>('/analyst/tape?tier=diamond&kind=all', options);
}
