@AGENTS.md

# A1 FLOW — NATIVE

Doctrine pack v0.3 · 2026-09-12 · repo `a1flow-native` · baseline commit `b6fad7b`

This file is the constitution. Brand Foundation v1 and Chart Doctrine v2 are law, not
suggestions. Everything else in here is a canonical learned the expensive way on the web
build — assume each line cost someone a day.

**Status: §7 (Motion) is RULED as of 2026-09-12.** The ruling lives in §13.1 (§7-Native) and
supersedes the §7 stub below. Read §13 before writing any animation behaviour.

---

## 0. HOW TO WORK HERE

1. **Verify against versioned docs before writing code.** Inherited from Expo's own
   `AGENTS.md` and it is the house rule too. SDK 57 / RN 0.86 / Reanimated 4 are all newer
   than most training data and most tutorials on the internet. Read
   `https://docs.expo.dev/versions/v57.0.0/` and the Reanimated 4 docs. Do not write from
   recall.
2. **Assume a sibling built it well — find it first.** Before building anything, search the
   repo for something that already does part of it. On the web build, three separate
   "defects" turned out to be correct code that nobody had read.
3. **Patch, don't rewrite.** Read the live file, make the surgical edit. Rewrites strip
   conventions you did not know were load-bearing.
4. **Name the convention.** "60 days" is ambiguous — say calendar or trading. "Expectancy"
   is ambiguous — say whether it includes mark-to-market opens. Ambiguity here has produced
   wrong conclusions twice.
5. **One commit per logical change**, message in imperative mood, prefixed
   `feat:` / `fix:` / `chore:` / `refactor:`.

### Definition of done
No task is complete until it has been seen running on a **real iPhone** via Expo Go or a dev
build. **Emulated ≠ device is proven doctrine here** — a component passed emulated 390px and
failed on the real phone, and that is why this rule exists. Simulator screenshots are not
evidence.

### Platform posture
**iOS is the focus. The iPhone is the oracle.** Android ships later off the same codebase.

When a platform-specific choice arises, iOS wins the tiebreak — but never at the cost of
writing code that cannot run on Android. No `Platform.OS === 'ios'` branch may contain
business logic; keep those branches confined to presentation.

§4's layout grammar was derived from a real-device review of an Android phone. Those rules are
mobile-vs-desktop idiom, not Android-vs-iOS. **They hold unchanged.**

---

## 1. WHAT THIS IS

Institutional-grade market intelligence for retail traders. Positioned between Robinhood
(too basic) and Bloomberg Terminal (too expensive). Tiers: Free / Gold / Diamond ($40/mo).

Every pixel decision asks: **"Would a hedge fund analyst respect this?"** Not "is this cute."

This app is a full native rebuild of `a1flow.io`. The web app is not deprecated — it remains
the desktop product and the Stripe web-checkout funnel. **The backend does not change.** Same
API Gateway, same Lambdas, same DynamoDB. This migration is frontend-only.

### Voice
Direct. Expert. Never patronizing. Never hype. No emoji.

- Headlines declarative: `Dark Pool Whale: TSLA $55.9M` — never `Look! Big Money in TSLA!`
- Empty states factual: `No signals fired this hour.` — never `Nothing here yet!`
- **Descriptive, never directive.** Show what is. Never instruct a trade.
- **The high-schooler test.** Every card leads with one sentence a stranger reads cold
  (`re-rated ~March, 15x→58x, up 34% since`). Numbers underneath for traders.

---

## 2. SIX PRINCIPLES (Brand Foundation §1.3 — port verbatim)

1. **Information density over whitespace.** Body 13–14px, line-height 1.4. Card padding
   12–16px, never 24–32px. Terminals pack data because users want data.
2. **Color is information, not decoration.** Default state is grey on grey on grey.
3. **Mobile parity, not mobile compromise.** If a feature can't work on mobile, it doesn't
   ship.
