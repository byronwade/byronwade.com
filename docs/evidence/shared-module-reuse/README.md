# Shared code is downloaded once

Page scripts repeated module factories already in the shared-primitives chunk.
The existing sharing rule now selects eligible modules used by at least two of
the same home, layout and not-found entries, then removes their extra copies
from every consumer. The separate classname-sharing rule is removed. No package,
UI composition, animation or budget was added.

The emitted-script regression fails on the original build and passes after the
change. It parses webpack registration objects with the existing TypeScript
parser, checks every prerendered page, and requires detectable shared factories.
It covers the canonical shared chunk; repeated source modules outside
that owner remain outside this change.

## Release payload comparison

This comparison rebuilds main `cf37b247cfcbf4551d66646b89b620c43cfa9790` with its original
configuration, then the combined product source `58bc2d28bb026a9a5b76d343b3fe2217c78505a6`
with the chosen configuration. The original product tree differed only by the
added test; that test is outside application compilation. The chosen source was
restored byte-for-byte before its release build. The baseline build is
`p6Qs64resRq9-gAlmDBy-`; the release build is `EvZmf0vKoQuwDSFXSGJL8`.

Numbers are sums of each initial modern script gzipped at level 9; the nomodule
polyfill is excluded. These differ from Lighthouse's HTTP transfer measurements.

| Prerendered page | Before gzip bytes | After gzip bytes | Saved bytes |
| --- | ---: | ---: | ---: |
| `index.html` | 170,816 | 170,743 | 73 |
| `projects/thorbis.html` | 193,159 | 183,147 | 10,012 |
| `projects/dits.html` | 193,159 | 183,147 | 10,012 |
| `blog/nexstar-win-invoice-lose-customer.html` | 174,159 | 170,830 | 3,329 |
| `contact.html` | 185,503 | 181,427 | 4,076 |
| `resume.html` | 186,292 | 179,529 | 6,763 |

Across all 39 prerendered pages, script gzip and initial request counts never
increase. Repeated registrations of factories from the selected shared chunk
fall from 951 to zero. The JSON retains
every page and the input-artifact hashes. Existing rendered checks retain the
glyph, server/client and lazy-interaction boundaries.

## Matched timing investigation

The timing set is pinned separately to application source `6531bdf` and candidate
`cd2e1fd`, before clipboard recovery PR #165. Their exact commits, build IDs,
Chrome/Lighthouse versions, settings and raw-artifact hashes are in
[summary.json](summary.json). These timings are not relabeled as measurements
of the combined release.

Three rounds per source ran home, Thorbis, Dits and Nexstar serially. Each sample
used a fresh production server and Chrome, the unchanged 45-second pre-launch
settle and five seconds on a blank page, and default simulated mobile/light
(412 x 823, 150ms RTT, 1638.4Kbps, 4x CPU). Available RAM was checked before each
launch. Other workloads on the shared Windows host were left alone.

Ranges and medians retain full precision in JSON. This table rounds milliseconds:

| Route | Before LCP median | After LCP median | After maximum TBT | After budget pass |
| --- | ---: | ---: | ---: | ---: |
| `/` | 2899 | 2904 | 103 | 3/3 |
| `/projects/thorbis` | 3214 | 3074 | 121 | 0/3 |
| `/projects/dits` | 3217 | 3060 | 1471 | 0/3 |
| `/blog/nexstar-win-invoice-lose-customer` | 3198 | 3215 | 209 | 0/3 |

Both matched sets passed 3/12 budgets and failed 9/12 on detail-page LCP. The first
after Dits sample additionally failed TBT at 1471ms. Its benchmark index was
1130 versus a baseline range of 2168.5-2653. The trace records longer tasks and
substantial non-executing thread time; the cause remains unproven. The failure
was retained. No sample was replaced and no gate was weakened.

One declared follow-up collected three Dits samples on original product source
and three on the exactly restored candidate. Every initial-script hash matched
its corresponding earlier build. Original TBT was 139-222ms and restored TBT
112-171ms, so the spike did not recur in those six controls. Each configuration
also produced one budget-passing LCP sample with unchanged bytes: 2736ms on the
original and 2573ms on the candidate. All thirty measurements remain: eight
budget passes, twenty-two LCP failures, including the one additional TBT failure.

Home's third after sample changed from a 21-node to a nine-node simulated LCP
graph compared with the earlier home sample. Its tail omitted hydration-related
requests after the observed paint cutoff, while transferred bytes stayed fixed.
The representative project trace terminates through framework loading,
evaluation and hydration-triggered requests; its fonts finish earlier. The
diagnostic graph and observed paint times are kept separately from budget LCP.
See [Lighthouse throttling](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md)
for the distinction between observed and simulated metrics.

The measured outcome is reduced bytes and duplicate factories. These samples
support no site-wide latency, field p75, INP or budget-conformance claim. All
original limits, including ten scripts, remain unchanged. The rejected
preload/hide/delay probes in [PERFORMANCE.md](../../PERFORMANCE.md) remain rejected.

## Decisions, limits and reproduction

- A first probe accepted ownership by one root entry. It expanded the shared
  set and grew standalone global-error script gzip by 1281 bytes. It was
  rejected before timing. The selected rule preserves the two-entry criterion.
- Read-only production HTML and static JS on deployment
  `dpl_8YCASVTbhKmLiGecWabVfn3UXREV`, tied to `6531bdf`, also repeated 33 shared
  factories. An initial protected URL redirected to Vercel login and was
  excluded. Deployment logs confirmed the existing npm/webpack command.
- Local Vercel Analytics and Speed Insights requests return 404; capture
  resolution returns 500 with the provider disabled. Those responses are retained.
  Hosted scripts were parsed without executing page JS. No paid capture or live
  email was sent; no deployment or repository setting was changed.
- Diagnostic graph recomputation uses the installed Lighthouse 13.5.0 computed
  API only in the job harness. It adds no runtime import or public abstraction.

For reproduction, install the pinned source with Node 24 and `npm ci`, then
`npm run build`. Run `node scripts/perf-budget.mjs --route=<path>` for each route
and sample with a unique `THORBIS_EVIDENCE_DIR` on C: and the screenshot provider
disabled. Keep nonzero exits and original profiles. Compare built page scripts
with `node --test tests/rendered/shared-modules.test.mjs`; run the complete
rendered suite serially for interactions. The scheduler job
`byronwade-com-hobby-1022-1939` retains full Lighthouse reports, traces, network
logs, computed node timings, source assertions and command receipts. The summary
records their hashes and the unchanged runner/budget hashes.
