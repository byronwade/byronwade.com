# Loading baseline and identical-build controls, October 28, 2026

23 of 24 samples passed every existing budget. The highest simulated LCP was
3008ms against the 3000ms limit. Near-limit passes are not comfortable regression
margin.

This measures the application at `ae357bafc7e489e264b2a789cdb34eefc5ac3109`.
The route-budget runner at `b7816116bf5999148c72d30d7642e94bf7af75c5` explicitly disables the
screenshot provider and saves observed paint diagnostics beside simulated budget
timings. No application code changed. A and A2 are the same build, not competing
implementations. These controls establish variation, not a speed improvement.

## Source and method

- Keyless Next webpack build `sX6RsYxAT4O-RN9Rgeznh`, 57/57 generated pages;
  Node v24.21.0, Chrome/155.0.8059.85, Lighthouse 13.5.0.
- Default simulated mobile profile: 412 × 823 CSS pixels, device scale 1.75,
  150ms RTT, 1638.4Kbps throughput and 4× CPU slowdown. No theme override; the
  default dark sky's narrow image appears in the request records.
- Three rounds in route order home → Thorbis → Dits → Nexstar. Each route has an
  A/A2 pair; round 2 reverses the pair order. Every sample gets a fresh hidden
  loopback server and headless browser. Server readiness fetches `/` first, so
  this measures a cold browser, not cold server caches.
- The unchanged browser helper waits 45 seconds before launch and five seconds
  on `about:blank`. No other heavy checks from this job ran during collection.
  Other agents on the shared Windows host were not paused.
- RAM was checked before every sample: minimum 13,516,070,912 bytes (12.59GiB).
  CPU calibration ranged from 1273.5 to 2604. The low reading was Nexstar round
  3 A; it is retained, not replaced. Available RAM does not establish an idle CPU.
- Each command had a 240-second outer deadline. No failed sample was replaced
  or retried. The summary records command exits and report hashes.
- The build and owned server have no screenshot key. Project previews are
  omitted at prerender; these samples do not exercise a capture, retry or
  runtime off state. Both local Vercel analytics scripts answer 404; their
  hosted JavaScript is not measured. Those requests remain in the reports.

## Results

Values below round to the nearest millisecond; JSON retains full precision.
Ranges describe these samples, not statistical confidence intervals.
Passing means every timing, byte and request limit in the unchanged
`lighthouse-budget.json` passes. Observed paint is diagnostic only and never
substitutes for simulated LCP in that decision.

| Route | Simulated LCP range / median (ms) | Observed LCP range (ms) | TBT range (ms) | Maximum CLS | Pass |
| --- | --- | --- | --- | --- | --- |
| `/` | 2837–2941 / 2851 | 341–477 | 98–153 | 0.000000 | 6/6 |
| `/projects/thorbis` | 2910–2928 / 2917 | 205–411 | 100–112 | 0.000000 | 6/6 |
| `/projects/dits` | 2980–3008 / 2994 | 228–254 | 100–120 | 0.000134 | 5/6 |
| `/blog/nexstar-win-invoice-lose-customer` | 2870–2952 / 2882 | 187–332 | 52–164 | 0.000000 | 6/6 |

Each paired difference below is A2 minus A, in round order. The labels serve
identical bytes; neither is a faster implementation.

| Route | Paired simulated LCP differences, rounds 1 / 2 / 3 (ms) |
| --- | --- |
| Home | -35 / +2 / -22 |
| Thorbis | -4 / +8 / +4 |
| Dits | +13 / +3 / +10 |
| Nexstar | -20 / +13 / -73 |

Transfer sizes include HTTP overhead as reported by Lighthouse:

| Route | Script bytes | Script requests | Document bytes | Font bytes | Total bytes |
| --- | --- | --- | --- | --- | --- |
| Home | 169,865 | 9 | 23,636 | 32,195 | 266,512 |
| Thorbis | 177,727 | 9 | 19,628 | 32,195 | 270,366 |
| Dits | 177,727 | 9 | 27,509 | 42,714 | 288,766 |
| Nexstar | 171,211 | 9 | 48,486 | 42,714 | 303,227 |

## Interpretation and limits

The network and main-thread diagnostics support investigation; they do not
isolate a first-party change that would improve loading. In particular, script
transfer is the largest byte category, but byte share alone does not prove the
cause of a paint delay. Keep the existing framework, chunk, font and request
constraints; do not hide content, delay the preview or preload Mono to obtain a
lower score.

This is one source/build and the default mobile profile on a shared local host.
There is no candidate application change, so no A/B performance claim. Before
claiming an optimization, compare its build against this matched application
with interleaved samples and fresh identical-build controls. Do not attribute
differences from older reports to a particular change, or relabel these reports
as later main commits. They establish neither hosted/real-user p75 nor INP,
desktop/light-theme performance or accessibility conformance.

## Reproduction and integrity

Build the pinned application with Node 24 and the lockfile. Keep the screenshot
key empty for both this build and its runtime; use unique evidence directories
so samples cannot overwrite each other:

```powershell
$env:SCREENSHOTONE_ACCESS_KEY = ""
npm ci
npm run build
$env:THORBIS_EVIDENCE_DIR = "C:/Temp/byronwade-loading/home-r1-A"
node scripts/perf-budget.mjs --route=/
```

Repeat serially for the other three routes and labels using the order above.
Retain nonzero exits and diagnose runtime/cleanup errors separately from budget
misses. A report alone does not prove a command and its cleanup succeeded.

[summary.json](summary.json) pins source, build, runner/budget/lockfile hashes,
profile, sample order, CPU calibration, RAM, command exits and report SHA-256s.
The raw reports retain observed metrics, all failures and resource/request
diagnostics. All report hashes, source/build identities, clean tracked trees,
profiles, empty Lighthouse warnings and exit/failure agreement were checked.
Published JSON uses the repository formatter; parsed contents were compared with
the originals and both original/published hashes are recorded. Full command
logs and RAM snapshots remain in the owner's job folder on C:.

- Home: [1A](home-r1-A.json), [1A2](home-r1-A2.json), [2A2](home-r2-A2.json), [2A](home-r2-A.json), [3A](home-r3-A.json), [3A2](home-r3-A2.json).
- Thorbis: [1A](thorbis-r1-A.json), [1A2](thorbis-r1-A2.json), [2A2](thorbis-r2-A2.json), [2A](thorbis-r2-A.json), [3A](thorbis-r3-A.json), [3A2](thorbis-r3-A2.json).
- Dits: [1A](dits-r1-A.json), [1A2](dits-r1-A2.json), [2A2](dits-r2-A2.json), [2A](dits-r2-A.json), [3A](dits-r3-A.json), [3A2](dits-r3-A2.json).
- Nexstar: [1A](nexstar-r1-A.json), [1A2](nexstar-r1-A2.json), [2A2](nexstar-r2-A2.json), [2A](nexstar-r2-A.json), [3A](nexstar-r3-A.json), [3A2](nexstar-r3-A2.json).
