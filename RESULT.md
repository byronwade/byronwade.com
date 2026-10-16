# PR #49: integration after the Thorbis port and resume PDF fixes

**DO NOT MERGE. Byron must choose real products.**

## Mode and decision

- **Mode:** Implementation. Authorized writes, normal merge commit, branch push
  and PR-body update only. PR #49 stays open and unmerged.
- Merge main `dd738fc407c7047e62a9a42f4cf1db8106cf8639` into previous shop head
  `13e92412a9fdddd1c485564b2abf739d813102be`, preserving both parents.
- **Merge SHA:** Pending creation of the verified merge commit.
- Main owns the complete Thorbis foundation, shared shell, split icon facade,
  webpack configuration, resume PDF fixes and `outputFileTracingIncludes`.
  These owners match main exactly. Main's performance runner/documentation also
  replaces the obsolete branch description. Both progress histories are retained
  and their historical permissions are scoped to their original work.
- **Reused:** `SiteShell`, `PageHeader`, `Link`, large `Button`, `CheckoutForm`,
  catalog, server action, test-key boundary, metadata helper and native tests.
- **Created or extended:** `/shop/[productId]` supplies the requested product
  page, using only the existing three catalog IDs, descriptions and prices.
  Unknown IDs return 404. The existing price formatter moved into the catalog
  owner for reuse. Shop headings/copy use Thorbis roles; obsolete animation
  overrides and local button sizing are removed. No dependency was added.
- Exactly three placeholders remain. All shop pages are noindex and omitted
  from global navigation, search and sitemap. Checkout still fails closed before
  network access without a nonempty test key. No real product, live payment,
  fulfillment, credential inspection or production deployment is included.
- **Recursive cleanup:** five merge conflicts resolved; obsolete icon-factory
  code discarded in favor of main's pure facade; competing formatting/control
  recipes removed; historical shop evidence labeled; profile and architecture
  reconciled. No unused-code findings or competing catalog/checkout path remain.
- **Mechanical prevention:** extend the existing Thorbis design contract over
  shop routes/form, and existing rendered shop tests over catalog-owned details,
  noindex, unknown IDs and sitemap exclusion. Retain all checkout, screenshot,
  contact, cache, date, homepage, resume and PDF tracing regressions.

## Verification

Node 24.21.0, npm 11.19.0, Next.js 16.2.7. Final serial runs all exit 0:

| Command | Result |
| --- | --- |
| `npm ci --no-audit --no-fund` | 644 packages installed |
| `npm run lint` | 235 files checked, no fixes |
| `npm run type-check` | Generated routes and strict TypeScript pass |
| `npm run knip` | No findings |
| `npm run build` | Webpack production build; 49/49 static pages |
| `npm test` | 186 passed; zero failed, skipped or cancelled |
| `npm run test:rendered` | 13 passed; zero failed, skipped or cancelled |
| `python node_modules/.cache/pr49/assertions.py` | Main preservation, exclusions and production scans pass |
| `python -u node_modules/.cache/pr49/browser.py` | 15 scenario groups pass; four owned servers stopped, ports closed |
| `git diff --check` | Pass |
| `git diff --check origin/main -- . ':!.env.example'` | Shop/integration diff passes |

Rendered checks include 38 dates across eight pages, 45 portfolio client chunks,
homepage hydration/bundle contracts, native contact/shop semantics, resume
print/privacy, and all four Chromium assets traced only into `/api/resume-pdf`.
Production scans find no raw canonical contact values in 47 client scripts or
42 prerendered pages, and no Stripe/ScreenshotOne secret symbols or key patterns
in client scripts. No environment file or credential value was inspected.

Build retained the existing missing-Figma and failed-Dribbble fallbacks. Native
tests retain their module-type warnings. The development smoke check invokes the
same `next dev` command as `npm run dev`, hidden on its own allocated port, and
checks both routes. React Scan reports an existing development dependency update
notice; it is not an application console error.

Logs and JSON evidence are copied to `.next/pr49-post56/`. Helpers and live logs
live in ignored `node_modules/.cache/pr49/` so Next can clear `.next` during build.
The first build attempt stopped before compilation because its log was open in
`.next`; the corrected run passed. An earlier wrapper print hit Windows encoding;
its type-check had passed, and the complete serial sequence was rerun afterward.
The toolkit reserve/run commands fail on a pre-existing missing configured root;
its configuration and cleanup quarantine were untouched. Native exit logs are
the evidence, not toolkit receipts.

## Design evidence

Guided profile. Preserve the collection's compact numbered list; product details
lead with the concept, illustrative price and explicit test availability. A card
grid or marketing hero would obscure that task. The full placeholder notice is
wrap-capable copy rather than a compressed, no-wrap badge. Shared components own
interaction and tokens; no page-local palette or primitive was created.

All eight requested production images were visually inspected:

| Route | Width | Light | Dark |
| --- | --- | --- | --- |
| `/shop` | 390px | `missing-shop-390-light.png` | `missing-shop-390-dark.png` |
| `/shop` | 1280px | `missing-shop-1280-light.png` | `missing-shop-1280-dark.png` |
| `/shop/field-notes` | 390px | `missing-product-390-light.png` | `missing-product-390-dark.png` |
| `/shop/field-notes` | 1280px | `missing-product-1280-light.png` | `missing-product-1280-dark.png` |

Images are under `.next/pr49-post56/`; additional fixture and development captures
are there too. Browser assertions cover Inter/32px heading roles, one h1, no
horizontal overflow, noindex, discovery exclusions, keyboard navigation and
visible focus, 44px links/buttons, both native return links, no-JavaScript content,
normal-motion theme toggle, reduced motion, and footer click-to-reveal.
Invalid live-key fixture shows no checkout controls. Intercepted test checkout
checks pending/disabled stable-width controls and focused failure/retry twice on
both routes. No real Stripe request was made.

All measured route cases have zero page errors and zero console errors with
exactly two local diagnostic stubs: `/_vercel/insights/script.js` and
`/_vercel/speed-insights/script.js`. Plain local Next does not serve these URLs;
the initial run detected their 404/MIME errors and stopped. These stubs do not
intercept application scripts, navigation or server actions. No new content
motion was added; shared feedback and pending state retain their reduced-motion
path. No speed or performance-budget claim is made.

## Publication and remaining findings

- Remote publication/checks are pending. Final exact-SHA status will be added
  after the normal push and GitHub verification.
- Main's breadcrumb compresses deep-route text at 1280px; the product h1 and
  explicit return link stay fully visible. The shared shell is preserved.
- Full merge whitespace checking reports two inherited trailing spaces in the
  upstream Inter/Geist OFL licenses. Those source license files are preserved;
  the shop diff and working-tree whitespace checks pass.
- No fresh axe, Lighthouse/performance budget, bundle-analysis, Safari,
  screen-reader, physical-device, slow-motion/frame inspection or authenticated
  Stripe-provider run was made. These are outside this integration's requested
  gates; no related acceptance or performance claim is made.
- Screenshots use Chrome viewport emulation. Real products remain Byron's decision.

VERDICT: BLOCKED (normal push and exact-head remote checks pending)