4. **Type hierarchy through weight, not size.** Three sizes cover 95% of the app. No 48px
   hero text.
5. **Motion is for feedback, not delight.** Every animation answers "did something happen?"
   — never "look how cool we are."
6. **Dark mode native.** Ship dark-only. No hardcoded hex in components — tokens only.

Principle 6 means the scaffold's `use-color-scheme.ts` / `use-theme.ts` light-mode branches
get removed, not maintained.

---

## 3. TOKENS → `src/constants/theme.ts`

No component references a raw hex. Ever. Components reference semantic tokens; semantic
tokens reference primitives.

### Greys (1% green-shift, for logo harmony)

| Token | Hex |
|---|---|
| grey-950 | `#0E100E` |
| grey-900 | `#181A18` ← canvas |
| grey-850 | `#1F211F` |
| grey-800 | `#262826` |
| grey-700 | `#2F322F` |
| grey-600 | `#44474A` |
| grey-500 | `#6B6F73` |
| grey-400 | `#8A8E92` |
| grey-100 | `#F0F2F0` |

### Semantic

```
surface-canvas    grey-900     text-primary    grey-100
surface-card      grey-850     text-secondary  grey-400
surface-elevated  grey-800     text-muted      grey-500
surface-popover   grey-700     text-disabled   grey-600

border-subtle     rgba(255,255,255,0.06)
border-default    rgba(255,255,255,0.10)
border-strong     rgba(255,255,255,0.18)
```

### Earned colors — signals only

| Token | Hex |
|---|---|
| signal-green-500 | `#3DDC84` |
| signal-red-500 | `#F87171` |
| gold-500 | `#C9A961` |
| gold-700 | `#A48745` |
| gold-300 | `#DBBE79` |
| brand-green-500 | `#2E8B2E` |
| brand-green-700 | `#1A641A` |

`brand-green-900` exists in Brand Foundation v1 but its hex is not recorded here — read it
out of the source doc before using it.

### EARNED-COLOR DOCTRINE (critical — the rule that makes the palette work)

Green, red and gold are reserved. **Routine price display gets grey plus the number's own
+/- sign.** The user reads direction from the sign, not the color.

- **Green** only for: a fired BUY signal, a watchlist whale print, a strong-threshold flow
  alert, a confirmation toast, active nav state (brand green, not signal green).
- **Red** only for: earnings miss vs consensus, account-level warning, stale/failed data,
  destructive confirmation, validation error.
- **Gold** only for: Diamond badges, upgrade CTAs, the single most important number on a
  Diamond screen, locked-feature indicators.
- **Never:** gold as background, gold as decoration, red/green for routine ticks.

If gold appears everywhere it means nothing. That is the entire point.

### Type

Inter, single font, **tabular numerals globally on anything numeric.** Column jitter when
digits change is the number-one amateur tell in a fintech UI.

`xs 11/1.4 · sm 13/1.4 · base 14/1.5 · md 16/1.5 · lg 18/1.3 · xl 22/1.2 · 2xl 28/1.1`

Weights 400 / 500 / 600. 700 for hero moments only, **never body.**

### Spacing — 4px base, no arbitrary values

`1:4 · 2:8 · 3:12 ← default card padding · 4:16 · 5:20 · 6:24 · 8:32 · 10:40`

### Radius

`sm 4 · md 6 ← DEFAULT · lg 12 · full 9999`

Keep radii low. 16px+ reads consumer (Cash App). 4–8px reads professional (Bloomberg,
Linear, TradingView).

### Elevation

**Lighten, don't shadow.** Shadows on dark backgrounds look muddy. Each elevation step goes
up the grey scale. Optional 1px `border-subtle` on elevated surfaces for crisp definition.

### Icons

Lucide. 1.5–2px stroke. Default 20px. Icons inherit `currentColor` — never hardcode.

---

## 4. MOBILE LAYOUT GRAMMAR (S21 punch list, locked 2026-07-09)

