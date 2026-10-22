# Repeated loading baseline, October 22, 2026

The homepage passed all budgets in three samples. Thorbis, Dits and the Nexstar
post exceeded the 3000ms LCP limit in all nine detail-page samples. Every other
timing, byte and request-count limit passed. These are measurements of the
unchanged application, not an optimization or a budget waiver.

## Source and method

- Application: `8df8549a6045d258d573839d21af6020ba662aa3`, main at job start.
- Production build: `udHVh-x5gMf5aQbKSc58H`, Next webpack, 48/48 pages.
- Browser: Chrome `155.0.8059.85`; Lighthouse `13.5.0`.
- Profile: default simulated mobile, 412 × 823 CSS pixels, device scale 1.75,
  150ms RTT, 1638.4Kbps throughput and 4× CPU slowdown. Each report contains the
  complete throttling settings.
- Three rounds in the order home → Thorbis → Dits → Nexstar. Each measurement
  starts a fresh production server and Chrome. The existing server helper
  requests `/` once to establish readiness; this is a cold browser, not a cold
  server-cache experiment.
- The unchanged runner waits 45 seconds before launching Chrome and five more
  on `about:blank`. This job ran no other heavy checks during collection.
  Other jobs on the shared Windows host were not paused.
- Available RAM was checked before every launch: minimum 24,784,715,776 bytes
  (23.08GiB). Every command had a 240-second outer timeout; none timed out.
- The child environment disabled the screenshot provider. Project measurements
  use the unavailable-preview fallback, not a live capture or image fixture.

The local server returned 404 for `/_vercel/insights/script.js` and
`/_vercel/speed-insights/script.js`, and 500 for `/api/screenshot` with its
provider disabled. These responses remain in the network diagnostics. The
results do not measure the hosted analytics scripts or a successful screenshot.

No application files changed during collection. PR #162 subsequently brought
contact-delivery recovery into main as `2a711ad`. These timings must not be
relabeled as measurements of that commit or a later build. The documentation PR
includes that main update, with separate release checks.

## Results

Ranges are rounded to the nearest millisecond; the JSON retains full precision.
“Pass” requires every budget, not just a Lighthouse score or the median sample.

| Route | LCP range / median (ms) | TBT range (ms) | Maximum CLS | Pass | Individual reports |
| --- | --- | --- | --- | --- | --- |
| `/` | 2902–2973 / 2903 | 101–204 | 0 | 3/3 | [1](home-1/home-budget.json), [2](home-2/home-budget.json), [3](home-3/home-budget.json) |
| `/projects/thorbis` | 3220–3231 / 3222 | 106–118 | 0.000983 | 0/3 | [1](thorbis-1/route-budget_projects_thorbis.json), [2](thorbis-2/route-budget_projects_thorbis.json), [3](thorbis-3/route-budget_projects_thorbis.json) |
| `/projects/dits` | 3213–3254 / 3221 | 100–220 | 0.000983 | 0/3 | [1](dits-1/route-budget_projects_dits.json), [2](dits-2/route-budget_projects_dits.json), [3](dits-3/route-budget_projects_dits.json) |
| `/blog/nexstar-win-invoice-lose-customer` | 3175–3186 / 3179 | 99–108 | 0 | 0/3 | [1](nexstar-1/route-budget_blog_nexstar-win-invoice-lose-customer.json), [2](nexstar-2/route-budget_blog_nexstar-win-invoice-lose-customer.json), [3](nexstar-3/route-budget_blog_nexstar-win-invoice-lose-customer.json) |

All twelve measurements used ten script requests, exactly the existing limit.
Transfer sizes were identical across each route's three samples:

| Route | Script bytes | Document bytes | Font bytes / requests |
| --- | --- | --- | --- |
| Home | 176,138 | 21,770 | 49,991 / 1 |
| Thorbis | 198,258 | 22,298 | 65,886 / 2 |
| Dits | 198,258 | 30,560 | 65,886 / 2 |
| Nexstar | 179,192 | 46,654 | 88,141 / 3 |

The LCP diagnostics identify text: the home heading, the project ledes and a
Nexstar body paragraph. They do not identify a screenshot as LCP. These element
breakdown timings are observed trace diagnostics; the budget uses Lighthouse's
simulated LCP. They must not be substituted for one another to obtain a pass.

## Limits and next investigation

Home's worst sample has only 27ms of LCP headroom. Its 71ms spread with identical
transfer sizes is ordinary variation in this sample set, not a statistical
confidence interval. Lighthouse's CPU benchmark index varied from 1332 to 2640;
the lower reading was Dits sample 2 and is retained. RAM availability does not
establish an idle CPU. There were no Lighthouse run warnings or runtime failures,
but the calibration variation limits causal comparisons.

This is a single local build, browser and default light-theme mobile profile.
It does not establish hosted performance, real-user p75, INP, production capture
behavior, dark/desktop performance, accessibility conformance or a speedup since
older Lighthouse 12 reports. The earlier all-route accessibility evidence has
its own source and build pins.

1. Before changing loading behavior, establish the same repeated baseline on the
   then-current source. Keep home as the shared-shell control and retain every
   failed or interrupted sample with its reason. Do not merge samples from
   different builds or replace failures with automatic retries.
2. Inspect the initial script and font dependency chains and main-thread work
   for the text LCP on one detail template. Scripts are the largest transferred
   resource category in these reports; that observation alone does not prove
   they cause the delay. Isolate the responsible request or task before editing.
3. Compare one candidate against the matched baseline, at least three samples
   per route, without adding an eleventh script, preloading Geist Mono, hiding
   reading content or delaying the preview. Preserve the rejected #139 probe
   constraints in [PERFORMANCE.md](../../PERFORMANCE.md). Require improvement
   beyond ordinary variation and report every remaining budget miss.

## Reproduction and evidence integrity

Build the pinned source in an authorized isolated worktree with Node 24 and
`npm ci`, then `npm run build`. Check available RAM before each heavy step.
For each route and sample, use a unique output directory on C: so no earlier
report is overwritten. For example, in PowerShell:

```powershell
$env:SCREENSHOTONE_ACCESS_KEY = ""
$env:THORBIS_EVIDENCE_DIR = "C:/Temp/byronwade-lighthouse/home-1"
node scripts/perf-budget.mjs --route=/
```

Repeat serially for `/projects/thorbis`, `/projects/dits` and
`/blog/nexstar-win-invoice-lose-customer`, then repeat that four-route round twice.
The runner's nonzero exits remain failures: in this set, three commands exited
0 and nine exited 1 for the recorded LCP misses. Inspect both the command result
and its report; a browser or cleanup failure is not a valid timing sample.

[summary.json](summary.json) records sample order, full-precision ranges,
per-command exits, RAM observations, report SHA-256 hashes and hashes of the
unchanged runners and budget. All twelve reports were checked for matching
source/build/browser/profile, complete expected coverage, no run warnings and
agreement with the existing `assessBudget` implementation. Command logs and
their independent hash receipts remain in the scheduler job folder on C:.
