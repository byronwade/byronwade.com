# Accessibility and performance evidence

Collected from local production builds beginning on 2026-10-16. Each report records its source commit, build ID, browser, audit versions, viewport, theme and throttling settings where applicable. Measurements are lab observations on a shared machine, not field data.

## Coverage and reproduction

Run `node scripts/verify-a11y-perf.mjs --lighthouse` after a production build. The runner discovers every visual page template in `app/`, requires a representative for each dynamic template, and adds the not-found page. Each route runs at 390, 768 and 1280 CSS pixels in light and dark. Successful HTTP responses use cold Lighthouse navigation; intentional not-found responses use accessibility snapshots. API, feed, sitemap and icon responses are nonvisual endpoints. There is no `/about` or `/shop` page in this checkout.

The screenshots named `<route>-1280-light.png` and `<route>-390-dark.png` show the route before interaction. Earlier captures at 375px are prior probes. Full-page captures include below-fold content. Additional `dev-*` captures exercise a hidden development server; `motion-*` captures inspect the retained capsule at quarter-speed. Every server uses a free loopback port and closes after its verification.

Keyboard checks cover visible focus, viewport visibility, header obstruction, capsule containment and dismissal, focus return, immediate exit Tab, rapid reopening, global shortcut ownership, contact validation and reveal, and native fullscreen preview containment. Contact success and notification lifecycle checks submit only to a loopback Resend fixture. Reduced-motion checks inspect computed transitions/animations, theme changes and project contents navigation.

## Fixture boundaries

The production email SDK uses its supported base URL override and a synthetic credential to send browser submissions to an owned loopback HTTP fixture. This verifies successful form feedback and that closing/reopening inline contact does not repeat the success notification. No email is delivered; live provider and inbox behavior are not verified.

Figma success and unavailable cases use local API fixtures. The embedded frame is explicitly replaced with a local fixture document. This covers application layout, headings, controls, switching and error handling; it does not certify the live third-party iframe or account data. The fixture has no static thumbnail, so the unavailable-preview branch is covered and the real thumbnail branch is not.

Existing missing gallery images in the legacy AI/mobile case studies are content findings. Their content and facts were outside the permitted edit scope.

## Baseline and intermediate observations

`home-budget-baseline.json` and `baseline.json` retain observations from source `73496a0`. The baseline browser matrix stopped before completion and the old color syntax caused incomplete contrast evaluation; it is not a passing accessibility baseline.

Files containing `precheck` retain unsuccessful or intermediate probes. `matrix-invalid-parser-precheck.json` predates rejection of incomplete Lighthouse evaluations. Its accessibility zeros represent an audit-parser error, not a valid score. `color-compatibility.json` verifies equal browser RGB output when numeric zero replaces an achromatic missing hue. `lighthouse-parser.json` verifies that the corrected syntax can be evaluated.

`home-budget-dialog-precheck.json` measured the eager dialog dependency graph. Its extra script transfer motivated loading that behavior only when a panel opens. `home-budget-deferred-precheck.json` overlapped build tracing and is unsuitable for a performance comparison. Timing variation and host contention prevent a causal speedup claim from these probes.

`home-budget-post-build-precheck.json` recorded LCP 3256ms and TBT 407ms. The same application/build in `home-budget-cold-precheck.json`, after a 45-second closed-browser interval, passed at LCP 2936ms and TBT 298ms. These observations show timing variation, not a causal attribution to a particular competing process. That narrow margin is not comfortable regression headroom. Both release runners now share the matrix's 45-second interval and five-second blank-page settle; these two probes remain separate from release acceptance.

`a11y-precheck.json`, `final-_.json` and `final-_projects_byronwade-ui.json` are earlier interaction probes, not final acceptance results. `matrix-shortcut-precheck.json` is a partial run before the final breadcrumb and independent-scenario timing corrections. Source/build metadata distinguishes each probe.

`matrix-toast-remount-precheck.json` and `toast-remount-before.txt` record the notification regression probe against application source `b722522`. Two mobile cases completed before the 768px light case stopped on two repeated success notifications. Its loopback transport never contacted Resend. The release matrix reruns this assertion after preserving the notification's keyed position across form closes.

`matrix-shared-host-precheck-lighthouse.json` is an intentionally interrupted 13-case checkpoint, not a completed acceptance matrix. All completed accessibility checks passed, but timing limits failed. `home-budget-shared-startup-precheck.json` also failed blocking time at 337ms. These failures remain visible rather than being counted as successful release verification.

`route-budget_blog-baseline.json` isolates the writing index before removing local-content streaming fallbacks: LCP 3138ms and TBT 232ms under the default mobile profile. Its LCP element is a post summary. Independently, `blog-noscript-before.json` records six failures with JavaScript disabled: no post links reached the visible document. A direct browser probe also found loading placeholders on `/projects` and both sampled detail pages. This motivated removing the four obsolete skeleton paths; repeat measurements determine the performance effect.

`final-_blog.json` is the six-case retest of the reading fix, before its application source was committed as `9471c2f`. Its HEAD field therefore still names `8d2fe2e`; it is an interaction probe, not the final source-pinned release matrix. All six cases pass, including the reading check with JavaScript disabled. `reading-noscript-after.json` is an additional four-route browser probe of that same production build: each route exposes one visible heading and nonempty reading content, with no loading status.

## Release results

Final acceptance totals and the homepage budget measurement will be recorded here after verification completes.
