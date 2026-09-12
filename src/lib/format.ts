/**
 * The single home for number formatting.
 *
 * The web build grew five local copies of formatPremium across its Flow files.
 * Exactly one copy of each formatter lives here (§9) — if you need a variant,
 * add a parameter, not a second function in a component file.
 */

/**
 * Signed percent, two decimals: `+0.80%`, `-1.24%`, `0.00%`.
 *
 * The sign is the point. Routine price movement is displayed in grey and the
 * user reads direction from the sign, not from colour (§3 earned-colour
 * doctrine), so a bare `0.80%` would lose the only direction cue the row has.
 *
 * Expects percent units — the API's `changePct` is already scaled (0.8027 for
 * +0.80%), verified against a live payload, not inferred.
 */
export function formatSignedPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return '—';
  }
  // Zero is signless. `+0.00%` reads as a rounded-up gain that did not happen.
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}${Math.abs(value).toFixed(2)}%`;
}

/**
 * Index level with thousands separators: `7,659.50`, `52,576.00`.
 * No currency symbol — futures indices are points, not dollars.
 */
export function formatIndexLevel(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return '—';
  }
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Clock time for a section header: `2:00 PM`. Headers carry the annotation
 * (§5), so this is deliberately short rather than a full timestamp.
 */
export function formatUpdatedAt(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}
