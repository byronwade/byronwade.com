# Thorbis Design adoption

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