Five rules, earned from a real-device review of the web build:

1. **DE-FRAME.** Cards are a desktop idiom. Mobile goes edge-to-edge with hairline dividers,
   not boxes. Fix in shared primitives, never per-screen.
2. **GO HORIZONTAL.** Peek-scroll snap carousels for chart groups. Robinhood-style unboxed
   tab rows instead of chip clouds.
3. **VERDICT FIRST.** Plain-English banner leads every technical screen, before any chart.
4. **ANCHOR EVERYTHING.** X-axes labelled. Spot price marked on levels charts. Legend for
   every line. No unlabelled series.
5. **ROW GRAMMAR.** One-line rows. Right-hand numeric columns fixed-width and tabular.

### Recessed-pocket control grammar

**Flat = read. Recessed = touch.** Interactive surfaces (inputs, pills, chips, CTAs, teaser
locks) sit ~2–3% darker than canvas with capsule radii and near-white text. Content never
gets a fill — DE-FRAME holds.

Ranks are exempt from the unlabelled-metric ban: a small muted `#N` left of the ticker is
allowed, with rows in rank order.

---

## 5. CHART DOCTRINE v2 (law)

- **No y-axis labels.** The scrub/tooltip carries values.
- Year-only x-axis for long ranges.
- **Never** `preserveAspectRatio="none"`.
- Sparkline = muted grey line, single status-colored dot at the trailing end. That dot is one
  of the only places routine color coding is allowed, because it encodes a *state*.
- Band-zoom to the actual data range, not to zero.
- **Max 3–4 axis ticks.**
- Annotations live in headers and legends. Never floating over the plot.

---

## 6. CHART FEEL DOCTRINE (the ceiling on this app's quality)

Everything that is not a chart is a solved library problem — navigation, lists, sheets all
have mature libraries where native feel is included. **All quality variance in this app lives
in the ~15 bespoke SVG chart surfaces**, and in a trading app the chart is the primary touch
surface.

### THE RULE

**A scrub must never touch React's render cycle.**

Wrong — this is the web port, and it is what reads to a user as "not a real app":

```
touch → JS thread → setState → reconcile → recompute path → native
```

Two or three frames of crosshair lag behind the finger. Users cannot articulate it. They just
feel that Robinhood is crisp and this is soft.

Right:

```
gesture recognized natively by gesture-handler
  → position written to a Reanimated shared value
  → crosshair + tooltip updated in a WORKLET on the UI thread
  → React never re-renders during the scrub
```

Finger and crosshair move on the same frame.

### Second layer: our series are large

SOFR from 2018-04-01. 730-day percentile windows. Full options chains. Handing an SVG path
three thousand points and re-deriving it per frame will stutter no matter how clean the
gesture layer is. Therefore:

- **Decimate** before render (largest-triangle-three-buckets or equivalent). Screen has ~400
  usable px; never draw more points than that.
- **Memoize paths.** A path is only recomputed when data or viewport changes — never on
  gesture.
- Heaviest charts likely move off `react-native-svg` onto Skia. Treat that as an expected
  architectural step, not a failure.

### WEEK-1 DE-RISK GATE — do this before building the other fourteen

Build **one** chart first: the scrubbing price chart. Highest touch-time, hardest gesture,
worst data volume. Take it to the full feel bar. Get it onto the **iPhone**. Thumb-test it
beside Robinhood on the same phone.

If it fails, one week is lost instead of two months. **Do not build chart two until chart one
passes on the device.**

---

## 7. MOTION — ⚠️ SUPERSEDED BY §13.1

**Ruled 2026-09-12. §13.1 (§7-Native) governs. The section below is kept as the record of why
the fork exists — its interim "no motion at all" rule is RETIRED.**

Brand Foundation v1 §7 was authored 2026-05-17 for a **web** app and contradicts the native
quality bar:

