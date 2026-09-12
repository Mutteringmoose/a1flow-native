import { apiGet, type ApiGetOptions } from '@/lib/api';

/**
 * Screener readers.
 *
 * Tier is requested, never decided here. The web asks for `diamond` from Home
 * and lets the Lambda truncate against the verified token (§10) — an anonymous
 * call comes back stamped `tier: "free"` with the free window. Sending `free`
 * from the client would be the client deciding its own tier, which is the
 * regression §10 names explicitly.
 */
const REQUESTED_TIER = 'diamond';

/** Echoed by the server. This is tier truth for display, not what we asked for. */
export type ServedTier = 'free' | 'gold' | 'diamond' | 'diamond_plus' | string;

export type UndervaluedRow = {
  rank: number;
  ticker: string;
  flag: string;
  /**
   * Null on the free window — the row is visible, the score is withheld. That
   * is tease-then-lock, not missing data, and must not render as an error.
   */
  uvs: number | null;
  components: unknown | null;
};

export type LockedAbove = {
  count: number;
  ranks?: number[];
  bands?: string[];
  cta: string;
};

export type UndervaluedScreener = {
  screener: string;
  tier: ServedTier;
  scan_date: string;
  run_id: string;
  last_updated: string;
  eligible_count: number;
  window: { start: number; end: number };
  visible: UndervaluedRow[];
  locked_above: LockedAbove | null;
};

export function getUndervalued(options?: ApiGetOptions): Promise<UndervaluedScreener> {
  return apiGet<UndervaluedScreener>(`/screener/undervalued?tier=${REQUESTED_TIER}`, options);
}

export type LeapScreener = {
  screener: string;
  tier: ServedTier;
  scan_date: string;
  run_id: string;
  last_updated: string;
  score_basis: string;
  eligible_count: number;
  /** Counts by how many of the four checks passed, keyed "0".."4". */
  bucket_counts: Record<string, number>;
  check_legend: string[];
  /** Empty on the free window — every LEAP name sits above the tier. */
  visible: { ticker: string; checks?: number }[];
  locked_above: LockedAbove | null;
};

export function getLeap(options?: ApiGetOptions): Promise<LeapScreener> {
  return apiGet<LeapScreener>(`/screener/leap?tier=${REQUESTED_TIER}`, options);
}
