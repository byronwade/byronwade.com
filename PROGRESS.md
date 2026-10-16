# Projects refresh progress

Mode: Implementation. Work only in this dedicated branch/worktree.

1. Read repository guidance; fetch and merge origin/main (contact + Node 24).
2. Inspect project content, loaders, UI, and public GitHub sources; record conservative facts and unknowns.
3. Add nine current projects (update Thorbis), retain fifteen older entries with status/group changes only; reuse existing UI/tokens.
4. Integrate origin/bot/design-system when available before publication.
5. Run local lint, type-check, knip, build; verify 9 + 15 rendered links and all detail routes; capture desktop/mobile evidence.
6. Review diff and acceptance criteria; write RESULT.md, commit small coherent changes, push branch, open ready PR with sources, evidence, and older-project decision table. Never merge or deploy production.

## Imported design-system plan (aff0151)

Implementation mode, authorized October 16, 2026. Scope: tokens, shared primitives,
homepage, nav, footer, first paint, tablet overlap, focus and structured data.
Reference clone D:/Dev/thorbis-design remains read-only. No content lane edits,
production deployment, or merge.

### Plan

1. Sync main; inspect instructions and Thorbis source/live examples; verify package
   and registry availability and pin source revision.
2. Port tokens/primitives into CSS/Tailwind/Base UI owners; redesign home and shell;
   document provenance and sync in DESIGN.md and docs/THORBIS-DESIGN-PORT.md.
3. Run local lint, types, knip, build, contact regressions, rendered verification,
   axe, no-JS, responsive/theme screenshots and perf:budget. Fix actual failures.
4. Review full diff; record evidence per criterion in RESULT.md; commit/push and
   open a ready PR for Byron. Never merge.

### Loop 1 — reconnaissance

- Branch bot/design-system; starting tree clean.
- Fetched and merged origin/main, fast-forward 38261e9 to c69030b.
- Contact and portfolio changes included; PR #49 not in this merge.
- Thorbis revision 46b6654d02fda9d8fde737395185c3141df52cd2, private manifest.
- Registry/npm verification and live inspection pending.
- No implementation or check claims yet.


## Loop 1
- Started: inspecting guidance and clean branch state. No implementation yet.
- Acceptance: pending research, implementation, checks, counts, screenshots, and PR.

## Decision record
- Operating mode: Implementation; commits, branch push, ready PR authorized by the brief.
- Surface profiles: Showcase index; Evidence detail pages. Reader: prospective client or peer.
- Primary job: see current work first, retain access to every earlier project.
- Dominant object / organizing move: ranked project rows with evidence, split into Current work and Earlier work; existing detail story and artifact layout.
- Reuse: `Section`, `ProjectsIndex`, `IndexList`, `StatusPill`, Markdown and existing tokens. No new primitive, dependency, color, or motion.
- Alternatives: one interleaved list hides the historical boundary; a grid loses index density. Choose two sections composed from the existing list.
- Dependency cone: content/projects, projects route, ProjectsIndex, lib/projects date parsing. Homepage/search/sitemap consume this same loader; portfolio-data is a separate portfolio surface and is unchanged.
- States/input: preserve empty/loading/error paths; native links; long titles wrap at mobile widths; inspect desktop/mobile, light/dark, keyboard and reduced motion.
- Motion gate: no new animation; grouping is static and needs no motion. Existing reveal and hover behavior stays under global reduced-motion rules.
- Performance: grouping stays server-rendered, with no new client boundary or image assets. QA adds small focus/inert fixes inside the existing client navigation. Run local production build and performance measurements; no speed claim.
- Plan: add content and conservative TODOs, preserve legacy bodies/frontmatter except status/featured/flagship; compose two sections; verify schema/counts/preservation and all routes, then capture evidence and publish the PR.
- Mechanical prevention: rendered count/slug assertions and legacy-content comparison recorded as acceptance evidence. No new permanent test framework for this content change.
- Shared toolkit: reserve/run unavailable because roots configuration references a missing legacy path; no shared state or configuration modified. Direct local checks will retain logs and exit codes.
- Baseline: branch clean at 38261e9; fetch + merge origin/main reports already up to date; origin/bot/design-system not published at initial check.

## Loop 1 result / Loop 2 verification
- Committed content and source ledger in 964c7ea. Nine current entries include the existing Thorbis slug; all unknowns have frontmatter TODOs.
- Static preservation assertion passes: 24 Markdown files = 9 Active + 15 Archived. All 15 legacy bodies and all frontmatter outside status/featured/flagship are unchanged against 38261e9.
- Removed build-time publication-date fabrication for undated entries. Added no outcome metrics.
- Index now composes canonical Section + ProjectsIndex twice; titles can wrap on mobile. UI commit pending local checks and rendering.
- Dependency installation is still running; required checks have not yet run. Node 24 will be used for verification.
- Public GitHub research found no description for six entries; conservative public write-up placeholders are intentional, not inferred functionality. See docs/PROJECT_SOURCES.md.
- Remaining: checks, rendered routes/counts, screenshots, final design-branch fetch, RESULT.md, branch push, ready PR.

