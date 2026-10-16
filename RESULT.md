# PR 49 re-integration after PR 55

**DO NOT MERGE. Byron must choose real products before any later merge.**
This remains an unlinked placeholder preview with Stripe test checkout only.

## Mode and decision

- **Mode:** Implementation / integration. Writes stayed in the shop worktree,
  bot/shop and its authorized PR handoff. No other worktree was changed.
- Merge current main `5d3b47a7e5f0b772e9393226f53c53cb349cdea7` (#53 projects,
  #55 screenshot privacy) into previous shop head
  `f53a4a8d661c8bbcacd0b34652a5354d655a9c05` with a normal two-parent merge.
  The exact published merge SHA and final remote checks are recorded in the
  [PR description](https://github.com/byronwade/byronwade.com/pull/49).
- Conflicts: PROGRESS.md, RESULT.md, docs/ARCHITECTURE.md, app-launcher,
  conditional-layout, dock-toolbar, footer and use-capsule-morph.
  Main's shared shell supersedes the earlier shop fixes: its flow header,
  footer, inert surfaces and guarded focus-return lifecycle are retained exactly.
  Architecture retains main's layout/screenshot ownership plus shop ownership.
  Both progress histories remain labeled; historical merge permissions apply
  only to their original lanes. PR 49 must stay OPEN and unmerged.
- **Reused:** existing catalog, checkout guard/action/form, metadata, shared
  primitives/tokens, main's shell and screenshot boundary, native/rendered tests.
- **Created or extended:** integration reports only; profile now includes the
  incoming screenshot regressions. No new dependency, product, price, credential,
  abstraction, visual system or payment behavior.
- **Recursive cleanup:** removed conflict markers and competing lifecycle edits;
  retained a single shared-shell implementation. No obsolete code or duplicate
  checkout path added. Knip reports no findings.
- **Mechanical prevention:** retained checkout, screenshot privacy, draft, date,
  contact, cache and rendered-boundary regression sensors. No new sensor needed
  for the merge; restoring local performance-budget enforcement remains recorded
  follow-up, outside this integration.

## Fresh local verification

Node `v24.21.0`, npm `11.19.0`, Next.js `16.2.7`. All commands completed with exit 0:

| Command | Result |
| --- | --- |
| `npm run lint` | 155 files checked, no fixes |
| `npm run type-check` | Route generation and strict TypeScript pass |
| `npm run knip` | No unused-code findings |
| `npm run build` | 49/49 pages generated |
| `npm test` | 166 passed, zero failed, skipped or cancelled |
| `npm run test:rendered` | 5 passed, zero failed |
| `python .next/pr49-post55/assertions.py` | Source, exclusion and production scans pass |
| `python -u .next/pr49-post55/browser-smoke.py` | 14 scenarios pass; all owned servers stopped |
| `git diff --check` and `git diff --cached --check` | No whitespace errors |

Rendered tests check 38 dates across eight pages, 27 portfolio client chunks,
contact submit semantics and both native shop return links. Native tests include
23 checkout and 29 screenshot regressions. Existing module-type warnings,
expected contact fixture diagnostics and Figma/Dribbble build fallbacks remain.
No real Stripe request, authenticated provider test or live payment was made.

Read-only source and production assertions confirm:

- Shop routes/components/catalog/checkout/tests, env template and package files
  are unchanged from f53a4a8. Exactly three products retain their placeholder
  labels and illustrative prices. Checkout still fails closed without test keys.
- All three routes remain noindex. Navigation, search and sitemap owners omit
  shop; the live sitemap and Primary/Footer navigation also omit it. A current
  page breadcrumb is contextual, not a shop discovery entry.
- Main's entire shared layout, screenshot routes/helpers, projects/content,
  date helper, SEO, globals and workflow files match origin/main exactly.
  Publication-date and draft protections remain intact.
- No live Stripe credential pattern across 301 tracked text files, local env
  files or Stripe-related process values. Only .env.example exists locally.
- No raw canonical contact details in 30 client scripts or 42 prerendered HTML
  files. Clients contain neither Stripe nor ScreenshotOne secret symbols or
  Stripe key patterns. Both built shop return pages remain noindex.

## Design evidence and limits

The Guided shop retains the numbered three-item collection and explicit preview
notice, now within main's flow header/footer and shared tokens. The collection
remains dominant. No new composition or motion was authored.

Fresh production Chrome checks on this worktree's own 127.0.0.1:3219 server cover
1440x1000 and 390x844 in both themes, 320x844 light, 768x1024 dark and 2560x1440
light. One h1, three labels, noindex, no horizontal overflow and zero page errors
pass. No-JavaScript collection, both keyboard return links, footer contact reveal,
normal/reduced-motion launcher/search/support Enter/Escape focus return, and
unknown-target rejection by both screenshot routes pass. Missing and invalid
live-key fixtures show coming soon with no checkout buttons. Locally intercepted
test checkout verifies 44px controls, disabled pending state, focused recoverable
error and retry. No fixture request reaches Stripe. All three owned servers stop.
Desktop light, mobile dark and mobile error screenshots were visually inspected.
Scripts, results, logs and captures remain ignored under `.next/pr49-post55/`.
The first browser attempt rejected its overly broad navigation assertion because
it counted the contextual breadcrumb; the corrected full run passed with exit 0.

No fresh dev-mode, axe, full shell audit, Safari, screen-reader, physical-device,
slow-motion/frame inspection, authenticated Stripe, bundle-analysis or Lighthouse
run was made. Production runtime evidence was used for this merge-only task.
No new accessibility certification or performance/budget-pass claim is made.

## Remote handoff and remaining findings

Normal branch push only; never force-push, squash-merge, enable auto-merge,
dispatch a workflow or change remote environment settings. The final pushed head,
main ancestry, OPEN/unmerged state, mergeability and checks are verified after
publishing and recorded in the PR body. Repository-managed checks may run in
response to the authorized push; workflow configuration is unchanged.

Byron must select real products before any future merge. Existing performance
budget misses and the ignored Lighthouse budget flag remain separate follow-up.
Toolkit advisory reservation failed on its pre-existing missing configured root;
configuration and cleanup quarantine were untouched. Native command exits were
used instead of toolkit receipts. No unrelated redesign or live fulfillment.

VERDICT: READY_FOR_BYRON
