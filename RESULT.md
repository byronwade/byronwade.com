# Projects PR #53 integration result

**Mode:** Implementation / integration. Authorized merge, evidence writes, branch
push, PR refresh and conditional squash merge. Stayed in this worktree; no hobby
worktree access, force push, admin override, older-project deletion or deployment command.

**Decision:** Reused completed normal merge `76bc359b1e7c3592b3979fa852ec26b95e751582`
of main `0e9f5cd9d04d67a3d49aa3e505cd138aabef5547` (#52), after #54. Fresh
`git fetch origin` followed by `git merge --no-edit origin/main` returned already
up to date; main ancestry exits 0. No additional application edit was needed.
The merged resolution retains main's blog draft/draft exclusion, skipHtml,
calendar-date owner/regressions and CSS/generator whitespace fixes, alongside
the branch's measured light-token corrections and generator guard.

**Preservation:** All 24 Projects files are byte-identical to pre-integration
`438f6f6`. Original content helper passes 9 current plus 15 earlier, all 15 older
bodies/non-grouping frontmatter unchanged against `38261e9`, 16 known dates
preserved, 8 unknown dates absent, 9 author TODOs, and all 24 detail routes built.
All 19 selected main blog/Markdown/date/test files are byte-identical to main.
See [preservation evidence](docs/evidence/projects-refresh/integration-preservation.json).

**Reused / created or extended:** Reused canonical formatter, project loader,
shared list/primitives/tokens, native tests and existing temporary browser helpers.
Extended acceptance evidence and reports only in this turn; no application
abstraction, dependency, primitive, token or animation was created.

**Recursive cleanup / mechanical prevention:** No new source defect or duplicate
path was exposed by integration; canonical date and draft owners remain single.
Existing date/draft regressions and rendered sensors are preserved. Restoring
actual performance-budget enforcement remains the highest-value next sensor;
no unrelated migration was added.

**Local verification:** Node v24.21.0, integrated application source
`76bc359b1e7c3592b3979fa852ec26b95e751582`. Exact receipts retain historical runs separately.

| Command | Result |
| --- | --- |
| `npm run lint` | PASS, exit 0, 9s |
| `npm run type-check` | PASS, exit 0, 81s |
| `npm run knip` | PASS, exit 0, 56s |
| `npm test` | PASS, exit 0, 32s |
| `npm run build` | PASS, exit 0, 113s |
| `npm run test:rendered` | PASS, exit 0, 8s |

Build generated 47/47 pages. Native tests: 114/114; rendered tests: 3/3,
38 dates across 8 pages and 26 production client chunks.
[Command receipts](docs/evidence/projects-refresh/verification-evidence.json).

**Design evidence:** Existing Showcase current-first project index and Evidence
case-study detail composition retained. Browser helper passes 11 observations,
24 detail HTTP/SSR heading/date checks, exact 9 plus 15 index links, eight
screenshots, no overflow at 320/390/768/1440/2560 widths, light/dark, native
Tab/Enter and visible focus, six normal/reduced-motion disclosure Escape/focus
return cases, footer reveal, and zero page errors. Inspected refreshed mobile
light Projects and desktop dark Movies captures. Contact feedback contrast
passes both forms/themes (4.58:1–6.01:1), invalid-field focus returns, zero POSTs.
No new motion; existing reduced-motion path exercised. Lighthouse 12.8.2 accessibility passes 100/100 with zero failed applicable
audits. Raw-contact scans pass: zero matches in 47 client assets and 40 HTML files.
Fresh performance is 62, best-practices 96, SEO 100. Manual budget pass is false:
LCP 4212ms > 3000ms, TBT 1208ms > 300ms, plus script/font/total bytes and requests.
These remain diagnostics on a shared host; no causal performance claim.

**Remaining findings / unrun checks:** Existing performance-budget misses and
Lighthouse 12's ignored budget flag remain follow-up; no speed or budget-pass
claim. No new dev-mode run, fault-injected loading/empty/error test, screen-reader,
Safari, real-device, frame-by-frame motion or live email delivery test for this
merge-only work. Production harness rerun instead. Toolkit advisory reservation
failed on a missing unrelated configured path; configuration untouched, native
command exits provide evidence. No GitHub Actions workflow was dispatched.

**Publication:** Pending fresh evidence completion, normal branch push, PR body
refresh, MERGEABLE status and acceptable remote checks. Conditional squash only.

VERDICT: IN PROGRESS