## Loop 2 checks so far
- `npm ci`: exit 0, installed 653 packages. npm reported 49 dependency advisories; lockfile and dependencies unchanged, no automatic audit fixes applied.
- `npm run type-check` (Node 24.21.0): exit 0; route types generated and tsc completed.
- Initial `npm run lint`: exit 1, 112 errors caused by the pre-existing CRLF checkout. Converted tracked checkout text to LF under existing .gitattributes; restored .gitignore's original bytes because its index blob is CRLF and it is not linted. No unrelated source diff remains.
- `npx ultracite fix app/projects/page.tsx components/project/projects-index.tsx lib/projects.ts`: exit 0, checked 3 files, no fixes applied.
- Fresh lint and knip in progress. Production build and rendered verification next.

## Loop 2 result / Loop 3 final corrections
- `npm run lint`: exit 0, 121 files, no fixes. `npm run type-check`: exit 0. `npm run knip`: exit 0.
- `npm run build`: exit 0; compiled in 39.9s, internal TypeScript took 8.3 minutes, generated 47/47 pages including all 24 project details. Only allowed Figma/Dribbble warnings.
- Development render confirmed both groups and 9 + 15 exact links at desktop/mobile in both themes. Draft screenshots include dev diagnostic overlays and will be replaced with production evidence.
- Development keyboard probe failed to reach Movies; do not treat keyboard verification as passed. Repeat on production, with browser focus and focus trace evidence.
- Render exposed repeated taglines in featured rows: second line now uses the existing excerpt. Long titles wrap. Project links compose the existing focus-ring utility.
- Unknown classifications no longer default to Hobby; six unsupported categories are omitted and the existing detail Badge shows neutral Project. Date input is normalized at the loader boundary. No new primitive, token, or motion.
- Fresh lint/type-check/knip are running after these corrections. Final build, production rendering, performance budget, and PR remain.

## Loop 3 checks
- After final corrections: lint exit 0 (121 files), type-check exit 0, knip exit 0. Implementation committed as fcf2028.
- `npm run perf:budget -- --chrome-flags=--headless=new --output=json --output-path=<local temp>/home-lighthouse.json --quiet`: final-source embedded production build passed (17.0s compilation, 30.4s TypeScript, 47/47 generated pages). Lighthouse portion still running.
- Final source content assertion exit 0: 24 = 9 + 15, all 9 featured, 8 unknown dates absent, 9 TODOs, zero new metrics, all 15 earlier bodies/non-grouping fields unchanged, manifest contains all 24 detail routes. Evidence: docs/evidence/projects-refresh/content-evidence.json.
- Raw owner email scans: zero matches in .next/static and prerendered .next/server/app HTML.
- Latest fetch still has no origin/bot/design-system, and no open PR for that head. Conditional integration remains pending its publication; PR will declare the dependency.
- Hidden dev server stopped by saved process identity; production server on 3000 remains for final evidence. No production deployment.

