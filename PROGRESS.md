# Thorbis Design adoption

## PR #56 LCP and merge follow-up — October 16, 2026

Final application: be1b8ba410476a9abbe5dc0ce82f2bff3d808928. Full npm run perf:budget PASS: LCP
2896.842ms, TBT 175ms, FCP 965.614ms, CLS 0, Speed Index 1083.628ms; all
resource limits pass (168117 script bytes / 9, 262435 total bytes / 14).
Native 149, check, build, rendered 8 and final production browser matrix PASS.
Zero contact/client-secret matches; original 20 font hashes match. No budget or
profile change. Evidence and PR update prepared; push/status/squash merge next.


Current authorization supersedes the historical review-only handoff below: integrate
main, fix the unchanged performance budget, push, and squash-merge #56 after all
local gates and browser checks pass. No force push, admin merge, Actions dispatch,
shop/content deletion, production environment or domain changes are authorized.

- Operating mode: Implementation. Showcase home and Shared delivery infrastructure.
- Target: LCP below 3000ms; every existing timing/resource budget, native test,
  lint/type/knip/build/rendered gate passes; 1440/390 light/dark and actual theme
  toggle verification retained; record merge SHA in RESULT.md.
- Dominant object and organizing move stay unchanged: experience beside current
  product, followed by qualified proof and writing. No composition or motion work.
- Existing candidates inspected: root font preload/global faces, HomeHero,
  HomeActions, SiteLayout, shell controls, production splitting and budget runner.
- Reuse/configure: test Next's built-in inlineCss rather than introduce a custom
  critical-CSS pipeline. The diagnostic report flags the stylesheet as blocking;
  observed heading paint is 636ms, simulated LCP 3311ms. Inlining trades stylesheet
  caching for a larger HTML response; it is an experimental Next option.
- Dependency cone: delivery configuration, rendered delivery contract, browser
  evidence and performance/acceptance documentation. Content and tokens unchanged.
- Normal merge 2bb59e7 includes origin/main 5d3b47a without conflicts.
- Integrated baseline `npm run perf:budget` fails: LCP 3443.108ms, TBT 559ms;
  all resource budgets pass. Baseline log is retained locally. No profile/budget
  changes. Verification remains serial on Byron-Home.
- Shared toolkit snapshot works; reservation/job runner fail on a stale configured
  root. Configuration was left untouched; ordinary commands retain local logs.
- Verification plan: same budget command, npm test/check/build/test:rendered,
  production browser matrix, development home smoke, secret scan and full diff.
- CSS inlining experiment rejected and reverted: LCP 3620.651ms, TBT 923ms,
  document transfer 55209 bytes (baseline 19498). No configuration change retained.
- Closed search eagerly imported Base UI Input and its field graph. Extracted the
  existing search/query/selection behavior into a deferred DockSearch feature;
  the toolbar still owns the capsule, shortcuts, close and return focus. Reused
  existing dynamic-import, Input, icon, navigation and morph contracts. A status
  placeholder handles cold loading, and mounted search focuses its input.
- Removed initial closed-search filtering and its synchronized active-state
  effect; reopening naturally resets query/selection. Empty-result ArrowDown
  retains a valid zero index. No new package, token, wrapper primitive or motion.
- Native suite now includes main #55: 146/146 pass. Initial check caught the new
  harness's await-in-loop; switched to its existing serial helper. Rechecking.
- Deferred search rejected and reverted: only 2691 initial script bytes saved;
  LCP 3216.046ms/TBT 379ms still fail. The extra loading lifecycle was not retained.
  A browser-only content-visibility probe did not skip these nearby lists. Font
  range and headline-wrap probes did not show a repeatable sufficient CPU gain;
  none were applied. Original UI, fonts, tokens and shell behavior remain intact.
- Emitted-module inspection found the actual payload defect: 45 Phosphor glyph
  definitions in one 112823-byte module (25253 gzip bytes), including off-route
  preview glyphs. The canonical facade's factory calls prevented independent
  module placement across routes. Split wrappers into individual glyph modules;
  keep the same pure public facade and one shared weight/display-name factory.
  No caller migration or icon change is required. The webpack sharing rule now
  shares the factory rather than forcing the complete facade into initial code.
- Added an actual initial-script boundary sensor to the existing rendered home
  tests. It fails against the prior build, identifying the shared chunk containing
  preview glyphs. New source passes lint, strict types and knip. Rebuilding and
  measuring the same budget next; no PASS claim yet.
