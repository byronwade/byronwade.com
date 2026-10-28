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
The [repeated October 22 template baseline](evidence/lighthouse-2026-10-22/README.md)
keeps twelve later measurements separately, with their exact source/build pins
and all budget failures; `home-budget.json` is an earlier snapshot.
The [October 28 baseline and identical-build controls](evidence/lighthouse-2026-10-28/README.md)
measure the application at `ae357ba` in 24 samples: 23 pass every budget and one
Dits sample exceeds LCP by 8ms. The reports retain that miss, CPU calibration,
observed paint diagnostics and source/build pins; they make no speedup claim.
The later [Dits graph investigation](evidence/dits-lcp-graph-2026-10-28/README.md)
measures application `02b3e41`: six serial identical-build controls pass three
times and miss LCP three times. Exported simulator traces explain a 222ms paired
swing through different graph membership for the local analytics 404s. This is
a diagnosis of the local model, not a production bottleneck or an optimization.
Lighthouse 12 removed built-in budget enforcement, and Lighthouse 13 does not
restore it. This runner checks the JSON limits itself instead of relying on an
ignored CLI/config flag.

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
The unavailable Figma fixture is a 200 recovery page for a valid key, matching
the detail route's contract; it must show its unavailable heading, `noindex`,
and links back to the portfolio and to Figma. The unknown-route fixture remains
an HTTP 404.
Figma and email delivery use local fixtures. Browser submissions exercise success
feedback without delivering a message or certifying a live provider.
Both capture runners explicitly disable the screenshot provider in their owned
server environment, including when the parent shell has a key. A keyless build
omits project previews; a placeholder-key build exercises the runtime off state.
Successful image capture and recovery use the rendered suite's local image
fixtures, without issuing a provider request. The route-budget report keeps
Lighthouse's `metrics` diagnostics, including observed paint, beside its
simulated budget timings. Observed paint never substitutes for a budget metric.
For a request-graph investigation, add `--save-assets` to the route-budget command
and point `THORBIS_EVIDENCE_DIR` at a local job folder. Beside the budget JSON,
Lighthouse's own asset exporter writes `-0.trace.json`, `-0.devtoolslog.json` and
named optimistic/pessimistic simulator traces. Open a trace in Chrome DevTools'
Performance panel to inspect the observed timeline or the simulated request/CPU
schedule. The simulated traces are models, not additional browser measurements.
The [Node API does not implement the CLI's `saveAssets` flag](https://github.com/GoogleChrome/lighthouse/blob/v13.5.0/docs/readme.md#differences-from-cli-flags),
so the runner calls the installed exporter's `saveAssets` directly and enables its
Lantern debug export only for that call. Exports are opt-in and do not change the
measurement profile or any limit. The budget report is saved before export, even
on a budget miss; an export failure still fails the command and closes the browser.
Raw traces and network logs stay in the local job folder; publish only reviewed,
bounded evidence. Native subprocess regressions cover export on passes and misses,
export failure, environment restoration and unchanged default output.
Set `THORBIS_EVIDENCE_DIR` for either runner to keep fresh reports and screenshots
in an external job folder instead of replacing the checked-in evidence. Omit
`--lighthouse` for accessibility and interaction checks without timing samples;
`--route=/search` limits a run to that route's six viewport/theme combinations.

Both the full audit and `capture-design-polish.mjs` use `audit-geometry.mjs` for
target-size decisions. It records sentence-link exceptions with their dimensions,
following [WCAG 2.5.8's inline exception](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
and `DESIGN.md` §7.4. A standalone link, button, field, or icon-only link still
needs its target box; adjacent links or hidden text cannot supply prose. The
capture runner retains its 44px minimum at desktop widths too. Its `--resume`
also checks the build ID and audit hash, so prior outcomes cannot mask a changed
detector. Browser fixtures protect both valid exceptions and undersized controls.

Search interaction checks submit a filename and a no-match query with Enter at
200% browser text size, then inspect axe, targets, overflow and keyboard focus.
The browser font preference is set before navigation, matching the header tests;
changing the root size on a laid-out page can leave container-query styles stale.
The rendered search regression also uses the maximum allowed unbroken query at
320, 390 and 1280px in both themes. Query summaries use the existing
`wrap-anywhere` utility so long identifiers reflow without changing the query.

## Repeated template baseline, October 22, 2026

On source `8df8549`, three cold-browser samples each for home, Thorbis, Dits and
the Nexstar post recorded three budget passes and nine LCP failures. Home passed
all three times but its worst LCP was only 27ms below the limit. Every detail-page
sample exceeded 3000ms LCP; every other timing, byte and request limit passed.
All four routes used the full ten-script allowance. The limits are unchanged.

The [reports and investigation plan](evidence/lighthouse-2026-10-22/README.md)
include each measurement, full-precision aggregates, source/build/browser pins,
CPU calibration variation, resource totals and reproduction instructions. This
is a repeated baseline after the shell changes, not a before/after experiment.
Contact PR #162 merged while collection ran; these timings remain pinned to
`8df8549`, not that later main or the documentation PR's release build. Before a
loading change, repeat the baseline on the then-current source and isolate the
responsible work. Do not infer a speedup from older reports using another
Lighthouse version or from one low sample.

## Shared client modules, October 22, 2026

The shared-primitives chunk now supplies its modules to every consumer. Its
membership still requires use by at least two of the original home, layout and
not-found entries, within the existing package/source rules (later widened; see
"Every-page chunk sharing" below). Filtering which
chunks could reuse those modules had left their factories in detail pages too.
The separate classname-sharing rule is covered by this owner and is removed.
`tests/rendered/shared-modules.test.mjs` checks the emitted registrations across
every prerendered page, alongside the existing glyph and server-boundary checks.

The [comparison and diagnostic record](evidence/shared-module-reuse/README.md)
retain the byte measurements, source/build pins and thirty Lighthouse samples.
The first comparison removed 951 repeated shared registrations across 39 pages
and reduced project script transfer by 9753 bytes without adding requests.
The final release also compares payloads against main after the clipboard
recovery change; the timing samples retain their earlier source pins.

Timing remains inconclusive. The matched set still has nine detail LCP failures
after the change, and one Dits sample also fails blocking time. Six declared
follow-up controls did not reproduce that spike. Both configurations produced
an unusually low LCP sample with unchanged bytes; the trace shows the simulated
graph changing when hydration-related requests fall outside the observed paint
cutoff. The report keeps those samples and the failure, without attributing a
site-wide speedup. Every budget and the rejected preload/hide/delay constraints
remain in place.

## Route chunk ownership, October 23, 2026

Next builds each page's client reference manifest by merging the manifests of its
parent segments in order (`flight-manifest-plugin.js`, `mergeManifest`), so for a
module several entries reference, the last entry written decides which chunks load
it. The root group holds the layout, the homepage, `error` and `not-found`; a
nested group holds its index page (`/projects`, `/blog`, `/portfolio`). A client
module that a root-level server tree renders, and that a page entry also imports
directly, therefore resolves to that page's chunk on every route that does not
import it itself. Two did:

- The header brand was a server-rendered `next/link`, which the homepage and the
  `/projects` index also render. All 24 project pages downloaded the `/projects`
  page chunk; contact, the résumé, privacy, terms, the 404, `/portfolio` and Figma
  file pages downloaded the homepage chunk.
- The root `not-found` boundary, which Next sends in every page's payload, rendered
  the Base UI `Button`, which `/portfolio` also imports. Figma file pages downloaded
  the `/portfolio` chunk, and the shared-primitives rule (two of home, layout and
  not-found) kept the Button in the chunk every page loads.

`NavDock`, a client component only the layout renders, now draws the brand link and
mark. The 404's "Return home" wears the button recipe (`buttonVariants`) on the
shared `Link`, as the error boundary already does: same classes, native link
semantics. The rule: a client module the root layout's or root not-found's server
tree renders must resolve to a chunk every page already loads. The shared `Link`
does today, because the layout's own reference wins in the root group and the
homepage does not import it; moving the homepage's raw `next/link` uses onto the
shared `Link` would likely send the 404's links to the homepage chunk. The safest
home for such a module is a layout-only client component, and
`tests/rendered/route-chunks.test.mjs` is the arbiter: run it before moving any.

Measured on production builds of `ca7bd78` and this change, initial scripts summed
per route and gzipped at level 9 (polyfills excluded; `noModule`), plus the HTML:

| Route | Scripts | Initial scripts, gzip | HTML, gzip |
| --- | --- | --- | --- |
| `/` | 8 → 7 | 170,737 → 170,588 (−149) | 21,056 → 20,713 (−343) |
| `/blog/nexstar-win-invoice-lose-customer` | 8 → 7 | 170,813 → 166,833 (−3,980) | 45,641 → 45,339 (−302) |
| `/projects` | 8 → 7 | 168,056 → 164,090 (−3,966) | 22,322 → 21,986 (−336) |
| `/projects/thorbis` (every project) | 8 → 7 | 183,137 → 182,838 (−299) | 21,765 → 20,885 (−880) |
| `/contact` | 9 → 7 | 181,396 → 177,884 (−3,512) | 17,806 → 17,554 (−252) |
| `/resume` | 8 → 7 | 179,557 → 176,594 (−2,963) | 21,922 → 21,603 (−319) |
| `/privacy` (and `/terms`) | 9 → 7 | 171,206 → 164,003 (−7,203) | 16,374 → 16,114 (−260) |
| 404 | 8 → 6 | 170,737 → 163,531 (−7,206) | 15,237 → 14,953 (−284) |

The release build, with main through #184 merged, has the same initial scripts on
every prerendered route and HTML within 23 bytes of these figures; #184 changed
only the Figma file route. The timing build below predates that merge.
The shared-primitives chunk fell from 15,474 to 11,694 bytes gzipped; routes that
render the Button (home, contact, the résumé, project pages) now carry it in their
own chunk. `/portfolio` and Figma file pages no longer reference the homepage or
`/portfolio` chunks in their payloads.

Timing, Chrome 155 and Lighthouse's default mobile profile, three interleaved rounds
(A B, B A, A B) of the `ca7bd78` build (A) and this change (B), sampled by
`npm run perf:budget`'s browser setup and checked with its assessor:

| Route | LCP, A | LCP, B | Budget failures, A → B |
| --- | --- | --- | --- |
| `/contact` | 2928 / 2942 / 2935 ms | 2862 / 2867 / 2867 ms | script count 11 > 10 in 3/3 → none |
| `/projects/thorbis` | 3071 / 3069 / 3047 ms | 2972 / 2966 / 2981 ms | LCP over 3000 ms in 3/3 → none |

The samples do not overlap: medians −68 ms and −97 ms, against a 24 ms spread
inside either build. No separate A/A build was run, so treat the size of the drop
as approximate. Lighthouse also counts the two Vercel diagnostics scripts: contact
loaded the homepage and not-found chunks on main, 11 scripts against the limit of
10, and now loads 9. Only
these two routes were timed; other detail pages and the Nexstar post were not
remeasured. `tests/rendered/route-chunks.test.mjs` reads the initial
scripts and the RSC payload (a streamed page fetches those chunks while hydrating)
of every prerendered page, `/portfolio`, a Figma file, search and an unknown URL,
and fails when one names another route's page chunk. Both of its tests fail on the
build of `ca7bd78`.

## Inter Latin core subset, October 23, 2026

Lighthouse's simulated LCP counts every request that finishes before the
observed largest paint. Locally that paint lands 224-441ms after navigation, so
the document, the preloaded Inter file, the stylesheet and all initial scripts
are in every route's graph. Thorbis and Dits add a 15.7KB page chunk and Geist
Mono (15.5KB); the Nexstar post adds a 45.6KB document, the italic core and
Geist Mono. Home and Thorbis documents are about the same size, so bytes alone
do not explain the detail-page gap.

The preloaded upright Inter file is now the 31,824-byte Latin core subset
described under current ownership, replacing the 49,620-byte file. Builds
`rDCyH0MglPluRC3l_5Bfn` (main `4b76f94`) and `y_ehpexxlezZ7kcf5Wm4G` (the
subset) were sampled in three interleaved rounds, alternating which build ran
first, with `perf-budget.mjs`'s browser settle and default simulated mobile:

| Route | Before LCP (ms) | After LCP (ms) |
| --- | --- | --- |
| Home | 2908, 2943, 2906 | 2879, 2829, 2826 |
| Nexstar post | 3170, 3186, 3203 | 3013, 3005, 3019 |
| Thorbis | 3054, 2881, 3046 | 3047, 3049, 2498 |
| Dits | 3087, 3106, 3048 | 1540, 3041, 3125 |

The post separates clearly: its median falls 173ms and every after sample is
below every before sample. Home's median falls 79ms with no overlap, but no
separate A/A control ran, and earlier A/A runs on this host differed by about
80ms, so home is consistent with a gain at the noise floor. The post still misses the
3000ms limit by 5-19ms. Thorbis and Dits show no change beyond variation; their
low samples are the graph-cutoff effect described above, not this change. FCP,
TBT and every other limit are unchanged. Benchmark index ranged 1586-2619 on
the shared host. The limits, the ten-script cap and the rejected probes are
unchanged; the project-page chunk and Mono request remain the open leads.

## Geist Mono Latin core subset, October 23, 2026

The deferred Mono core described under current ownership reduces its font file
from 15,524 to 10,148 bytes (5,376 bytes, 34.6%). A cold browser census on
`83ea242` found the full Latin Mono request on 25 of 39 published and
representative routes. The rendered subset test now checks every such route,
requires Mono only where used, checks all 119 retained characters at both
weights in actual light/dark themes, and verifies the full Latin fallback with
an accented name. Original and derived specimens produced identical pixels at
400/500 in both themes; a separate fontTools comparison found identical outlines
and advances for all 119 characters at 400/450/500, with unchanged axes and
vertical metrics.

Three sequential default-mobile Lighthouse samples per build on
`/blog/nexstar-win-invoice-lose-customer` used Chrome 155.0.8059.85 and Lighthouse
13.5.0, with the runner's standard browser settle:

| Build | LCP (ms), in sample order | TBT (ms), in sample order | Font transfer | Total transfer |
| --- | --- | --- | --- | --- |
| Baseline `83ea242`, `ZIueIgWE5g7oRWtxqLEo1` | 3077, 3048, 3043 | 70, 111, 58 | 70,345 B | 317,094 B |
| Mono core, `Aibs2lxzuZEqNaLd6q8E5` | 3050, 3118, 3042 | 112, 176, 105 | 64,969 B | 311,739 B |

Font requests remain three and scripts remain ten (176,107 transfer bytes).
The stylesheet grows by 21 transfer bytes, leaving a net 5,355-byte page saving.
All six samples fail only the existing 3000ms LCP limit. Timing ranges overlap;
these samples were not interleaved and no A/A control ran, so they establish no
LCP or blocking-time improvement. Keep this as a measured byte reduction, not
an LCP fix. No preload, content delay, budget or initial-script change was made.
The raw reports are in hobby job `byronwade-com-hobby-1023-0409`, directories
`baseline-valid-1` through `3` and `candidate-1` through `3`. Three earlier probes
used an incorrect slug, returned 404 and are excluded.

## Nexstar post without the italic face, October 23, 2026

The Nexstar post was the only post that requested
`inter-italic-latin-core.woff2` (22,255 bytes). Its only italic text was three
publication titles, each already inside its underlined source link and far
below the first screen. In these Lighthouse runs layout requested the face at
about 133ms, before the observed paint at about 240ms, so the simulated LCP
counted it. Those titles are now upright, and the post no longer loads the
italic face. Italic emphasis elsewhere is unchanged; eight project case studies
still use it, and any `*emphasis*` added to a post brings this request back.

Builds `mm1p802-FV8jvscznC6DY` (main `6e685b5`) and `q_3dGacpsBpWH1r9foljU`
(the edit) ran three interleaved rounds, alternating which build went first,
with `perf-budget.mjs`'s browser settle, default simulated mobile, Chrome 155
and Lighthouse 13.5. The Building Thorbis post has no italic and the same
rendered content in both builds, so it is the control. Only chunk hashes and
the streaming order of its RSC rows differ, about 330 bytes gzipped:

| Route | Before LCP (ms) | After LCP (ms) |
| --- | --- | --- |
| Nexstar post | 3041, 3018, 3004 | 2879, 2897, 2897 |
| Building Thorbis (control) | 2708, 2714, 2787 | 2716, 2708, 2713 |

The post's median falls 121ms, every after sample is below every before
sample, and each is at least 103ms under the 3000ms limit. The control's
medians differ by 1ms. FCP fell from 1373-1380 to 1222-1231ms. Page transfer
fell from 311,736 to 289,423 bytes with the same ten scripts. This is a
simulated-LCP and byte result. The observed paint stayed about 240ms in both
builds, so it does not claim a faster paint for real readers.

`perf-budget.mjs` itself, which checks every timing, byte and request limit,
then ran three more interleaved rounds on the post. Before: 3053, 3011 and
3134ms, each failing only LCP. After: 2886, 2866 and 2907ms, passing every
limit. One earlier single run of the edit recorded 3094ms while the shared host
was busy (benchmark index 1827, against 2298-2591 for the six runner samples, and
445ms of style and layout instead of about 300ms). It is kept as a failure. The
post passes on an uncontended host, but its margin of 93-134ms does not cover
heavy contention.

Two other leads were measured and ruled out. The document is not it:
Building Thorbis has a 42KB document and passes, and the Nexstar post's RSC
payload mostly repeats the article for hydration. The first layout takes about
50ms on this post against 28ms on home, but it scales with the article's
length: hiding the article halved it. Overriding `text-rendering`, letter
spacing, `text-wrap`, font features, `overflow-wrap` or the font family changed
its median by at most 4ms. Only `content-visibility` would cut it,
which hides reading content and stays rejected. Raw reports are in hobby job
`byronwade-com-hobby-1023-0459`.

## Every-page chunk sharing, October 23, 2026

The root layout and root error boundary chunks are initial scripts on every
page. With webpack's default groups disabled, a module either of them shared
with a page chunk stayed in both, so the browser downloaded and registered it
twice. Project pages and the résumé repeated all of `next/image` (the header
brand mark in `NavDock` uses it) and the shared `Link`; every page repeated the
error notice, the site shell and the button recipe, which the error boundary and
the layout both reach. Across the 39 prerendered pages that was 554 repeated
registrations.

The `sharedPrimitives` group in `next.config.js` now also takes any script
module that `app/layout` or `app/error` shares with at least one other chunk.
Both chunks already load on every page, so moving such a module costs no route a
byte, and no request is added. Stylesheet modules are excluded so the group can
never emit a second CSS file. The original two-of-home/layout/not-found rule is
unchanged.

Measured on production builds of `237cb0b` and this change, initial scripts per
route as whole files gzipped at level 9 (polyfills excluded):

| Route | Initial scripts, gzip |
| --- | --- |
| Every project page | 182,933 → 176,014 (−6,919) |
| `/resume` | 176,587 → 169,571 (−7,016) |
| `/contact` | 177,867 → 175,653 (−2,214) |
| `/` | 170,580 → 168,886 (−1,694) |
| `/blog`, `/projects` | −1,357 |
| Every post, `/privacy`, `/terms` | −1,303 to −1,390 |
| 404 and global error | −1,078 |

The shared-primitives chunk grew from 11,779 to 20,156 bytes and the layout
chunk fell from 16,885 to 8,777; the [slug] page chunk fell from 19,406 to
13,565. Script counts (7, or 6 on the 404), the single stylesheet and the
document sizes are unchanged; HTML moved by RSC row order only.
`tests/rendered/shared-modules.test.mjs` now fails on any factory two initial
scripts of one page register, not only shared-primitives ones. It reported all
554 on the earlier build.

Timing did not change beyond variation. Three interleaved rounds of
`perf-budget.mjs` sampled main (A), a second copy of the same main build (A2,
the A/A control) and this change (B):

| Route | LCP, A (ms) | LCP, A2 (ms) | LCP, B (ms) |
| --- | --- | --- | --- |
| `/projects/thorbis` | 2972, 2990, 2926 | 2926, 2942, 3009 | 2995, 2870, 2916 |
| `/resume` | 2974, 2922, 2946 | 3117, 2922, 2953 | 3474, 2992, 2957 |

A and A2 alone differ by up to 83ms on Thorbis and 195ms on the résumé. B's
2870 and 3474 and A2's 3117 ran while the shared host was busy (benchmark
index 1398-1431, against 2215-2607 for the other fifteen); they are kept. Lantern
counts every initial script either way, and these moves keep the same scripts,
so only their bytes and parse work shrink. Claim the bytes, not a speedup. Raw
reports are in hobby job `byronwade-com-hobby-1023-0709`.

## Native Button, October 23, 2026

`components/ui/button.tsx` wrapped Base UI's `Button`. Every page that showed a
Button therefore loaded Base UI's `Button`, `useButton`, its render and
prop-merging helpers and `@floating-ui/utils/dom`, about 4 KB gzipped, even where
the Button was a server-rendered link. Those layers added only `type="button"` and
role handling to elements the platform already makes operable. The Button now draws
a native `<button>`, or clones its `render` link target, with no hooks: a server
component renders it as HTML with no client code, and a client component ships one
small function. The header popover chunks keep their own Base UI copy, which
Popover needs.

Measured on production builds of `55dafe7` and this change. Each prerendered page:
every chunk its HTML names (script tags and RSC payload references), gzipped at
level 9 as whole files, polyfills excluded:

| Route | Chunks named by the page, gzip |
| --- | --- |
| Every project page | 175,908 → 171,936 (−3,972) |
| `/` | 168,968 → 165,042 (−3,926) |
| `/resume` | 169,470 → 165,547 (−3,923) |
| `/contact` | 175,717 → 174,748 (−969) |
| Every other prerendered page | −1 |

Request-time page chunks: `/portfolio` 4,288 → 281, Figma file pages 5,930 →
1,869, `/search` 6,310 → 5,431. Contact and search kept Base UI's input helpers,
so they saved less (since removed; see Native Input below). Script counts and the stylesheet are unchanged. No timing was
claimed. `tests/rendered/button-markup.test.mjs` fails if any route's client
manifest includes Base UI's `Button` (the earlier build's project-page manifest
did), checks that prerendered Buttons keep native link and button semantics, and
clicks the résumé's Download PDF link to prove its own handler still runs.

