# Dits simulated paint graph, October 28, 2026

Six serial controls of identical application bytes passed the existing budgets
three times and missed LCP three times. Simulated LCP ranged from 2802 to 3031ms;
observed LCP ranged from 221 to 300ms. No application loading policy changed,
no budget was waived, and no speed improvement is claimed.

The useful finding is the model's tail: five controls include the local Vercel
analytics 404s and end on the Web Analytics request. In the 2802ms control those
requests completed just after observed LCP and are absent from both modeled
paint paths. Their absence explains the path change; it is not evidence that
production analytics delayed visible content by that amount.

## Source and collection

- Application base `02b3e41c8ec605eb2c438bc086bbd3341af91f95`, including the
  visitor-controlled error recovery from #222. Runner
  `7ce370c7c2482160677756e80e47338c570db36c` adds trace export only. No application
  inputs differ between those commits. Every report records a clean tracked tree.
- Keyless webpack build `6f814QXm0b5PfCX1O2qpa`, 57/57 generated pages;
  Node v24.21.0, Chrome/155.0.8059.85, Lighthouse 13.5.0.
- Default simulated mobile profile: 412 × 823, scale 1.75, 150ms RTT,
  1638.4Kbps throughput, 4× CPU slowdown. No theme override; dark is the default.
- Each sample owns a fresh hidden loopback server and browser. Readiness fetches
  `/` first, so the server is warm and the browser cold. The existing 45-second
  host settle and five-second browser settle remain unchanged. Each command has
  a 240-second outer deadline; none timed out or required forced browser cleanup.
- Controls run serially as A/A2, A2/A, A/A2; the labels serve identical bytes.
  Other jobs on the shared Windows host were not paused. Minimum available RAM
  across all nine samples was 13,950,218,240 bytes (12.99GiB); control CPU
  calibration ranged from 1906.5 to 2583. Every sample is retained.
- The build and runtime have no capture key. No ScreenshotOne request is made.
  The plain Next server answers both Vercel analytics script URLs with HTTP 404;
  this is not the hosted scripts' execution or network behavior.

Three earlier exploratory runs also remain below. Exploratory runs 2 and 3
had a 19.790337-second command overlap, including the later sampler's startup.
They are excluded from the serial controls, regardless of their outcomes.
No exploratory failure was removed or converted into a passing control.

## Results

All values here round to milliseconds; JSON retains full precision. Pass means
every timing, byte and request limit in `lighthouse-budget.json` passed.
The existing 3000ms LCP and ten-script limits remain unchanged.

| Serial control, in collection order | Simulated LCP | Observed LCP | Optimistic end | Pessimistic end | Budget |
| --- | --- | --- | --- | --- | --- |
| [Round 1 A](control-r1-A.json) | 3031 | 253 | 2956 | 3106 | LCP miss |
| [Round 1 A2](control-r1-A2.json) | 2994 | 221 | 2919 | 3069 | Pass |
| [Round 2 A2](control-r2-A2.json) | 2999 | 249 | 2924 | 3074 | Pass |
| [Round 2 A](control-r2-A.json) | 3025 | 300 | 2950 | 3100 | LCP miss |
| [Round 3 A](control-r3-A.json) | 2802 | 224 | 2727 | 2877 | Pass |
| [Round 3 A2](control-r3-A2.json) | 3024 | 261 | 2949 | 3099 | LCP miss |

A2 minus A is -38ms, -26ms and +222ms for the three pairs. These are controls,
not an A/B comparison. All six transfer the same 288,513 bytes across 17 requests:
nine scripts (177,479 bytes), two fonts (42,714), the document (27,504), one
stylesheet (17,299), two images (19,433) and two other requests (4,084).
There is no changed script count or content to credit for the movement.

| Exploratory sample | Simulated LCP | Observed LCP | Budget |
| --- | --- | --- | --- |
| [First](dits-r1-A.json) | 2993 | 449 | Pass |
| [Second, overlapping](dits-r1-A2.json) | 2994 | 217 | Pass |
| [Third, overlapping](dits-r2-A2.json) | 3004 | 243 | LCP miss |

Across all nine commands: five budget passes, four LCP misses, zero timeouts.
Every other budget passed, including the existing script cap. These results do
not supersede the previous baseline's different source/build pins.

## What the traces show

Lighthouse's own exporter saves the observed trace, DevTools network log and
named simulator traces. The [summary](summary.json) records both modeled
schedules, request types, status codes, CPU tasks and the analytics initiators'
first two stack frames. The initiators point to the root layout chunk, matching
`SiteAnalytics` and the installed Vercel packages' effect-based script injection.