- The first split build exposed the other ownership defect: the named sharing
  group combined modules used by any two initial route entries. Its initial
  scope is now the real app/page + app/layout overlap. Independent glyph modules
  alone cannot fix a group that eagerly merges unrelated routes. All 60 original
  glyph/weight/display-name mappings match exactly; no API or caller changes.
- Next's client graph still retained facade re-exports in the intermediate build.
  Its installed SWC barrel transform proves the pure facade maps directly to each
  glyph module. Enabled the existing optimizePackageImports capability for that
  facade; no custom loader, dependency, runtime behavior or measurement change.
- Icon-boundary regression now passes (5/5 rendered tests). Retry after one
  Chrome launch failure measures LCP 3189.390ms/TBT 225ms, script 195200 bytes;
  all gates except LCP pass. The initial bundle no longer contains preview glyphs.
- Emitted module inspection also identifies duplicated Next link/helper modules
  and unused common-barrel clients in home/page + layout. Apply the same existing
  import optimizer to the pure common facade and include Next in the bounded
  sharing group. This removes duplicate/bootstrap work without changing any
  navigation, component, token, font, profile or budget contract. Re-measuring.
- Common/Next pruning measures LCP 3137.888ms, TBT 360.028ms, script 185991 bytes.
  The root not-found entry, always present on home, still duplicates roughly 7KB
  of link/button helpers. Include that exact root entry and canonical Button in
  bounded sharing; unrelated route entries remain outside it.
- The trace also shows a whole-document style invalidation from header clearance.
  Repository search confirms only html scroll padding consumes the variable.
  Set native scrollPaddingBlockStart directly and remove the inherited custom
  property. Keep the same no-JS 16rem/6rem defaults and live measured clearance;
  keyboard/reflow behavior remains under browser verification.
- Root-entry sharing measures LCP 3061.690ms/TBT 407ms, script 177681 bytes.
  Glyph/bundle boundary checks hold, but the budget still fails.
- Static launcher/toolbar SVGs now render in their existing server feature owners
  and pass as ReactNode slots to client interaction leaves. Public component
  imports and props stay unchanged; all search/theme/capsule/dismissal logic is
  preserved. No deferred-open lifecycle or font compromise is introduced.
  This boundary owns a concrete invariant: static glyph definitions stay off
  the initial client graph. Extended the rendered sensor to cover these glyphs,
  with the remaining client contact-action glyph as a positive control.
- Latest npm run check passes lint, strict types and knip (214 files). Measuring
  the exact production command before the final full browser and release matrix.
- Server slots measure LCP 3035.974ms/TBT 343.675ms, script 168227 bytes, total
  262595 bytes, CLS zero. The remaining miss is explicit; no acceptance PASS yet.
  Run the full browser matrix, then replicate the unchanged budget before more
  source changes. All abandoned experiments remain absent from the application.
- Full production browser verification passes: eight width/theme cases with
  actual toggle round trips, 24 open panels, four keyboard widths, nine routes,
  two no-JS views, contact draft/invalid/reveal and reduced motion. Serious/critical
  axe findings are zero; contrast, mobile targets and focus checks pass. Fresh
  desktop-light and mobile-dark screenshots reviewed.
- Serial unchanged-budget replications: 3068.041ms LCP / 305ms TBT (fail), then
  2960.946ms LCP / 273.351ms TBT (all limits pass). Same source/profile/budget.
- Canonical npm run dev (Turbopack) passes HTTP 200 at 1440/390, dark/light via
  actual toggles, Inter 32px, no overflow or page errors. An internal-startup
  harness had returned 500; that discarded probe was not the canonical command.
  The owned canonical dev process tree exited and port 54669 no longer listens.
  Optional React Scan/react-grab version warning remains outside scope.
- Final full build-and-budget attempt: build passes all 47 pages; LCP 2755.594ms
  passes, TBT 358.5ms fails. Record workstation timing variability; keep application
  and measurement settings frozen. Finish remaining release checks and repeat the
  complete command before publication. No merge yet.
- Two more full unchanged runs remain inconsistent: LCP 3074.292ms/TBT 284ms,
  then LCP 3076.917ms/TBT 334ms. Do not publish a selected passing sample.