## Native Input, October 23, 2026

`components/ui/input.tsx` wrapped Base UI's `Input`, which is `Field.Control`.
Outside a `Field` it only added state attributes nothing reads, an id nothing
references and validation that never runs, but it brought Base UI's field,
labelling, render and floating-ui helpers. Because it was a client reference,
the server-rendered `/search` form also loaded it. The Input now draws a native
`<input>` with no hooks, like `Textarea` and `Button`. Prerendered contact fields
keep the same attribute set.

Measured on production builds of `2bca28b` and this change, gzipped at level 9 as
whole files, polyfills excluded. Initial chunks are every chunk the HTML names;
`/search` is request-time, so its HTML came from a production server. Lazy chunks
are the files the loadable manifest lists for each dynamic import, excluding
`shared-primitives`, which every page already has:

| What loads it | Gzip |
| --- | --- |
| `/contact`, initial | 174,788 → 169,797 (−4,991) |
| `/search` and `/search?q=`, initial | 167,941 → 162,709 (−5,232); page chunk 5,390 → 160 |
| Home inline contact form, on open | 15,100 → 9,988 (−5,112) |
| Header search panel, on open | 8,067 → 6,303 (−1,764) |
| Every other prerendered page | −2 |

The header search panel keeps the helpers its Base UI Popover needs. Script
counts and the stylesheet are unchanged. No timing was claimed.
`tests/rendered/input-markup.test.mjs` fails if any route's client manifest
includes Base UI's `Input` or `Field` (every route's did before) and checks that
the prerendered contact fields keep their ids, names, types, `required` and
labels.

