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

## Loop 3 — full verification

- Dependency install completed (653 packages, approximately 9 minutes); no lockfile
  or dependency changes. Native Node 24 shop regressions now pass 22/22 after
  splitting the catalog and failure cases into independently named checks.
- Narrow Biome check of the new source/tests passes. Full lint/type-check started.
- Checkout boundary/catalog/docs committed as `7e41915`; UI remains in progress.
- Latest fetch still shows no `origin/bot/design-system`. Port 3100 is available
  for this worktree's hidden local server; no other server will be used.
- Prepared temporary browser verification outside the repository: real server-action
  submission with a mocked Stripe failure, disabled/pending/focus/retry checks,
  no-key/live-key states, no-JS preview, axe, light/dark and responsive screenshots.
  The fixture is test evidence only, never a real Stripe session.

## Loop 4 — rendered findings

- Full lint passes (130 files), type-check passes, knip passes, and no-key
  production build passes. Expected Figma/Dribbble credential warnings only.
- Full native suite: 56/56 pass. Existing rendered contact check: 1/1 pass.
- Corrected pre-existing CRLF checkout bytes to the LF already stored in Git;
  confirmed no source/content diff outside intended changes.
- Captured and visually inspected `/shop` desktop/mobile light screenshots; also
  captured dark variants. Responsive preview has no horizontal overflow.
- Browser keyboard test exposed `role="button"` on Button-rendered return anchors.
  Changed only the two new routes to canonical Link + existing `link-underline`
  and `focus-ring` utilities; added two rendered native-link regressions.
- Next: rebuild/re-run checks after this fix, finish axe/keyboard/fixture states,
  measure performance, inspect secrets/diff, and publish the branch/ready PR.

## Loop 5 — verification recovery

- Native-link regressions correctly failed against the old production HTML
  (red). Rebuild is in progress to establish green against the corrected routes.
- Full lint after the fix passes (131 files). A repeat incremental type-check
  stalled for several minutes at about 11 seconds CPU. Verified its exact PID,
  start time, and command path, then stopped only that worktree-local process.
  Retrying with `npm run type-check -- --incremental false`; never weakened types.
- Temporary resumable verification files are in
  `%TEMP%/codex-shop-20261015/`: `verify.py` (headless installed Chrome, axe 4.10.3,
  screenshots and real server-action fixture), `performance.py` (own local :3000
  server, prescribed perf script plus `/shop` Lighthouse), and bounded logs.
- Client output scans found no Stripe env name/fixture credential or raw contact
  address; no remote credentials were requested or changed.
- Branch source diff remains limited to the shop, its docs/tests, and evidence.
  Re-fetch the design-system branch before publishing. No remote ref found yet.
- Cold type-check completed successfully; rebuild after the native-link fix also
  passed. Host scheduling made TypeScript take 2.4 minutes during that build.
- CSS inspection found the existing `.reveal` utility overrides ordinary
  `animate-none` by source order. The three new Guided headers now use Tailwind's
  important animation opt-out (`animate-none!`); no shared motion/token change.
  Browser verification now explicitly checks the normal-motion computed value.

## Loop 6 — axe remediation in the shared shell

- Latest shop build, full type-check, lint, knip, and three rendered tests pass.
- Full-page axe exposed existing shared-shell failures, not shop content:
  hidden launcher/search panels retained focusable descendants; floating identity
  and toolbar lacked a landmark; footer copyright opacity reduced light contrast
  to 3.16:1; two external toolbar links crowded the launcher at 320px.
- Focused fixes: inactive compact/panel surfaces are inert; wrap existing chrome
  in a semantic header; use unmodified muted-foreground for copyright; show the
  duplicated GitHub/X toolbar shortcuts from `sm` upward (footer links remain).
- No homepage composition, project content, tokens, or primitive changes.
- Browser tool fixture needed a Windows file URL for Node `--import`; corrected
  outside the repo. Re-run full axe matrix after rebuilding; check footer reveal.
- Format generated JSON evidence before final lint. The failed axe report is an
  honest intermediate artifact and will be replaced only by fresh rendered results.

## Loop 7 — keyboard clearance and final boundary review

- Full-page axe now reports zero violations for no-key desktop/mobile, both themes,
  tablet, wide, 320px reflow, both return routes, live-key fallback, and enabled
  fixture desktop/mobile. Final error-state scan remains to finish.
- Sequential keyboard navigation exposed bottom-dock coverage of the first mobile
  checkout. Added `scroll-mb-28` to the checkout button and focused error, matching
  canonical shell clearance. Dev-server check passed: focused button at y=688,
  height 44, unobscured; Enter reached the server action, the intercepted provider
  failure focused the error, and retry remained available.
- Boundary review added UUID validation for the per-render submission identity
  before building an idempotency header. Focused Node checkout tests pass 23/23,
  including malformed identities with zero provider requests.
- Final release gates are running on this source; then regenerate all evidence,
  run the prescribed performance budget plus `/shop`, and publish.

## Loop 8 — acceptance evidence and performance findings

- Final source: lint, type-check, knip, no-key build pass; native tests 57/57;
  rendered tests 3/3. Production browser pass completed: 13 scenarios, zero axe
  violations, zero page errors, seven screenshots. Keyboard, pending/width,
  unobscured focus, focused error/retry, native return links, no-JS preview, and
  footer contact reveal pass. Normal-motion header computes `animation: none`.