- Compose React Suspense boundaries around the synchronous server-rendered header,
  home action and footer contact leaf. These preserve their existing HTML while
  enabling selective hydration of separate interaction regions. No new loading
  UI, timer, dependency or measurement setting. Verify no-JS navigation/heading,
  context/theme behavior, and the full browser matrix again if measurement passes.

Implementation mode, authorized October 16, 2026. Scope: tokens, shared primitives,
homepage, nav, footer, first paint, tablet overlap, focus and structured data.
Reference clone D:/Dev/thorbis-design remains read-only. No content lane edits,
production deployment, or merge.

## Plan

1. Sync main; inspect instructions and Thorbis source/live examples; verify package
   and registry availability and pin source revision.
2. Port tokens/primitives into CSS/Tailwind/Base UI owners; redesign home and shell;
   document provenance and sync in DESIGN.md and docs/THORBIS-DESIGN-PORT.md.
3. Run local lint, types, knip, build, contact regressions, rendered verification,
   axe, no-JS, responsive/theme screenshots and perf:budget. Fix actual failures.
4. Review full diff; record evidence per criterion in RESULT.md; commit/push and
   open a ready PR for Byron. Never merge.

## Loop 1 — reconnaissance

- Branch bot/design-system; starting tree clean.
- Fetched and merged origin/main, fast-forward 38261e9 to c69030b.
- Contact and portfolio changes included; PR #49 not in this merge.
- Thorbis revision 46b6654d02fda9d8fde737395185c3141df52cd2, private manifest.
- Registry/npm verification and live inspection pending.
- No implementation or check claims yet.

## Design decision and loop 2 — port implementation

- Audience: clients, employers and peers; web desktop/tablet/phone.
- Profiles: Showcase home, Shared shell/primitives. Pattern: compact claim and
  proof; dominant object is Byron's work, current Thorbis product beside experience.
- Alternatives: full-height editorial title (rejected: hides work and repeats
  original whitespace defect); card-only marketing grid (rejected: weak reading
  hierarchy); chosen compact opening, evidence lists and quiet product panel.
- Reuse: existing Base UI primitives, contact action/sheet, search, theme hook,
  nav-config, project/blog loaders. Port existing primitive recipes, do not add kit.
- State plan: static home content has no loading dependency; existing empty list
  messages, contact validation/error/success retained. Light/dark, keyboard, touch,
  reduced motion, 1440/768/390/320 and no-JS will be exercised in browser.
- Motion gate: frequent navigation immediate; hover color only; no content
  entrances. Occasional shell panels retain source-token motion and reduced path.
- Package search returned []; no registry.json outside node_modules. Port chosen.
- Token generator reads upstream only, namespacing source colors and preserving
  local semantic aliases. Inter replaces Geist Sans; Geist Mono retained.
- Header now in flow with navigation's own row below desktop. Inactive toolbar
  panels inert, compact controls inert while open, footer has stable contrast.
- First meaningful plan commit aff0151 pushed. Implementation checks pending;
  npm ci still running. Toolkit reserve failed on a missing configured root.

## Loop 3 — static and rendered verification

- Port commit a5347a8 pushed, source remains 46b6654. Lint passed before new
  verification scripts. Type-check passed; knip passed after restoring existing
  GitHub social preview and removing an unused public NavItem type.
- npm test: 39/39 passed. npm run build: passed (39 routes; expected external
  Figma/Dribbble warnings). npm run test:rendered: 3/3 passed including new SSR
  homepage content sensor and existing contact/portfolio contracts.
- Browser initial light/1440: no axe violations; h1 at y=164, Inter 32px, no
  overflow. Live token equality caught upstream's additional theme corrections
  before the primary light block; generator now reads all explicit theme blocks
  and excludes legacy fallback hex values. Rebuild/comparison pending.
- Resting launcher/toolbar elevation removed to match source header tools.
  Inter wordmark adopted; personal signature loads only when resume needs it.
- Perf command now owns a hidden production server on an isolated port and
  enforces timing/byte/request budgets rather than only printing Lighthouse.
- Added browser matrix and raw-color/first-paint regression sensors. Formatting
  briefly normalized unrelated CRLF files; git diff contains no changes in them.

## Loop 4 — measured performance and final responsive fixes

