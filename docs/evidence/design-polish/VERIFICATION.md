# Local verification

Windows, Node 24.21.0, Chrome 155.0.8059.80. Checks run locally and serially;
no GitHub Actions dispatch, production deployment or live contact delivery.
Production browser runners own hidden loopback servers on free ports and stop
them in finally. Each matrix viewport/theme owns a separate Chrome profile.

## Measurement history

| Sample | Source | LCP / 3000ms | TBT / 300ms | CLS / 0.1 | Outcome |
| --- | --- | --- | --- | --- | --- |
| performance-attempt-1.json | `2e2cd54` | 3093.3448 | 358.2184 | 0 | Failed timings; all resource budgets passed |
| performance-attempt-2.json | `7ae886a` | 2906.9852 | 177 | 0 | All original budgets passed |
| performance-attempt-3.json | `67dede7` | 2941.52685 | 275 | 0 | All original budgets passed |
| performance-attempt-4.json | `027e219` | 3072.4818 | 465.8394 | 0 | Failed; a read-only Node inspection overlapped this sample |
| performance-attempt-5.json | `f738e96` | 2959.67665 | 222 | 0 | All original budgets passed, isolated from this lane's other jobs |
| performance-attempt-6.json | `b01c50d` | 3003.52255 | 368 | 0 | Failed timings; all resource budgets passed |
| performance-attempt-7.json | `b01c50d` | 3070.0485 | 361.6505 | 0 | Cold sample on the same build failed timings |
| performance-attempt-8.json | `7eed588` | 2957.52245 | 241.82585 | 0 | All original budgets passed |
| performance-attempt-9.json | `2b7e798` | 2868.0196 | 199.3268 | 0 | All original budgets passed |
| performance-final.json | `8d5d308` | 2912.0421 | 228.3193 | 0 | All original budgets passed |

Samples 1–6 came from `npm run perf:budget`, including its production build;
sample 7 used `node scripts/perf-budget.mjs` on the unchanged sample-6 build.
Samples 8, 9 and final also used the complete `npm run perf:budget` command, after
normally merging main PRs #73, #74 and #75 respectively. Final passed with FCP
935.3614ms, Speed Index 1070.9606ms, 14 requests / 262,186 bytes and no
third-party requests.
The first was followed by a fresh owned server/browser sample on the shared
machine. This is lab budget verification, not a before/after performance gain.
Neither lighthouse-budget.json nor the performance harness is changed.
The `b01c50d` build generated all 48 pages and exited 0. Its two samples have
14 total requests / 262,214 bytes, 9 script requests / 167,914 bytes, 1 stylesheet /
17,325 bytes and 1 font / 49,991 bytes. Compared with sample 5, the same framework
chunks take variable script-evaluation time and style/layout rises from 362.556ms
to 424.876–432.668ms. This does not establish a code-level bottleneck or a speed
gain. Real-user performance is unverified.
The final sample has 87.958ms LCP margin and 71.681ms TBT margin; earlier
failures remain evidence of sensitivity, not discarded outliers.

## Baseline and diagnostic receipts

- `npm ci --no-audit --no-fund`: exit 0; lockfile unchanged. Existing sharp
  install-script approval warnings did not prevent the native module loading.
- Baseline `npm run build`: exit 0, 48 pages, source `6229524`.
- `node scripts/capture-design-polish.mjs before`: completed 84 cases, expected
  statuses and no overflow. Six baseline 404 cases report React error 418.
- `node scripts/verify-design-polish-states.mjs before`: 48 captures; six
  timeout failures recorded as the baseline, not silently counted as passes.
- Extended route probe: `extended-route-probe.json` and two toc-before PNGs
  retain the 27.25px contents-link finding from source `2e2cd54`.
- The open-homepage-form probe on `67dede7` failed because the copy pill's
  background was transparent. `pill-before.json` and its PNG preserve the
  measured failure. The shared pill fix is `027e219`; its repeated state run
  passed in the final controlled suite below.
- `reading-progress-before.json` preserves the critical non-finite ARIA value
  from `027e219` at 768px dark. The fix is `f738e96`.
- `button-link-roles-before.json` records three destination anchors exposed as
  buttons on `f738e96`; the shared render-adapter fix is `93d5e6b`.
- `preview-mobile-before.json` and its PNG preserve the 1px address and
  292.75px toolbar on `f738e96`. Container-based wrapping is `b01c50d`.
- The first expanded state run passed both mobile themes, then timed out when
  returning from the mobile preset to Desktop at 768px. Its fixture returned
  one identical image URL for every capture size, unlike captureImagePath's
  size-specific URL contract. `states-identical-image-fixture-attempt.json`
  preserves the partial run. The fixture now retains width/height in its local
  image URL; this is a harness correction, not an application pass by itself.