- §7.4 "Disallowed Animations" bans *"Bouncy / spring physics"* and *"Tab transitions"*
- §1.3 Principle 5 says *"No bouncy springs"*
- But the native bar mandates spring and haptics, and the 2026-07-19 pocket amendment says
  pockets compress on press **with spring**
- And §7.3's approved list is hover and focus states — neither of which exists on a
  touchscreen

Proposed resolution pending ruling: split into **§7-Web** (frozen, governs `a1flow.io`) and
**§7-Native**. Under §7-Native, springs are allowed on presses, sheets, tabs and pockets via
Reanimated; the 400ms ceiling survives reframed as *settle time*; Principle 5 survives intact
because a surface with physics is feedback, not decoration; ambient motion and parallax stay
banned; haptics join the approved list.

Candidate one-line rule for this file once ruled:

> **Spring where the user touched. Instant everywhere else.**
> Springs on controls, never on data readouts. A number never bounces into place.

Until ruled: no springs, no transitions, nothing. Leave motion out.

---

## 8. SDK 57 / REANIMATED 4 CANONICALS

Verified against live docs 2026-07-25. These are traps, not trivia.

- **Reanimated 4 is New Architecture only.** RN 0.86 is Fabric by default, so this is already
  satisfied. No opt-in flag.
- **Import worklet functions from `react-native-worklets`, not `react-native-reanimated`.**
  Reanimated 4 moved them out. They are still re-exported for backwards compatibility but
  are deprecated and slated for removal. Every pre-2025 tutorial writes the deprecated
  import — do not copy it.
- Babel plugin is `react-native-worklets/plugin` and **must be last** in the plugin array.
  `babel-preset-expo` may already handle this — check before adding.
- `useWorkletCallback` is **removed.** `combineTransition` is **removed.**
- `addWhitelistedNativeProps` / `addWhitelistedUIProps` are **no-ops.** Reanimated 4 removed
  the native-vs-UI prop distinction. The old ceremony for animating SVG props from a worklet
  is gone — animate them directly.
- Reanimated 4 adds a CSS-style declarative animation API alongside worklets. Prefer it for
  simple non-gesture transitions; worklets for anything gesture-driven.
- `@gorhom/bottom-sheet` requires **≥5.1.8** on Reanimated 4.
- Routes live in `src/app/`, not root `app/`. `package.json` main is `expo-router/entry`.

### Scaffold cleanup owed

- Strip `LICENSE` (MIT, dropped by `create-expo-app` — this project is proprietary).
- Remove light-mode branches from `use-color-scheme.ts` / `use-theme.ts` per Principle 6.
- Audit `src/global.css` and `*.module.css` — understand what they do on native before
  styling anything through them.
- Delete Expo demo assets (`react-logo*`, `expo-badge*`, `tutorial-web.png`, demo tab icons)
  once real screens exist.

### Dependencies needed, not yet installed

`react-native-svg` (all charts) · `@shopify/flash-list` (screener rows, prints tables) ·
`expo-haptics` · `expo-secure-store` (Cognito tokens — **JWTs never go in AsyncStorage**)

Install with `npx expo install`, never bare `npm install` — it resolves SDK-compatible
versions.

---

## 9. ENGINEERING CANONICALS (ported from the web build)

- **Union type rule.** When adding a member to a view/state union, grep every component the
  variable flows into before writing the change. TypeScript will not catch member-only
  property access until the build. This has bitten twice.
- The `in` operator narrows to `(A | B) & Record<K, unknown>` — it does **not** discriminate
  to a specific union member. Accessing member-specific props then fails `tsc` with TS2339.
  Fix with an explicit annotation plus cast.
- Type-check is the real gate. Syntax-only checks pass code that `tsc` rejects.
- **`formatPremium` consolidation:** the web build has five local copies across Flow files.
  Exactly one goes in `src/lib/format.ts` here. One copy migrates, not five.