- Initial enforced Lighthouse: FCP 1080ms, LCP 6639ms, TBT 609ms, CLS 0;
  403339 script bytes/23 requests, 54 total requests/1064920 bytes. Failed gates
  were preserved in performance-before.json; no budget was raised.
- Diagnostics confirm 26 other/RSC requests, 23 script requests, 17 initial JS
  tags and two 239KB favicon requests. Home was prefetching multiple routes and
  rendering an unused contact form dependency graph and a Framer footer preview.
- Disabled speculative prefetch on home/shared navigation. Contact code now loads
  on first intentional open, then stays mounted across closes to preserve drafts.
- Thorbis footer uses ordinary social links; removed unused hover preview, its
  sole framer-motion dependency, unused hover-card and icons (confirmed by knip).
- Testing existing Next webpack production bundling against the 10-script budget;
  development remains Turbopack. This is a measured comparison, not yet a claim.
- Desktop/390/768 light and dark passed axe, contrast and source color parity.
  320 focus check exposed smooth-scroll delay; global keyboard scrolling is now
  native/instant. Full matrix will be rerun on the final build.
- Main advanced with cache revalidation security PR #51; fetched and merged
  f84a344. PR #49 remains open; its shell accessibility intents are retained.

## Loop 5 — performance convergence

- ad06c2b pushed with deferred UI, plain footer links, dependency cleanup, and
  production webpack/shared UI configuration. Both source and release checks
  remain local; development stays on Turbopack.
- Intermediate webpack run: 252721 script bytes (down from 403339), 25 requests
  (down from 54), CLS .0115; LCP 5876ms/TBT 460ms/script count 17 still failed.
- Closed search and launcher bodies now render only while open. Removed repeated
  tooltip providers in favor of source-style native title/aria labels, and
  derive toolbar footprint from source control/spacing tokens rather than
  synchronized measurement state. Sticky header clearance follows its real
  wrapped height; global search stays visible from the bottom of a page.
- Two 239KB favicon requests dominated remaining bytes. Original app/public
  512px assets decode to identical pixels (SHA256 raw pixel proof recorded in
  session). Reused the existing 32px favicon for app/icon.png and existing 192px
  manifest icon. Original full-size images and every image URL remain available.
- Explicit panel closes and email reveal hit areas are 44px; panel bounds fit
  320px. Final source remains under verification; no PASS claim yet.

## Loop 6 — complete browser coverage and type correction

- Final candidate browser run completed all eight width/theme cases with zero
  serious/critical axe findings, AA text contrast, focus paths and no overflow.
  No-JS 1440/390, nine existing routes, contact draft/validation/reveal and reduced
  motion theme interactions passed. Screenshot review then exposed a type defect:
  cn() treated named Thorbis text sizes as colors and dropped them. Extended its
  existing theme and added native plus computed browser assertions; rerunning.
- The small favicon now has a single app-route owner; the exact full-size asset
  is archived, and a native sensor prevents route shadowing and asset bloat.
- Latest measured candidate: 341372 total bytes / 19 requests, 249576 script
  bytes / 13 requests, LCP 3648ms, TBT 392ms, CLS zero. Still fails LCP/TBT/script
  count. Testing default small-chunk suppression while keeping Next framework
  groups; no budget relaxation.
- Corrected README's obsolete design ownership and the source sync guard/order.

## Loop 7 — dependency ownership and menu states

- Merged main publication-date PR #54 (c48f332); retained both date contracts and
  Thorbis profile rules in the one documentation conflict. Content files untouched.
- With default tiny chunk groups suppressed, the production run passed all byte
  and request limits: 8 scripts / 288590 bytes, total 14 requests / 380255 bytes.
  LCP 3668ms and TBT 456ms still fail; no PASS claim or budget change.
- Inspection found zero query-state consumers beyond the root adapter. Removed
  the unused provider/package, moved notifications to the actual contact forms,
  and deferred breadcrumb popover code on home (where no breadcrumb exists).
- Extended browser evidence to all three open shell panels. Manual OKLCH contrast
  caught launcher labels at 3.2/3.9:1; removed diminished text opacity and used
  neutral Thorbis selected roles. Search now uses canonical Input with a 44px
  target and mobile 16px text. Initial launcher slot matches its true height.
- Evidence writers now pass generated JSON through existing Biome formatting,
  preventing a successful measurement from leaving a failing release lint gate.