- Intermediate guarded after matrix: 96 cases with no overflow, ellipsis or
  axe A/AA violations. It preceded the final placeholder/contents-link changes;
  the final matrix replaces it.
- Initial capture attempts timed out while waiting for network idle on 404.
  Captures now wait for DOM, fonts and settled document bounds. The full-page
  sensor also handles integer PNG bounds versus fractional DOM rectangles
  (the diagnostic writing-index difference was 0.046875px).
- `npm test`: 244 passed, 0 failed, 0 skipped, including main PR #71's stalled
  portfolio-response regressions. Existing typeless-module warnings remain.
- The first development check clicked before hydration and timed out without
  exercising the form. `dev-attempt-1.json` records zero completed checks and
  server cleanup. The hydrated default-command retry below passed; this initial
  attempt is not a pass.
- The second development attempt produced no startup output within 120s and
  completed no checks (`dev-attempt-2.json`). Connection probes confirmed both
  owned attempt ports closed (`dev-cleanup.json`). A separate retry has a longer
  startup allowance; production gates do not inherit this allowance.
- The one-off webpack development fallback failed to compile the existing
  React Scan package's named JSON export. `dev-attempt-3.json` records its
  compile error, zero completed checks and stopped owned server. No dependency
  or configuration workaround was introduced. The repository's actual default
  Turbopack command subsequently passed the smoke check below.

## Static gates

`npm run check` exited 0 on source `67dede7`: Ultracite checked 241 files with
zero findings, `next typegen && tsc --noEmit` passed, and knip reported no unused
files, exports or dependencies. A final lint pass follows generated evidence.

An early type check failed with TS5033/ENOSPC while writing its build-info file.
Only this worktree's ignored `.next/cache` was moved, intact, to the task's
temporary C-drive quarantine and junctioned back. Subsequent type checks passed.
No source, content, other worktree or quarantined cache was deleted. The shared
toolkit's reservation command was unavailable because its configuration points
at a missing unrelated project root; ordinary command receipts were used.

Final source `8d5d308` passed the exact commands `npm run lint` (264 files,
zero findings), `npm run type-check` and `npm run knip`, all exit 0. Its
`npm run perf:budget` includes the passing production build of 48 pages.
Unverified devices, APCA, upstream motion identity and reserved shell work
are enumerated in FINDINGS.md and CHECKLIST.md. Final commits after this source
add only the evidence, findings and capture scripts; their application tree
matches this verified source.

## Final production evidence

