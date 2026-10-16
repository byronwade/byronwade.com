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