- Never `Scan(Limit=1)` for a "latest" record — arbitrary partition order. This produced two
  separate wrong readings on the backend. If you touch a reader, know this.
- Chart color literals: the web build learned that canvas-based chart libraries cannot parse
  CSS `var()`. In RN, `react-native-svg` takes plain strings — pass resolved token values,
  not CSS variable syntax.

### Not portable

`src/lib/twa.ts` — TWA detection via `android-app://` referrer. **Doctrine reference only.**
RN uses `Platform.OS`. The anti-steering *compliance requirement* still applies to the Play
build: no external payment steering inside the app. Manage-Subscription stays, because it is
a Maryland ARL cancellation method, not steering.

Wrapper-era work does not port at all: AAB v3, assetlinks, first-launch onboarding built for
TWA.

---

## 10. BACKEND CONTRACT

**The backend is not being migrated.** It is stable and already serves the web app. Hit the
same endpoints.

- API Gateway: `tqbn8alhp5`, us-east-2, stage `prod`
- Auth: Cognito pool `us-east-2_ro0dkGJ9U`. Discord OAuth exists → **Sign in with Apple is
  required by App Store guideline 4.8.** Cognito IdP + Apple developer config is a permanent
  port, do it early.
- **Tier gating is server-side.** Free / Gold / Diamond windows are enforced in the Lambdas
  via JWKS ID-token verification. The client must send the token; the client must not decide
  the tier. Never reimplement gating client-side — that is a regression to a fixed bug.
- Tokens go in `expo-secure-store`.

### Secrets
No API keys, tokens or secrets in this repo, in `app.json`, or in `EXPO_PUBLIC_*` vars.
Anything prefixed `EXPO_PUBLIC_` ships in the client bundle and is readable by users. Server
secrets live in AWS Secrets Manager and are only ever touched by Lambdas.

### Tier ladder
Tease-then-lock, three tiers: Diamond full, Gold gets windows, Free gets teasers. Detail
pages return 200 with locked structure visible and data absent — never a fake empty state
that lies ("No notable options activity" when the truth is "locked"). Teaser copy asks; it
does not pretend.

---

## 10b. iOS SPECIFICS

- **Apple Developer Program ($99/yr) is required** to install a dev build on a physical
  iPhone. Expo Go needs nothing, but its native module set is immutable — the first
  `@shopify/flash-list` or Skia install ends Expo Go's usefulness. Unlike Android, there is no
  sideload escape hatch.
- **Sign in with Apple is mandatory**, not optional. Guideline 4.8 requires it wherever a
  third-party login is offered, and Discord OAuth already exists in the product. Same
  developer account, so it is one purchase covering both needs.
- **No Mac required.** EAS builds iOS in the cloud. A Mac is a convenience for local simulator
  debugging, never a blocker.
- Guideline **4.2 (minimum functionality)** no longer applies — this is a real native app, not
  a web wrapper. That risk is retired.
- `react-native-safe-area-context` is already installed. Use it. Never hardcode inset values —
  Dynamic Island and home-indicator geometry vary per device.

### Unruled forks — do not decide these unilaterally

1. **`expo-symbols` (SF Symbols) vs Lucide.** Brand Foundation specifies Lucide, and the web
   app uses it. SF Symbols feel more native on iOS but have no Android equivalent and break
   cross-platform brand consistency. Until ruled: **Lucide**, with system-supplied
   affordances (nav back chevrons, share) left to the native navigator.
2. **`expo-glass-effect` (iOS liquid glass).** It ships in the template. It also sits against
   "lighten don't shadow" and a Bloomberg-terminal posture rather than a consumer one. Until
   ruled: **do not use it.**

### Monetization — unresolved, do not build payment UI

App Store commission versus Stripe's ~3% on a $40/mo tier is a live business question with a
shifting legal backdrop. The TWA anti-steering implementation does not transfer. **Build no
purchase, paywall or upgrade flow until this is ruled.** Tier *display* and locked states are
fine; a checkout path is not.

