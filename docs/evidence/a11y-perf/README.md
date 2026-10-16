# Accessibility and performance evidence

Collected on 2026-10-16 from local production builds. `final-lighthouse.json` records its source commit, build ID, browser, audit versions, viewport, theme and throttling settings. Measurements are lab observations on a shared machine, not field data.

## Coverage and reproduction

Run `node scripts/verify-a11y-perf.mjs --lighthouse` after a production build. The runner discovers every visual page template in `app/`, requires a representative for each dynamic template, and adds the not-found page. Each route runs at 390, 768 and 1280 CSS pixels in light and dark. Successful HTTP responses use cold Lighthouse navigation; intentional not-found responses use accessibility snapshots. API, feed, sitemap and icon responses are nonvisual endpoints. There is no `/about` or `/shop` page in this checkout.

The screenshots named `<route>-1280-light.png` and `<route>-390-dark.png` show the route before interaction. Earlier captures at 375px are prior probes. Full-page captures include below-fold content. Additional `dev-*` captures exercise a hidden development server; `motion-*` captures inspect the retained capsule at quarter-speed. Every server uses a free loopback port and closes after its verification.

Keyboard checks cover visible focus, viewport visibility, header obstruction, capsule containment and dismissal, focus return, immediate exit Tab, rapid reopening, global shortcut ownership, contact validation and reveal, and native fullscreen preview containment. Contact fixtures never submit a message. Reduced-motion checks inspect computed transitions/animations, theme changes and project contents navigation.

## Fixture boundaries

Figma success and unavailable cases use local API fixtures. The embedded frame is explicitly replaced with a local fixture document. This covers application layout, headings, controls, switching and error handling; it does not certify the live third-party iframe or account data. The fixture has no static thumbnail, so the unavailable-preview branch is covered and the real thumbnail branch is not.

Existing missing gallery images in the legacy AI/mobile case studies are content findings. Their content and facts were outside the permitted edit scope.

## Baseline and intermediate observations

`home-budget-baseline.json` and `baseline.json` retain observations from source `73496a0`. The baseline browser matrix stopped before completion and the old color syntax caused incomplete contrast evaluation; it is not a passing accessibility baseline.

Files containing `precheck` retain unsuccessful or intermediate probes. `matrix-invalid-parser-precheck.json` predates rejection of incomplete Lighthouse evaluations. Its accessibility zeros represent an audit-parser error, not a valid score. `color-compatibility.json` verifies equal browser RGB output when numeric zero replaces an achromatic missing hue. `lighthouse-parser.json` verifies that the corrected syntax can be evaluated.

`home-budget-dialog-precheck.json` measured the eager dialog dependency graph. Its extra script transfer motivated loading that behavior only when a panel opens. `home-budget-deferred-precheck.json` overlapped build tracing and is unsuitable for a performance comparison. Timing variation and host contention prevent a causal speedup claim from these probes.

`a11y-precheck.json`, `final-_.json` and `final-_projects_byronwade-ui.json` are earlier interaction probes, not final acceptance results. `matrix-shortcut-precheck.json` is a partial run before the final breadcrumb and independent-scenario timing corrections. Source/build metadata distinguishes each probe.

## Release results

Final acceptance totals and the homepage budget measurement will be recorded here after verification completes.
