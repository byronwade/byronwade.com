# Shop implementation progress

## Plan and acceptance

- Mode: Implementation; stay on `bot/shop` in this worktree. Commits, branch push,
  and a ready PR are authorized. No merge, deployment, live payment, or remote
  environment change.
- Sync `origin/main` (contact reliability + Node 24), then integrate
  `origin/bot/design-system` if available before publishing.
- Build `/shop`, `/shop/success`, `/shop/cancel` with exactly three locally typed
  placeholder products, each visibly labeled `Placeholder - pending Byron's choice`.
- Create Stripe-hosted Checkout sessions using server-owned `price_data` only.
  Reject missing and non-`sk_test_` credentials before any network call.
- Keep Shop unlinked; add only the variable name to `.env.example`.
- Verify with local lint, type-check, knip, build without a Stripe key; focused
  native Node payment regressions; browser/axe/keyboard checks and desktop/mobile
  screenshots. Exercise a real test session only if a local test key exists.
- Review the complete diff, document evidence in RESULT.md and the PR, push the
  feature branch, and open a ready PR to main. Never merge.

## Design decision record

- Surface: Guided; visitor previews the collection and optionally tries test checkout.
- Dominant object: the three-item collection, with honest availability and prices.
- Organizing move: a compact shop introduction beside an explicit preview notice,
  followed by a numbered, editorial product list with a clear action per item.
- Alternatives: a three-card merchandise grid adds unnecessary visual containers;
  a single featured item hides the equal placeholder status. Use the editorial list.
- Reuse: site shell, semantic tokens, canonical Button and Link primitives,
  metadata helper, native forms, platform fetch/URLSearchParams/Intl.
- Create: local product config and test-only checkout boundary; no existing commerce
  owner or behavior is expected. Confirm through repository search before coding.
- States: coming soon (missing/live key), test ready, submitting, recoverable failure,
  canceled, and return page that never treats a URL visit as proof of payment.
- Responsive/input: wide rows on desktop, stacked on mobile, >=44px actions,
  native keyboard submission and visible focus. No hover-only content.
- Motion: frequent controls need immediate feedback; no purpose for a shop entrance
  animation. Use existing primitive feedback and reduced-motion tokens only.
- Risks: no browser Stripe SDK, bespoke palette, or imagery; keep secrets server-only,
  validate product IDs and checkout response, preserve the site's performance budget.

## Loop 1 — reconnaissance

- Read AGENTS.md, CLAUDE.md, DESIGN.md, PROJECT_PROFILE.md, docs/UI_GUIDELINES.md,
  shared toolkit guidance, and Stripe/commit/browser skills.
- Worktree started clean on `bot/shop`; main now includes `38261e9`.
- No remote design-system branch appeared in the initial branch listing; recheck
  before publishing. Next: inspect equivalent components and server contracts.

## Loop 2 — implementation and focused regression checks

- Created the three routes, catalog, native server-action form, and Checkout
  boundary using platform fetch; no new dependency, token, or primitive.
- Chose inline `price_data`, no-store mutation, timeout, stable per-form
  idempotency, strict test-session/Stripe-origin validation, and generic errors.
- Verified current Stripe API version against official documentation:
  `2026-09-30.endive`. No real Products/Prices API calls or payments.
- `node --experimental-strip-types --test tests/shop-checkout.test.mjs`: 19/19 pass,
  including zero network calls for missing/live keys and untrusted response cases.
- No local Stripe env file or process key exists. Real test-session creation will
  be documented in `docs/SHOP.md`; no credential requested or provisioned.
- `npm ci --no-audit --no-fund` is in progress. The non-login shell defaults to
  Node 22, so all verification explicitly selects the installed Node 24.21.0.
- Shared toolkit reservation failed on its stale configured septic path. No
  toolkit configuration, other worktree, or ownership record was changed.
- Next: lint/type-check/build, render states and viewports, axe and keyboard,
  performance budget, full diff review, design-system recheck, and PR evidence.