---

## 11. DO NOT PORT

- Any chart implementation from the web repo. All fifteen get rebuilt. Read the web version
  to learn *what the chart says*, never to copy *how it renders*.
- Light-mode support.
- Hover and focus states — replace with press, long-press, pan.
- The web app's scrub implementation specifically. It is the anti-pattern in §6.

---

## 12. OPEN / OWED

- ~~**§7 motion ruling**~~ ← RULED 2026-09-12, see §13.1
- **Apple Developer Program purchase** ← blocks dev builds, and therefore blocks the §6 chart
  gate the moment we outgrow Expo Go
- **Monetization ruling** ← blocks any checkout path (§10b)
- **Icon and glass forks** ← §10b, do not decide unilaterally
- `brand-green-900` hex — read from Brand Foundation v1
- Component and surface inventory — **script-generated off live web HEAD at kickoff, never
  hand-written.** A hand-written inventory is a fossil the day after it is written.
- Sign in with Apple (Cognito IdP + Apple dev config)
- App icon refresh
- Line-ending normalization (`.gitattributes`) — Windows git rewrites LF→CRLF, EAS builds on
  Linux, and left alone this produces phantom whole-file diffs

---

## 13. DOCTRINE STATE v2 (2026-09-12)

Nothing in this section removes an existing rule unless it says RETIRED.

### 13.0 Priority ruling (Lo, 2026-09-12)

- The phone app IS the product. a1flow.io is its desktop surface. When a rule from the web era
  conflicts with native feel, native wins and the web rule is scoped to §-Web.

### 13.1 §7-Native — Motion (Lo ruled 2026-09-12; §7-Web stays frozen for a1flow.io)

- One rule: **spring where the user touched, instant everywhere else.**
- Spring physics (Reanimated, UI thread) ALLOWED on: button/row presses, tab changes, sheet
  enter/exit, recessed-pocket compress-on-press.
- Haptics (expo-haptics) APPROVED: light impact on press, selection tick on tab/segment change,
  notification success/warning only on verdict-state changes. Never on scroll, never on data
  refresh.
- Data readouts NEVER animate into place: no count-up tickers, no bounce on a price, score, or
  count. The 600 ms price flash (green/red, fades) carries over from §7.3.
- 400 ms ceiling survives as SETTLE time — a spring must be at rest within 400 ms.
- Still BANNED: scroll-triggered reveals, parallax, ambient/looping motion, decorative
  particles.
- Carry over unchanged: skeleton pulse, system spinner, modal/sheet slide.
- The interim "no motion at all" rule from v0.2 is RETIRED.

### 13.2 Auth — verified facts (source: 2026-07-27 AuthBypass session, live-probed)

- API Gateway `tqbn8alhp5` stage `prod` has NO authorizer. Every Lambda verifies the Cognito
  token itself.
- Verification is identical across all verifying functions: `token_use === 'id'`,
  `aud === 13jliqg0pjc5mc6v2jt4o96seu`, `iss` = pool `us-east-2_ro0dkGJ9U`, `exp` in future,
  `email` present. Send the **ID token**, not the access token — only the ID token carries
  email, and users are keyed by email (lowercased).
- Free-tier reader routes are DELIBERATELY unauthenticated (discovery funnel). Consequence: a
  missing or expired token does not error at the gateway — the route silently returns the FREE-
  tier payload shape. The client must own token expiry and refresh; never infer tier from token
  presence (this was a live bug on web).
- Tier truth comes from `GET /auth/me` (auto-registers on first login). Gate tiers are
  `free | gold | diamond` (+ `diamond_plus` once the union type lands); anything else resolves
  to free.
- Tokens live in `expo-secure-store`. Never AsyncStorage.
- Native calls execute-api directly (no Vercel `/api/*` rewrite exists here). React Native fetch
  does no CORS preflight, so the sparse-OPTIONS-routes problem that blocks direct gateway calls
  from a browser should not apply — VERIFY on the first authed call before assuming.
