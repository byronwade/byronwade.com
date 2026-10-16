# Shop verification evidence

This is historical evidence captured before the completed Thorbis port (#56).
Current PR #49 post-port captures and checks are recorded in `RESULT.md` and the
local ignored `.next/pr49-post56/` directory. The performance-runner limitations
below describe that earlier run; `docs/PERFORMANCE.md` owns the current runner.

Captured locally on October 15, 2026, using a production Next.js build, installed
headless Chrome, and axe-core 4.10.3. The browser server used Node 24.21.0; cold
compiler traces used Node 24.14.0, both within the supported Node 24 major. No Stripe credential was
available. Enabled-checkout images use an invalid fixture credential with the
Stripe transport intercepted outside the repository; they are not evidence of
a real Stripe session or payment. See [the manual test procedure](../../SHOP.md).

| Image | State | Viewport |
| --- | --- | --- |
| [Desktop](shop-desktop.png) | Coming soon, light | 1440 × 1000 |
| [Mobile](shop-mobile.png) | Coming soon, light | 390 × 844 |
| [Desktop dark](shop-desktop-dark.png) | Coming soon, dark | 1440 × 1000 |
| [Mobile dark](shop-mobile-dark.png) | Coming soon, dark | 390 × 844 |
| [Test desktop](shop-test-desktop.png) | Fixture-enabled test checkout | 1440 × 1000 |
| [Test mobile](shop-test-mobile.png) | Fixture-enabled test checkout | 390 × 844 |
| [Error mobile](shop-error-mobile.png) | Focused, recoverable provider failure | 390 × 844 |

Images capture the full document. The error image is taken after keyboard focus
moves to the inline message, so fixed chrome reflects that scroll position.
Tablet (768px), wide (2560px), and 320px reflow are also checked without storing
additional screenshots. The shop uses the existing shell, semantic tokens,
controls, typography, and icon family. No bespoke palette or entrance motion.

[Accessibility evidence](accessibility.json) records 13 full-page scans, keyboard
paths, normal-motion header behavior, and page errors. The launcher's hidden
`aria-controls` target is retained in axe's manual-review list; the browser check
verifies the referenced ID when the named dialog is expanded. No rule is disabled.
The native Node suite protects live-key rejection, catalog pricing, submission
identity, idempotency, provider failures, and untrusted redirect responses. Rendered
tests protect native submit and return-link semantics.

[Compiler evidence](typecheck.json) records the measured icon declaration fanout:
3,025 Phosphor declarations before, 59 after using its public per-icon SSR and
types entry points. The canonical icon exports and weights are preserved. This is
a file-loading measurement, not an elapsed-time or runtime speed claim.

[Performance evidence](performance.json) includes the raw budget comparisons for
the shop and an unchanged `/privacy` route using the same shell. Both miss shared
script/font/transfer budgets. This is **not a performance-budget pass** or a speed
improvement claim. The prescribed script hardcodes occupied port 3000, so the
equivalent installed CLI ran against this worktree's own production server on
port 3100. Its missing budget audits and the comparison run's Windows cleanup
error are recorded explicitly. Broader font, icon, and prefetch work belongs with
the pending design-system work.

No real-device, Safari, screen-reader, or authenticated Stripe-provider test was
performed. Browser mobile screenshots use viewport emulation.