For the first exploratory sample, the optimistic schedule is:

| Modeled work | Completion (ms) |
| --- | --- |
| Stylesheet | 1366.782 |
| Geist Mono font | 1825.172 |
| Project page chunk | 1983.563 |
| Inter font | 2116.782 |
| React framework chunk | 2566.782 |
| Main application chunk | 2575.172 |
| Last included CPU task | 2759.172 |
| Local Web Analytics 404 | 2917.563 |

Its pessimistic path ends on the same request at 3067.563ms. Their mean is
exactly the budget's 2992.563ms. Mono and the project chunk are not the tail in
this sample. The low-priority sky and icon requests are absent from the optimistic
network schedule and present in the pessimistic one; that schedule shifts the
main-app completion and tail by 150ms. This describes the simulator's schedule, not an
isolated real-world saving from removing a font, preview or photograph.

The strongest identical-build comparison is round 3. In A, observed LCP is
224ms; the analytics requests finish at 226.715ms and 227.029ms and are excluded
from both modeled paint paths. In A2, observed LCP is 261ms; those requests finish
at 245.722ms and 249.306ms and are included. A's terminal included CPU task ends
at 2727.275ms optimistic / 2877.275ms pessimistic; A2 ends on Web Analytics at
2948.954ms / 3098.954ms. All resource totals and script hashes are unchanged.

The installed Lantern LCP implementation uses the observed paint cutoff, excludes
low-priority images from the optimistic graph and averages the two branch
estimates with an FCP floor. Its shared paint-graph selector considers request
completion and script evaluation evidence. A failed script with no evaluation
can therefore remain in this local graph. The installed source files and their
hashes are pinned in the summary, alongside the lockfile. See also
[Lighthouse's LCP computed artifact](https://github.com/GoogleChrome/lighthouse/blob/v13.5.0/core/computed/metrics/lantern-largest-contentful-paint.js)
and its [Lantern documentation](https://github.com/GoogleChrome/lighthouse/blob/v13.5.0/docs/lantern.md).

## Decision

Keep application loading, analytics, fonts, the photograph and budgets as they
are. Delaying analytics, excluding its requests or moving content past the paint
cutoff could change the local model without demonstrating a visitor benefit.
Preloading Mono and deferring preview chrome were already rejected in earlier
investigations; this graph provides no reason to restore those probes.

Before a loading change, collect a matched-source graph with representative
hosted analytics assets and controlled egress, while preserving search-word
redaction. Establish fresh A/A controls alongside interleaved A/B samples of an
actual candidate. Keep this loopback budget evidence separate, and require
observed paint and behavioral checks as well as the simulated result. No hosted
analytics, real-user p75/INP, desktop/light performance, physical device or full
accessibility-conformance claim follows from these controls.

## Reproduction and integrity

Use a clean checkout of the pinned source and lockfile, then a unique local
folder for each sample:

```powershell
$env:SCREENSHOTONE_ACCESS_KEY = ""
npm ci
npm run build
$env:THORBIS_EVIDENCE_DIR = "C:/Temp/dits-graph/unique-sample"
node scripts/perf-budget.mjs --route=/projects/dits --save-assets
```

Open `route-budget_projects_dits-0.trace.json`,
`route-budget_projects_dits-optimisticLargestContentfulPaint.trace.json` or
`route-budget_projects_dits-pessimisticLargestContentfulPaint.trace.json` in Chrome
DevTools' Performance panel. Network requests and CPU work in a simulator
trace are modeled events. Keep raw assets local and review any evidence before
publication. The default budget command does not export these assets.

The summary's schedules were derived from the unmodified exporter traces at
its synthetic 1e9-microsecond time origin. The exporter's final artificial 1ms
trailing Task is excluded. Each branch estimate takes the latest included CPU
or network endpoint, excluding Low/VeryLow image endpoints as the installed LCP
model does. The two-branch mean agrees with every saved LCP within 0.001ms.
This reconstruction does not run a counterfactual or compute savings.

All 288 completed-command artifact hashes were verified before publication.
All nine report identities, profiles, empty Lighthouse warnings and exit/failure
agreements were checked, as was the absence of overlap in the six serial controls.
Published report JSON is parsed-identical to the originals; both hashes are in
the summary. Raw traces, network logs, command logs, RAM snapshots, receipts and
the hashed analysis script remain in this job's C: folder,
`jobs/byronwade-com-hobby-1028-1409/`, outside the repository.