- Read-only toolkit snapshot: 18GB RAM available, 30GB commit headroom; concurrent
  workstation activity exists. Local lab timings will be reported with that limit.

- Local `npm run check` passed (lint, type-check and knip) for the dependency
  ownership checkpoint. Final production/browser/performance run remains pending.

## Loop 8 — font discovery and final state checks

- Latest production measurement passes all gates except LCP: FCP 1554ms, LCP
  3353ms, TBT 280ms, CLS zero, 8 scripts / 245561 bytes, 336944 total bytes.
- Read the emitted HTML and Next font manifest: no font preload, empty manifest.
  Chrome confirms Inter discovery waits until after CSS. Porting the exact
  upstream Inter files/faces and OFL with explicit root preload; this also makes
  source font identity exact. Retaining next/font for deferred Mono/signature.
- All eight width/theme cases and all 24 open launcher/search/support states
  passed axe, AA text contrast and bounds. Keyboard focus clears the sticky
  header; No-JS 1440/390 passed. Slow-motion capture is being repeated with
  unit-aware duration parsing (the CSS value was seconds, not milliseconds).
- Final interaction harness used an unsupported combined Control+k key name.
  Corrected to down/press/up; production UI was not the failure. Full run pending
  on final font build, including source comparison screenshots.
- Search anchor navigation now uses native auto scrolling, including reduced
  motion. Browser evidence always closes Chrome even if evidence formatting fails.

## Loop 9 — measured shared primitives and release gates

- Explicit source-font preload improved FCP to 1107ms. LCP 3636ms / TBT 476ms
  still failed on that run; retained exact source fonts, did not relax budgets.
- Bundle inspection confirms 43 duplicate modules between homepage and layout:
  175341 uncompressed bytes / 47692 gzip bytes, dominated by icon and class
  helpers. Added one initial-only, min-two-consumer primitive chunk; async
  contact/breadcrumb code stays outside that sharing group. Measurement pending.
- All 116 native tests pass. Latest `npm run check` passes lint, type-check, knip.
  The preceding lint failure was CRLF in the generator after a comment edit;
  formatted it with existing Biome, without suppressions.
- Development smoke passed via hidden `npm run dev` at 768px in light/dark:
  HTTP 200, Inter 32px heading, no overflow or runtime errors. Captured process
  tree was stopped by PID plus creation identity; port 3197 no longer listens.
  React Scan reports an outdated optional react-grab diagnostic, outside scope.
- Input/textarea rims now use the source marker for >=3:1 non-text boundary
  contrast, an explicit AA adaptation. Browser sensor checks enabled fields as
  well as text. Contact invalid state contrast is included.
- Source fallback font chain is copied exactly. Regenerated slow-motion evidence
  uses 720ms (four times 180ms); reduced-motion assertion accepts the CSS global
  0.01ms snap. Full final production matrix remains pending.

## Loop 10 — consolidated font delivery

- Isolated repeat with no overlapping local verification: FCP 1085ms, LCP 3387ms,
  TBT 278ms, CLS zero, 203166 script bytes / 9 requests. Only LCP still fails.
  Next bootstrap/hydration dominates the remaining script trace; no claim that
  machine contention alone explains the LCP miss.
- Removed the last separate blocking font stylesheet by porting the remaining
  exact Geist Mono files/faces and OFL into the CSS owner. Existing resume OTF
  stays a deferred site identity face. Removed unused lib/fonts.ts and root
  font-loader classes; all callers and font aliases migrated.
- Contact invalid-state check found dark email boundary contrast 2:1 from an
  old alpha danger border. Input/textarea now retain solid source danger borders
  in both themes. New production browser run will verify this case.
- Current lint/type/knip pass; production compilation/type generation pass. Final
  build/performance, full browser matrix, rendered contracts and report pending.
- After this candidate, any remaining budget miss will be recorded explicitly;
  no budget changes, metric substitutions, CSS experiments or broad runtime
  migration will be used to manufacture acceptance.

## Loop 11 — latest main integration

- Fetched main 20d8527: #52 draft filtering and #53 project refresh, which also
  carried an early Thorbis port snapshot from this lane. #49 remains open.
- Preserved all incoming blog/project content, draft filtering, current/earlier
  grouping, Markdown skipHtml, source ledger and project-lane evidence. No direct
  edits to content/blog, content/projects or shop.