- Sign in with Apple is REQUIRED on iOS (Apple 4.8 — Discord OAuth exists as a linking method).
  Backend: Cognito Apple IdP. Not yet built; Apple org enrollment 4B7SXSZNA2 approved 9/2026.

### 13.3 DynamoDB tables — classified (measured 2026-09-12)

**One-fetch-serves-all.** Every data surface reads a DynamoDB table populated by a cron poster.
The app NEVER calls a provider (FMP, UW, Massive, Yahoo, FRED) directly, and never asks a Lambda
to fetch live on a user's behalf. Cost is decoupled from user count by design.

Source: `aws dynamodb list-tables` + `describe-time-to-live` on all 53 tables, us-east-2.
Cache vs accrual is VERIFIED by TTL status. The "current-state" bucket is by name and
usage convention only — treat as unverified until a session reads each table.
Rule for the app: never call a provider; read these. Never write to any of them from the client
except the user-state tables via their existing authed routes.

#### Cache — TTL enabled, safe to lose, rebuilt by cron (13)
A1Flow-ChainCache · A1Flow-DarkPool-Live · A1Flow-FinancialsCache · A1Flow-FredCache ·
A1Flow-GEXCache · A1Flow-Home · A1Flow-OICache · A1Flow-OptionsFlow-Live · A1Flow-Quotes ·
A1Flow-ReversalCharts (orphan, slated for cleanup) · A1Flow-StockIntel · A1Flow-VolumeCache ·
A1LeapsCache

#### Mixed — TTL enabled on the table, must be per-row (1)
A1Flow-Screeners — holds the 2,518-ticker universe, dated screener boards (`{date}` + `latest`),
AND 24h scan-temp chunks. Only the chunks may carry `ttl`. Probe 2026-09-12: 16 rows carry `ttl`,
all scan-temp-* chunks (keys `screener_type`/`scan_date`). Universe and dated boards carry none.
PASS.

#### Accrual — no TTL, Archive-Everything, never backfillable if lost (16)
A1Flow-AnalystTape · A1Flow-BreadthHistory · A1Flow-DarkPool-ByTicker · A1Flow-DarkPool-History ·
A1Flow-EstimatesHistory · A1Flow-FedProbHistory · A1Flow-FedSEP · A1Flow-FedStatements ·
A1Flow-FundingStress · A1Flow-IVHistory · A1Flow-OptionsFlow-History · A1Flow-PriceHistory ·
A1Flow-PrintArchive · A1Flow-SectorHistory · A1Flow-SeriesArchive · CMBSFilings

#### Current-state boards — no TTL, overwritten or dated by posters (by name, unverified) (17)
A1Flow-BreakoutState · A1Flow-ConvictionBoard · A1Flow-EarningsCalendar · A1Flow-EconCalendar ·
A1Flow-FedCalendar · A1Flow-FedWatch · A1Flow-FlowAlerts-Recent · A1Flow-HotContracts ·
A1Flow-MacroCache (named cache, NO TTL) · A1Flow-MacroCompass · A1Flow-OIScanner ·
A1Flow-ReversalCandidates · A1Flow-ReversalRadar · A1Flow-SectorConstituents ·
A1Flow-SetupCardState · CMBSAggregate · MacroBriefings

#### User / auth state — no TTL except OAuthState (5)
A1Signals-Users (PK = email, lowercased) · A1Signals-Trades · A1Signals-Trials ·
A1Flow-OAuthState (TTL `expiresAt`) · a1leaps-watchlist

#### Legacy (1)
a1leaps-screener-cache — named cache, no TTL, pre-A1Flow naming. Do not build against it.

### 13.4 Universe

- Screener universe is 2,518 tickers (as of 9/12), read from `A1Flow-Screeners`. Never hardcode
  a ticker list in the app.