- Second review follow-up, after merging main through `8284a3c` (#108) as
  `87fb464`. The reports record that head. Main #103 removed the `reveal`
  classes so pages read without JavaScript; the merge keeps that and this
  pass's borderless spacing and type roles. Earlier runs on `ea0a592` (main
  through #100) had the same counts.
  - `node scripts/capture-design-polish.mjs after`: exit 0, 96 cases, 0 page
    errors, 0 overflow and 0 axe A/AA violations. The six 404 cases return 404
    with no error, so the React #418 exemption is gone and any page error fails.
  - `node scripts/verify-design-polish-states.mjs after`: exit 0, 120 cases,
    6 reading-progress probes, 0 page errors, 0 failed recoveries and 0 axe
    A/AA violations. Every
    page now records `pageerror` and the run fails on any. Main #88 removed
    `public/images/portfolio`, so the preview fixture now reuses
    `images/analysis/figma-analysis.jpg`.
  - `node scripts/verify-thorbis-browser.mjs`: exit 0 after retargeting the #80
    header. Search is checked at every width and the Navigate menu below 640px,
    replacing the retired All products and Support open source panels. Focus
    checks after Escape wait up to 2s for focus to return. Below 640px the no-JS
    check uses the footer navigation, because the header menu needs JavaScript.
    Closing a Ctrl/⌘K search now returns focus to where it was opened (`7e1a701`).
  - `npm run lint`, `npm run type-check`, `npm run knip` and `npm run build`
    exit 0. `npm test`: 879 passed, 0 failed, 0 cancelled.
  - `node --test --test-concurrency=1 tests/rendered/*.test.mjs`: three
    consecutive runs, 70 passed and 0 failed each. Before each run the machine
    was below 70% CPU (67–69%). Earlier attempts under 90–100% load failed only
    in Chrome start/stop plumbing; the PR body lists them.
  - `npm run perf:budget` (budgets unchanged), first sample at 68% CPU: FCP
    948.7ms, LCP 2970.5ms, CLS 0, TBT 237ms, Speed Index 1797.6ms. 15 requests /
    264,572 bytes, 9 scripts / 168,146 bytes, no third-party requests.
- Review follow-up: `node scripts/capture-design-polish.mjs after` exit 0 on
  `8fb6741`, then again on `3ee3365` after merging main #81. Both runs had 96
  cases. The run now fails on any page error. The only recorded errors are the
  six exempt 404 #418 breadcrumb warnings (R01). These sources restore the
  Card border, with the home aside opting out, and move the copy status beside
  its button. Home captures were pixel-identical. Other PNGs that differed only
  on untouched routes (not-found, post, privacy, project) were re-encode noise,
  so they stay at `b01c50d`. `matrix.json` is from `3ee3365`.
- `node scripts/verify-design-polish-states.mjs after` exit 0 on `3ee3365`,
  using the verifier committed in `450d994`: 120 cases, 0 failures. The copy
  confirmation must now appear in a live region outside the button. The
  mocked API sends `githubFailed` as the real route does. The new
  `portfolio-provider-*` states show that a Dribbble, Figma or stats failure
  shows no repository warning. Previously captured state PNGs that changed only
  by re-encoding were kept; `states.json` is fresh.
- `node scripts/capture-design-polish.mjs after`: exit 0, 96 full-page captures
  on `b01c50d`, one h1 and expected HTTP status in every case; no overflow,
  ellipsized labels, button-role destination anchors, undersized main-content
  standalone targets or axe A/AA violations. The six existing 404 hydration
  errors are retained. All sixteen route sheets were visually reviewed across
  the three widths and both themes; reading/related-content and recovery regions
  also received full-size inspection.
- `git diff --name-only b01c50d..7eed588 -- app components`: empty. The subsequent
  main merge changes server Figma requests, tests and architecture notes; it does
  not change the application UI represented by the route matrix.
- Main PR #74 was normally merged as `2b7e798`. Its portfolio API now marks a
  GitHub failure explicitly and prevents caching that transient outcome.
  `git diff --name-only b01c50d..2b7e798 -- app components ':(exclude)app/api/**'`
  is empty. Its response/fallback behavior is covered by the final native and
  rendered regressions; the UI state suite already covers the equivalent
  degraded-empty and failed-refresh outcomes. UI captures are retained with
  their actual source hashes rather than relabeled as a newer build.
- Main PR #75 was normally merged as `8d5d308`. It validates repository fields
  before sorting/caching and handles nullable timestamps. It changes only the
  API, server data/types, tests and architecture notes. The captured route and
  controlled-state UI implementations remain identical; the final build and
  regression gates include the new boundary validation.
- `node scripts/verify-design-polish-states.mjs after`: exit 0 on `7eed588`;
  114 screenshots, 6 fitting-document/scroll/resize probes, 0 failed recoveries
  and 0 axe A/AA violations. The four narrow-preset cases keep their address
  within two lines and successfully restore Desktop. The two contents-link
  cases preserve hash/focus and clear the header. Axe incomplete checks remain
  in each report; they are not claimed as automated passes.
- `npm run test:rendered`: exit 0 on `8d5d308`, 12 passed, 0 failed/skipped. Includes 38
  visible dates on 8 pages, authored dates for 30 content URLs, 42 production
  client chunks, contact button semantics, the dynamic portfolio API and resume
  print/PDF boundaries.
- `node scripts/verify-thorbis-browser.mjs`: first run failed the immediate
  focus assertion at line 478 after interrupted launcher Escape at 768px.
  `verification/browser-attempt-1/` preserves its partial results. The unchanged
  second run exited 0: 8 width/theme cases, 24 panels, 9 routes, 2 no-JavaScript
  pages, live token parity, contrast, footer reveal, contact draft/invalid focus,
  theme/global search and 4× interrupted-motion checks. Its 720ms opening frames
  were inspected. This does not certify hardware feel or remove the intermittent
  focus finding (R05). Final receipts are in `verification/browser/`.
- `npm test`: exit 0, 378 passed, 0 failed, 0 skipped on `8d5d308`, including
  main PRs #71–#75. Existing MODULE_TYPELESS_PACKAGE_JSON warnings remain;
  error messages from mocked delivery failures are expected. No live mail sent.
- Raw-contact scans: `rg -l --fixed-strings 'byron@byronwade.com' .next/static`
  and the same scan with `--glob '*.html'` in `.next/server/app` both returned
  no matches (rg exit 1, the expected empty result).
- Default development smoke on `2b7e798`: exit 0, hidden owned port 62275.
  The actual Turbopack command rendered 404 and hydrated contact, focused the
  invalid name, retained a draft through intercepted pending/503 failure, and
  exercised the dark-theme control and keyboard. Three named checks completed;
  no page errors occurred. Console 404/503 messages are the intentional routes
  and fixture. `after/dev.json` records successful process-tree cleanup.

The legacy verifier permits 24px desktop targets. Its target measurements expose
40px header icons and a 36px search-panel input, explicitly retained under R05
because navigation belongs to the separate lane. The 44px main-content guard
is stricter; no claim of a 44px shared-shell pass is made.