## Search corpus reuse, October 22, 2026

At `d238896`, each nonempty `/search?q=` request rebuilt readable text for all
30 local documents. A separate unbundled native profile identified Markdown
extraction as the dominant work: seven warm samples averaged 418ms parsing,
11ms loading and 0.54ms matching. Those native timings are diagnostic, not the
compiled server's request timings.

`buildPageSearchIndex` now uses the existing Next Data Cache for that computed
corpus, with the complete validated loader output as its arguments. It still
reads content on each request; edits and publication changes select a new key.
Development bypasses caching, and the header still gets no body text. See the
cache revision and invalidation contract in [ARCHITECTURE.md](ARCHITECTURE.md).

The same local production HTTP harness measured three fresh server sessions,
each with one priming request then seven samples per query in alternating order.
Timers cover `fetch` through reading the complete HTML response. The table shows
21 warm samples per query on the same shared Windows host, without throttling.

| Query | Before median / p95 | After median / p95 |
| --- | --- | --- |
| Empty form | 22 / 29ms | 21 / 34ms |
| `Thorbis` | 274 / 326ms | 27 / 39ms |
| `claude_desktop_config.json` | 277 / 389ms | 26 / 43ms |
| No-match query | 274 / 404ms | 30 / 41ms |

Warm nonempty ranges were 215–454ms before and 22–47ms after. These samples
support avoiding repeated parsing; they do not measure real-user Web Vitals,
production cache latency, throughput, or the first uncached corpus computation.
The rendered search regression checks real local cache entries and immediate
freshness through edits, draft transitions, malformed-file recovery and removal;
it deliberately makes no timing assertion on a shared machine.

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
  `Modelistasignature-ownAV.otf` is kept only as the source of that subset; no
  page or route loads it.
