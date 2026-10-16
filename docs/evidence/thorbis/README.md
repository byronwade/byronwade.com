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

- browser.json: Chrome/155.0.8059.41, axe 4.10.3, eight width/theme cases, four keyboard widths, 24 panels, nine route smoke checks, two no-JS widths and contact/shortcut/reduced-motion checks. All audited text meets AA and enabled field boundaries meet 3:1. Twelve live color roles match. Computed type roles survive cn().
- port.json: source revision, clean read-only checkout, private manifest and asset fingerprints.
- dev-smoke.json: hidden development server, 768px light/dark, no runtime errors.
- performance-before.json: first port candidate, before loading/dependency optimizations. This is not a measurement of the old production site.
- performance.json: final candidate and complete budget failures/diagnostics.

## Performance

Same Lighthouse 12.8.2 default mobile simulated profile and unchanged budgets. Local Windows/Node 24/Chrome lab; workstation contention can vary CPU timings. Do not infer real-user latency from these samples.

| Metric (ms, except CLS) | First port candidate | Final candidate |
| --- | --- | --- |
| FCP | 1080.06 | 944.19 |
| LCP | 6639.18 | 3266.37 |
| TBT | 609.00 | 228.91 |
| CLS | 0.00 | 0.00 |
| Speed Index | 2073.08 | 1424.85 |
| Script bytes | 403339 | 203019 |
| Script requests | 23 | 9 |
| Total bytes | 1064920 | 294457 |
| Total requests | 54 | 14 |

Final JavaScript: 198.3KiB; total: 287.6KiB. **Performance remains BLOCKED:** largest-contentful-paint: 3266.371 > 3000. The gate exits nonzero. Further bootstrap/hydration work is needed before merge.

## Reproduce locally

Use Node 24 and Chrome (CHROME_PATH can select another installation). From the worktree: npm ci; npm test; npm run check; npm run perf:budget; npm run test:rendered; node scripts/verify-thorbis-browser.mjs; npm run lint; git diff --check. The performance command builds once and owns an isolated production server/browser; the browser command uses that build with its own server. No GitHub Actions or deployment is part of verification.

Physical-device, Safari and screen-reader validation were not run. Empty home content arrays were not forced; empty search and invalid contact states were exercised. RESULT.md records the acceptance blocker without claiming complete performance compliance.