- Resolved overlapping design owners in favor of the later source-token, font,
  AA/focus, sticky-header and loading fixes already verified here. This prevents
  old font loaders, unused nav icons and removed Framer preview paths returning.
- The project lane independently recorded ignored Lighthouse budget flags and
  preexisting misses. Preserved that fact and its evidence links; our runner
  explicitly restores enforcement by comparing all report values with budgets.
- Rechecking the merged tree. Evidence before this merge remains a checkpoint;
  final screenshots, route counts, tests and performance will be refreshed.

- Merged-tree verification: 117 native tests pass; lint/types/knip pass; production
  build generates 47 pages. All four rendered contracts pass (38 dates/eight
  pages, 41 client chunks). Protected content-lane diff remains empty.
- Tailwind default transitions now point to Thorbis fast/ease tokens; browser
  asserts these values explicitly under no-preference motion and separately
  checks reduced motion. Removed the ignored Lighthouse budgets config field;
  default simulated profile and all direct budget assertions are unchanged.
- Latest enforced budget run: FCP 1001ms, LCP 3270ms, TBT 391ms, CLS zero,
  203010 script bytes/9 requests, total 294244 bytes/14 requests, one stylesheet.
  LCP/TBT remain BLOCKED. Final integrated browser evidence is being refreshed.


## Loop 12 — final touch targets and review handoff

- Final target audit found small search rows, launcher theme control, social/legal
  targets and standalone home links. Expanded these controls to 44px on mobile,
  retained source type/color roles, and added browser geometry assertions for
  home, open panels and invalid contact. Skip link has an opaque source surface.
- Latest `npm run check` passes; production build generates all 47 pages. The four
  rendered contracts pass (38 dates/eight pages and 41 client chunks).
- Final enforced `npm run perf:budget` exits 1: LCP 3266.371ms exceeds 3000ms.
  All other limits pass: FCP 944.186ms, TBT 228.907ms, CLS zero, Speed Index
  1424.852ms; script 203019 bytes/nine requests, total 294457 bytes/14 requests.
  No budget, simulated profile or metric was changed. This is a real remaining
  acceptance blocker; targeted Next bootstrap/RSC profiling is the next step,
  and its causal contribution to LCP still needs proof.
- Browser refresh and final branch/evidence review are in progress. The ready PR
  will prominently disclose the blocker and must not be merged as acceptance PASS.

- Final browser command exits 0: eight themes/widths, 24 open panels, all target
  assertions, four keyboard widths, two no-JS views and nine route smoke checks.
  Axe serious/critical zero; text AA/field 3:1 pass. Contact draft, invalid focus,
  reveal, reduced motion, footer shortcut, four-times-slow motion and interrupted
  close/focus return pass. Final mobile-light and desktop-dark comparisons reviewed.
- Final native suite: 117/117 pass. `npm run check` again exits 0, 146 files linted,
  route types generated, strict TypeScript and knip clean. Adapter source pin and
  clean reference verified; 20 source font hashes match; two regenerations are
  idempotent. No contact/client-secret/raw-color/old-theme scan findings; protected
  content lane diff is empty. Full affected source and evidence review complete.
- Main #55 screenshot-key hardening landed after the last main integration. It
  changes its separate screenshot/API dependency cone. Verified application base
  remains 20d8527, recorded separately from current main 5d3b47a in sanity.json;
  no claim that #55 was part of these test results. PR mergeability will be checked.


## Review handoff

- Pushed source 9580afa and evidence 63ada08. Ready PR:
  https://github.com/byronwade/byronwade.com/pull/56 — OPEN, isDraft=false,
  base main, head bot/design-system, MERGEABLE. No merge or deployment requested.
- PR body says PORT (no package), full source 46b6654d02fda9d8fde737395185c3141df52cd2,
  four immutable side-by-side screenshot links, actual local results and LCP blocker.
- GitHub default-setup CodeQL started run 38869318654 on PR creation. The sole
  checked-in workflow remains workflow_dispatch only. Requested cancellation to
  honor local-only verification; no Actions were manually dispatched. App checks
  are not part of the local acceptance receipt. Vercel preview was automatic;
  no production deploy was requested.
- Final verdict remains BLOCKED: unchanged mobile LCP limit, 3266.371 > 3000ms.
  Next work is targeted bootstrap/RSC profiling, then repeat the same budget.
  Byron can review visual/system decisions now. Do not merge as acceptance PASS.
