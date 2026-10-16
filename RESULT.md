# Thorbis Design adoption result

Mode: Implementation; repository writes, scoped commits and branch pushes authorized.

Decision: a faithful CSS/Tailwind/Base UI **port**, not an installed Thorbis package.
Source: byronwade/thorbis-design at 46b6654d02fda9d8fde737395185c3141df52cd2.
The upstream manifest is private, no registry manifest was found, and npm search returned [].
The reference checkout was read-only. See docs/THORBIS-DESIGN-PORT.md for provenance/sync.

## Acceptance evidence

| Criterion | Result | Evidence |
| --- | --- | --- |
| 1. Lint, type-check, build | PASS | npm run check (lint, types, knip) and production build pass; 47 static pages generated. |
| 2. Desktop/mobile, light/dark comparison | PASS | Four side-by-side comparisons at 1440/390; browser.json proves 12 live color roles match, Inter 32px headings, 13px nav and 14px card titles. |
| 3. Old palette/raw colors | PASS | Native design-contract sensor and grep over migrated UI/docs show no old palette or raw color outside the source token block. |
| 4. No-JS first paint | PASS | Native SSR contract and 1440/390 no-JS browser screenshots; heading and ancestors visible, no opacity-zero content entrance. |
| 5. Axe/contrast/keyboard | PASS | Eight home cases plus 24 open shell states: zero serious/critical axe findings; AA text, enabled field boundary contrast and 44px mobile targets. Focus clears sticky header; Escape/shortcut focus return, reduced motion and contact validation/reveal pass. |
| 6. Performance budget | BLOCKED | largest-contentful-paint: 3266.371 > 3000 |
| 7. Design ownership/sync docs | PASS | DESIGN.md and docs/THORBIS-DESIGN-PORT.md adopt Thorbis, pin source, map adapters and document AA deviations. |
| 8. Ready PR distribution/pin disclosure | PASS | [PR #56](https://github.com/byronwade/byronwade.com/pull/56), isDraft=false, main base, explicitly states port and source commit; unmerged. |

## Verification

- npm test: 117/117 pass (contact/cache/date/design contracts; fixture transport).
- npm run check: lint, type-check and knip pass.
- npm run build: pass, via npm run perf:budget; expected optional Figma/Dribbble warnings allowed.
- npm run test:rendered: 4/4 pass; 38 dates across eight pages and 41 client chunks checked.
- node scripts/verify-thorbis-browser.mjs: pass; eight width/theme cases, 24 panels, nine routes, two no-JS widths, contact draft/error/reveal, measured interactive targets, shortcut and reduced-motion checks.
- Hidden npm run dev smoke at the font-preload checkpoint: 768px light/dark, HTTP 200, no overflow/runtime errors; captured process tree stopped. The final production matrix covers consolidated font delivery.
- Token/font adapter idempotence, reference cleanliness, source asset SHA checks, contact leak scan and git diff --check recorded with final evidence.
- npm run perf:budget: FAIL; Lighthouse 12.8.2, default mobile simulated profile, unchanged lighthouse-budget.json.

## Measured dependency cleanup

Reused Base UI APIs, nav-config, content loaders, contact actions, obfuscated contact,
search and theme hooks. Ported canonical tokens/primitives; no new runtime dependency.
Removed obsolete preview/Framer/hover-card/tooltip and unused query-state provider.
Deferred contact/breadcrumb code and colocated notifications with contact consumers.
Shared initial primitive code; removed oversized favicon shadowing; preserved originals.
Consolidated font ownership in CSS. Contact delivery and published routes stay intact.
No content/blog, content/projects or shop edits entered the branch diff. Main #52/#53 content, grouping and draft rules are retained.

Mechanical prevention: source pin guard; named-type merge sensor; raw-color/favicon/
rendered preload contracts; reproducible browser/contrast checks; budget runner exits
nonzero for exceeded limits. No production deployment. Repository CI is manual-only;
GitHub default-setup CodeQL started automatically on PR creation despite that file.
Cancellation was requested for run 38869318654; no Actions were manually dispatched.
Verification receipts above are exclusively local.

## Design evidence and limits

Showcase home/Shared shell: compact experience beside current Thorbis work, then
qualified proof and writing. Both themes at 1440, 768, 390 and 320px, with focus,
empty search, invalid contact, touch targets, source tokens and first paint checked.
Navigation is immediate; no content entrance animation. Occasional retained panels
use source timing, trigger anchoring, four-times-slower inspection, interruption and
focus return; reduced motion snaps. Signature font still loads on resume.

Local Chromium viewport emulation is not a physical-device, Safari or screen-reader
certification. Empty home content arrays were not forced; empty search and invalid
contact states were exercised. Existing dependency alerts and optional React Scan diagnostic updates
remain outside this design port. There is no real-user production speed claim. The tested application includes main
through 20d8527. Main #55 landed afterward in its screenshot/API cone; PR #56 is
mergeable with it, but those changes are outside this local test receipt.

Remaining acceptance blocker: largest-contentful-paint: 3266.371 > 3000. Final TBT is 229ms against its 300ms limit. The trace concentrates script CPU in the Next main-app bundle; its contribution to LCP requires targeted bootstrap/RSC profiling. Further performance work is required before merge; no budget relaxation or metric substitution was used.

VERDICT: BLOCKED unchanged mobile performance budget
