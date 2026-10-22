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
  JavaScript stays out of the client bundle. The project site preview does the
  same (`components/project/full-width-project-preview.tsx` wraps the client
  file). Each Phosphor icon module carries path data for all six weights; the
  preview's twelve glyphs were 29,405 bytes of the project page chunk.
  Measured against `4b1202f`, moving them cut that chunk from 92,188 to 59,880
  bytes (29,997 to 21,773 gzipped) and added the rendered SVG to the page
  payload instead (`/projects/dits` HTML 62,389 to 64,471 bytes gzipped). Lighthouse's script transfer for a
  project page went from 209,005 to 200,663 bytes. This is a byte reduction;
  it did not measurably change LCP.
- Client leaves elsewhere follow the same rule. The footer's email reveal no
  longer imports glyphs for an icon option no caller used, so the envelope left
  every page's layout chunk. The homepage contact button, the résumé's copy-email
  and download buttons, and the contact submit button receive their glyphs from
  server parents. Post share links to X and LinkedIn are server anchors; only
  native share and copy link are client code. The lazily loaded inline contact
  form, the success toast, the breadcrumb overflow trigger (its `next/dynamic`
  loading fallback cannot take a slot) and the Figma viewer still import glyphs
  directly. Measured on production builds of `08b11de` and this change, initial
  scripts and HTML summed per route and gzipped at level 9 (script counts
  unchanged):

  | Route | Initial scripts, gzip | HTML, gzip |
  | --- | --- | --- |
  | `/` | 212,473 → 211,079 (−1,394) | 20,256 → 20,341 (+85) |
  | `/blog/nexstar-win-invoice-lose-customer` | 219,802 → 215,159 (−4,643) | 44,254 → 45,261 (+1,007) |
  | `/resume` | 229,879 → 226,589 (−3,290) | 21,677 → 21,835 (+158) |
  | `/contact` | 229,916 → 225,765 (−4,151) | 17,492 → 17,793 (+301) |
  | `/projects/dits` | 235,033 → 234,185 (−848) | 30,131 → 29,828 (−303) |
  | `/projects` | 213,707 → 212,859 (−848) | 22,188 → 22,171 (−17) |

  This is a byte reduction only; LCP was not measured for it. Every rendered
  glyph is now also in the page's HTML and RSC payload, so a toggled pair (copy
  and copied, send and sending) costs HTML bytes even when one half is never
  shown. Check the net before slotting a glyph into a route.
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

Earlier budget exception: on source `84d9b5c` (after main through `ceb89d9`
was merged), the homepage recorded LCP 3182 ms, TBT 476 ms and CLS 0, failing
the LCP and blocking-time limits. Earlier homepage samples on that branch, other
than the overlapped-build and eager-dialog probes, ranged from LCP 2936 to 3256
ms and TBT 226 to 455 ms; only the 2936 ms and 2986 ms samples passed.

On main at `4b1202f` (2026-10-21, same runner, clean tree), the indexes pass
every limit: the homepage in three samples at LCP 2916 to 2940 ms and TBT 112 to
127 ms, `/blog` at 2961 ms and `/projects` at 2948 ms, all with CLS 0. That is
1 to 3 percent under the LCP limit, so it is not regression margin, and no
single change is credited for the movement since `84d9b5c`. After merging main
through `5cef5db` (source `e098e9c`), the homepage passed two of three samples
(LCP 2918 and 2943 ms) and failed one at 3045 ms with identical bytes, so it
sits on the limit rather than under it; `/blog` (2772 ms) and `/projects`
(2940 ms) passed. Detail pages still
exceed the LCP limit, which remains a recorded budget exception:
`/projects/dits` 3293 to 3470 ms, `/projects/thorbis` 3226 to 3309 ms (both
before and after the preview icon change above, which did not move LCP beyond
run-to-run variation) and `/blog/nexstar-win-invoice-lose-customer` 3277 ms.
After merging main through `5cef5db` (#129 shortened the Dits article to a
30,450-byte document), one more sample each recorded Dits 3214 ms, the Thorbis
case study 3261 ms and the Nexstar post 3301 ms, all still over the limit.
`lighthouse-budget.json` is unchanged.

Lighthouse simulates this LCP. On the homepage the observed paint happens about
300 ms after navigation, but the simulation counts every request that started
before it, and the async scripts start within 80 ms. The simulated LCP therefore tracks the
bytes of the document, the preloaded font and all initial scripts, of which
about 132 KB is the React and Next framework. Detail pages add a larger document
(the Nexstar post is 45 KB gzipped, much of it the RSC payload repeating the
article), a 22 KB gzipped page chunk on project pages and, on posts, italic and mono
fonts discovered from the stylesheet. Preloading the mono
face was tried and rejected (see the evidence README).

On 2026-10-22 the committed production build of `fea7eda` was measured once
per route before any probe, with Chrome 155 and Lighthouse 12.8.2. Thorbis
recorded LCP 3432 ms and TBT 365 ms (two fonts, 65,886 bytes, including Geist
Mono; 10 scripts, 200,605 bytes). Dits recorded LCP 3323 ms and TBT 217 ms
with the same script and font totals. The Nexstar post recorded LCP 3228 ms
and TBT 180 ms (three fonts, 88,141 bytes: Inter, Inter italic, and Geist
Mono). The LCP element was the excerpt or a body paragraph already in the
HTML. A following dirty-tree rebuild deferred the project preview's
interactive chrome until after first paint and stopped that chrome, inline
code, and fenced code from requesting Geist Mono. It also set
`content-visibility` on emphasis and quotes. Thorbis, twice, then recorded
LCP 3150 ms and 3213 ms with TBT 162 ms and 204 ms, one font (Inter, 49,991
bytes), and 10 scripts at 201,627 bytes. Dits once recorded LCP 3130 ms.
Nexstar once recorded LCP 3119 ms and still downloaded Inter italic (22,255
bytes); the opening quote is inside the first screen, so
`content-visibility` did not skip that face. Every sample still failed the
3000 ms LCP limit. Two Thorbis samples are not enough to call a roughly
200 ms drop more than the 127 ms spread already seen on identical homepage
bytes, and the earlier detail-page floor was already 3214 to 3226 ms. The
probe also changed when the screenshot appears. It was reverted and is not
in this tree. Home was not remeasured on that build. Later commits changed
the shared shell, so these figures are not a measurement of current main.
Do not add an eleventh script on these routes, do not preload Geist Mono,
and do not raise `lighthouse-budget.json` to turn this miss into a pass.

The rebuilt header from main (#80) replaced the launcher and morph capsule with
anchored popovers. Probes recorded before merge commit `9c2953c` measured the
previous header; only the release matrix and `home-budget.json` describe the
merged source.