## Loop 4: verification findings
- Production browser pass: 11 viewport/theme observations, 24 detail URLs with expected SSR headings, 9 + 15 exact index links, no overflow at 320/390/768/1440/2560, desktop Tab/Enter with a visible ring, zero page errors. Eight production screenshots replace the dev drafts.
- Targeted Lighthouse confirmed neutral StatusPill contrast at 4.3:1 and focusable descendants in two closed global panels. Fixed the canonical neutral variant with existing foreground token; closed panels and inactive compact controls are inert; explicit closes restore focus to the opener. No motion values changed.
- Final review corrected the date adapter to preserve date-only calendar days in all 16 dated entries. Native content assertions cover those dates plus unknown dates/categories.
- Lighthouse 12.8.2 removed budget support (upstream #15950); the existing CLI flag is ignored. Manual budget comparisons show misses on / and /projects (LCP ~7.1s, TBT 0.9–1.0s, script/font bytes and requests). No baseline, regression, or performance-improvement claim. Restoring enforcement is recorded in PROJECT_PROFILE.md and docs/PERFORMANCE.md.
- Fresh serial lint/type-check/knip/build running after these small accessibility and date corrections. Browser disclosure open/Escape/focus-return checks and final screenshots will follow.
- origin/main advanced to 8765f9d (contact corrections, #47). After committing this loop, integrate it on this unpublished branch and verify the combined result. origin/bot/design-system remains absent.

## Loop 4 check result
- Serial `npm run lint`, `npm run type-check`, `npm run knip`, and `npm run build`: all exit 0 after the date and disclosure/contrast fixes. Lint checked 124 files; build compiled in 29.2s, checked TypeScript in 28.2s, and generated 47/47 pages.
- Commit these verified corrections, then rebase this unpublished branch onto origin/main at 8765f9d. Recheck the combined result, including the merged contact regressions, before final production evidence and PR publication.

## Loop 5: integration and final contrast correction
- Rebased successfully onto origin/main 8765f9d, including contact PR #47. No other worktree changed.
- Combined branch checks: lint exit 0 (125 files), type-check exit 0, knip exit 0, npm test 39/39 pass, production build 47/47 pass, test:rendered 1/1 pass.
- The full contrast evidence had 25 nodes: the 24 neutral status pills already corrected, plus footer copyright text at reduced opacity. Removed only that opacity suffix, retaining the existing muted-foreground token. Footer email reveal is included in the final browser checks; no contact details or submission behavior changed.
- Running the final local gates after this one-class correction. Final production snapshots, disclosure keyboard flows, date checks, contact reveal, and a targeted accessibility/performance report follow.

## Loop 6: focus lifecycle verification
- Final footer-adjusted branch passed lint/type-check/knip, 39 contact tests, build 47/47, and rendered contact contract 1/1.
- Automatic approval review blocked Stop-Process/restart and detached Start-Process preview launch commands (reason: blocked by policy). The old preview on port 3000 is cached and remains untouched. A tool-managed Node preview on 3117 that closes itself after 180 seconds is allowed; its automatic closure was confirmed twice.
- Refreshed final-source screenshots and all count/date/HTTP checks passed, but the added Escape/focus-return test failed. A focused probe showed all three controls returned to BODY: event-time requestAnimationFrame ran before React's inert-state commit.
- Replaced that race with an `onClosed` callback on the existing useCapsuleMorph lifecycle. Pending focus targets are consumed after the closing DOM state commits. Toolbar button clicks provide their invoker explicitly; shortcuts retain current focus.
- Fresh serial gates are running after the lifecycle correction. Then rerun the focused disclosure probe and full browser evidence, followed by final Lighthouse and publication.
- Local helper directory: C:/Users/bcw19/AppData/Local/Temp/projects-refresh-20261015. `qa-server.cjs` provides the bounded preview; `verify.cjs` captures/asserts the UI; `content-check.cjs` checks content preservation and build routes. Use Node 24.21.0 from C:/Users/bcw19/AppData/Roaming/fnm/node-versions/v24.21.0/installation/node.exe. Runtime JSON evidence is only authoritative after those assertions exit 0.

## Loop 6 result / publication integration
- Source fix 7c5156d passed all four gates, 39 contact tests, and rendered contact contract 1/1.
- Focused disclosure probe passed 3/3. Full production browser assertions now pass: 11 viewport/theme observations, all 24 HTTP headings and dates, current 9 + earlier 15, no overflow, visible Tab/Enter focus with no hidden ancestor, all 6 disclosure open/Escape/focus-return cases across normal/reduced motion, footer email reveal, zero page errors. All eight screenshots were regenerated before revealing contact details.
- The prior harness wait for total network quiescence was inappropriate for background prefetch activity; readiness now checks the destination heading and committed frames. Product assertions are unchanged.
- origin/main advanced to 65596a5 (#48, owner-only contact delivery). It changes only contact action/tests/docs. Rebase this unpublished branch onto it and rerun the local gates before publishing; Projects source and captured UI are unchanged by that integration.

## Loop 7: release evidence
- Rebased onto 65596a5 successfully. The Projects UI and its production screenshots are unchanged by this contact-only integration.
- Final checks now write explicit per-command exit receipts to docs/evidence/projects-refresh/verification-evidence.json; raw local logs remain in the helper directory. This also makes verification resumable if tool output is truncated.
- Screenshot evidence contains eight production PNGs: index and Movies, desktop/mobile, light/dark. README distinguishes full interactive surface checks from the twenty-four server-rendered detail checks.
- Remaining publication steps: final accessibility audit, final content/raw-contact assertions, evidence formatting/review, RESULT.md, branch push, and ready PR. No production deployment or merge is authorized.
- Screenshot/content/browser evidence committed in 88d054c. RESULT.md is a local, deliberately uncommitted handoff with pending items explicit.
- Final receipt run passed lint, type-check, knip, and 39 contact tests. One repeated build attempt encountered the preceding build's lock; the receipt runner waited for its release and retried. The active retry reached TypeScript checking. At roughly nine minutes its worker CPU was still advancing (13.875 CPU seconds, responsive); no build error had been reported. Do not claim that retry passed until session 9334 returns its exit result.
- Session 9334 completed successfully: build exit 0 (1129 seconds; internal TypeScript 11.4 minutes), 47/47 pages, including 24 project details; rendered contact test exit 0, 1/1 pass. All six final commands have exit-0 receipts. Fresh content assertions also exit 0 against the final build. This was slow verification on the shared host, not a source failure.

## Loop 8: published design-system head
- Final fetch found origin/bot/design-system at aff0151, based on main c69030b. Rebased this still-unpublished branch onto it as requested. Preserved the imported design-system plan above alongside this lane's progress; the only conflict was PROGRESS.md.
- aff0151 contains the design migration plan, not a token/component port. c69030b includes the portfolio server/client boundary fix and its server-only dependency plus rendered bundle regression. Project UI/content are unchanged by this integration; the PR still depends on the eventual design-system implementation PR.
- Installing the merged lockfile, then rerunning all local gates with release-stream.cjs (streams build progress and preserves prior receipts). RESULT.md remains local rather than adding an unrelated replacement of main's portfolio report to this PR.
- The pre-integration Lighthouse accessibility CLI ended with a Windows EPERM error deleting its temporary browser profile. Do not call that CLI invocation passed. The bounded preview closed with exit 0. Final audit will use an explicitly owned browser session without temporary-profile deletion.
- Merged-lockfile npm ci completed: 649 packages, exit 0, same 49 existing advisories. No audit fixes or dependency edits from this lane.
- Shared-kit snapshots explain the host constraint: at 04:43:50 UTC only 1.3 GiB RAM / 2.5 GiB commit headroom remained; at 04:49:27 UTC this recovered to about 22 GiB / 24 GiB. No other worktree/process was changed. Post-integration lint passed; remaining serial checks continue in session 96782.
- The saved accessibility report itself is 100/100 with no runtime error. Its CLI still exited 1 during Windows temporary-profile deletion; keep those two outcomes distinct.
- Integrated aff0151 result: lint, type-check, knip, build (47/47), 39 contact tests and 2 rendered contracts all exit 0. Refreshed full browser harness exits 0; eight screenshots, 11 observations, 24 SSR headings/dates, 9 + 15 links, keyboard/focus/reveal all pass. The owned-browser Lighthouse audit exits 0 with accessibility 100/100; scans find zero raw contact matches across 44 client assets and 40 prerendered HTML files. Final evidence lint checks 129 files, exit 0. Bounded preview closed, exit 0.
- Final remote inspection found the actual Thorbis implementation at 30cceba (tokens/primitives plus homepage/navigation), after the earlier plan-only checkpoint. Commit this passing checkpoint, then rebase this still-unpublished branch onto 30cceba and verify the actual reskin. Do not use the earlier screenshots as final Thorbis evidence.

## Loop 9: actual Thorbis implementation
- Rebased onto published implementation 30cceba. Conflicts were shared toolbar focus, footer, and lifecycle documentation. Kept Thorbis composition/styles; retained the already-tested pending focus target and opener capture; reused Thorbis's existing onClosed hook instead of adding a competing callback. The new footer already removes the old reduced-opacity copyright text.
- Merged fetched main f84a344 (cache refresh secret/regressions), cleanly. Its expanded native regressions will run alongside contact tests. No environment setting was changed.
- Read DESIGN.md v3, the updated project profile, and port provenance. Projects remains a Showcase index; detail remains Evidence. The same two-group organizing move and native links compose existing Thorbis-skinned owners. No project-local palette, primitive, or animation.
- Corrected Thorbis Design's provisional association with the old Design repository using the newly published site port notes. This is existing site copy, not private-clone research; TODOs retain unknown dates, public upstream preference, broader adoption, and outcomes.
- The design contract now accurately distinguishes budget targets from the removed Lighthouse enforcement flag. Neutral status text preserves the existing measured correction through semantic aliases.
- Pin this verification to the integrated design implementation 30cceba and main f84a344. Rerun local gates and actual-reskin screenshots/accessibility/performance before publication. Later design-system revisions remain the explicit PR dependency.
- Removed the project arrow's old hover translation to match the canonical Thorbis index's color-only feedback. No new motion or style scale was introduced.
- Integrated e78deca passed lint, type-check, knip, 70 native tests, production build (47/47), and 2 rendered contracts. Full browser assertions passed: 9 + 15, all 24 detail HTTP headings/dates, 11 viewport/theme observations, eight Thorbis screenshots, keyboard/disclosure focus/reveal, zero page errors. Owned Lighthouse completed with accessibility 100/100; bounded preview closed, both exit 0.
- Independent read-only review found no Projects content/grouping blocker, but confirmed an inherited light status contrast regression: the port adapter skipped the upstream light status block. Corrected extraction to include the early status/info/accent and layer-shadow roles, preserving supported shadow refinements and the generated dark palette. Added a missing-role guard; no bespoke values or form edits. Corrected stale shell/theme/home references in ARCHITECTURE.md.
- Rerun final local gates and captures after this token correction, plus contact validation and success-role contrast checks without sending email. Retain the explicit design-system checkpoint/dependency; no unrelated upstream chasing.
- The first repeat lint caught formatting in newly generated JSON evidence. Applied the existing formatter; repeat lint, type-check, knip and 70/70 native tests pass. No rule was weakened. Closure review confirms the status-token finding is resolved; final build and rendered validation remain pending below.
- Final source 42f239c passes all six commands: lint/type-check/knip, native tests 70/70, build 47/47 (133 seconds), rendered contracts 2/2. Fresh content assertions pass 24 = 9 + 15, strict earlier-content preservation, all 24 generated detail routes, all TODO/date/category checks. Refreshing browser and contact-contrast evidence on a bounded 300-second preview at 3117; no email submission or production deployment.
- Final browser refresh exits 0: all 11 observations and 24 detail HTTP/SSR checks, eight screenshots, six disclosure cases, native Tab/Enter, contact reveal, no overflow or page errors. Visually inspected the mobile index plus desktop dark and mobile light Movies captures. Both contact forms pass rendered validation and existing success-role contrast in light/dark (4.58:1–6.01:1); zero POST requests. The helper waits for the existing color transition to settle before recording failure feedback.
- Final owned-browser Lighthouse exits 0: performance 67, accessibility 100, best practices 96, SEO 100. Manual budget comparisons still miss LCP (4211ms > 3000), TBT (820ms > 300), script/font/total bytes and requests; no budget pass, improvement, or regression claim. Initial diagnostics remain separately labeled. Lighthouse 12 ignores the existing budget flag; enforcement restoration remains follow-up.
- Final evidence aggregation exits 0; scans find zero raw owner contact matches in 47 client assets and 40 prerendered HTML files. Evidence formatted with the existing formatter; final `npm run lint` checks 133 files, exit 0; `git diff --check` clean. Read-only review and closure review have no remaining blocking finding.
- Commit the refreshed artifacts, push only bot/projects-refresh, and open a READY PR to main with sources, the 15-project recommendation table, screenshots and receipts. Publication commits use [skip ci] to honor local-only checks (GitHub documents skip instructions for push/pull_request); no workflow or repository setting is changed. The PR depends on design-system checkpoint 30cceba; no open design-system PR found at preparation.

## Publication result
- Pushed only bot/projects-refresh at 438f6f6; remote head matches. READY PR https://github.com/byronwade/byronwade.com/pull/53 is OPEN, isDraft false, base main, head bot/projects-refresh, MERGEABLE. No merge or production deployment performed.
- PR body includes all nine source rows, all fifteen editorial recommendations, eight production captures, exact local check results and known performance misses. It explicitly depends on the integrated design-system implementation/PR.
- GitHub repository-level dynamic CodeQL ignored the skip instruction and started after PR creation (event dynamic, refs/pull/53/head). Cancelled only this PR's run 38856335244; confirmed completed/cancelled. No remote check used for acceptance and no security setting changed. The tracked CI is manual; default CodeQL setup needs owner reconciliation with the local-only policy.
- Final bounded QA preview closed automatically, exit 0. Earlier port-3000 preview remains untouched after automatic approval review blocked cleanup/restart and a detached launch; final evidence came from the allowed bounded preview.
- Publication notes and RESULT.md stay local to avoid another source push solely for handoff notes and another automatic CodeQL run. Published application/source and evidence are complete at 438f6f6; checks reference source 42f239c, with only evidence/docs changed afterward.


## Loop 10: PR #53 integrates publication-date policy (#54)
- Mode: Migration or cleanup; branch merge, push, PR update and conditional squash authorized.
- Fetched origin/main c48f33207bae3a20e9ccec92f7dd065d1539daf1 into published head 438f6f6; no rebase or force push.
- Only conflict: project title wrapping. Retained branch min-w-0 layout for long current-work titles; kept main safeFormatDate year rendering and all publication-date changes/tests.
- No content/projects file changed by integration. All 24 pre-merge entries must remain, including all 15 earlier projects.
- Reused canonical markdown-utils calendar formatter; removed obsolete yearOf through the main merge. No new components, motion, dependencies or palette.
- Existing uncommitted handoff notes preserved before merge; original RESULT read before merging and superseded by this integration report after verification.
- Shared-kit advisory reservation failed on a configured missing unrelated directory; configuration unchanged. Native exit/output evidence will be captured.
- Verification pending: Node 24 lint/type-check/knip/build/native tests/rendered tests, original content/browser/contrast/accessibility helpers, full diff and remote gates. No merge authorization gate is yet claimed passed.
- Serial verification at integrated source 94a3ff7: lint exit 0 (18s), type-check exit 0 (66s), knip exit 0 (25s), npm test exit 0 (113/113, including 43 publication-date regressions). Build and rendered/browser checks pending.
- Preservation assertions passed, but the first diagnostic receipt write failed because Next build cleared its temporary .next directory. Repeated using a durable tracked evidence destination; no application check failed.
- All six Node v24.21.0 commands passed at 94a3ff7: lint 18s, type-check 66s, knip 25s, npm test 113/113 (27s), build 47/47 pages (125s), test:rendered 3/3 (7s). Date rendered regression is included. Build used existing Figma/Dribbble fallbacks.
- Durable integration-preservation.json confirms main ancestry, all 24 files byte-identical to 438f6f6, and canonical date owner/tests identical to c48f332. Existing browser helpers running on a bounded local production preview at 3117.
- content-check.cjs exit 0: 24 = 9 + 15, 15/15 original bodies/non-grouping frontmatter preserved against 38261e9, 16 known dates retained, 8 absent dates retained, 24 detail routes built. verify.cjs exit 0: 11 viewport/theme observations, 24 HTTP/SSR headings/dates, eight screenshots, native Tab/Enter and six disclosure focus-return cases, footer reveal, zero overflow/page errors. Visually inspected refreshed Projects mobile/light and Movies desktop/dark.
- All five original final helpers completed with exit 0. Fresh Lighthouse accessibility 100/100, no failed applicable audits; raw-contact scans zero in 47 client assets and 40 prerendered HTML files. Performance diagnostics still miss budgets (see JSON); no budget or speed claim. Local VERDICT PASS; final evidence formatting/lint before push.
- Bounded QA preview closed itself, exit 0. Refreshed evidence formatted with local Biome (7 files, 4 corrected); final npm run lint exit 0, 136 files, no fixes. Full merge/source/evidence diff reviewed; git diff checks clean. Fresh main still c48f332. Commit evidence, push only bot/projects-refresh, refresh #53 body, then inspect latest remote checks before squash.

## Loop 11: publication and remote merge gates
- Pushed only bot/projects-refresh at 4d3d0f7083954be54516da4290540c8a5c89c13d. Remote branch matches; main remains c48f332 and ancestry passes. Application source is identical to verified 94a3ff7; later commit is docs/evidence only.
- Updated #53 body with actual merge note, conflict policy, fresh local results and immutable evidence links. PR reports MERGEABLE. Local verdict PASS.
- Latest-head automatic CodeQL, GitGuardian and Vercel checks initially pending. Cursor checks are NEUTRAL; CodeRabbit and Socket checks successful. No workflow dispatch, cancellation, admin override or merge yet; waiting for actual terminal results.
- GitHub push also reported 89 default-branch dependency vulnerabilities; dependency files are unchanged in this lane and this is not a failed latest-head check. Recorded for separate dependency work.
- Final publication outcome notes remain local after the evidence push to avoid another docs-only push restarting all remote checks.


## Imported #52 blog-draft progress (historical)

# AI agents blog draft progress

Operating mode: Implementation. Stay in `bot/blog-post` in this worktree.

Plan: sync origin/main; read all six existing posts and content consumers; write
one 900–1500 word first-person draft; add minimal centralized draft exclusion;
verify local rendering with screenshots and production exclusion; run local
lint, type-check, knip, and build; review the diff; push and open a ready PR.

Acceptance: valid existing frontmatter plus `draft: true`; 900–1500 visible
words; dev slug renders; production listing hides the draft; all author TODOs
listed in the PR; checks pass. No production deployment, PR merge, external messages,
new design primitives, or edits to other worktrees.

Existing candidates: `lib/blog.ts` owns loading; `/blog`, RSS, sitemap, route
generation, and search consume it. No draft filtering exists. Extend that owner
instead of adding route-specific filters. Reuse existing Markdown rendering.
Dependency cone: one new post, blog loader, focused native Node regression,
and these local handoff notes. No visual or motion changes planned.

Loop 1: merged origin/main at c69030b, including contact and Node 24 changes.
Read all six posts and required guidance. Draft written (1159 whitespace-delimited
body words, excluding frontmatter and HTML comments); three author TODOs.
Extended the canonical blog loader to hide drafts outside development, sharing
that boundary with list, direct lookup, and slug consumers. Removed duplicated
frontmatter parsing and raw slug enumeration. Added native Node regression
coverage for development, production, test, explicit false, and absent draft.
No UI, token, or motion changes. Existing reading surface: prose dominant,
workflow sequence; inspect desktop/mobile, light/dark, keyboard/reduced motion.

Toolkit reservation and job launcher both failed on a missing unrelated configured
root. Do not change toolkit config; use ordinary hidden local command execution.
Dependencies absent in this worktree; npm ci running. Design-system branch is not
yet on origin; recheck before opening the PR. Next: commit/push, run checks and
rendered verification, then record results here and in RESULT.md.

Loop 2: merged origin/bot/design-system at aff0151. This revision contains the
adoption plan only, with no token/component changes yet. Its intent is preserved
below. Check for a newer revision before opening the PR; branch already pushed,
so use merge (never rebase/force-push). The only merge conflict was this handoff.

Design-system lane handoff: scope is tokens, shared primitives, homepage, nav,
footer, first paint, tablet overlap, focus, and structured data. Thorbis source
revision 46b6654d02fda9d8fde737395185c3141df52cd2, private manifest. Its plan:
inspect source/live examples and registry; port through existing CSS/Tailwind/
Base UI owners; document provenance; run local checks, accessibility, no-JS,
responsive/theme screenshots and perf budget; open a ready PR without merging.
No source implementation or verification was included in the fetched revision.

Loop 3: npm ci completed. Native tests: 40/40 pass; draft regression fails on
the original loader as expected. Type-check passed. Lint initially exposed
CRLF checkout drift; normalized local files to indexed LF and refreshed the
index, leaving only intended source changes. Test loops now use Promise.all;
lint passes (125 files, zero findings). Knip running.

Browser caught author comments rendered as text by ReactMarkdown. Repository
search found no authored raw HTML outside the new comments. Extend canonical
Markdown with its skipHtml option, keeping comments out of the reading surface
without enabling HTML execution. Next: repeat dev browser pass, rerun relevant
checks, production build, HTTP visibility verification, and full diff review.

Loop 4: dev browser pass succeeded: 1148 rendered body words; one h1, six h2s;
TODO comments invisible; no horizontal overflow at 1440x1000/light, 390x844/dark,
768x1024/light, 2560x1440/dark. Reduced-motion enabled; skip-to-main followed by
Tab and keyboard Back to writing both work; no page errors. Screenshots captured
and inspected. Initial browser assertions were corrected to allow existing HTML
classes and native skip-link sequential-focus behavior; no application changes
were required for those two checks. All review server trees stopped after use.

Design-system implementation a5347a8 arrived during verification and is now
merged (no code conflicts). Read its updated DESIGN.md, profile and port map.
It ports tokens, core primitives, Inter and layout font wiring; no package changes.
Re-running all four local gates against this revision, then refreshing screenshots
and production exclusion checks. A prior preview displayed October 15 for date-only
October 16 frontmatter because the existing formatter uses the host timezone;
record this date-formatting issue for a separate site-wide fix.

Loop 5: integrated-tree checks passed: lint (126 files, zero findings),
type-check, knip, npm run build (39 generated pages), npm test (40/40).
Build emitted the allowed Figma credential/Dribbble fallback warnings. A shell
runner typo invoked npm build once; corrected to npm run build, which passed.
Repeated dev browser verification after the token/font merge: all four viewports,
themes, keyboard paths, hidden comments, 1148 rendered words, and no page errors
passed. Refreshed both committed review screenshots to the Thorbis token revision.
Build/preview jobs are local and hidden; none use other worktrees.

Production runtime visibility, rendered tests, generated-contact scans and a
Lighthouse budget check are in progress. Port 3000 is occupied, so do not run the
hardcoded perf:budget script against it. Use the same build and Lighthouse budget
on this worktree's own production server at 127.0.0.1:3212 instead. No performance
improvement claim is being made. Next: collect actual runtime/budget results,
write RESULT.md locally, finalize PR body with all three TODOs, push and open a
ready PR to main; never merge.

Final loop: ready/open [PR #52](https://github.com/byronwade/byronwade.com/pull/52)
All four acceptance criteria PASS. Runtime production checks exclude the draft
from /blog, /feed.xml, /sitemap.xml and / (all 200). Published post returns 200.
Draft URL shows Page not found with noindex and no article content; Next streams
this fallback with HTTP 200, so do not describe it as a literal HTTP 404.
Production browser had no page errors. Added a production-listing screenshot.
PR body includes all three author TODOs verbatim (programmatically compared).

Supplementary Lighthouse did NOT pass: valid 12.8.2 report, LCP 7247ms, TBT 802ms,
total 1195897 bytes, script 402666 bytes, font 188800 bytes; request counts 59 total
and 23 scripts exceed the existing budgets. CLI exit 1 was EPERM during Chrome
temporary-folder cleanup. Left denied folder alone. No runtime error in report.
The installed CLI ignored budget-path (no budget config/audits); compared measured
values directly to lighthouse-budget.json. Record homepage performance and a real
budget-enforcement sensor for the design/performance owner, outside this post.

RESULT.md contains criterion evidence, scope, limitations, and VERDICT: PASS for
the requested draft acceptance. Keep it uncommitted as a local handoff; PR body
contains the review evidence, performance findings and date-format caveat.
Source gates and browser screenshots all use integrated a5347a8. All local review
server trees stopped. Next: Byron reviews prose and the three TODOs. Never merge.

## PR 52 Codacy and merge follow-up

The current request authorizes fixing Codacy, pushing, and squash-merging after
Codacy succeeds and all real checks pass. It supersedes the earlier no-merge
handoff above. Operating mode: Implementation; this worktree only, no force push,
admin merge, rule suppression, or changes to the post's `draft: true` flag.

Loop 1: fetched origin and merged main at c48f332, including cache-secret and
publication-date fixes. No merge conflicts. Codacy check 116821667172 reports six
issues and zero annotations. Its public issue API identifies exactly six added
findings: MD034 in this log, three comment-empty-line-before occurrences, one
rule-empty-line-before, and one at-rule-empty-line-before in app/globals.css.
Fixed the URL with a Markdown link and inserted the five required blank lines.
Updated the canonical token generator to preserve both marker-comment fixes on
regeneration. No CSS declaration, token value, selector, motion, or UI changed.

Decision: reuse existing lint configs, CSS ownership, generator, and native Node
tests; no new abstraction or package. Dependency cone: stylesheet whitespace,
generator template, and handoff notes. Verify markdownlint, lint, type-check,
knip, build, tests (including blog drafts), rendered tests, whitespace-only CSS
equivalence, full diff, and unchanged draft. Then push and poll checks before
the authorized squash merge. Existing design review findings remain separate
from these six Codacy findings and will be recorded in RESULT.md.

Toolkit reservation failed on a missing unrelated configured root; no toolkit
configuration or quarantine changes. Native command exits provide evidence.
The pre-existing local RESULT.md report is preserved and extended locally.

Loop 2: lint passed (130 files), knip passed, and all 114 native tests passed,
including blog drafts, cache-refresh, contact, and content dates. Markdownlint
passed all six root documents with zero issues. A temporary local Stylelint 14
config selecting the three reported spacing rules reproduced all five CSS
findings: 22 warnings before, 17 after, with none at the five Codacy locations.
The other 17 warnings predate this fix; this is a targeted reproduction, not a
claim that the whole stylesheet is Stylelint-clean. No lint config was committed
or weakened. CSS whitespace equivalence and unchanged-post assertions passed.
Production compilation passed; independent type-check and build type validation
are still running. Wait for actual exits before publishing.

Loop 3: type-check passed; build passed (39 pages, existing Figma/Dribbble
fallback warnings). Rendered tests passed 3/3, checking contact semantics, 39
dates across eight pages, and 26 client chunks. Raw-contact scans found no
matches in client output or prerendered HTML; no draft slug in prerendered HTML.
The post remains unchanged with `draft: true`. Full source diff reviewed;
git diff --check passed. Only this log, five CSS blank lines, and two generator
template blank lines are staged for the fix; the prior local RESULT report is
preserved outside the commit. Next: commit, normal push, poll Codacy and all
real checks, then squash merge using the verified head SHA without admin.


## Loop 12: integrate main again after #52 lands
- Main moved during remote checks to 0e9f5cd (#52 blog draft plus independently published Thorbis token port); stopped before merge and fetched it.
- Repeated a normal merge. Resolved four files: preserve both progress logs; retain the measured light status/accent/shadow corrections and missing-role guard; retain main's CSS/generator blank-line fixes; retain matching port provenance.
- Kept #52 blog draft, production exclusion, skipHtml rendering and fixture regressions unchanged. Kept #54 calendar ownership and all 24 Projects entries unchanged.
- New integrated source needs a complete fresh serial gate/helper run. Prior source 94a3ff7 evidence remains historical, not acceptance for this merge. No workflow was dispatched and no main push/force push/admin/deploy was used.
