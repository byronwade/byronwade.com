# PR #56 result

Mode: **Implementation**. Repository writes, normal merges, commits, push and squash
merge are authorized. No shop, payment, environment/domain or content deletion work.

Decision: retain the Thorbis CSS/Tailwind/Base UI port and fix homepage delivery.
The upstream source stays pinned to `46b6654d02fda9d8fde737395185c3141df52cd2`;
this is a port of a private application, not an installed package.

## Acceptance

| Criterion | Evidence |
| --- | --- |
| Integrate main normally | Merge `2bb59e7` includes #55; merge `c0beb8f` includes main `2101118` (#58 resume/PDF). No history rewrite. |
| Native tests | `npm test`: 149 pass, zero failures/skips. |
| Local quality gates | `npm run check`: lint, strict types and knip pass. |
| Production build | `npm run build`, executed by `npm run perf:budget`: 47 pages pass. |
| Rendered contracts | `npm run test:rendered`: 8 pass; 38 dates/eight pages, 41 client chunks, resume print/privacy and home bundle boundary. |
| Performance | Full `npm run perf:budget` exits 0; unchanged mobile profile and all limits. Values below. |
| Browser/design | `node scripts/verify-thorbis-browser.mjs`: PASS; eight width/theme cases, 24 panels, four keyboard widths, two no-JS widths and nine routes. |
| External status and merge | Pending push, status inspection and requested squash merge. |

Application commit: `969fe88a37616d45f082cf43c5b023ec4e27a951`. Fresh contact HTML/client and server-environment-name
scans: zero matches; 20 original font hashes match pinned evidence; protected content,
budget/runner and font tree diff empty. `git diff --check` passes.

## Performance evidence

Lighthouse 12.8.2, default mobile simulated profile, local Byron-Home. Neither
`lighthouse-budget.json` nor `scripts/perf-budget.mjs` changed. The baseline below
is the integrated #55 tree before this follow-up; the earlier PR LCP was 3266ms.

| Metric | Integrated baseline | Passing follow-up | Limit |
| --- | ---: | ---: | ---: |
| LCP | 3443.108ms | 2989.517ms | 3000ms |
| FCP | — | 940.344ms | 2000ms |
| TBT | 559ms | 271.828ms | 300ms |
| CLS | — | 0 | 0.1 |
| Speed Index | — | 961.438ms | 3000ms |
| JavaScript | 203017 bytes | 168115 bytes / 9 requests | 300KiB / 10 |
| All resources | 294456 bytes | 262432 bytes / 14 requests | 1000KiB / 50 |
| Fonts | — | 49991 bytes / 1 request | 100KiB / 5 |
| CSS | — | 17963 bytes / 1 request | 50KiB / 3 |
| Images | — | 0 bytes / 0 requests | 500KiB / 20 |

`docs/evidence/thorbis/performance.json` retains the final complete diagnostics;
`lcp-runs.json` retains exploratory failures as well as passing samples. Local CPU
variance was material and the final LCP margin is only 10.483ms. These are lab measurements,
not a claim about production user latency. Font instancing, inline CSS, deferred
search and selective hydration experiments were rejected and removed.

## Ownership, reuse and cleanup

Reused the canonical icon API, Phosphor SSR glyphs, Base UI, Button, search data,
nav-config, theme hook, capsule hook, obfuscated contact and existing verification
harnesses. No runtime dependency, visual token or font change was introduced here.

Extended the icon implementation into independent modules behind its existing
curated facade: all 60 glyph/weight/display-name mappings match the original.
Next's import optimizer resolves those modules; initial sharing is bounded to the
home, root layout and not-found entries. Server shell wrappers pass static SVG
slots into client interaction leaves. This removes unrelated preview and static
shell glyph definitions from initial JavaScript without changing public callers.

Recursive cleanup removed the monolithic icon implementation and inherited header
clearance variable. Native root scroll padding preserves the same measured focus
clearance. Existing ResizeObservers now supply initial measurements without an
extra synchronous read; closed capsules skip motion-token reads until needed.
No abandoned font assets, deferred-search implementation or hydration experiment
remains. Main #58's print/footer and resume fixes are retained.

Mechanical prevention: the existing rendered suite now inspects actual initial
scripts, rejects server-shell/preview glyph definitions, and has a positive
control for the required client action glyph. It was observed failing before the
fix and passing after. Existing timing/resource limits remain enforced. Browser
checks now toggle the real theme control in every matrix case and assert no-JS
navigation visibility. No automatic Actions workflow was enabled or dispatched.

Codacy cleanup: added CSS spacing, fixed a bare URL, and named the returned client
configuration. No check settings changed. Nine initial homepage JS/CSS assets are
byte-identical to the final browser matrix build; rendered tests pass again. The
updated token adapter was run twice in a scratch directory: idempotent and equal
to checked-in styles; the pinned source checkout remains clean.

## Design evidence and limits

Showcase home / Shared shell. The dominant object remains experience beside the
current product, followed by qualified proof and writing. No new composition or
motion was added. Existing panel motion retains trigger anchoring, interruption,
focus return and reduced-motion behavior; the final harness checks these paths.

Production matrix covers 1440/768/390/320 light and dark, actual theme-toggle
round trips, 24 open panel states, four keyboard widths, two no-JS widths, nine
routes, empty search, invalid contact, reveal, touch targets and contrast. The
final rerun status is recorded above. Development smoke at the earlier client-slot
checkpoint passed 1440/390 light/dark with actual toggles and no runtime errors.

Physical-device, Safari and screen-reader checks were not run. Empty home content
arrays were not forced. There is no new image payload or content entrance motion.
Unrelated dependency updates and shop/payment decisions remain outside scope.
Next backlog item: review/test dependency PR #50 (Next.js update), with its own
local regression and performance checks before accepting it.

VERDICT: LOCAL GATES PASS; final external status/merge receipt pending.
