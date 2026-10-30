# Analytics runtime replay integration, October 28, 2026

One real Lighthouse run verifies the opt-in replay and asset exporter with the
installed dependencies. It **fails** the existing LCP limit: 3144.5708ms > 3000ms.
Every other timing, byte and request-count limit passes. No limit was changed,
no sample was replaced, and this is not a performance improvement or a baseline.

- Runner: `aec3b5417821a6769f8b0efdd4a47a66bccb3c59`, clean tree.
- Application inputs: unchanged from `c26be394e2548cbfda1ff3cc64105a3f4e8adf1d`.
- Keyless webpack build: `jaRk_dX-L9SP9_Pe0Mxu_`, 57/57 static pages.
- Node 24.21.0, Chrome 155.0.8059.85, Lighthouse 13.5.0.
- Route: `/projects/dits`; default mobile simulated profile; existing 45s browser
  interval and 5s blank settle. Exact profile and CPU calibration are in the report.
- Before-run available RAM: 12,014,739,456 bytes. After-run snapshot:
  3,934,650,368 bytes. These are endpoint observations, not a continuous minimum;
  other shared-host workloads were not paused. No timing conclusion is drawn.

[The report](route-budget_projects_dits.json) retains the capture time, source
URLs, sizes and SHA-256 hashes of both unmodified public scripts. They returned
200 with JavaScript bodies; the report's network diagnostics show the page-view
sink returning 204. Both runtime activation flags were verified; three telemetry
requests were intercepted by report time, with zero off-origin HTTP attempts.
The actual-runtime search check separately verifies real page-view and measured
vital payloads in phone/light and desktop/dark states: 3 passed, 0 failed. Two
negative-control runs (both handlers bypassed, then Speed Insights alone) each
failed 0/3 as expected; original test bytes were restored and the check passed again.

This condition differs from ordinary local `next start`, whose platform scripts
return 404. Replay removes automation signals so analytics executes, adds browser
interception overhead, serves decoded bodies without hosted compression/CDN timing,
and answers telemetry locally. Do not compare this single sample to historical
404-baseline samples as an optimization. Matched interleaved A/B and fresh A/A
controls under the same condition remain necessary for a loading-policy claim.

Reproduction, after a keyless production build and reviewed local capture:

```powershell
$env:THORBIS_EVIDENCE_DIR = "C:/path/to/job/runtime-report"
node scripts/perf-budget.mjs --route=/projects/dits --analytics-runtime=C:/path/to/job/runtime-snapshot --save-assets
```

The original report, capture, command receipt/log and actual/simulated trace
exports remain in hobby job `byronwade-com-1028-180956-codex-2` on C:. Only this
reviewed report is published; fetched third-party scripts, raw browser logs and
trace files stay local. Native regression checks protect replay provenance,
missing/changed inputs, default behavior, activation/egress failures and cleanup.
