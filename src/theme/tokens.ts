/**
 * A1 Flow design tokens — Brand Foundation v1, ported from CLAUDE.md §3.
 *
 * Two layers, and the boundary is load-bearing:
 *   primitives  — raw values. Nothing outside this file may read them directly.
 *   semantic    — what a component is allowed to reference.
 *
 * No component references a raw hex. Ever. (§3)
 */

import type { TextStyle } from 'react-native';

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

/** Greys carry a 1% green shift so they sit with the logo. §3 */
const grey = {
  950: '#0E100E',
  925: '#121412',
  900: '#181A18',
  850: '#1F211F',
  800: '#262826',
  700: '#2F322F',
  600: '#44474A',
  500: '#6B6F73',
  400: '#8A8E92',
  100: '#F0F2F0',
} as const;

/**
 * Earned colors. Green, red and gold are reserved — see EARNED_COLOR_DOCTRINE
 * below before reaching for one.
 */
const palette = {
  signalGreen500: '#3DDC84',
  signalRed500: '#F87171',
  gold300: '#DBBE79',
  gold500: '#C9A961',
  gold700: '#A48745',
  brandGreen500: '#2E8B2E',
  brandGreen700: '#1A641A',
} as const;

// ---------------------------------------------------------------------------
// Semantic
// ---------------------------------------------------------------------------

const color = {
  // Surfaces. Elevation lightens, never shadows — shadows go muddy on dark. §3
  surfaceCanvas: grey[900],
  surfaceCard: grey[850],
  surfaceElevated: grey[800],
  surfacePopover: grey[700],

  /**
   * Recessed interactive surface. Flat = read, recessed = touch (§4).
   * grey-925 sits ~2.4 lightness points below canvas — the "2–3% darker" in
   * the pocket amendment, measured in HSL L, not in channel percentage.
   */
  surfacePocket: grey[925],

  textPrimary: grey[100],
  textSecondary: grey[400],
  textMuted: grey[500],
  textDisabled: grey[600],

  borderSubtle: 'rgba(255,255,255,0.06)',
  borderDefault: 'rgba(255,255,255,0.10)',
  borderStrong: 'rgba(255,255,255,0.18)',

  // Earned — signal/verdict/premium only.
  signalUp: palette.signalGreen500,
  signalDown: palette.signalRed500,
  premium: palette.gold500,
  premiumPressed: palette.gold700,
  premiumHairline: palette.gold300,
  navActive: palette.brandGreen500,
  navActivePressed: palette.brandGreen700,
} as const;

/**
 * Green, red and gold are reserved. Routine price display gets grey plus the
 * number's own +/- sign — the user reads direction from the sign, not the
 * color. If gold appears everywhere it means nothing. (§3)
 */
export const EARNED_COLOR_DOCTRINE = {
  green: 'fired BUY signal · watchlist whale print · strong-threshold flow alert · confirmation toast',
  red: 'earnings miss vs consensus · account warning · stale/failed data · destructive confirm · validation error',
  gold: 'Diamond badge · upgrade CTA · the single most important number on a Diamond screen · locked indicator',
  never: 'gold as background · gold as decoration · red/green for routine ticks',
} as const;

// ---------------------------------------------------------------------------
// Type
// ---------------------------------------------------------------------------

/**
 * Inter is doctrine (§3) but is not bundled yet — no font asset is loaded.
 * Until it is, this resolves to the platform system face. When Inter lands,
 * change this one value, not the call sites.
 */
const fontFamily: { sans: string | undefined } = {
  sans: undefined,
};

/** 400/500/600. 700 is for hero moments only — never body. §3 */
const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  hero: '700',
} as const satisfies Record<string, TextStyle['fontWeight']>;

const fontSize = {
  xs: 11,
  sm: 13,
  base: 14,
  md: 16,
  lg: 18,
  xl: 22,
  '2xl': 28,
} as const;

const lineHeight = {
  xs: 15, // 11 × 1.4
  sm: 18, // 13 × 1.4
  base: 21, // 14 × 1.5
  md: 24, // 16 × 1.5
  lg: 23, // 18 × 1.3
  xl: 26, // 22 × 1.2
  '2xl': 31, // 28 × 1.1
} as const;

/**
 * Tabular numerals on anything numeric. Column jitter when digits change is
 * the number-one amateur tell in a fintech UI. (§3)
 */
const tabularNums: TextStyle = {
  fontVariant: ['tabular-nums'],
};

/** Three sizes cover 95% of the app — hierarchy comes from weight. §2 */
const text = {
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    fontWeight: fontWeight.medium,
  },
  body: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontWeight: fontWeight.regular,
  },
  bodyLarge: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    fontWeight: fontWeight.regular,
  },
  header: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    fontWeight: fontWeight.semibold,
  },
  headerLarge: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
    fontWeight: fontWeight.semibold,
  },
} as const satisfies Record<string, TextStyle>;

// ---------------------------------------------------------------------------
// Space, radius, motion
// ---------------------------------------------------------------------------

/** 4px base. No arbitrary values. §3 */
const space = {
  1: 4,
  2: 8,
  3: 12, // default card padding
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
} as const;

/** Low radii read professional. 16px+ reads consumer. §3 */
const radius = {
  sm: 4,
  md: 6,
  lg: 12,
  full: 9999,
} as const;

/** Hairline divider — the mobile replacement for a card border. §4 DE-FRAME */
const hairline = {
  width: 1,
  color: color.borderSubtle,
} as const;

/**
 * §13.1 (§7-Native): spring where the user touched, instant everywhere else.
 * Duration-based spring so the 400 ms settle ceiling is guaranteed by the
 * config rather than hoped for out of stiffness/damping.
 */
const motion = {
  press: { duration: 220, dampingRatio: 0.82 },
  pressScale: 0.97,
  /** A spring must be at rest within this. §13.1 */
  settleCeilingMs: 400,
} as const;

export const tokens = {
  color,
  text,
  fontSize,
  lineHeight,
  fontWeight,
  fontFamily,
  tabularNums,
  space,
  radius,
  hairline,
  motion,
} as const;

export type Tokens = typeof tokens;