- Share cards (`/api/og`, every page's `og:image`) are drawn by Satori, which
  reads TrueType but not WOFF2 and ignores variable axes. `assets/og/` holds
  static Inter instances of the Latin face above (regular at opsz 14 and medium
  at opsz 32, the page title weight), without GPOS, because Satori places words
  by their unkerned width but draws them kerned, which widened the gap after
  every kerned word. If the Thorbis port replaces that face, regenerate them with
  `python scripts/build-og-fonts.py`. `tests/share-card.test.mjs` checks their
  format and that they cover every title and excerpt; the route fails rather
  than fall back to another font when they are missing.
  Successful PNG responses use `public, max-age=86400, s-maxage=604800`:
  one day in browsers and one week in shared caches. Card text lives in the
  query, so different titles and descriptions have different cache keys;
  template and font changes at the same URL can remain in a browser for a day.
  Asset-loading failures return `no-store` so a later request can recover.
  `tests/rendered/share-cards.test.mjs` checks the actual production HTTP
  policy for every page's card, distinct/repeated queries, and recovery after
  a child-server-only simulated font failure. No application cache or extra
  cache tag is needed for these binary responses, as with project screenshots.
- With the earlier italic blockquotes, Inter, Geist Mono and the full
  Latin italic face together measured 103,933 bytes on a post with a quote,
  over the 100KiB font limit. `public/fonts/inter-italic-latin-core.woff2` is a
  Basic Latin and typographic-punctuation subset of that pinned italic face,
  declared after the generated Thorbis faces so it takes precedence for the
  characters it covers. The full face remains for other Latin characters. If the
  Thorbis port replaces the italic file, regenerate the subset with
  `python -m fontTools.subset public/fonts/UcC53FwrK3iLTcvneQg7B5iqpJlhKnPCkaL5UUM.woff2 --unicodes="U+0020-007E,U+00A0,U+00AB,U+00BB,U+2010-2014,U+2018-201E,U+2022,U+2026,U+2032-2033,U+2039-203A" --layout-features='*' --flavor=woff2 --output-file=public/fonts/inter-italic-latin-core.woff2`
  and keep the face's `unicode-range` equal to that list.
- Every page preloads upright Latin Inter before its first paint, and Lighthouse
  counts it in every route's simulated LCP. The pinned file is 49,620 bytes.
  `public/fonts/inter-latin-core.woff2` is a 31,824-byte subset of it: the italic
  core's characters plus the § © · × é ↑ ↓ the site prints, with both axes,
  kerning and every layout feature. Two faces (400 and 500, matching the
  generated pair) follow the generated block, and the root layout preloads the
  subset instead of the full file. The full face still loads for any other Latin
  character, such as an accented name typed into search. Content or source that
  adds another such character fails `tests/design-contract.test.mjs`; add it here,
  regenerate with
  `python -m fontTools.subset public/fonts/UcCo3FwrK3iLTcviYwY.woff2 --unicodes="U+0020-007E,U+00A0,U+00A7,U+00A9,U+00AB,U+00B7,U+00BB,U+00D7,U+00E9,U+2010-2014,U+2018-201E,U+2022,U+2026,U+2032-2033,U+2039-203A,U+2191,U+2193" --layout-features='*' --flavor=woff2 --output-file=public/fonts/inter-latin-core.woff2`
  and keep both faces' `unicode-range` equal to that list.
  `tests/rendered/font-subset.test.mjs` loads every prerendered page and checks
  that only the subset is requested.
- The root layout preloads the subset with `preload()` from `react-dom`, not a
  `<link rel="preload">` element. React's server renderer turns such an element
  into a preload hint and still renders the element, so every page carried two
  identical tags for the font, and every RSC payload carried the element again.
  Prerendered pages now carry one tag, ahead of the stylesheet. Pages rendered per
  request (`/portfolio`, Figma files, search) get React's font preload as an HTTP
  `Link` header instead of a tag; before, they also had the late element.
  Chrome fetched the file once either way, so this removes markup only and makes
  no timing claim. The layout also no longer hints DNS lookups for
  `api.github.com`, `api.dribbble.com` and `api.figma.com`: only server code
  (`lib/portfolio-data.ts`, `app/api/github`) calls them, so the browser resolved
  three hosts it never contacts. `tests/rendered/head-hints.test.mjs` fails if a
  page repeats a resource hint, hints a cross-origin host, or preloads the font
  after the stylesheet or not at all.
- Geist Mono remains deferred. `public/fonts/geist-mono-latin-core.woff2` is a
  10,148-byte subset of the pinned 15,524-byte
  `or3nQ6H-1_WfwkMZI_qYFrcdmg.woff2`, using the same 119-character core as upright
  Inter. Both weights (400 and 500) override the generated Latin faces after
  `thorbis-fonts:end`; other Latin characters still load the original face.
  The weight axis, layout features, outlines, advances and vertical metrics are
  preserved. The existing Geist OFL license covers this derived asset. Regenerate
  with [fontTools](https://fonttools.readthedocs.io/en/latest/subset/):
  `python -m fontTools.subset public/fonts/or3nQ6H-1_WfwkMZI_qYFrcdmg.woff2 --unicodes="U+0020-007E,U+00A0,U+00A7,U+00A9,U+00AB,U+00B7,U+00BB,U+00D7,U+00E9,U+2010-2014,U+2018-201E,U+2022,U+2026,U+2032-2033,U+2039-203A,U+2191,U+2193" --layout-features='*' --flavor=woff2 --output-file=public/fonts/geist-mono-latin-core.woff2`
  The same contract and rendered subset tests protect its size, range, weights,
  request selection and full-face fallback. Do not preload Mono.
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
  including preview-only icons. Membership in the sharing group is limited to
  modules used by at least two of home, layout and root-not-found; every consumer
  reuses that selected code. Sharing every route's initial modules
  recreated the same eager payload even after splitting the facade. Independent
  modules and Next's existing import optimizer resolve each consumer to its
  requested glyphs; this bounded sharing keeps route dependencies deferred
  without changing public imports or weights. The rendered home contract checks
  the actual initial scripts for preview glyphs. The same kind of check covers every
  published post, the résumé, and the contact page, so the share, envelope, download,
  send, and spinner glyph definitions cannot drift back into those routes' initial
  scripts (`tests/rendered/glyph-boundary.test.mjs`). React Compiler owns routine
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
  form and the success toast still import glyphs directly. The Figma viewer
  and the breadcrumb overflow dots are server slots; see the measurements below. Measured on production builds of `08b11de` and this change, initial
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
  The breadcrumb overflow dots were the remaining glyph in the layout chunk.
  The trigger now receives that glyph from the server layout, and the popover
  loads with `React.lazy` so the fallback can draw the same slot. `next/dynamic`'s
  loading option could not take one. Measured on production builds of `74a7678`
  and this change, gzip level 9. Script counts did not change: home, the résumé,
  the projects index, Dits, and the Nexstar post stay at 9; contact stays at 10.

  | Route | Initial scripts, gzip | HTML, gzip |
  | --- | --- | --- |
  | `/` | 211,085 → 210,498 (−587) | 20,363 → 20,619 (+256) |
  | `/blog/nexstar-win-invoice-lose-customer` | 215,165 → 213,459 (−1,706) | 45,284 → 45,384 (+100) |
  | `/resume` | 226,594 → 226,007 (−587) | 21,860 → 21,971 (+111) |
  | `/contact` | 225,776 → 225,189 (−587) | 17,818 → 17,923 (+105) |
  | `/projects` | 212,857 → 211,151 (−1,706) | 22,205 → 22,310 (+105) |
  | `/projects/dits` | 234,180 → 232,474 (−1,706) | 29,847 → 29,949 (+102) |

  The sum of those two columns fell on every route. `DotsThreeIcon` left client
  chunks entirely (one chunk, then none) and remains in the server build. The
  larger script drop on the writing and project routes was measured and not
  isolated to the glyph module alone. This is a byte reduction only.
  Home's prerender still carries that dots graphic in the layout payload, because
  the trail is hidden in the client and the layout is shared. Removing the graphic
  from the saved homepage HTML and gzipping again at level 9 saved 90 bytes
  (20,456 to 20,366) on the build of `b7900cf`. Splitting the shared layout to
  omit it would not put the glyph back into client JavaScript, and it is not
  worth that split for 90 bytes.
- The Figma file page's client chunk imported the monitor and image glyphs.
  On `b7900cf` that chunk was 45,155 bytes, 16,538 gzipped at level 9. The icon
  definition modules alone are 648 and 992 bytes gzipped, and each carries all
  six weights. The viewer now receives those two glyphs as server slots, same as
  the project preview. The same chunk is 39,581 bytes, 14,701 gzipped (−1,837).
  Homepage, contact, résumé, projects, Dits, and the Nexstar post kept 9 scripts
  (contact 10) and the same summed script gzip. Their HTML gzip moved by at most
  5 bytes, the new chunk hash in the script URL. `MonitorIcon` and `ImageIcon`
  left client chunks and remain in the server build. The success toast was
  measured and left alone: its five
  glyphs live in the chunks downloaded after a successful send (two dynamic
  copies, about 13 KB and 14 KB gzipped, not in the homepage or contact initial
  scripts). Slotting them would add the graphics to the homepage payload, and
  the homepage is the page sitting on the loading limit. The contact form's send
  glyph stays in the chunk that loads when the form opens.
- The success toast loads only after a contact submission succeeds; the unused
  global query-state adapter is removed. Home does not load the breadcrumb
  popover graph.
- Vercel Analytics and Speed Insights render from the root layout through
  `components/common/site-analytics.tsx`, which adds the search-word `beforeSend`
  handler (+65 B gzip on the layout chunk, no extra script).
  React Scan is a development diagnostic and is excluded from production.
- Images use the existing Next image configuration (WebP/AVIF and responsive
  sizes). No new service worker, third-party runtime origin or performance
  utility layer is introduced by the design port.

## Replaying analytics runtimes locally

Plain `next start` does not serve Vercel's platform scripts. Its analytics 404
responses are part of the historical local baseline, not hosted analytics work.
To investigate the runtime separately, capture the two public scripts once into
a **new directory outside the repository**:

```powershell
node scripts/analytics-runtime.mjs capture C:/path/to/job/runtime-snapshot
```

Capture uses only GETs to the canonical `https://www.byronwade.com` script URLs,
refuses redirects, and records capture time, decoded byte sizes, content types
and SHA-256 hashes in `manifest.json`. It refuses to replace an existing directory.
Snapshot files stay local; do not commit fetched third-party code or raw telemetry.
The hashes detect changed inputs; they do not authenticate a manually edited
manifest. Use snapshots you captured and reviewed.

After a keyless production build, replay that snapshot on the existing runner:

```powershell
$env:THORBIS_EVIDENCE_DIR = "C:/path/to/job/runtime-report"
node scripts/perf-budget.mjs --route=/projects/dits --analytics-runtime=C:/path/to/job/runtime-snapshot --save-assets
```

The runner validates the snapshot before starting its server/browser, passes an
owned intercepted page to Lighthouse's Node API, and serves the unchanged script
bytes. Every off-origin HTTP request is blocked; same-origin `/_vercel/` telemetry
gets a local 204 response. No telemetry is forwarded to Vercel. Interception stays
active until that page closes, including on failed audits. Application code,
production configuration, loading policy and budgets are unchanged.

These scripts skip automation. The isolated replay sets `navigator.webdriver`
to false and removes `HeadlessChrome` from its initial user agent so the runtime
actually executes. Lighthouse still applies its own mobile profile. Reports
declare `analytics.mode = "pinned-runtime-replay"`, activation policy, script
hashes/source/capture time, script request paths, telemetry count and blocked
origins. Inactive runtimes or unexpected off-origin requests fail the run. Reports
without replay declare `"unmodified-local-server"`; do not pool the two conditions.

Interception adds overhead and serves decoded bodies without Vercel's compression,
CDN timing or response policy. Local 204s are telemetry sinks, not provider responses.
This is a reproducible lab condition for runtime and graph diagnosis, not hosted
performance or an optimization. A loading-policy claim still requires matched
interleaved A/B and fresh A/A controls under the same condition and unchanged limits.

For privacy coverage with these actual scripts, run the explicit browser check:

```powershell
$env:ANALYTICS_RUNTIME_DIR = "C:/path/to/job/runtime-snapshot"
node --test tests/analytics-runtime/browser.test.mjs
```

It requires real page-view and measured-vital payloads in phone/light and
desktop/dark states, checks that search words are removed while attribution and
hash survive, and proves an intentional off-origin fetch is blocked. Telemetry
bodies are checked in memory only. The default rendered suite retains its cheap
queued-handler sensor; this opt-in check needs a locally captured snapshot.
Vercel documents [Web Analytics `beforeSend`](https://vercel.com/docs/analytics/package),
[Speed Insights `beforeSend`](https://vercel.com/docs/speed-insights/package), and
[vital delivery on blur/unload](https://vercel.com/docs/speed-insights/troubleshooting).
Repeat capture review and the real browser/export smoke checks after a runtime,
Puppeteer or Lighthouse upgrade; synthetic native tests do not certify those APIs.

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
measurement in that directory is the snapshot pinned by `home-budget.json`;
the later repeated template baseline is linked above. Neither is an unpinned
measurement of current main.
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

Lighthouse simulates this LCP. In the historical homepage sample the observed
paint happened about 300 ms after navigation. Lantern selects requests using
their observed completion times and CPU evidence; it does not simply count
every request started before paint. The later Dits graph investigation above
shows local analytics 404s entering or leaving that model on identical bytes.
The historical initial scripts included about 132 KB of React and Next framework
code. Detail pages added a larger document
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
