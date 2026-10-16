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
