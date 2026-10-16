# Projects PR #53 integration result

**Mode:** Migration or cleanup. Authorized writes stayed in the Projects dependency cone;
branch merge, commits, push, PR update and conditional squash merge are authorized.
No main push, force push, branch/content deletion, deployment command or other worktree edit.

**Decision / conflicts:** Merged origin/main `c48f332` (#54) into the published Projects
branch, producing `94a3ff7e2f20b57a1d79aed8ab61f45b2102571c`. The sole conflict was
title wrapping in `components/project/projects-index.tsx`: kept the branch's `min-w-0`
wrapping for long current-work titles and main's `safeFormatDate` year rendering.
The canonical formatter, all date-policy callers and both new date regression files
are retained. Main is an ancestor; all 24 project files are byte-identical to
pre-merge `438f6f6`. No earlier project or current-work entry was removed.

**Reused / extended:** Existing calendar formatter, project loader/list, tokens,
primitives, native tests and temporary browser helpers. No new application concept,
dependency, component or motion was needed. Only merge resolution and evidence/docs
were added in this lane. The existing Showcase current-first list and Evidence detail
composition remain the organizing moves for prospective clients and peers.

**Recursive cleanup / prevention:** Main's obsolete project `yearOf` formatter is gone;
calendar ownership remains in markdown-utils. All affected callers use the same owner.
#54's 43 timezone/date regressions and rendered date sensor are preserved. No duplicate
helper or competing date path was introduced. Existing performance-budget enforcement
remains the highest-value follow-up sensor.

**Local verification:** Node v24.21.0; integrated application source `94a3ff7`.

| Command | Result |
| --- | --- |
| `npm run lint` | PASS, exit 0; 18 seconds |
| `npm run type-check` | PASS, exit 0; 66 seconds |
| `npm run knip` | PASS, exit 0; 25 seconds |
| `npm test` | PASS, exit 0; 113/113 tests, 27 seconds |
| `npm run build` | PASS, exit 0; 47/47 pages including 24 detail routes, 125 seconds |
| `npm run test:rendered` | PASS, exit 0; 3/3 tests, 7 seconds; 38 dates across 8 pages and 26 client chunks |
| `git merge-base --is-ancestor origin/main HEAD` | PASS, exit 0 before publication |
| `git diff --check`; `git diff origin/main...HEAD --check` | PASS before evidence commit; repeated before push |

Exact command receipts and source identity are in
[verification-evidence.json](docs/evidence/projects-refresh/verification-evidence.json).
[integration-preservation.json](docs/evidence/projects-refresh/integration-preservation.json)
records main ancestry, the 24-file comparison and unchanged date owner/regressions.
The original `content-check.cjs` passes: 9 current + 15 earlier; 15/15 earlier bodies
and non-grouping frontmatter unchanged against `38261e9`; all 16 known calendar dates
and 8 unknown dates preserved; 24 detail routes built; 9 TODOs retained.

**Design evidence:** Existing `verify.cjs` passes: 11 viewport/theme observations,
8 screenshots, all 24 detail HTTP/SSR headings and dates, no overflow at
320/390/768/1440/2560 widths, visible focus and native Tab/Enter, six disclosure
open/Escape/focus-return cases under normal/reduced motion, footer reveal and zero
page errors. Inspected refreshed Projects mobile/light and Movies desktop/dark images.
Existing `contact-contrast.cjs` passes for both forms in both themes (4.58:1 to 6.01:1),
including invalid-field focus; zero POST requests and no email delivery attempted.
The motion gate introduces no animation; existing reduced-motion paths were exercised.

**Final audit / scans:** All five original helpers (`content-check.cjs`, `verify.cjs`,
`contact-contrast.cjs`, `accessibility.cjs`, `final-evidence.cjs`) completed, exit 0.
Lighthouse 12.8.2 accessibility: 100/100 with zero failed applicable audits.
Raw-contact scans: zero matches in 47 client assets and 40 prerendered HTML files.
Fresh Lighthouse scores: performance 61, accessibility 100, best-practices 96, seo 100.
Manual budget pass: false. Misses: LCP 4.78s > 3s, TBT 970ms > 300ms; script/font/total bytes and script/total requests.
These remain diagnostics on a shared host, with no causal performance claim.

**Remaining findings / limits:** Build used existing Figma/Dribbble fallbacks;
third-party freshness is not established. Prior performance-budget misses are documented;
Lighthouse diagnostics are not a budget pass and no speed improvement is claimed.
No dev-mode rerun, empty/error fault injection, screen-reader, Safari, real-device,
frame-by-frame motion or live email test was added for this merge-only change.
The existing production harness was rerun instead. Shared-kit advisory reservation
failed because its configuration references an unrelated missing directory; configuration
was not changed. Native command exits/output provide this lane's evidence.

Final evidence formatting: `npm exec -- biome format --write docs/evidence/projects-refresh`
exit 0; repeated `npm run lint` exit 0 (136 files, no fixes). The bounded QA preview
closed itself with exit 0. Only documentation/evidence changed after verified source.

**Publication:** Pending branch push, PR body refresh and remote merge-gate inspection.
Local required gates and project browser assertions: PASS. Squash remains conditional
on MERGEABLE and no real remote check failures.

VERDICT: PASS
