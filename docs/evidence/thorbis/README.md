# Thorbis evidence

Source: [Thorbis Design](https://design.thorbis.com), [46b6654](https://github.com/byronwade/thorbis-design/tree/46b6654d02fda9d8fde737395185c3141df52cd2). This is a port of a private application, not a package installation.

## Visual comparisons

Each comparison places local home on the left and the live Thorbis Rules homepage on the right. Screenshots use device scale 1 and a 1000px-tall viewport. Layout is site-specific; color/type/component roles come from Thorbis. Accessible status/field/button deviations are documented in the port map.

| Viewport | Light | Dark |
| --- | --- | --- |
| Desktop 1440 | [Side by side](comparison-1440-light.png) | [Side by side](comparison-1440-dark.png) |
| Mobile 390 | [Side by side](comparison-390-light.png) | [Side by side](comparison-390-dark.png) |

Full-page home images also cover 768/320 in both themes. focus-*.png records visible primary-nav focus. panel-*-768.png records open states. motion-open-*-768.png records the 720ms inspection. home-*-no-js.png proves readable static content. dev-768-*.png is development smoke evidence from the earlier font-preload checkpoint; final production screenshots cover the merged tree.

## Structured proof

- browser.json: Chrome/155.0.8059.41, axe 4.10.3, eight width/theme cases, four keyboard widths, real theme-toggle round trips, 24 panels, nine route smoke checks, two no-JS widths and contact/shortcut/reduced-motion checks. All audited text meets AA and enabled field boundaries meet 3:1. Twelve live color roles match. Computed type roles survive cn().
- Known drift (October 22, 2026, main `bf18367`): `verify-thorbis-browser.mjs` now injects Lighthouse's axe through `scripts/axe-audit.mjs`, and its first case confirms the in-page axe version, but it then stops on the geometry read before asserting results because no element carries `data-slot="card-title"` any more. The unmodified script fails at the same place. browser.json above is the last completed run.
- port.json: source revision, clean read-only checkout, private manifest and asset fingerprints.
- dev-smoke.json: earlier development checkpoint, 768px light/dark.
- dev-current.json: client-slot checkpoint, canonical npm run dev, 1440/390 light/dark, actual theme controls, no overflow/runtime errors.
- performance-before.json: first port candidate, before loading/dependency optimizations. This is not a measurement of the old production site.
- performance.json: final acceptance candidate and complete budget assertions/diagnostics.

## Performance

Same Lighthouse 12.8.2 default mobile simulated profile and unchanged budgets. Local Windows/Node 24/Chrome lab; workstation contention can vary CPU timings. Do not infer real-user latency from these samples.

The integrated #55 baseline was LCP 3443.108ms / TBT 559ms. The follow-up's
full `npm run perf:budget` passed: LCP 2989.517ms, TBT 271.828ms, FCP 940.344ms,
CLS 0 and Speed Index 961.438ms. All resource limits passed: 168115 JavaScript
bytes / nine scripts, 262432 total bytes / 14 requests, one font (49991 bytes),
one stylesheet (17963 bytes), no images. The 3000ms LCP limit was not changed.

See performance.json for the final acceptance sample and complete diagnostics;
lcp-runs.json retains exploratory failures and passing samples. CPU variance is
material and the final LCP margin is only 10.483ms; no real-user production claim is made.

## Reproduce locally

Use Node 24 and Chrome (CHROME_PATH can select another installation). From the worktree: npm ci; npm test; npm run check; npm run perf:budget; npm run test:rendered; node scripts/verify-thorbis-browser.mjs; npm run lint; git diff --check. The performance command builds once and owns an isolated production server/browser; the browser command uses that build with its own server. No GitHub Actions or deployment is part of verification.

Physical-device, Safari and screen-reader validation were not run. Empty home content arrays were not forced; empty search and invalid contact states were exercised. [PR-56-RESULT.md](PR-56-RESULT.md) preserves that task's final local verification, status and merge receipts.