- Port 3000 became occupied. Did not use or alter that process. The prescribed
  perf script hardcodes it; ran the equivalent installed Lighthouse CLI against
  this worktree's own hidden production server on port 3100 instead.
- Initial Lighthouse: score 80, LCP 4.1s, CLS 0.015, TBT 300ms. Raw resources exceed
  script/font/total limits; signature font and duplicate site-icon transfers are
  existing shared costs. Measuring unchanged `/privacy` as a comparison before
  classifying this broader work for the design-system owner.
- CLI exit 0 emitted no budget audits. Final evidence will explicitly compare raw
  metrics/resources to the canonical budget; no performance-pass claim is made.

## Loop 9 — final ARIA review and comparison evidence

- Measured unchanged `/privacy`: score 73, LCP 4.4s, font transfer identical at
  165.68 KiB, scripts 388.01 KiB versus shop 389.76 KiB. Both exceed shared budgets.
  Classified broader font/icon/prefetch work as record for the design-system owner.
  Privacy report was written, then CLI cleanup failed with Windows EPERM; retained
  that exit code and limitation in evidence. No permission changes or foreign cleanup.
- `performance.json` compares raw metrics and request/size counts directly with
  the canonical budget. Shop performance is explicitly not a budget pass.
- Axe's manual-review item is the launcher `aria-controls` pointing to its inert
  hidden dialog. Added a browser check that the ID resolves to the visible named
  dialog when expanded. This also exposed absent focus return, so the existing
  capsule lifecycle now accepts `onClosed`; launcher/search/support restore their
  trigger, and support gets initial dialog focus. No animation scale or geometry change.
- Re-running local gates and the keyboard/axe matrix for this focused lifecycle
  correction, then commit evidence, final secret/diff review, push, and ready PR.

## Loop 10 — verified compiler fix and final browser evidence

- Cold compiler traces identified the apparent stalls: the icon barrels loaded
  1,512 CSR and 1,513 SSR declarations. The package explicitly exports public
  per-icon SSR and types entry points, so the canonical module now uses those.
  No icon exports, weights, consumers, dependency versions, or visual system changed.
- After trace: zero CSR and 59 SSR declarations; total source files 4,479 → 1,508.
  Strict cold type-check, knip, production build, and three rendered tests pass.
  Import cleanup and trace evidence committed as `3b8417c`.
- Latest production browser matrix passes: 13 scenarios, zero axe violations,
  zero page errors, seven screenshots. Launcher/search/support Enter/Escape focus
  return passes. Expanded launcher resolves its exact aria-controls target;
  the closed inert-target axe review item is documented, not suppressed.
- Freeze browser output, format evidence, clear only the generated local
  `tsconfig.tsbuildinfo`, and re-run the standard lint/type-check commands. Then
  finish the results/PR with shared performance-budget debt explicitly recorded.

## Loop 11 — final upstream integration

- Standard lint/type-check passed after clearing the stale generated cache;
  native tests 57/57 and rendered tests 3/3 passed on the pre-integration tree.
- `origin/main` advanced to `8765f9d` (PR #47, contact error correction). Merged it
  into this branch as `eac8bc1`. Resolved only the profile ownership paragraph by
  preserving the new contact hook and the shop boundary; no source conflict.
- The new contact hook owns contact fields/validation/delivery, so it is not an
  equivalent of the shop's native server-action state. Both remain domain-owned.
- Post-merge lint, standard type-check, knip, and native tests pass (62/62 now,
  including five upstream contact regressions). Production build and fresh browser
  evidence are finishing. No shop change touches homepage composition or projects.
- No `origin/bot/design-system` ref was available at the latest fetch. Document
  the pending design-system dependency in the PR and recheck before publication.

## Loop 12 — ready for publication

- Current source includes main `8765f9d`. All four local release gates pass without
  a Stripe key. Native tests 62/62; rendered tests 3/3; post-merge browser matrix
  13/13 scenarios with zero axe violations/page errors and verified panel focus return.
- Inspected desktop/mobile light/dark and fixture-enabled/error images; retained
  seven screenshots. No secret/fixture credential/raw contact in client output,
  no raw contact in prerendered HTML, and no real Stripe key pattern in source diff.
- Final-source Lighthouse on own port 3100: score 80, LCP 3.791s, TBT 358.5ms,
  CLS 0.0145. Budget misses are explicitly recorded, not marked passing; comparison
  route and CLI/cleanup limitations remain in the structured evidence.
- `RESULT.md` is a local handoff report, intentionally not committed as duplicate
  PR noise. Commit the maintained docs/screenshots/evidence, push only `bot/shop`,
  and open a ready PR to main. Never merge or deploy. Re-fetch the design-system
  ref immediately before publication and note the dependency if still unavailable.

## Loop 13 — preserve owner-only contact delivery

- Before publication, main advanced again to `65596a5` (PR #48). Merged it as
  `d4fbe38` so the branch preserves owner-only contact delivery. The merge changed
  only the contact server action, its tests, and spam-protection documentation;
  no shop UI or shared chrome changed after the final 13-scenario browser capture.
- Re-running the four local gates on that integration: lint/type-check/knip and
  62 native tests pass; production build is finishing. Run the three rendered
  contracts against that build, retain the explicit performance findings, and
  publish this reviewed snapshot without chasing unrelated future main changes.
- Production build completed with exit 0 on `65596a5` integration. The source is
  frozen for publication; no shop/chrome UI changed in the last contact-only merge.
