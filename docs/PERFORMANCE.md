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
Both performance runners share `scripts/audit-browser.mjs`: a 45-second interval
with their previous Chrome closed, followed by a five-second blank-page settle
after launch. Background-network suppression augments Puppeteer's default flags;
Lighthouse's profiles and the JSON budgets remain unchanged. Other workloads can
still contaminate a sample, so inspect host contention before resampling.

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
template and every published writing/project detail URL after a production build.
Content URLs come from Next's prerender manifest, so the audit neither duplicates
front-matter parsing nor silently skips newly published content. Other dynamic
templates require explicit representatives. Each URL covers 390, 768 and 1280 CSS
pixels in light and dark. The same
budget assessor checks each route. Intentional HTTP errors use an accessibility
snapshot because navigation-mode Lighthouse rejects them.
Figma and email delivery use local fixtures. Browser submissions exercise success
feedback without delivering a message or certifying a live provider.

## Current ownership

- Server Components own content loading and static homepage composition. External
  data/cache rules remain in `lib/cache.ts` and their server-side callers.
- Writing and project indexes and detail pages render local Markdown without a
  streaming Suspense fallback. Their previous skeletons remained on screen with
  JavaScript disabled. The browser matrix checks visible reading content with
  scripts disabled after each route's normal interaction checks.
- The shared Markdown renderer drops react-markdown's `node` prop before its
  element overrides spread props onto the DOM. Spread through, every element
  printed `node="[object Object]"` and the page's RSC payload repeated that
  element's hast subtree with source positions. Measured at 170cd73, removing
  it cut prerendered HTML from 6,181,468 to 4,432,121 bytes across all pages
  (`/projects/dits` 711,204 to 322,457 bytes, 99,877 to 62,397 gzipped). On the
  four pages compared (Dits, Memoria, Building Thorbis, Nexstar), the markup
  outside scripts was byte-identical apart from the dropped attribute.
  `tests/markdown-headings.test.mjs` fails if any post or case study renders
  the attribute again.
- The exact Thorbis Inter and Geist Mono files and face descriptors are copied
  with their OFL licenses into the global CSS owner. The root layout preloads
  Latin Inter, avoiding a missing generated font manifest and a separate blocking
  font stylesheet. Mono loads when used. All fonts use swap. Inter falls back to
  a local Arial face scaled to Inter's metrics, so a late swap does not shift
  layout at the default text size.
- The resume signature renders only the name "Byron Wade". The stylesheet loads
  `public/fonts/byron-signature.woff2`, a subset of those glyphs, so `/resume`
  stays inside the 100KiB font limit. The full
  `Modelistasignature-ownAV.otf` remains for server-side OG rendering and is not
  referenced by the page stylesheet.
- Markdown blockquotes and emphasis are italic. Inter, Geist Mono and the full
  Latin italic face together measured 103,933 bytes on a post with a quote,
  over the 100KiB font limit. `public/fonts/inter-italic-latin-core.woff2` is a
  Basic Latin and typographic-punctuation subset of that pinned italic face,
  declared after the generated Thorbis faces so it takes precedence for the
  characters it covers. The full face remains for other Latin characters. If the
  Thorbis port replaces the italic file, regenerate the subset with
  `python -m fontTools.subset public/fonts/UcC53FwrK3iLTcvneQg7B5iqpJlhKnPCkaL5UUM.woff2 --unicodes="U+0020-007E,U+00A0,U+00AB,U+00BB,U+2010-2014,U+2018-201E,U+2022,U+2026,U+2032-2033,U+2039-203A" --layout-features='*' --flavor=woff2 --output-file=public/fonts/inter-italic-latin-core.woff2`
  and keep the face's `unicode-range` equal to that list.
- Shared `Link` disables viewport prefetch. Index pages compose that link, so a
  long project or writing index does not request every destination during the
  initial load. Primary navigation does the same. The contact form loads on the
  first intentional open and remains mounted afterward to preserve drafts.
- Closed header search and menu popovers render only their triggers. Popover
  positioning, focus management and the search panel load on the first
  intentional open (`components/layout/header-popover.tsx`). Contact addresses remain obfuscated until revealed. The breadcrumb popover
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
- The site header and toolbar render static SVGs on the server and pass them as
  ReactNode slots to their client interaction leaves, so glyph-definition
  JavaScript stays out of the client bundle.
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
contention and failed runs honestly; do not relax a budget to obtain a pass.

The baseline homepage at commit `73496a0`, measured on 2026-10-16, recorded LCP
3243.91 ms and TBT 707.70 ms with CLS 0. It failed the existing LCP and
blocking-time limits. That run is `home-budget-baseline.json`. The release
measurement is whatever `home-budget.json` records for the committed source.
Timing variation on a shared machine is large; a pass close to a limit is not a
comfortable regression margin.

Budget exception, recorded rather than relaxed: on source `84d9b5c` (after main
through `ceb89d9` was merged), `home-budget.json` recorded LCP 3182 ms, TBT 476
ms and CLS 0, failing the LCP and blocking-time limits. Earlier homepage samples
on this branch, other than the overlapped-build and eager-dialog probes, ranged
from LCP 2936 to 3256 ms and TBT 226 to 455 ms; only the 2936 ms and 2986 ms
samples passed. Most content routes also exceed the
LCP limit under the mobile simulation, on main and on this branch; per-route
reports are in `docs/evidence/a11y-perf/`. `lighthouse-budget.json` is
unchanged.

The rebuilt header from main (#80) replaced the launcher and morph capsule with
anchored popovers. Probes recorded before merge commit `9c2953c` measured the
previous header; only the release matrix and `home-budget.json` describe the
merged source.
