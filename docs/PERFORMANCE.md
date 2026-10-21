# Performance verification

Performance is measured locally against `lighthouse-budget.json`. Do not claim
improvement from source size, framework choice or library age alone. Establish
and repeat the same measurement, then preserve its output with the change.

## Local budget

`npm run perf:budget` builds once, starts an isolated production server on an
allocated loopback port, launches headless Chrome and runs Lighthouse's default
mobile simulated profile. `scripts/perf-budget.mjs` checks every timing, byte
and request-count limit and exits nonzero for any exceeded budget. Its server
and browser are closed when the run finishes or fails. Set `CHROME_PATH` if
Chrome is installed outside the Windows default location.

The authoritative limits remain in the JSON file: FCP 2000ms, LCP 3000ms, TBT
300ms, CLS 0.1 and Speed Index 3000ms; scripts 300KiB/10 requests, total
1000KiB/50 requests, CSS 50KiB/3 requests, images 500KiB/20 requests and fonts
100KiB/5 requests. The report is `docs/evidence/thorbis/performance.json`.
A Lighthouse score alone cannot pass a failed resource or timing limit.
Lighthouse 12 removed built-in budget enforcement; this runner checks the JSON
limits itself instead of relying on an ignored CLI/config flag. Earlier project
lane reports remain at docs/evidence/projects-refresh/.

`npm run build:analyze` enables the existing Next bundle analyzer. Development
uses Turbopack; production uses Next webpack. Any splitting changes must satisfy
the same request and byte limits without pulling unused route code onto home.
There are no automatic GitHub Actions performance runs. Do not publish or deploy
as part of measurement.

## Current ownership

- Server Components own content loading and static homepage composition. External
  data/cache rules remain in `lib/cache.ts` and their server-side callers.
- The exact Thorbis Inter and Geist Mono files and face descriptors are copied
  with their OFL licenses into the global CSS owner. The root layout preloads
  Latin Inter, avoiding a missing generated font manifest and a separate blocking
  font stylesheet. Mono and the existing resume signature load when used. All
  fonts use swap. Inter falls back to a local Arial face scaled to Inter's
  metrics, so a late swap does not shift layout at the default text size.
- Home/shared navigation requests routes on navigation rather than speculative
  viewport prefetch. The contact form loads on the first intentional open and
  remains mounted afterward to preserve drafts.
- Closed menu and search panel bodies do not render an inactive UI tree.
  Contact addresses remain obfuscated until revealed.
- The app favicon reuses an existing small asset. `tests/design-contract.test.mjs`
  prevents a large public asset from shadowing its route.
- `lib/icons.tsx` is a pure re-export facade over individual wrappers in
  `lib/icons/`. A monolithic factory module shipped 45 glyph definitions on home,
  including preview-only icons. The sharing group is limited to the actual
  homepage/layout/root-not-found overlap; sharing every route's initial modules
  recreated the same eager payload even after splitting the facade. Independent modules and
  Next's existing import optimizer resolve each consumer to its requested glyphs;
  this bounded sharing keeps route dependencies deferred without changing public
  imports or weights. The rendered home contract checks the actual initial scripts
  for preview glyphs. React Compiler owns routine memoization; do not add manual
  memoization without a measured need.
- The same import optimizer keeps unused common-barrel clients out of server-only
  homepage lists. The bounded sharing group also deduplicates Next link helpers
  used by home and layout, preserving Next's existing framework groups.
- Header measurement writes native root scroll padding directly. The old inherited
  custom property recalculated styles throughout the document even though only
  the root used it. No-JS defaults and measured focus clearance are retained.
- Header/toolbar feature owners render static SVGs on the server and pass them
  as ReactNode slots to their client interaction leaves. Their existing public
  APIs and state logic stay intact while glyph-definition JavaScript is removed.
- Toast notifications mount with the contact forms; the unused global query-state
  adapter is removed. Home does not load the breadcrumb popover graph.
- Vercel Analytics and Speed Insights retain their existing root integration.
  React Scan is a development diagnostic and is excluded from production.
- Images use the existing Next image configuration (WebP/AVIF and responsive
  sizes). No new service worker, third-party runtime origin or performance
  utility layer is introduced by the design port.

## Evidence and limits

The Thorbis migration's baseline and final measurements are stored alongside the
browser matrix in `docs/evidence/thorbis/`. The evidence README identifies the
measurement environment, results, source pin and reproduction commands. They are
local lab results, not a real-user or production latency claim. Report machine
contention and failed runs honestly; do not relax a budget to obtain a pass.
