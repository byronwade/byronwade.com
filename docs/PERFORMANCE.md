# Performance verification

Performance is measured locally against `lighthouse-budget.json`. Do not claim
improvement from source size, framework choice or library age alone. Establish
and repeat the same measurement, then preserve its output with the change.
Do not raise a limit to obtain a pass.

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
100KiB/5 requests. Homepage output is
`docs/evidence/a11y-perf/home-budget.json`. Earlier project lane reports remain
at `docs/evidence/projects-refresh/` and `docs/evidence/thorbis/`.
A Lighthouse score alone cannot pass a failed resource or timing limit.
Lighthouse 12 removed built-in budget enforcement; this runner checks the JSON
limits itself instead of relying on an ignored CLI/config flag.

`npm run build:analyze` enables the existing Next bundle analyzer. Development
uses Turbopack; production uses Next webpack. Any splitting changes must satisfy
the same request and byte limits without pulling unused route code onto home.
There are no automatic GitHub Actions performance runs. Do not publish or deploy
as part of measurement.

`node scripts/verify-a11y-perf.mjs --lighthouse` audits every visual page
template after a production build. It requires a representative for each dynamic
template and covers 390, 768 and 1280 CSS pixels in light and dark. The same
budget assessor checks each route. Intentional HTTP errors use an accessibility
snapshot because navigation-mode Lighthouse rejects them.

## Current ownership

- Server Components own content loading and static homepage composition. External
  data/cache rules remain in `lib/cache.ts` and their server-side callers.
- The exact Thorbis Inter and Geist Mono files and face descriptors are copied
  with their OFL licenses into the global CSS owner. The root layout preloads
  Latin Inter, avoiding a missing generated font manifest and a separate blocking
  font stylesheet. Mono loads when used. All fonts use swap.
- The resume signature renders only the name "Byron Wade". The stylesheet loads
  `public/fonts/byron-signature.woff2`, a subset of those glyphs, so `/resume`
  stays inside the 100KiB font limit. The full
  `Modelistasignature-ownAV.otf` remains for server-side OG rendering and is not
  referenced by the page stylesheet.
- Shared `Link` disables viewport prefetch. Index pages compose that link, so a
  long project or writing index does not request every destination during the
  initial load. Primary navigation does the same. The contact form loads on the
  first intentional open and remains mounted afterward to preserve drafts.
- Closed launcher/search/support panel bodies do not render an inactive UI tree.
  Contact addresses remain obfuscated until revealed. The breadcrumb popover
  graph loads only at the xl header, which is the first width that shows it.
- The app favicon reuses an existing small asset. `tests/design-contract.test.mjs`
  prevents a large public asset from shadowing its route.
- `lib/icons.tsx` is a pure re-export facade over individual wrappers in
  `lib/icons/`. A monolithic factory module shipped 45 glyph definitions on home,
  including preview-only icons. The sharing group is limited to the actual
  homepage/layout/root-not-found overlap; sharing every route's initial modules
  recreated the same eager payload even after splitting the facade. Independent
  modules and Next's existing import optimizer resolve each consumer to its
  requested glyphs; this bounded sharing keeps route dependencies deferred
  without changing public imports or weights. The rendered home contract checks
  the actual initial scripts for preview glyphs. React Compiler owns routine
  memoization; do not add manual memoization without a measured need.
- The same import optimizer keeps unused common-barrel clients out of server-only
  homepage lists. The bounded sharing group also deduplicates Next link helpers
  and `lib/contact` used by home and layout, preserving Next's existing
  framework groups.
- Header measurement writes native root scroll padding directly. The old inherited
  custom property recalculated styles throughout the document even though only
  the root used it. No-JS defaults and measured focus clearance are retained.
- Launcher/toolbar feature owners render static SVGs on the server and pass them
  as ReactNode slots to their client interaction leaves. Their existing public
  APIs and state logic stay intact while glyph-definition JavaScript is removed.
- The success toast loads only after a contact submission succeeds; the unused
  global query-state adapter is removed. Home does not load the breadcrumb
  popover graph.
- Vercel Analytics and Speed Insights retain their existing root integration.
  React Scan is a development diagnostic and is excluded from production.
- Images use the existing Next image configuration (WebP/AVIF and responsive
  sizes). No new service worker, third-party runtime origin or performance
  utility layer is introduced by the design port.

## Evidence and limits

The Thorbis migration's baseline and final measurements are stored alongside the
browser matrix in `docs/evidence/thorbis/`. This audit's matrix, screenshots and
homepage budget live in `docs/evidence/a11y-perf/`. The evidence README identifies
the measurement environment, results, source pin and reproduction commands. They
are local lab results, not a real-user or production latency claim. Report machine
contention and failed runs honestly.

The baseline homepage at commit `73496a0`, measured on 2026-10-16, recorded LCP
3243.91 ms and TBT 707.70 ms with CLS 0. It failed the existing LCP and
blocking-time limits. That run is `home-budget-baseline.json`. The release
measurement is whatever `home-budget.json` records for the committed source.
Timing variation on a shared machine is large; a pass close to a limit is not a
comfortable regression margin.

Closed shell capsules skip motion-token reads before their first opening. Header
and launcher ResizeObservers supply their initial measurements without duplicate
synchronous hydration reads. The launcher observer writes its slot geometry directly
rather than scheduling a React render for measurements. Panel geometry and existing
reduced-motion behavior remain owned by `useCapsuleMorph`.
