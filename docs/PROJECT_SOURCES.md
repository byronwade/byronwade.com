# Project and article sources

Project inventory reviewed October 15–16, 2026, using Byron's public GitHub repositories
and existing site copy. Later project and article reviews are dated below.
Current-work selection and names come from Byron's brief;
an Active label identifies the portfolio group, not a released product. No new
metrics, clients, adoption figures, or measured outcomes are claimed.

| Project | Sources | Limits / follow-up |
| --- | --- | --- |
| Thorbis Network / FMS | [Public repository](https://github.com/byronwade/local.thorbis.com), [README](https://github.com/byronwade/local.thorbis.com/blob/main/README.md), [previous site write-up](https://github.com/byronwade/byronwade.com/blob/38261e9/content/projects/thorbis.md) | Conservative service-business scope only. Older public README and existing site describe different stack generations, so no current stack or launch claim. TODO confirms Network/FMS naming; the earlier CMS article uses FMS for agriculture. |
| Thorbis Design | [Existing site port notes](https://github.com/byronwade/byronwade.com/blob/30cceba/docs/THORBIS-DESIGN-PORT.md), [site design contract](https://github.com/byronwade/byronwade.com/blob/30cceba/DESIGN.md), Byron's supplied design.thorbis.com address | The published design-system implementation establishes this site's CSS/Tailwind port and Base UI interaction layer. It replaces the earlier provisional association with the separate Design repository. TODO covers preferred public upstream link, dates, wider adoption, and outcomes; no published-package claim. |
| Subfield | [Public repository inventory](https://api.github.com/users/byronwade/repos?per_page=100), existing site search | No matching public description found. Name and current selection only; TODO requests scope, links, stack, dates. |
| Hollowveil | [Public repository inventory](https://api.github.com/users/byronwade/repos?per_page=100), existing site search | No matching public description found. No genre or features inferred. TODO requests description and category confirmation. |
| Movies | [Repository](https://github.com/byronwade/movies.byronwade.com), [home route](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/routes/index.tsx), [package manifest](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/package.json) | Source supports a discovery feed and React/TypeScript/TanStack Start/Router/Vite. TODO requests canonical URL, dates, release state. No launch, user, or recommendation-quality claim. Feed and catalog claims were checked against `6dbc3fc` on October 22, 2026; see the Movies section below. |
| Realistic Face | [Public repository inventory](https://api.github.com/users/byronwade/repos?per_page=100), existing site search | No matching public description found. No model, dataset, technique, or realism claim. TODO requests details. |
| Drone PI | [Public repository inventory](https://api.github.com/users/byronwade/repos?per_page=100), existing site search | No matching public description found. No hardware or flight capability inferred. TODO requests details. |
| ODB2 | [Public repository inventory](https://api.github.com/users/byronwade/repos?per_page=100), existing site search | Spelling retained from brief. No vehicle-diagnostics assumption. TODO confirms ODB2/OBD2 and details. |
| Plumbing Code Playbook / The Trust Sale | [Public repository inventory](https://api.github.com/users/byronwade/repos?per_page=100), existing site search | One combined entry as requested. No title-specific public source found. The separate academy repository does not establish facts about these titles. TODO confirms format, relationship, publication state, and links. |

The unauthenticated public inventory returned 39 repositories. Direct public API
lookups for the unmatched names returned 404; that is an absence of public evidence,
not evidence that a project does not exist. No private repositories were consulted.

All nine current entries contain frontmatter TODO comments. Unknown dates are
omitted rather than assigned the build date. Existing Thorbis date is retained.
Unverified categories are omitted; unknown work has a neutral Project label instead
of being classified as Hobby by default.

The fifteen earlier write-ups and all their other frontmatter are preserved.
Only `status`, `featured`, and existing `flagship` fields change to establish the
earlier-work group and remove older entries from the homepage's featured set.
Archived here is an editorial grouping; no GitHub repositories are archived.

## Earlier-work performance claims, October 20, 2026

The Zugzology case study (`content/projects/mushroom-cultivation-supplier.md`)
previously claimed 80% fewer database queries, 70–80% faster loads, an 8+ second
initial load, and a 2MB+ product payload. No supporting benchmark, workload,
measurement date, or source was found in this repository or the introducing
content commit (`ef54a5a0`). Those figures and unmeasured performance guarantees
have been removed. The write-up retains its described caching and streaming
approaches; it does not establish measured results for them. Restoring metrics
requires a source and a reproducible before/after comparison.
This correction does not independently verify the inherited feature list,
production usage, scaling capacity, or field-management roadmap.
The feature list and the field-management roadmap were checked on October 22,
2026; see Zugzology storefront claims below.

## Zugzology AI claims, October 20, 2026

The same case study described a multi-provider "enterprise AI/ML system"
(recommendations, behavior analysis, sentiment analysis, segmentation, market
basket analysis, A/B testing) as part of the current store. The store's public
repository, [byronwade/zugzology.com](https://github.com/byronwade/zugzology.com),
shows otherwise:

- Commit [`a509ce9d`](https://github.com/byronwade/zugzology.com/commit/a509ce9dd04df8f450c2bf1421dc142817cc963c)
  (2025-10-15, "Major architectural restructuring") deleted `app/api/ai/*`
  (behavior-analysis, demand-forecasting, enhance-product, personalize-homepage,
  recommendations, search-suggestions, sentiment-analysis, support,
  user-segmentation) and `components/ai/*`, including the A/B testing framework.
- Commit [`b7a6d695`](https://github.com/byronwade/zugzology.com/commit/b7a6d695110913681e1e9b9593b8387aa03b1d43)
  (2026-07-31) deleted the remaining `src/app/api/analytics/ab-test` route.
- At HEAD [`5b7f80d8`](https://github.com/byronwade/zugzology.com/tree/5b7f80d81b4819f9d38f51da89bf3247763077ed),
  `package.json` has no OpenAI, Anthropic, or Groq SDK, and product order comes from
  [`src/lib/ranking/product-ranker.ts`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/lib/ranking/product-ranker.ts)
  ("without external dependencies or AI"), called from
  `src/components/features/products/realtime-products-content.tsx`.
- The removed system's statistical fallback when no provider key is set is
  documented in that repository's `docs/AI_PREDICTIONS_STATUS.md`.

This site's case study was added in `ef54a5a0` (2025-12-02), after the removal,
so the AI passages were stale when published. They now describe the AI layer as
a removed experiment and the ranker as current. Added feature-list items (typed
analytics events, a Web Vitals route, Google Merchant/Facebook feeds, a Shopify
outage degraded mode) come from routes and components present at that HEAD;
whether custom analytics events record in production depends on the Vercel plan
and was not checked. "Proven Scalability" / "thousands of products", "already
handling production traffic", and "self-sustaining" revenue had no recorded load
test, traffic, or revenue source and are now worded as design intent. No reason
for the AI removal is given because the commit does not state one. The
repository's own `docs/ENTERPRISE_AI_SYSTEM.md` still describes the deleted system;
it was not edited.

## Wade's Plumbing mobile-traffic figure, October 20, 2026

`content/projects/wades-plumbing-and-septic.md` said 80% of local-service traffic
comes from phones and called mobile speed a "massive ranking factor". Neither had
a source. The earlier correction removed the traffic figure and qualified the
ranking wording. The follow-up below addresses the unsourced
front-matter outcome "ranks in two markets" and the related speed assertions.

## Wade's Plumbing ranking and speed claims, October 20, 2026

The archived case study now distinguishes the owner's historical two-state
project account from current service coverage and from measured outcomes.
The summary no longer claims rankings in two markets; the body no longer
guarantees faster loading than competitors or implies measured traffic or
conversion gains from Tailwind, local pages, or structured data.

| Primary source | Supports | Limits |
| --- | --- | --- |
| [Current service areas](https://www.wadesplumbingandseptic.com/service-areas), accessed October 20, 2026 | The current public page describes Santa Cruz County and selected Santa Clara County coverage in California. | It does not establish the historical California/Georgia navigation, rankings, performance, or conversions. Today's coverage does not disprove the owner's earlier two-state account. |
| [Google: page experience](https://developers.google.com/search/docs/appearance/page-experience), accessed October 20, 2026 | Google uses Core Web Vitals in ranking systems; good scores do not guarantee top placement. | General guidance is not a ranking report or a benchmark for this project. |
| [Google: Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals) and [Chrome: INP becomes a Core Web Vital](https://web.dev/blog/inp-cwv-march-12) | Current metrics are LCP, INP, and CLS. INP replaced FID on March 12, 2024. | The historical project date stays October 2023; the updated paragraph explicitly describes current terminology, not measurements from that date. |
| [Tailwind: detecting classes](https://tailwindcss.com/docs/detecting-classes-in-source-files), accessed October 20, 2026 | Tailwind generates CSS for detected utility classes. | The documentation establishes a framework capability, not this site's loading time, field scores, or speed relative to page-builder sites. |

Repository history (`ef54a5a0`, `54a153a`, `20d8527`) and the source ledger did
not supply a dated search report, before/after speed comparison, or conversion
study for the assertions. Absence of that evidence is not evidence that the
project had no effect. Restoring measured claims requires the query and market,
measurement period, workload/device, comparison method, and supporting record.

The project URL, publication date, heading anchors, archived grouping,
front-matter keys, owner-reported $2.4M year-two revenue, and CA + GA project
context are preserved. Revenue is not attributed to the website. The remaining
psychology passages describe the owner's design rationale; they are not a
validated study of customer behavior. No private business records, current
signed-in service flows, or live performance tests were consulted.

## Nexstar article evidence and worked examples, October 20, 2026

Reviewed `content/blog/nexstar-win-invoice-lose-customer.md` against all eight
linked sources. All opened without credentials. Dated sources precede the
article's August 7, 2026 publication; the undated training catalog establishes
current descriptions, not its exact contents on that earlier date.

| Source | Supports | Limits |
| --- | --- | --- |
| [Nexstar training catalog](https://www.nexstarnetwork.com/technical-training/) | Six-step Service System and the named training programs | Describes goals, not measured effectiveness. |
| [Bootcamp adoption](https://www.nexstarnetwork.com/blog/insights-blog/sales-objection-bootcamp-adoption/) (March 4, 2026) | Member-reported 53% revenue and 72% average-sale increases on fewer leads | Informal account, not a controlled comparison or retention study. |
| [Objection bootcamp](https://www.nexstarnetwork.com/blog/newsroom/an-objection-bootcamp-ten-years-in-the-making/) (February 5, 2024) | The listed objections and training philosophy | Does not establish behavior at every member company. |
| [Power to the Buyer](https://www.nexstarnetwork.com/blog/newsroom/power-to-the-buyer-a-conversion-breakthrough-for-dynamic-tradies/) (May 15, 2025) | Company-wide solutions/opportunity 1.59 to 3.07; reported $300 average-sale and nearly 15% conversion increases | Australian member self-report; currency and relative-versus-point conversion change are unspecified. No added precision is inferred. |
| [Service System and objections](https://www.nexstarnetwork.com/blog/newsroom/service-system-clearing-our-own-objections-to-help-others-find-clarity-in-theirs/) (December 11, 2023) | Rapport, options and handling objections | First-party account of intent, not independent customer-outcome evidence. |
| [HBR retention discussion](https://hbr.org/2014/10/the-value-of-keeping-the-right-customers) (October 29, 2014) | The attributed cost multiplier | Secondary, cross-industry context. |
| [Housecall Pro report](https://www.housecallpro.com/resources/home-service-customer-service-report-trends-statistics/) (December 10, 2025) | Online survey of 1,040 U.S. homeowners; 68% would rehire and 73% would refer after excellent service | Respondent intentions, not tracked bookings or referrals. |
| [Yang, Xu and Lin, DOI 10.1002/mar.70019](https://onlinelibrary.wiley.com/doi/10.1002/mar.70019) (August 5, 2025) | Five scenario experiments support the direction of the word-of-mouth finding | Section 6.1's social sharing was simulated; sections 6.2.5 and 8.2 disagree on the precise comparison. The article drops 88%/25% rather than selecting a denominator. No plumbing or Nexstar retention effect was measured. |

The added [Bain-hosted *Loyalty Rules!* chapter](https://www.bain.com/contentassets/29f74ec417fa4e36a1d7d7e7479badc5/loyalty_rules_chapter_one.pdf),
printed page 10, supplies direct provenance for the historical retention/profit
range. Its wording is retained without interpreting the retention change as
relative or percentage points. It is not a forecast for a plumbing company.

The 80% contribution increase is correct under the article's invented inputs:
`(1350 - 750) / 750 = 0.8`. It stays, explicitly conditional on later jobs.
The separate break-even calculation now compares gross profit, not just revenue:
equal 50% margins give `400 / 1500 ≈ 26.7%`; an extra $50 retention cost gives
30 percentage points; a 25% future margin with no extra retention cost gives
about 53.3 points. Equal acquisition costs cancel. Timing, costs and future work
are explicit assumptions, not measurements. Slow-season figures are likewise
hypothetical revenue comparisons, not forecasts or profit figures.

Byron's opinion, personal experience and reported 46% repeat-revenue share are
preserved as his account, not independently audited findings. No source here
establishes that Nexstar training causes plumbing customers to leave.

## Goodmarks availability and feature claims, October 20, 2026

Reviewed `content/projects/goodmarks.md` against Goodmarks' public product pages.
The previous write-up described a finished native app released to both stores,
store subscriptions, customer adoption, and revenue without supporting release
or business records. The following first-party sources support a narrower account:

| Source | Evidence | Limits / correction |
| --- | --- | --- |
| [Public homepage](https://goodmarks.io/) | Web signup is offered; the iOS/Android section invites notification when the native app ships. | Replace the blanket Live metric with Web signup and remove assertions of a finished native release. A reachable marketing page does not prove successful signup, active users, revenue, or service reliability. |
| [Routing explanation](https://goodmarks.io/no-review-gating) | Low ratings get private feedback alongside the same public review destinations available to other ratings. | Correct the claim that unhappy customers go privately instead of publicly. This is documented intended behavior, not an exercised flow or a legal/compliance finding. |
| [Roadmap](https://goodmarks.io/roadmap) | SMS requests are upcoming; Smart Links and QR codes are beta; NFC tags are listed as placements. | Remove shipped SMS and native NFC-writing assertions. Link placement does not establish device-writing support. No delivery or hardware test was performed. |
| [Delight feature page](https://goodmarks.io/features/delight) | Gifting is beta, with caps and an owner approval queue for campaigns. The page distinguishes a private rating signal from a public review. | Remove the unqualified automatic five-star-reviewer reward and referral-cost claims. Gifting pages and older release notes vary on trigger/approval details, so this case study does not claim one verified end-to-end implementation. |
| [Stack credits](https://goodmarks.io/humans.txt), last updated May 7, 2026 | Next.js 15, React, TypeScript, Vercel, Supabase, and Stripe are named. | Attribute the web stack to these dated credits; do not infer a current version or validate the former Expo/React Native, biometric, push, local-security, or offline claims. |
| [Changelog](https://goodmarks.io/changelog), May 2026 entries | Web dashboard billing and a Stripe customer portal are described; several integrations and features carry beta labels. | Does not establish store subscriptions, production hardening, adoption, or measured outcomes. Release notes are first-party reports, not independent runtime verification. |

The public homepage also makes aggregate adoption/outcome claims, but no
underlying records or measurement method were reviewed. They are not copied into
this portfolio. No identifiable Goodmarks listing was found in bounded public
Apple/Google store searches, and no matching implementation repository was found
in Byron's public GitHub inventory. Those absences do not prove no listing or
private implementation exists; the native waitlist is the direct basis for the
availability correction. No private repository, account, purchase, signup, or
production setting was accessed.

Byron's service-business motivation is retained. The original publication date,
route, front-matter shape, heading anchors, and earlier-work grouping are
preserved. Archived is this portfolio's editorial group, not proof that Goodmarks
has shut down. Reinstating native-release, adoption, or revenue claims requires
identifiable release records or owner-supplied business evidence with a period
and source. That review left the separate Wade's Plumbing ranking claim for
follow-up; the dated Wade's Plumbing section above records its correction.

## byronwade/ui chrome and availability claims, October 20, 2026

`content/projects/byronwade-ui.md` told readers "You're looking at it right now":
a top-left launcher that morphed into a product switcher, a floating `--dock`
toolbar capsule, and a breadcrumb in the same material, plus a gold accent
"that runs through everything" and a "Used on: This site" metric. This site's
own history shows that chrome is gone:

| Source | Supports | Limits / correction |
| --- | --- | --- |
| Commit `6411efc` (2026-06-02, "Add byronwade/ui design system to projects and launcher") | The case study and its launcher entry were added together. | Does not establish when the morph chrome first shipped, so the write-up gives no start date. |
| [#56](https://github.com/byronwade/byronwade.com/pull/56) (`73496a0`, 2026-10-16) and [#80](https://github.com/byronwade/byronwade.com/pull/80) (`ad83258`, 2026-10-20) | #56 moved the site to the Thorbis Design port; `docs/THORBIS-DESIGN-PORT.md` records the capsule width/height morph as removed. #80 deleted `components/layout/app-launcher*.tsx` and `hooks/use-capsule-morph.ts`. | The chrome claims are now past tense, "until October 2026". |
| Current source at `7ec5eed` | The header (`components/layout/site-header.tsx`, `nav-dock.tsx`) is fixed; its menu is a Base UI `Popover` anchored below it (`header-popover-content.tsx`). Remaining lineage: `components/ui/pill.tsx`, the `--brand`/`--dock` token names (now aliases of `--thorbis-*`), and the theme toggle's circular View Transitions wipe (`hooks/use-theme-toggle.ts`, used by `dock-toolbar-client.tsx`). | `--thorbis-accent` is blue (`oklch(… 264.4)`), so the gold accent is described as former. |
| [ui.byronwade.com](https://ui.byronwade.com), accessed October 20, 2026 | Live; presents "Design systems that install as MCP" (design contracts). It does not mention the Morph Panel, launcher, or dock. | The closing link now says what the address hosts today. Its listed products are not described here. `/r/registry.json` returned 404; `components.json` resolves per-item `/r/{name}.json`, so that is not evidence the registry is gone. |
| [byronwade/ui.byronwade.com](https://github.com/byronwade/ui.byronwade.com) repository, `main` `package.json`, accessed October 20, 2026 | Depends on `radix-ui`, so "Radix primitives" stays for byronwade/ui itself. Repository API: created 2026-06-03, not archived. | `github.com/byronwade/ui` returned 404; that does not rule out a private repository. This site uses `@base-ui/react`, which the body now states. |

Byron's account that byronwade/ui was made to sit under GoodMarks, SignalRoute,
Thorbis, and this site is kept as design intent. No source here shows those
products currently ship on it, and "battle-tested", "reused everywhere I build",
and "in continuous development" had no supporting record, so they were reworded
or removed. The title, date, URL, archived grouping, front-matter keys, metric
labels, and heading anchors are unchanged. The dated article
`content/blog/design-systems-that-earn-their-keep.md` (July 12, updated August 7)
was reviewed and left as written: it describes the Morph Panel as a pattern and
says the launcher and dock "can share" its material, which was true when published.

## Memoria install and capability claims, October 21, 2026

`content/projects/memoria.md` was added in `ce21f0c` (2025-12-08). Its Claude
Desktop install line, `npx @anthropic/claude-code mcp add …`, could not work, and
three capability claims were stronger than the source. Checked against the
package `npx -y @byronwade/memoria` installs today, version 1.0.32 (npm `latest`,
published 2025-12-04 to 2025-12-08), unpacked and read without running it, and
the [byronwade/memoria](https://github.com/byronwade/memoria) repository at
`main` [`f6c5244`](https://github.com/byronwade/memoria/commit/f6c5244abe66c31330ef7c569b43f89e2814f615)
(2026-08-09):

| Claim | Source | Correction |
| --- | --- | --- |
| Claude Desktop: `npx @anthropic/claude-code mcp add memoria …` | npm returns 404 for `@anthropic/claude-code`; the CLI is `@anthropic-ai/claude-code`, and its `mcp add` registers a server with Claude Code, not Claude Desktop. Memoria's README configures Claude Desktop through `claude_desktop_config.json`. | Replaced with merging the same `mcpServers` entry into `claude_desktop_config.json` (macOS and Windows paths). The Claude Code line was already correct. The broken command is copied from Memoria's own README, which this site does not edit. |
| "Sub-100ms analysis" | [`benchmarks/RESULTS.md`](https://github.com/byronwade/memoria/blob/f6c5244abe66c31330ef7c569b43f89e2814f615/benchmarks/RESULTS.md) (2025-12-04, one darwin arm64 machine, one repository): full analysis averaged 114.12 ms (p95 134.88 ms); its own badge line says "<200ms". Cached coupling lookups averaged 0.02 ms. | Now "about a tenth of a second". The cache claim stays. One machine and one repository do not establish speed on other repositories. |
| "Runs 100% locally. No API keys, no cloud upload" | 1.0.32 `dist/index.js` and `dist/auth.js`: analysis runs on the local `.git` folder; an unlinked install makes no network request at startup and runs in offline mode. A linked device checks its status with `memoria.byronwade.com/api` at startup and syncs optional cloud memories. | Local analysis, no account/API key/code upload and offline use are kept; sign-in is described as optional and limited to cloud-synced memories. What those memories contain was not audited. |
| ">15% of the time", ">7 days" | `getAdaptiveThresholds` in 1.0.32: base 15% coupling / 7-day drift, adjusted to 10–25% and 3–14 days by commit pace and files per commit, overridable in `.memoria.json`. Drift compares file modification times on disk. | Both are now stated as adaptive, configurable defaults, and drift is described by modification time. |
| "One-line install for every major AI client" | Memoria's README lists Windsurf as manual config and Cline as a settings UI. | Reworded to one config entry per client. The Cursor one-liner gets a note that it replaces an existing `.cursor/mcp.json`. |

Also confirmed in 1.0.32: importers come from `git grep`; default panic keywords
include `revert` and `hotfix` with weights; the `memoria` binary starts the MCP
server when launched without a terminal, so the global-install line works.
Repository HEAD declares `@byronwade/memoria` 1.1.1, which is not on npm, so
the write-up describes the published 1.0.32. [memoria.byronwade.com](https://memoria.byronwade.com),
accessed October 21, 2026, now presents an MCP server plus GitHub App for
pull-request risk reports; the closing paragraph says so without describing
those products. Title, date, URL, archived grouping, front matter and headings
are unchanged. No package code was executed, no account was created and no
production setting was touched.

## Rebuzzle AI pipeline claims, October 21, 2026

`content/projects/rebuzzle.md` was added in `584c39b` (2025-12-01), though its
front matter says 2024-12-01. Its claims were checked against
[byronwade/rebuzzle.byronwade.com](https://github.com/byronwade/rebuzzle.byronwade.com)
at [`a16c141`](https://github.com/byronwade/rebuzzle.byronwade.com/commit/a16c1412488379a0c7f6af2033139cda535eb998)
(2025-12-01 14:33 ET, the last commit before the write-up was added), tracing
the daily path: `vercel.json` cron (`0 0 * * *`) →
`src/app/api/cron/generate-puzzles` → `src/app/api/workflows/daily-content` →
`generateNextPuzzle` → `generateMasterPuzzle({ qualityThreshold: 70, maxAttempts: 3 })`
in `src/ai/services/master-puzzle-orchestrator.ts`.

| Claim | Source at `a16c141` | Correction |
| --- | --- | --- |
| Next.js 15 | `package.json`: `next ^16.0.0`, `ai ^5.0.76`, `mongodb ^6.0.0`; that day's commits fix "Next.js 16 Cache Components". | Next.js 16, dated December 2025. Current `main` (`ed3ff19`, 2026-08-27) is a monorepo on Next.js 16.3.1 and AI SDK 7; it was not re-audited. |
| A team of four agents generates every puzzle | `src/ai/agents/orchestrator.ts` has generator, quality, difficulty and personalized-generator agents, but `master-puzzle-orchestrator.ts` uses them only when `featureFlags.agentOrchestration` is set. `src/ai/config/feature-flags.ts` labels it experimental: on in development, off in production unless `AI_ENABLE_AGENT_ORCHESTRATION` is `true`/`1`. | The default daily run is described as separate generation, quality and difficulty AI steps; the four-agent mode is described as experimental and off in production by default. Production environment variables were not checked. |
| Seven dimensions "including … cultural sensitivity"; below 70 sent back | `quality-assurance.ts` schema: clarity, creativity, solvability, appropriateness, visualAppeal, educationalValue, funFactor (plus overall), 0–100. The daily call passes `qualityThreshold: 70, maxAttempts: 3`. | The seven named dimensions replace "cultural sensitivity" (cultural bias is an adversarial-test prompt, not a score). Retry limit stated. |
| Six-stage pipeline with adversarial testing as stage 5 and "final validation" as stage 6 | The orchestrator labels five stages: generation, uniqueness, difficulty calibration, quality assurance, decision. Adversarial testing is inside stage 4 with `skipAdversarial = attempt === 1`. After acceptance the puzzle is saved and an embedding generated. | Now five stages; adversarial testing runs on retries only. |
| >80% similar "determined via vector cosine similarity" is rejected | `uniqueness-tracker.ts` `calculateSimilarity`: 0.6 × answer Levenshtein similarity + 0.4 × emoji Jaccard; stage 2 rejects above 0.8 and runs for rebus only. | Described as answer/emoji similarity, rebus only. |
| Semantic search powers "puzzles about cats" → 🐱 | Embeddings are stored on puzzles; `src/app/api/puzzles/semantic-search` ranks by cosine similarity. No page or client code in `src` requested that route. | Kept as an API route not yet used by the app; the cats example was not reproduced and is removed. |
| Semantic caching serves similar requests and "significantly reduces API costs" | `src/ai/cache.ts` `getBySimilarity` is reached only through `withCache`, and nothing outside `cache.ts`/`ai/index.ts` calls `withCache` or its wrappers. | Described as written but unused; no cost claim. |
| Learns from play and auto-calibrates difficulty; 90% abandonment example | `puzzle-learning.ts` computes solve/abandonment rates, estimated actual difficulty and problem puzzles, but has no database write; neither do its callers (`src/app/api/puzzles/performance`, the agent tools). It reads `abandoned` from `puzzleAttempts`, where no app code sets it; abandonment is recorded separately as `analyticsEvents` via `src/app/api/analytics/completion`. | Analysis described as available but not written back or used by the daily run; the 90% figure (illustrative, never measured) is removed. |

Also fixed the "does does" typo. The intro's "self-correcting, learning system" is
kept as what Byron set out to build. Title, URL, archived grouping, front-matter
keys and headings are unchanged; the excerpt now matches the corrected body.
The 2024-12-01 date is left as-is: the repository was created 2024-07-11, so it
may be the project date rather than the write-up date (question for Byron).
No Rebuzzle code was run, no account was used and production configuration was
not inspected.

## ReactPress stack and capability claims, October 21, 2026

`content/projects/reactpress.md` was added as a short entry in `584c39b`
(2025-12-01) and expanded into the current write-up in `ef54a5a` (2025-12-02).
Its claims were checked against
[byronwade/reactpress.byronwade.com](https://github.com/byronwade/reactpress.byronwade.com)
(the old `byronwade/ReactPress` address redirects there) at `main`
[`64b56a8`](https://github.com/byronwade/reactpress.byronwade.com/commit/64b56a835f654e219cdcb9d676a1dc77d247db1a)
(2025-06-21), which is still the latest commit on `main`, and against
[reactpress.byronwade.com/rp-admin](https://reactpress.byronwade.com/rp-admin),
accessed October 21, 2026. All 63 source files at that commit were downloaded and
searched; nothing was installed or run.

| Claim | Source at `64b56a8` | Correction |
| --- | --- | --- |
| Next.js 15 (excerpt, body, roadmap, performance section) | `package.json`: `next ^14.2.30`, `react ^18.3.1`, `typescript ^4.9.5`. `next ^15.3.4` was tried in `379f5f6` and `839b6cb` (2025-06-20) and reverted to 14 in `6371112` the same evening. The repo's own README and page metadata still say Next.js 15. | Next.js 14 throughout, excerpt included. |
| Bun "for package management and runtime" | `bun.lockb` and `package-lock.json` are both committed; every script calls `next` directly. | Bun or npm for installs; no runtime claim. |
| "Faithfully recreates every aspect … from the post editor to the settings pages. Every pixel, every interaction, every workflow" | 39 `page.tsx` routes under `src/app/rp-admin`, mostly static WordPress markup styled by a copied 18,664-line `rp-admin/index.css`. `posts/post-new` and `pages/page-new` render only "this is the posts bilder page" (also live); the block editor code is commented out and the `@wordpress/*` packages are imported only in those comments. | The 39 screens are listed; the editor is described as a placeholder. |
| "A working alternative" / "a functional admin interface" | No `fetch`, API route or data store in `src`. `utils/setup.js` only logs "Setting up database..."; its MongoDB/Firebase code is commented out. `utils/provider.js` wraps SWR and Recoil but nothing mounts it. | Screens on `main` render but do not load or save anything. |
| API-first design that "works with any backend" | As above. | Kept as the plan; stated that `main` has no data layer. |
| CSS conversion to Tailwind "currently in progress" | Tailwind is configured, but the screens use WordPress class names and the copied stylesheet. No commits on `main` after 2025-06-21. | Unfinished on `main`. |
| "Fast"; performance "needed for real-world field operations"; "6–12 months" to build an admin | No benchmark or source in the repo. The README's "5x faster than traditional WordPress admin" has no measurement behind it either. | Removed; the write-up says no speed was measured. |
| "Open source" | GitHub reports no license and there is no license file, although the README shows an MIT badge. | "Public on GitHub" with no license file. |
| Reusable dashboard widget and form components | Shared components are the sidebar, toolbar, footer, screen-options toggle and list table. The dashboard (`rp-admin/page.tsx`, 541 lines) and settings forms are inline. | Says which pieces are shared and that extracting the rest is still to do. |

Two unmerged branches were pushed on 2026-06-11 and 06-12, after the write-up:
`claude/admiring-goldberg-c6t9fl` (28 commits ahead of `main`: dead-CSS removal,
`rp-admin/index.css` trimmed from 18,664 to 9,839 lines, admin shell converted to
Tailwind) and `claude/lucid-cannon-fujppo` (17 ahead: a Fakebase mock backend
wired to the users, posts, pages, comments, plugins, categories, tags, media,
dashboard and General Settings screens; the editors stay placeholders). Only their
commit lists were read. The write-up mentions them as unmerged work and makes no
claim about how well they work.

Byron's motivation and the field-management-system framing are kept as intent,
reworded where they described unbuilt work as existing. Title, URL, archived
grouping, front-matter keys and headings are unchanged. The front matter's
2024-01-01 date is left as-is: the repository was created 2023-03-04 and most
work landed in March and October 2023, October 2024 and June 2025, so the right
date is a question for Byron.

## Content Management System prototype claims, October 21, 2026

`content/projects/content-management-system.md` was added as a short entry in
`584c39b` (2025-12-01) and expanded into the current write-up in `ef54a5a`
(2025-12-02). Its claims were checked against
[byronwade/cms.byronwade.com](https://github.com/byronwade/cms.byronwade.com)
at `main` [`8353417`](https://github.com/byronwade/cms.byronwade.com/commit/8353417acc1264355b73177cd6882c98d1a122e6)
(2025-12-02 03:08 UTC), the latest of its 16 commits and four minutes older than
`584c39b`; its other branches have nothing `main` lacks. The previous commit,
`8b7a050`, moved it from Next.js 15 to 16. Of the 22 files that changed between
the two, most are formatting and lint fixes plus a landing-page rewrite; the only
file cited below that changed is `app/cms/build/page.tsx` (+10/−4), which was read
at `8353417`. Nothing was
installed or run, so interactive behavior comes from reading the code. The
repository README at that commit calls the project "entirely a design-only demo"
in which "All data is fake".

| Claim | Source at `8353417` | Correction |
| --- | --- | --- |
| "Visit cms.byronwade.com"; front-matter `url` `https://cms.byronwade.com/cms/build` | On October 21, 2026, `/`, `/cms/build` and four other paths returned 404 with `X-Vercel-Error: DEPLOYMENT_NOT_FOUND`. | `url` removed, so the page no longer shows a dead Visit link or live preview. The body links the repository instead, which gives the page a Source button. |
| "Currently in active development" | No commits after 2025-12-02; most of the work landed 2024-12-20 to 12-29. | Front-end prototype, stopped December 2025. |
| Zero JavaScript by default; data fetched in Server Components "without exposing API endpoints" | `app/cms/layout.tsx` and every working `app/cms/**` screen start with `"use client"`. The content editor (`app/cms/content/[...slug]/page.tsx`) calls `fetch('/api/content/…')`, and `app/api/content/[...slug]/route.ts` reads and writes JSON files. Server-rendered pages: landing, `analytics/overview` and three redirects. | Kept as the plan, with a statement that the prototype did not get there. |
| Schema builder: create tables by drag and drop; export schemas | `app/cms/build/page.tsx` (ReactFlow): tables come from hard-coded `initialNodes`. The drop handler adds AI nodes for `application/aiflow` data, which is all the sidebar sets. `components/build/header.tsx`'s Add Table button is not rendered anywhere, and nothing dispatches `build:addTable`. No export or SQL generation exists. Add Field, data types and `onConnect` relationships exist. | Lists what works; adding tables and export are named as not wired up. |
| Media management, analytics dashboard, publishing as working features (Phase 1 checklist) | Upload progress is simulated with `setTimeout` (`components/media/upload-dialog.tsx`); analytics use `Math.random()` (`lib/nodes/analytics/MetricsNode.ts`); the publish board is filled with hard-coded items. | Checklist and FMS mappings say these run on sample data. "Performance optimizations" removed from the checklist (no measurement). |
| Radix "ensuring WCAG compliance" | No audit or accessibility tests; no tests at all. | Described as a starting point that was never audited. |
| "Easy dark/light mode switching"; Zustand "DevTools support" | `<html className="dark">` is hard-coded; `next-themes` is installed but no ThemeProvider is mounted. The three Zustand stores do not use the devtools middleware. | Dark by default with no switch; DevTools bullet removed. |
| Next.js 16 throughout | `next ^16.0.0` only from `8b7a050` (2025-12-01); Next.js 15 before that. | Next.js 16 since December 2025, started on 15. |
| "Built on a foundation that's already proven its worth" | Prototype on sample data, deployment gone. | Now "built on what this prototype taught me". |

Byron's reasons, the FMS mappings, the agriculture context, the roadmap and the
lessons are kept as intent. Title, category, archived grouping and headings are
unchanged; the excerpt now matches the corrected body. The front matter's
2023-08-01 date is left as-is, but the repository was created 2024-12-20 and the
write-up's own heading asks "Why Build a CMS in 2024?", so the right date is a
question for Byron. The repository has no license file.

## Project destination availability, October 21, 2026

All 16 project front-matter `url` destinations were requested with HTTP GET,
following redirects, on October 21, 2026. These checks establish availability
at that time, not feature completeness or the accuracy of the case studies.

| Project | Destination | Result |
| --- | --- | --- |
| byronwade/ui | [ui.byronwade.com](https://ui.byronwade.com) | 200 |
| Ciel | `https://ciel.byronwade.com` | 404, Vercel `DEPLOYMENT_NOT_FOUND`, confirmed by a second GET |
| Dits | [dits.byronwade.com](https://dits.byronwade.com) | 200 |
| Fakebase | [fakebase.byronwade.com](https://fakebase.byronwade.com) | 200 |
| Goodmarks | [goodmarks.io](https://goodmarks.io) | 200 |
| Impact Marine Group | [impactmarinegroup.com](https://impactmarinegroup.com) | 403, bot challenge; retained, not classified as a dead deployment |
| Memoria | [memoria.byronwade.com](https://memoria.byronwade.com) | 200 |
| Mushroom Cultivation Supplier | [zugz.byronwade.com](https://zugz.byronwade.com) | 200 |
| ReactPress | [reactpress.byronwade.com/rp-admin](https://reactpress.byronwade.com/rp-admin) | 200 |
| Rebuzzle | [rebuzzle.byronwade.com](https://rebuzzle.byronwade.com) | 200 |
| SignalRoute | [getsignalroute.com](https://getsignalroute.com) | 200 |
| Stream | [stream.byronwade.com](https://stream.byronwade.com) | 200 |
| Thorbis Design | [design.thorbis.com](https://design.thorbis.com) | 200 |
| Thorbis | [thorbis.com](https://thorbis.com) | 200 |
| Wade's Plumbing and Septic | [wadesplumbingandseptic.com](https://wadesplumbingandseptic.com) | 200 after redirect to `www` |
| Wormhole | [wormhole.byronwade.com](https://wormhole.byronwade.com) | 200 |

Ciel's [public repository](https://github.com/byronwade/ciel.byronwade.com)
returned 200. Its repository metadata lists `https://cielbyronwadecom.vercel.app`
as the homepage, but that address also returned 404 with `DEPLOYMENT_NOT_FOUND`.
The README at [`9493ede`](https://github.com/byronwade/ciel.byronwade.com/blob/9493ede6f2c03d510c77171dc84244680323115a/README.md)
identifies the project as a frontend prototype with mock data and stubbed auth.
Only the dead demo reference was changed: the optional front-matter `url` is
removed and the closing invitation now links to the source with a dated
availability note. This reuses the project page's existing Source action and
omits its Visit action and screenshot preview. No project route, date,
classification, layout, or feature claim was changed.

Impact Marine's challenge was not treated as evidence of a dead site. Its
[public page](https://www.impactmarinegroup.com/), also checked through a separate
web reader, still presents the dealership. No bypass was attempted and its link
was retained.

## Ciel and Stream prototype claims, October 21, 2026

Both case studies now follow their public repositories' `main`, the only branch
in each: Ciel at
[`9493ede`](https://github.com/byronwade/ciel.byronwade.com/tree/9493ede6f2c03d510c77171dc84244680323115a)
and Stream at
[`5d9cbcc`](https://github.com/byronwade/stream.byronwade.com/tree/5d9cbcca5bb6ce2c02b24896d238adc1bf854a5d).
Every commit in both histories (five for Ciel, three for Stream) is dated
June 1, 2026 in its author's time zone, so the `2026-06-01` front-matter dates
and the Archived grouping are kept. Neither repository is marked archived on
GitHub, and neither has a license file. Both READMEs describe frontend-only
prototypes with mock data. The Stream demo at `stream.byronwade.com` returned
200 with the title "Stream — Live Platform Concept"; Ciel's demo is covered by
the availability section above.

The Stream page gained a link to its repository, so it now has a Source action
next to Visit. Titles, routes, categories, taglines, dates and featured flags
are unchanged. The Ciel title still contains "Actually" and its body still names
Netlify, which `tests/search.test.mjs` relies on.

### Stream

| Earlier claim | Source evidence and resulting correction |
| --- | --- |
| Discovery boosts small communities and ranks on chat health, creator response rate and newcomer friendliness | The default [discover sort](https://github.com/byronwade/stream.byronwade.com/blob/5d9cbcca5bb6ce2c02b24896d238adc1bf854a5d/src/lib/data/index.ts#L139-L177) orders by `discovery.fitScore`, a number stored in the seed JSON. [`smallCommunityBoost`](https://github.com/byronwade/stream.byronwade.com/blob/5d9cbcca5bb6ce2c02b24896d238adc1bf854a5d/src/lib/types/index.ts#L64) and [`creatorResponseRate`](https://github.com/byronwade/stream.byronwade.com/blob/5d9cbcca5bb6ce2c02b24896d238adc1bf854a5d/src/lib/types/index.ts#L40) are declared and seeded, but nothing reads them. The [rising-creators rail](https://github.com/byronwade/stream.byronwade.com/blob/5d9cbcca5bb6ce2c02b24896d238adc1bf854a5d/src/lib/data/index.ts#L126-L130) sorts by `newViewerResponseRate`. The thesis section now states the goal, and a new paragraph says what is shown today and that no formula combines the signals yet. |
| Base UI primitives and a command palette | [`package.json`](https://github.com/byronwade/stream.byronwade.com/blob/5d9cbcca5bb6ce2c02b24896d238adc1bf854a5d/package.json) has no Base UI or cmdk dependency, and no palette component or Cmd/Ctrl+K handler exists in `src`. Both claims removed; the page says the components are hand-built. |
| Bloom panels use shared-element transitions | [`BloomLayer`](https://github.com/byronwade/stream.byronwade.com/blob/5d9cbcca5bb6ce2c02b24896d238adc1bf854a5d/src/components/bloom/bloom-layer.tsx#L91-L120) accepts a `layoutId`, and so does `StreamCard`, but no caller passes one. The panels fade and scale with Motion, honor reduced motion and trap focus. They are [driven by `?panel=`](https://github.com/byronwade/stream.byronwade.com/blob/5d9cbcca5bb6ce2c02b24896d238adc1bf854a5d/src/app/live/%5BstreamSlug%5D/watch-client.tsx#L60-L129); nine are listed, including the discovery-preferences panel the old list missed. The README still says "shared-element"; this page does not. |
| Structured chat with sentiment and moderation flags | Chat has four tabs. [The filter](https://github.com/byronwade/stream.byronwade.com/blob/5d9cbcca5bb6ce2c02b24896d238adc1bf854a5d/src/components/chat/chat-panel.tsx#L155-L161) hides deleted messages, shows questions in Questions and pinned messages in Highlights. `sentiment` is stored on each message and never displayed. Copy names the tabs and the pinned and deleted behavior. |
| Catch Me Up and Join Late | Kept. [`shouldShowJoinLate`](https://github.com/byronwade/stream.byronwade.com/blob/5d9cbcca5bb6ce2c02b24896d238adc1bf854a5d/src/lib/utils/catch-up.ts#L17-L21) shows the prompt once a live stream is more than 45 seconds old, and its button opens the catch-up panel. |
| A complete creator studio with monetization "fully modeled" | All [studio routes](https://github.com/byronwade/stream.byronwade.com/tree/5d9cbcca5bb6ce2c02b24896d238adc1bf854a5d/src/app/studio) exist. The [restream page](https://github.com/byronwade/stream.byronwade.com/blob/5d9cbcca5bb6ce2c02b24896d238adc1bf854a5d/src/app/studio/restream/restream-client.tsx#L20) calls its destinations mock with fake keys, and the monetization page calls its figures mock data. Copy says so. Only one seeded stream has replay chapters. |
| 30-plus routes, static export, `localStorage` with `useSyncExternalStore`, JSON seeds, Vitest, Playwright and Storybook | Kept and made exact: 33 `page.tsx` templates, [`output: "export"`](https://github.com/byronwade/stream.byronwade.com/blob/5d9cbcca5bb6ce2c02b24896d238adc1bf854a5d/next.config.ts#L4), twelve JSON seed files, stores under `src/lib/stores`, three Vitest unit files, four Playwright specs (flows, stream, axe accessibility, visual) and 14 stories. None of these were run for this review. |
| "In active development" | The last commit is June 1, 2026 and the page is Archived. Now "I built it in June 2026". |

### Ciel

| Earlier claim | Source evidence and resulting correction |
| --- | --- |
| Hierarchical budgets at workspace, project and environment level, with budget-pause logic | [`BudgetMode`](https://github.com/byronwade/ciel.byronwade.com/blob/9493ede6f2c03d510c77171dc84244680323115a/types/index.ts#L3) has four modes, and caps exist on the workspace and each project only. A project shows as paused because its [mock `status` is `"paused"`](https://github.com/byronwade/ciel.byronwade.com/blob/9493ede6f2c03d510c77171dc84244680323115a/app/app/projects/%5Bproject%5D/overview/page.tsx#L43-L45), not from spend reaching the cap. The [budget meter](https://github.com/byronwade/ciel.byronwade.com/blob/9493ede6f2c03d510c77171dc84244680323115a/components/ciel/budget-meter.tsx#L22-L24) does compare spend to the cap and turns to warning at 75% and critical at 100%. "Environment" appears only in the banner's wording. Copy names the four modes and the paused sample project. |
| Step-up reauthentication on sensitive actions | [`reauthRequired`](https://github.com/byronwade/ciel.byronwade.com/blob/9493ede6f2c03d510c77171dc84244680323115a/lib/dialog-registry.ts#L9-L18) is set on dialogs such as reveal and rotate secret, but [the dialog host](https://github.com/byronwade/ciel.byronwade.com/blob/9493ede6f2c03d510c77171dc84244680323115a/components/dialogs/dialog-host.tsx#L72-L75) never reads it; both dialog footers call the same handler, which shows a success toast and closes. The reveal dialog only says identity will be verified. A separate `/auth/re-auth` screen exists. Copy says the flag is not enforced yet. |
| Every modal state is linkable | The [registry](https://github.com/byronwade/ciel.byronwade.com/blob/9493ede6f2c03d510c77171dc84244680323115a/lib/dialog-registry.ts) holds 29 dialogs and 4 side panels, all driven by `?dialog=` and `?panel=`. The command palette and app launcher use local state. Copy counts the registered overlays and says submitting saves nothing. |
| Anonymous actors get a hashed animal name and a matching OKLCH gradient | [`animalName`](https://github.com/byronwade/ciel.byronwade.com/blob/9493ede6f2c03d510c77171dc84244680323115a/lib/identity.ts#L23-L26) has no caller. [`gradientFor`](https://github.com/byronwade/ciel.byronwade.com/blob/9493ede6f2c03d510c77171dc84244680323115a/lib/identity.ts#L29-L37) drives `GradientAvatar`, seeded by email on the team page and by author on the marketing page. Copy describes avatars and says the name helper is unused. |
| One-click recovery on every failure; DNS tracked like a package in transit | Parsed issues in the deployment mocks each carry a fix link, and there are rollback, redeploy and resume actions. A DNS record card shows found, missing, mismatched or pending with a copy button. Copy describes those. |
| Auth flows "built out properly" | Each listed step has its own route under [`app/auth`](https://github.com/byronwade/ciel.byronwade.com/tree/9493ede6f2c03d510c77171dc84244680323115a/app/auth). Sign-in and passkey buttons only [set a demo session cookie](https://github.com/byronwade/ciel.byronwade.com/blob/9493ede6f2c03d510c77171dc84244680323115a/lib/auth/mock-session.ts#L14-L16), and `middleware.ts` checks that the cookie exists. Copy says so. |
| Polished first-run setup flow | `?welcome=1` shows one card asking for a workspace name and goal, then links to the six-step new-project wizard. Copy describes exactly that. |
| Next.js 16, React 19, Tailwind 4, shadcn on Base UI, Recharts, cmdk, next-themes | Kept. [`package.json`](https://github.com/byronwade/ciel.byronwade.com/blob/9493ede6f2c03d510c77171dc84244680323115a/package.json) lists each; `components.json` uses the `base-nova` style; Recharts draws the traffic-attribution chart. |
| "In active development" | Last commit June 1, 2026 (Pacific). Now "built in June 2026". |

This was source reading only. Neither prototype was built, tested or clicked
through, and no code, dependency, account, service or setting was changed in
either repository.

## Fakebase API and export claims, October 21, 2026

`content/projects/fakebase.md` was added in `801a940` (June 2, 2026,
23:53:25 UTC), with a front-matter date of May 30. The old source URL,
`byronwade/fakebase`, returns 404; the public repository is
[byronwade/fakebase.byronwade.com](https://github.com/byronwade/fakebase.byronwade.com).
Its available main history begins with
[`758e902`](https://github.com/byronwade/fakebase.byronwade.com/commit/758e902b3c3bc246efc1a6d857fcf389b0b388bf)
(June 3, 00:08:39 UTC), after the write-up was added. The API query for commits
before the write-up returned none. This review therefore corroborates later public
implementation, not the state on the article's original date.

Implementation was inspected at latest main
[`2f60fe6`](https://github.com/byronwade/fakebase.byronwade.com/commit/2f60fe695ca0cac03e18f954a231ca446fb3479c)
(June 3, 2026, 04:04:25 UTC). Source files were read without installing or running
Fakebase. No live Supabase migration, performance comparison, deployment parity,
package publication or passing upstream test run was established.

| Claim | Pinned source and correction |
| --- | --- |
| MIT, free and actively maintained flagship | The [license](https://github.com/byronwade/fakebase.byronwade.com/blob/2f60fe695ca0cac03e18f954a231ca446fb3479c/LICENSE) supports MIT. Ongoing maintenance and commercial-grade operation are not established; copy now states why Byron made it available. Archived remains this site's editorial grouping, not GitHub's repository flag. |
| Complete Supabase-compatible client including `rpc` | The [client interface and factory](https://github.com/byronwade/fakebase.byronwade.com/blob/2f60fe695ca0cac03e18f954a231ca446fb3479c/packages/client/src/create-client.ts) have no `rpc` method; the URL and key are ignored in favor of a required kernel. The [kernel](https://github.com/byronwade/fakebase.byronwade.com/blob/2f60fe695ca0cac03e18f954a231ca446fb3479c/packages/core/src/kernel.ts) invokes a local JavaScript function registry. Copy says Supabase-shaped, with partial compatibility. |
| Everything runs in memory; auth and storage reproduce production services | The [memory factory](https://github.com/byronwade/fakebase.byronwade.com/blob/2f60fe695ca0cac03e18f954a231ca446fb3479c/packages/adapter-memory/src/memory-adapter.ts) wires local auth and filesystem storage. The [auth service](https://github.com/byronwade/fakebase.byronwade.com/blob/2f60fe695ca0cac03e18f954a231ca446fb3479c/packages/auth/src/local-auth.ts) uses a development password representation, local OTP inbox and local identifiers for sessions. The [storage service](https://github.com/byronwade/fakebase.byronwade.com/blob/2f60fe695ca0cac03e18f954a231ca446fb3479c/packages/storage/src/local-storage.ts) stores bytes on disk and token records in memory. Copy distinguishes these from hosted auth and storage. |
| Realtime broadcast, change streams and presence all work through the client | The [client channel](https://github.com/byronwade/fakebase.byronwade.com/blob/2f60fe695ca0cac03e18f954a231ca446fb3479c/packages/client/src/realtime-client.ts) uses kernel mutation events and invokes same-object broadcast listeners. It stores presence callbacks but has no track/untrack/presenceState or presence dispatch. The [separate realtime channel](https://github.com/byronwade/fakebase.byronwade.com/blob/2f60fe695ca0cac03e18f954a231ca446fb3479c/packages/realtime/src/channel.ts) contains richer behavior but is not the channel returned by createClient. The article names that boundary. |
| Complete export path to real Supabase | [Migration export](https://github.com/byronwade/fakebase.byronwade.com/blob/2f60fe695ca0cac03e18f954a231ca446fb3479c/packages/cli/src/commands/migrate.ts) copies existing SQL files; local apply loads schema IR and updates a ledger rather than replaying arbitrary SQL. [Seed export](https://github.com/byronwade/fakebase.byronwade.com/blob/2f60fe695ca0cac03e18f954a231ca446fb3479c/packages/cli/src/commands/seed.ts) uses kernel.snapshot, which is empty when an adapter lacks exportData; PGLite lacks it. [Type generation](https://github.com/byronwade/fakebase.byronwade.com/blob/2f60fe695ca0cac03e18f954a231ca446fb3479c/packages/cli/src/commands/types.ts) is separate and writes example profiles types without a loaded schema. Copy describes inputs requiring real-stack validation, not an automatic migration. |
| Unsupported features always throw CapabilityError; no silent faking | Unsupported [auth methods](https://github.com/byronwade/fakebase.byronwade.com/blob/2f60fe695ca0cac03e18f954a231ca446fb3479c/packages/client/src/auth-client.ts) return the error in a result. [Registry assertions](https://github.com/byronwade/fakebase.byronwade.com/blob/2f60fe695ca0cac03e18f954a231ca446fb3479c/packages/core/src/capability.ts) throw. The [CLI runtime](https://github.com/byronwade/fakebase.byronwade.com/blob/2f60fe695ca0cac03e18f954a231ca446fb3479c/packages/cli/src/runtime.ts) can fall back to memory when SQLite/PGLite construction fails. The universal guarantee is removed; vector search and PITR remain outside the implemented production-service scope. |
| AI init generates project schema scaffolding | [The command](https://github.com/byronwade/fakebase.byronwade.com/blob/2f60fe695ca0cac03e18f954a231ca446fb3479c/packages/cli/src/commands/ai.ts) writes five static instruction/reference templates, including a hard-coded profiles schema summary. It does not call the [schema-aware generator](https://github.com/byronwade/fakebase.byronwade.com/blob/2f60fe695ca0cac03e18f954a231ca446fb3479c/packages/ai/src/rules-generator.ts). Copy says starter templates. |
| PGLite provides unqualified real Postgres semantics | The [adapter](https://github.com/byronwade/fakebase.byronwade.com/blob/2f60fe695ca0cac03e18f954a231ca446fb3479c/packages/adapter-pglite/src/pglite-adapter.ts) really uses PGlite, but generated tables omit foreign keys, defaults and complex filters use JavaScript, and the shared JS policy engine replaces Postgres roles. Copy keeps the real engine and states its local limits. [SQLite](https://github.com/byronwade/fakebase.byronwade.com/blob/2f60fe695ca0cac03e18f954a231ca446fb3479c/packages/adapter-sqlite/src/sqlite-adapter.ts) uses better-sqlite3; [JSON](https://github.com/byronwade/fakebase.byronwade.com/blob/2f60fe695ca0cac03e18f954a231ca446fb3479c/packages/adapter-json/src/json-adapter.ts) persists table data. Adapter durability does not imply persisted auth/session/storage metadata. |
| Current Turborepo, eighteen packages, separate apps and CI release practice | The [initial manifest](https://github.com/byronwade/fakebase.byronwade.com/blob/758e902b3c3bc246efc1a6d857fcf389b0b388bf/package.json) and initial workflows describe that architecture. On reviewed main, the [root manifest](https://github.com/byronwade/fakebase.byronwade.com/blob/2f60fe695ca0cac03e18f954a231ca446fb3479c/package.json) is the Next site, workspace membership is packages/* (19 package manifests), and turbo configuration, apps/ and workflow files are absent. Vitest and Playwright test sources remain. Copy qualifies historical workflow configuration and removes the package count. |
| verify supabase establishes production compatibility | The [command](https://github.com/byronwade/fakebase.byronwade.com/blob/2f60fe695ca0cac03e18f954a231ca446fb3479c/packages/cli/src/commands/verify.ts) uses its own memory fixture, not the user's selected adapter or exported schema. Its [default suite](https://github.com/byronwade/fakebase.byronwade.com/blob/2f60fe695ca0cac03e18f954a231ca446fb3479c/packages/test-utils/src/compat-runner.ts) has twelve database-only scenarios. Missing real Supabase yields PARTIAL; real-side exceptions or matching top-level shapes can yield CLOSE. Only UNSUPPORTED/ERROR fail the command. It does not certify auth, storage, realtime or exports; copy states the limitation. |

The [separate server package](https://github.com/byronwade/fakebase.byronwade.com/tree/2f60fe695ca0cac03e18f954a231ca446fb3479c/packages/server)
adds HTTP and WebSocket endpoints for real Supabase clients. Its interoperability
test files support an implemented local server path, not a claim that those tests
passed or that it reproduces the hosted service. The article no longer calls all
usage entirely in-process.

All five public branch heads were compared with pinned main on October 21:
`restore-library` (`0ebc5f8`) is 0 ahead / 21 behind;
`changeset-release/main` (`b13803d`) is 1 ahead / 25 behind, changing release
metadata only; the dependency branches (`f305cd1`, `95aab2b`) are each 1 ahead /
0 behind and change manifests/lockfile only. Main is `2f60fe6`. These comparisons
do not show later unmerged functionality. No private, deleted or unpublished
history was available, so earlier capability and maintenance are not inferred.

Title, published route, front-matter keys/date, category, archived grouping and
section headings are retained. The redundant leading Markdown title no longer
implies an unmeasured speed advantage. The excerpt follows the corrected body and flows
through the existing metadata/search owners. No project code, dependencies,
production environment, accounts or services were changed.

## Dits local engine and roadmap claims, October 21, 2026

The Dits case study now follows public main at
[`cc30c403`](https://github.com/byronwade/dits/tree/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147)
(August 13, 2026). Its December 9, 2025 date is kept: the article was added in
site commit
[`f3cd5e62`](https://github.com/byronwade/byronwade.com/commit/f3cd5e6265d0d5a3b5c76316e8629e9ba5b064a5).
The public Dits repository was created December 13, 2025 (UTC), and its earliest
visible commit is
[`4d80c8d2`](https://github.com/byronwade/dits/commit/4d80c8d28d5ff9e67e29fa40a8d77b2247d7e667)
from that day. That shows when the article was published, not what worked on
that date, and it does not rule out earlier private work, so the article dates
its capability review instead. Archived is this site's editorial grouping;
GitHub does not mark the Dits repository archived. All seven other branches
(`agent/align-product-docs-marketing`, `agent/deep-research-foundations`,
`alert-autofix-13`, `claude/dits-open-source-launch-4d4t77`,
`claude/tender-cori-1zi8s6`, `imgbot`, `perf/systemic-fast-paths`) have
diverged from main; their commit lists were read, and none of their unmerged
work is described as current.

The upstream
[implementation status](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/docs/STATUS.md)
separates current local behavior, experiments, designs and historical backend
code. The CLI parser, dispatch and handlers were read to confirm it rather than
treating a README, dependency, command name or design document as proof.

| Earlier claim | Source evidence and resulting correction |
| --- | --- |
| Every file goes through the same chunk store | The [workspace](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/Cargo.toml) builds `dits-core` and the CLI. [Repository ingest](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/apps/cli/src/store/repository.rs#L1152-L1218) sends supported text to embedded Git blobs and binaries to chunks, with a separate MP4 path. Streaming applies to binary files at or above 1 MiB (`STREAMING_INGEST_THRESHOLD`); text and MP4 can buffer the whole file. |
| FastCDC, BLAKE3, manifests and checkout | Implemented: [shared chunker](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/packages/dits-core/src/chunk.rs), [BLAKE3 hasher](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/packages/dits-core/src/hash.rs), [commit and checkout](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/apps/cli/src/store/repository.rs#L2028-L2245). [Chunk reads](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/apps/cli/src/store/objects.rs#L248-L311) rehash and reject mismatches; [manifest and commit reads](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/apps/cli/src/store/objects.rs#L385-L462) check their content hashes. Text goes through libgit2, so the copy does not claim BLAKE3 on every read. Reuse is limited to byte-identical content, not re-encoded media. |
| Journal recovery, automatic corruption repair and deleting GC | [Commit](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/apps/cli/src/store/repository.rs#L2028-L2155) publishes objects, ref and index in separate steps; the [ref store](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/apps/cli/src/store/refs.rs) writes refs directly with no journal. Upstream status limits reflog coverage to commit and checkout and disables destructive GC ([guard](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/apps/cli/src/commands/repo/gc.rs)). Copy keeps the integrity checks and tells readers to keep backups. |
| QUIC resumable sync, remote clone, hosted deployment, REST/webhooks | [Push](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/apps/cli/src/commands/repo/push.rs), [pull](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/apps/cli/src/commands/repo/pull.rs), [fetch](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/apps/cli/src/commands/repo/fetch.rs) and [sync](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/apps/cli/src/commands/repo/sync.rs) return errors for every remote type, including local paths. The [HTTP object server](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/apps/cli/src/store/remote_server.rs) has no authentication and binds to 127.0.0.1 by default. QUIC exists only as an in-process demo. Local-folder clone is described separately from remote exchange. |
| Mounted remote drive, Windows support and enforced team locks | [Mount commands](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/apps/cli/src/main.rs#L310-L328) need the optional `fuser` feature and a mount point. The [FUSE mount](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/apps/cli/src/vfs/fuse.rs#L465-L495) is read-only and local, with no WinFSP or remote hydration. The [lock store](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/apps/cli/src/store/locks.rs) keeps local records; status lists remote lock leases as not current. |
| Repository encryption and official SDKs | [Encryption handlers](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/apps/cli/src/commands/advanced/security.rs) refuse init, login and password changes; status explains the experiment did not cover the embedded Git store. The [SDK pages](https://github.com/byronwade/dits/tree/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/docs/sdks) describe designs, not published packages. |
| `checkout -b`, bare `mount`, curl installer, email and Discord contacts | The [parser](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/apps/cli/src/main.rs#L35-L95) has no `checkout -b`; branch and checkout are separate. The [README](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/README.md) and [getting-started guide](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/docs/user-guide/getting-started.md) say there is no `curl \| sh` installer, so the old `install.sh` line was removed. The old dev@dits.io address and Discord channel had no source support and were removed. Install scripts and release binaries were not run. |
| Chunking, LAN upload, clone and status speed figures | [Benchmark data](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/benchmarks/latest.json) records August 4, 2026, Dits commit `15a8bda2`, one Linux x64 Xeon machine, component throughput and local timings on a 32 MiB synthetic file. The [method notes](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/docs/performance/benchmarks.md) do not cover real media or network use. The copy links the data without quoting targets as measurements. |

The long glossary, roadmap, operations, deployment, business and FAQ sections
were replaced by one account of the local engine and its limits (754 lines to
144). The repository root is still the first GitHub link in the body, so the
Source button opens it. The new excerpt flows through the existing listing,
metadata and search. Route, title, URL, date, category, type, archived status
and non-featured setting are unchanged. No Dits code, site code, dependency,
account, service or setting was changed.

This was source reading, not a run of Dits's build, tests, CLI or benchmarks.
It does not establish release-binary health, platform support, media-format
coverage, private history, or fitness for production. The review was started by
job 174945 (codex), which stopped before committing; job 175946 re-checked each
claim against a fresh clone at the same commit.

## Wormhole mount and signaling claims, October 21, 2026

The Wormhole case study now follows public main at
[`60151d94`](https://github.com/byronwade/Wormhole/tree/60151d94a1e4eadc5ca483bb35c7d45a056cceb0)
(August 27, 2026, a WinFSP dependency bump). Its December 9, 2025 date is kept:
the article was added in site commit
[`f3cd5e62`](https://github.com/byronwade/byronwade.com/commit/f3cd5e6265d0d5a3b5c76316e8629e9ba5b064a5),
and the public repository was created the same calendar day
(2025-12-09T04:45:24Z). GitHub does not mark the repository archived. Every
other branch returned by the branches API is a `dependabot/*` bump. Those
subjects were listed. None of that unmerged dependency work is described as
current product behavior.

The newest release tag is
[v0.2.0](https://github.com/byronwade/Wormhole/releases/tag/v0.2.0)
(August 3, 2026). That tag is older than `60151d94`, so release assets are not
this tree. The crates declare `MIT OR Apache-2.0` in the workspace manifest.
The repository root has no `LICENSE` file, and the GitHub license field is
empty.

| Earlier claim | Source evidence and resulting correction |
| --- | --- |
| Join code `MARS-WIND` and a 16-character code | [`JOIN_CODE_LENGTH`](https://github.com/byronwade/Wormhole/blob/60151d94a1e4eadc5ca483bb35c7d45a056cceb0/crates/teleport-core/src/crypto.rs#L13) is 6. [`make_share_link`](https://github.com/byronwade/Wormhole/blob/60151d94a1e4eadc5ca483bb35c7d45a056cceb0/crates/teleport-core/src/crypto.rs#L128-L132) builds `https://wormhole.byronwade.com/j/` plus `ABC-XYZ`. `MARS-WIND` normalizes to eight letters and fails validation. |
| Axum signal server with SQLx persistence, Fly-ready NAT help | [`teleport-signal`](https://github.com/byronwade/Wormhole/blob/60151d94a1e4eadc5ca483bb35c7d45a056cceb0/crates/teleport-signal/Cargo.toml) depends on tokio-tungstenite and rusqlite, not Axum or SQLx. [`SignalServer::serve`](https://github.com/byronwade/Wormhole/blob/60151d94a1e4eadc5ca483bb35c7d45a056cceb0/crates/teleport-signal/src/server.rs#L34-L44) keeps rooms in memory. [`wormhole-signal --db`](https://github.com/byronwade/Wormhole/blob/60151d94a1e4eadc5ca483bb35c7d45a056cceb0/crates/teleport-signal/src/bin/signal.rs#L61-L85) opens SQLite and then constructs a server that does not receive it. [`wormhole signal`](https://github.com/byronwade/Wormhole/blob/60151d94a1e4eadc5ca483bb35c7d45a056cceb0/crates/teleport-daemon/src/bin/wormhole.rs#L2347-L2359) prints STUN and TURN flags and does not pass them in. The default URL `wss://wormhole-signal.fly.dev` is a CLI default, not a checked deployment. |
| Writes are only a later roadmap phase | [`handle_write_chunk`](https://github.com/byronwade/Wormhole/blob/60151d94a1e4eadc5ca483bb35c7d45a056cceb0/crates/teleport-daemon/src/host.rs#L1069-L1164) checks a lock and a BLAKE3 checksum, rejects a path outside the share, and writes the file. The FUSE mount [starts read-only](https://github.com/byronwade/Wormhole/blob/60151d94a1e4eadc5ca483bb35c7d45a056cceb0/crates/teleport-daemon/src/fuse.rs#L86). Host write access is [`--allow-write`](https://github.com/byronwade/Wormhole/blob/60151d94a1e4eadc5ca483bb35c7d45a056cceb0/crates/teleport-daemon/src/bin/wormhole.rs#L252-L254). |
| RAM cache is 128KB | [`CHUNK_SIZE`](https://github.com/byronwade/Wormhole/blob/60151d94a1e4eadc5ca483bb35c7d45a056cceb0/crates/teleport-core/src/lib.rs#L42) is 128 KiB. The mount cache holds [`DEFAULT_CHUNK_CACHE_ENTRIES`](https://github.com/byronwade/Wormhole/blob/60151d94a1e4eadc5ca483bb35c7d45a056cceb0/crates/teleport-daemon/src/cache.rs#L28) (4,000) chunks, and [`with_capacity`](https://github.com/byronwade/Wormhole/blob/60151d94a1e4eadc5ca483bb35c7d45a056cceb0/crates/teleport-daemon/src/cache.rs#L187-L193) sets the byte cap to entries times the chunk size (500 MiB). [`MAX_CACHE_BYTES`](https://github.com/byronwade/Wormhole/blob/60151d94a1e4eadc5ca483bb35c7d45a056cceb0/crates/teleport-daemon/src/gc.rs#L22) is 10 GiB, and [`wormhole-mount`](https://github.com/byronwade/Wormhole/blob/60151d94a1e4eadc5ca483bb35c7d45a056cceb0/crates/teleport-daemon/src/bin/wormhole-mount.rs#L196-L198) starts that collector. |
| Desktop is React 18, and only bincode is on the wire | Desktop [`package.json`](https://github.com/byronwade/Wormhole/blob/60151d94a1e4eadc5ca483bb35c7d45a056cceb0/apps/desktop/package.json#L46) depends on React 19.1.0, and [`tailwindcss`](https://github.com/byronwade/Wormhole/blob/60151d94a1e4eadc5ca483bb35c7d45a056cceb0/apps/desktop/package.json#L64) is 4.x. [`codec.rs`](https://github.com/byronwade/Wormhole/blob/60151d94a1e4eadc5ca483bb35c7d45a056cceb0/crates/teleport-core/src/codec.rs#L1-L52) prefers postcard when both peers advertise it and otherwise uses bincode. The comment at the top of `protocol.rs` still says bincode only. |
| No accounts and zero monthly fees, with a $50 and 50GB illustration | [`apps/web` pricing](https://github.com/byronwade/Wormhole/blob/60151d94a1e4eadc5ca483bb35c7d45a056cceb0/apps/web/src/app/pricing/page.tsx#L19-L53) lists Free, Pro at $8, and Team at $15, and labels the paid tiers as coming after launch. The optional [`cloud`](https://github.com/byronwade/Wormhole/blob/60151d94a1e4eadc5ca483bb35c7d45a056cceb0/crates/teleport-daemon/Cargo.toml#L16-L19) feature is not the default share path. The $50-a-month and 50GB timing lines were illustrations, not measurements, and they are gone. |
| The seven-phase list is the shipping schedule | Those phase notes live under `docs/development/` and as comments on code that is already in this tree, including FUSE reads, caches, prefetch, and the write handler above. The page no longer presents them as a future schedule. CI does run desktop `pnpm install`, `pnpm typecheck`, and `pnpm test:run` ([workflow](https://github.com/byronwade/Wormhole/blob/60151d94a1e4eadc5ca483bb35c7d45a056cceb0/.github/workflows/ci.yml#L232-L241)). |

The repository root is still the first GitHub link in the body, so the Source
button opens it. Route, title, URL, date, category, type, archived status, and
non-featured setting are unchanged. No Wormhole code, site code, dependency,
account, service, or setting was changed.

This was source reading, not a build, test run, installer run, or mount. It
does not establish release-binary health, that `wss://wormhole-signal.fly.dev`
answers, or that two machines on different networks can connect.

## SignalRoute phone and texting claims, October 21, 2026

The SignalRoute case study now follows private main at
[`31d30be`](https://github.com/byronwade/signalroute/tree/31d30be205e516ce3336d4470155d25a9ea84aaf)
(August 3, 2026, commit message "chore: trigger production redeploy"). The
repository is private, so those links open only for someone signed in with
access. GitHub does not mark it archived. The branches API returned only
`main`. The GitHub license field is empty. The repository was created
2026-06-03T01:30:58Z. The page date stays 2026-06-01.

`https://getsignalroute.com` returned HTTP 200 on October 21, 2026. The
response title was "SignalRoute - A business phone that runs itself". That
check does not prove the host is serving `31d30be`. The case study does not
link the private repository, so the page's Source button stays absent and
Visit still opens the public site.

| Earlier claim | Source evidence and resulting correction |
| --- | --- |
| Actively building, and the spine is live call operations | The newest commit on `main` is August 3, 2026. [`placeCall`](https://github.com/byronwade/signalroute/blob/31d30be205e516ce3336d4470155d25a9ea84aaf/lib/actions/voice.ts#L10-L38) stores a completed call with `duration_seconds: 0` after the adapter returns. [`api_create_call`](https://github.com/byronwade/signalroute/blob/31d30be205e516ce3336d4470155d25a9ea84aaf/supabase/migrations/0003_api_templates_webhooks.sql#L156-L158) inserts `status` `completed` with `answered_at` and `ended_at` both `now()`. |
| Telnyx swaps in with a key change, and development uses the mock | [`getTelecomProvider`](https://github.com/byronwade/signalroute/blob/31d30be205e516ce3336d4470155d25a9ea84aaf/lib/telecom/index.ts#L9-L22) defaults to the mock and constructs `TelnyxAdapter` when `TELECOM_PROVIDER=telnyx`. [`notImplemented`](https://github.com/byronwade/signalroute/blob/31d30be205e516ce3336d4470155d25a9ea84aaf/lib/telecom/real-adapter.ts#L24-L28) throws from every method, including `placeCall` and `sendMessage`. |
| Visual editor runs ring groups, queues, and fallbacks | [`FlowNodeType`](https://github.com/byronwade/signalroute/blob/31d30be205e516ce3336d4470155d25a9ea84aaf/lib/types/call-flow.ts#L11-L36) includes `ring_group`, `queue`, `transfer`, and `voicemail`. [`layoutFlow`](https://github.com/byronwade/signalroute/blob/31d30be205e516ce3336d4470155d25a9ea84aaf/lib/flow/layout.ts#L14-L15) uses dagre. [`saveCallFlow`](https://github.com/byronwade/signalroute/blob/31d30be205e516ce3336d4470155d25a9ea84aaf/lib/services/call-flows.ts#L46-L55) writes `localStorage` key `sr.callflow.<numberId>`. The type file says the graph is not stored in the database. No runner executes it. |
| Dialer does warm and cold transfers, conference, DTMF, and ring-out on the line | [`transferCall`](https://github.com/byronwade/signalroute/blob/31d30be205e516ce3336d4470155d25a9ea84aaf/components/dashboard/use-comm-controls-state.ts#L292-L314) renames the line and removes it after 1600 ms. [`sendDtmf`](https://github.com/byronwade/signalroute/blob/31d30be205e516ce3336d4470155d25a9ea84aaf/components/dashboard/use-comm-controls-state.ts#L431-L434) is an empty function. [`sendToVoicemail`](https://github.com/byronwade/signalroute/blob/31d30be205e516ce3336d4470155d25a9ea84aaf/components/dashboard/use-comm-controls-state.ts#L285-L290) ends the local line and toasts. The keypad does capture the physical keyboard. |
| Claude summarizes calls and transcripts | [`summarizeMessages`](https://github.com/byronwade/signalroute/blob/31d30be205e516ce3336d4470155d25a9ea84aaf/lib/ai/summarize.ts#L5-L21) summarizes SMS threads, and without `ANTHROPIC_API_KEY` it returns a template from the last inbound text. |
| SMS templates, scheduled sends, and STOP/START | Templates are rows. [`deliver_scheduled_messages`](https://github.com/byronwade/signalroute/blob/31d30be205e516ce3336d4470155d25a9ea84aaf/supabase/migrations/0016_scheduled_send.sql#L9-L31) marks due rows `delivered` and does not call a provider. The same migration tries `pg_cron` and continues if it fails. STOP and START are handled in [`ingest_inbound_message`](https://github.com/byronwade/signalroute/blob/31d30be205e516ce3336d4470155d25a9ea84aaf/supabase/migrations/0008_inbound_suppressions_flags.sql#L82-L87). |
| Spam-score tracking shows how carriers see the numbers | [`reputation_scores`](https://github.com/byronwade/signalroute/blob/31d30be205e516ce3336d4470155d25a9ea84aaf/supabase/migrations/0001_init.sql#L258-L266) is inserted with defaults (trust 80, delivery 99.00). The spam-score page reads that row. This tree has no writer that recomputes it from traffic. |
| `/api/v1` places calls and sends messages | The routes exist. [`api_send_message`](https://github.com/byronwade/signalroute/blob/31d30be205e516ce3336d4470155d25a9ea84aaf/supabase/migrations/0008_inbound_suppressions_flags.sql#L232-L234) inserts `status` `delivered`. [`api_create_call`](https://github.com/byronwade/signalroute/blob/31d30be205e516ce3336d4470155d25a9ea84aaf/supabase/migrations/0003_api_templates_webhooks.sql#L134-L163) ignores `p_say` and inserts a completed call. |
| Webhook auth is a shared secret, with Ed25519 on the roadmap | [`verifyWebhookSignature`](https://github.com/byronwade/signalroute/blob/31d30be205e516ce3336d4470155d25a9ea84aaf/app/api/telnyx/webhook/route.ts#L21-L38) checks HMAC-SHA256. The `telnyx-signature-ed25519` header is passed into that HMAC check. There is no Ed25519 verify. |
| Next.js 16, React 19, Tailwind 4, Supabase, and a landing preference | [`package.json`](https://github.com/byronwade/signalroute/blob/31d30be205e516ce3336d4470155d25a9ea84aaf/package.json#L21-L54) pins Next 16.2.6, React 19.2.4, Tailwind 4, Base UI, and Supabase. [`setLandingPanel`](https://github.com/byronwade/signalroute/blob/31d30be205e516ce3336d4470155d25a9ea84aaf/lib/actions/preferences.ts#L35-L44) writes `members.preferences.landing_panel`, except the demo path, which returns success without writing. |

Route, title, URL, date, category, archived status, and non-featured setting
are unchanged. `flagship` stays false. The three proof chips now say Mock,
This browser, and Writes rows. No SignalRoute application code, site code,
dependency, account, service, or setting was changed.

This was source reading, not a build, test run, or sign-in. It does not
establish that getsignalroute.com serves `31d30be`, that an active billing
workspace can dial, or that a production Telnyx webhook verifies.

## Impact Marine Group site claims, October 21, 2026

The Impact Marine Group case study now describes the WordPress site that the
live domain serves under a custom theme named `impact`, whose footer reads
"Designed & Developed by Byron Wade". On October 21, 2026 a direct request got
a Cloudflare challenge (HTTP 403, `cf-mitigated: challenge`), and a separate
web reader also got HTTP 403. Neither was bypassed, so the claims below are
dated to Internet Archive captures, not to the site today. The theme source is not
public, so none of this is a source-level claim.

| Capture | What it shows |
| --- | --- |
| [Home, 2025-03-23](https://web.archive.org/web/20250323182202/https://impactmarinegroup.com/) | The earlier dealer-website platform (`/clients/` and `/sms-chat/` assets), no credit to Byron. Captures from October 2024 to this date use the same platform, though brands and navigation changed. |
| [Home, 2025-04-09](https://web.archive.org/web/20250409034254/https://impactmarinegroup.com/) | First capture of the WordPress `impact` theme, with the footer credit. The switch happened between these two captures. |
| [Home, 2026-02-12](https://web.archive.org/web/20260212210915/https://impactmarinegroup.com/) | Full-width looping video (`impactlogo.mp4`) behind the white "Make an Impact!" headline; blue primary buttons; Viaggio Pontoons, MB Sports, Tige and ATX named; used boats described as inspected; footer line about "impactful memories". |
| [About, 2026-01-15](https://web.archive.org/web/20260115151103/http://impactmarinegroup.com/about/) | "We are boaters." and "From one boater to another"; over 10,000 sq ft of shop space; factory-certified technicians and the engine list (Indmar, Ilmor, PCM, Yamaha, Suzuki, Mercury, Mercruiser, Volvo Penta). Service-area lines, in the page's words: "Serving Lake Lanier and all Georgia Lakes with nationwide shipping" and "Proudly serving all North Georgia Lakes". The named list is fourteen lakes: Lanier, Allatoona, Burton, Hartwell, Sinclair, Chatuge, Blue Ridge, Rabun, Seed, Oconee, Jackson, Carters, Nottely, and West Point. |
| [Services, 2026-02-12](https://web.archive.org/web/20260212211905/https://impactmarinegroup.com/services/) | Nine services, each linking to its own page (winterization, fiberglass repair, engine repair and others). |
| [Tige brand page, 2026-01-15](https://web.archive.org/web/20260115135753/https://impactmarinegroup.com/boat-manufacturer/tige/) and [a boat page, 2026-02-12](https://web.archive.org/web/20260212215548/https://impactmarinegroup.com/boat/2023-tige-24rzx-208-hours/) | Manufacturer pages list that brand's boats. Each boat has its own page in the site template with stock number, specs, price and status. |
| [New, 2025-05-21](https://web.archive.org/web/20250521090547/http://impactmarinegroup.com/boat-condition/new/), [used](https://web.archive.org/web/20250521090210/http://impactmarinegroup.com/boat-condition/used/), and [demo](https://web.archive.org/web/20250521083738/http://impactmarinegroup.com/boat-condition/demo/) | Condition archives in the `impact` theme. Each lists boats and prints that condition (New, Used, or Demo). The visible heading on all three is "Latest News & Updates". |
| [Available, 2025-05-21](https://web.archive.org/web/20250521074237/https://impactmarinegroup.com/boat-status/available/), [sold](https://web.archive.org/web/20250521090045/https://impactmarinegroup.com/boat-status/sold/), and [on consignment, 2025-10-15](https://web.archive.org/web/20251015121320/https://impactmarinegroup.com/boat-status/on-consignment/) | Status archives that list boats. Available and sold cards use those words. The on-consignment page title is "On Consignment"; the card opened there is badged "New Arrival". Same news heading. |
| [Sale pending, 2025-05-21](https://web.archive.org/web/20250521084618/https://impactmarinegroup.com/boat-status/sale-pending/) and [2026-02-12](https://web.archive.org/web/20260212213135/http://impactmarinegroup.com/boat-status/sale-pending/) | The page title is "Sale Pending". Both opened captures say the page cannot find what you are looking for. The article does not say visitors can browse a sale-pending list. |

| Earlier claim | Correction |
| --- | --- |
| Pages optimized for Lake Lanier, Lake Allatoona and Lake Burton | No lake pages appear in the archived captures. The lakes are a list on the About page. The article now quotes that page's own service-area lines, including nationwide shipping and North Georgia. |
| Visitors can browse boats that are sale pending | The sale-pending address exists. The first and last captures opened on October 22, 2026 were empty. The article now names only the status lists that contained boats: available, on consignment, and sold. |
| Deep "mini-sites" for Tige, ATX, Viaggio and MB Sports, ranking for specific models | Archived manufacturer pages are inventory listings. Keyword pages such as `/tige-boats-georgia` and `/winterization-boats-georgia` exist only in [March 2025 captures](https://web.archive.org/web/20250323181519/https://impactmarinegroup.com/tige-boats-georgia) of the earlier platform, with no credit to Byron, so they are not attributed to this build. No ranking claim remains. |
| An inventory "feed" in place of a DMS iframe | Captures show each boat as a page in the site's own template, with no listing iframe. They cannot show how listings get into WordPress, so the word "feed" is gone. |
| "10,000 sq ft service center", "certified Mercury mechanics" | Now the About page's wording: over 10,000 sq ft of shop space, factory-certified technicians, Mercury among the engines listed. |
| "Emotional connection happens in the first 2 seconds", "infinitely more valuable", traffic that converts, longer visits, sales closed before a visit | No measurement supports these. They are removed or stated as reasoning, following the Wade's Plumbing correction above. The psychology sections are marked as design rationale. |

The public repository
[byronwade/impactmarinegroup.com](https://github.com/byronwade/impactmarinegroup.com)
(created 2024-10-11, not archived, no license) holds a separate Next.js rebuild:
Sanity and then Payload CMS on `main` at
[`6063c85`](https://github.com/byronwade/impactmarinegroup.com/tree/6063c85234a4ee93e783199f57a66f3ff9f85dbd)
(2025-01-30), and a `payload` branch six commits ahead at
[`e129e43`](https://github.com/byronwade/impactmarinegroup.com/tree/e129e430e20e7de729638201e29a2615a5fa8930)
(2025-02-07). No archived capture shows that build on the domain. The article
does not link the repository, so the project page shows no Source button that
would point readers at code the live site does not run.

Route, title, URL, date, category, archived grouping and non-featured setting
are unchanged. The 2023-11-01 date is not supported by anything found: the
first archived home page capture (August 2024) was a 404, the repository was
created in October 2024, the WordPress theme appeared in spring 2025, and the
article was added to this site on 2025-12-01. It stays as an owner question.
On October 22, 2026 the About capture and the condition and status archives in
the table were opened again, and the article's service-area sentences and
inventory lists follow those pages. Menus were not captured, so these notes do
not claim a navigation label for the lists. This was archive and source reading
only; no sign-in, search ranking, traffic or sales data was consulted.

## Movies feed and catalog claims, October 22, 2026

The Movies page was two sentences with links to moving `main` files. It now
describes the public repository
[byronwade/movies.byronwade.com](https://github.com/byronwade/movies.byronwade.com)
at [`6dbc3fc`](https://github.com/byronwade/movies.byronwade.com/tree/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3)
(September 14, 2026), the head of `main`, its only branch. The repository was
created on September 11, 2026 and has 12 commits; the first four are titled
"Export from Grok", the package is named `app-builder-workspace`, and its
`AGENTS.md` is Grok's app-builder contract. That is the basis for the page
saying the project began in Grok's app builder. GitHub does not mark the
repository archived, and it has no license file. Its homepage field lists
`https://movies-nine-amber.vercel.app`.

The live address `movies.byronwade.com` returned 200 with the title "movies"
from Vercel on October 22, 2026. Byron's hobby-scheduler brief for
"Movies (movies.byronwade.com)" names the private repository `byronwade/movies`
(created September 12, 2026; `main` at `a1e6957`, October 18, 2026, 353
commits) as the code behind it. Only that
repository's metadata, branch list and head commit were read; its code was not
reviewed, and the live host was not checked against `6dbc3fc`. The article
describes only the public export, does not link the private repository, and
says the live site follows newer work. The repository root is the first GitHub
link in the body, so the Source action opens the repository, not a file.

Counts below came from loading `src/catalog/movies.ts` at the pin with Node's
type stripping: 2,869 films after merging, years 1930 to 2026, 98 with an
included streaming label, and 722 with any score. None of the project's own
checks (typecheck, tests, build) were run for this review, and nothing in the
article is a measurement of recommendation quality.

| Article claim | Source evidence at `6dbc3fc` |
| --- | --- |
| Six actions per film, stored as events; undo cancels an event | [`MovieActions`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/components/movie/actions.tsx) renders Seen, Favorite, Save, Interested, Skip and Not into. [`projectMovieState`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/pipeline.ts#L71-L80) skips events reversed by an `undo` event. |
| Weighted marks that fade, positive half-life 160 days and negative 80 | [`WEIGHT`, `POSITIVE_HALF_LIFE`, `NEGATIVE_HALF_LIFE`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/taste.ts#L7-L26): favorite 1.05, love 1, not_interested -1. |
| Profile over director, genres, themes, tones, moods, writers, first four cast, decade and language, compared by cosine | [`movieFeatures`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/features.ts#L7-L26) and the `cosine(tasteScaled, feats)` call in [`rank`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/pipeline.ts#L484-L486). Certification, audience and rating features are also added. |
| Taste gains weight until about ten films carry a clear signal | [`confidence = clamp01(trainedOn / 10)`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/pipeline.ts#L512-L514); `trainedOn` counts films whose net weight is above 0.12 in [`rebuildTaste`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/taste.ts#L50-L75). With no trained film the score uses critic consensus, popularity, recency and quality only. |
| Twelve strongest marks as seeds; shared director, cast, themes or similar titles; the card names the seed | [`seedMovies` and `neighborBoost`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/pipeline.ts#L259-L301); the "Because you keep … close" line is in [`statementFor`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/pipeline.ts#L310-L323). |
| Not into hides the film, keeps its series out, cools similar titles | [Cooling loop](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/pipeline.ts#L458-L470), the [-0.48 penalty](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/pipeline.ts#L528), and the `notInterested` and series checks in [`eligible`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/pipeline.ts#L178-L219). |
| First-screen mixer: without a genre, mood or service filter, at most two per lead genre and one per director in the first eight; Interested never first | [`mixWatchable`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/pipeline.ts#L348-L406). The caps skip the "free" passes for owned and Interested titles. Its wildcard loop runs after a pass that usually fills the list already, so the article does not claim a wildcard. The `RANK_WEIGHTS` UI copy ("SimClusters", "like mute on X") is not repeated. |
| Sitting filters; family viewing drops R-rated and adult titles; bedtime 11:10 PM | Filter state in [`filters.tsx`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/components/discovery/filters.tsx#L25-L35); rules in [`eligible`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/pipeline.ts#L178-L219); [`minutesUntilBed` and `fitsTonight`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/clock.ts#L1-L11); the For you session [passes `minutesLeft`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/lib/store.ts#L547) into `rank`. |
| Grok reorders the next twenty after three marked films, with a one-line reason; needs an xAI key; the local order survives a failure | [`refreshGrok`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/lib/store.ts#L1041-L1108) runs 1.6 seconds after a mark in For you ([`scheduleGrok`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/lib/store.ts#L735-L742), [caller](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/lib/store.ts#L883)), needs at least 3 signals and 6 queued films, sends up to 20, and catches errors. [`grokRerank`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/lib/server/grok-taste.ts#L28-L78) returns "AI is not available" without `XAI_API_KEY`. Whether the live host has that key was not checked. |
| Fine tune at `/tune` asks about well-known films | [`/tune`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/routes/tune.tsx) renders the feed in tune mode; explore scoring in [`rank`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/pipeline.ts#L493-L495) leans on popularity and novelty. |
| Household profiles; an import asks which profile watched titles that are not adults-only | [`DEFAULT_PROFILES`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/index.ts#L28-L32); [`ingestHits`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/lib/store.ts#L1162-L1195) queues the [ask sheet](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/components/household/ask.tsx). |
| Letterboxd username import reads the public diary, watchlist and likes feeds; pasted lists | [`importLibrary`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/lib/server/import.ts#L17-L50). A Gmail scan in [`ambient.ts`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/lib/server/ambient.ts) depends on Grok's connector gate and is not mentioned in the article. |
| Signed-in public page at `/@handle`; "Tonight for both" merges two people's favorites and vetoes into twelve | [`claimHandle`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/lib/server/public.ts#L280-L281) requires sign-in; [`collideEvents` and `collideRank`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/collide.ts#L35-L62) use `limit: 12`. |
| 280 films per decade from a public Wikipedia dataset, plus a hand-written set | [`build-catalog.mjs`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/scripts/build-catalog.mjs#L421-L422) fetches `prust/wikipedia-movie-data` per decade with `PER_DECADE = 280`; hand-written films are in `movies.ts` and `fresh.ts`. |
| Scores from Wikidata or typed in for recent releases | [`build-ratings.mjs`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/scripts/build-ratings.mjs#L55-L56) queries Wikidata; recent releases use `SCORES` in [`fresh.ts`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/catalog/fresh.ts#L13-L25). |
| Film pages pull summary, images and trailer from Wikipedia, Wikidata, iTunes search and Grokipedia | [`movie-extras.ts`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/lib/server/movie-extras.ts#L85-L165), called from [`use-extras.ts`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/components/movie/use-extras.ts#L23). |
| Generated quality and popularity come from text length and cast size; rating, themes, tones and moods are guessed from genre; generated films show Rent | [`qualityOf` and `popularityOf`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/scripts/build-catalog.mjs#L243-L259), the [certification rule](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/scripts/build-catalog.mjs#L441), [themes, tones and moods](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/scripts/build-catalog.mjs#L458-L460), and [`watch: Rent`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/scripts/build-catalog.mjs#L471). |
| Streaming labels only on 98 hand-written films; the app doesn't check them against a live service | Labels are constants such as [`netflix`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/catalog/movies.ts#L7-L11) in hand-written entries; no availability API is called. The count is from the Node load above. |
| React 19, TypeScript, TanStack Start and Router, Vite, Tailwind 4, Zustand; guests in local storage; Better Auth and Neon sync; email-only sign-in outside Grok's preview | [`package.json`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/package.json); [`persist`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/lib/store.ts#L276-L311); [`pullKinoState`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/lib/server/sync.ts#L491-L494); [`grokBrokerOAuthOk`](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/lib/auth/client.ts#L107-L109) shows Google and X only inside the live preview. |
| Node test suites for ranking, search, title matching and the sign-in gate | The `test` script in `package.json` runs `node --test` over those files. Not run for this review. |

Front matter is unchanged, including the TODO that reserves the public URL,
release state and dates for Byron. The page still has no `url`, so it shows a
Source action and no Visit action. Adding `https://movies.byronwade.com` as the
Visit link is an owner decision, because that site runs the private code, not
the export this page describes.

## Zugzology storefront claims, October 22, 2026

`content/projects/mushroom-cultivation-supplier.md` still described Zugzology as
the foundation of a field-management system: products as equipment, accounts as
grower profiles, orders as harvest records, then sensors and yield forecasts.
The October 20 notes above removed invented performance figures and the current
AI claim, and said the inherited feature list had not been checked on its own.
This pass checks that list against the public repository
[byronwade/zugzology.com](https://github.com/byronwade/zugzology.com) at
[`5b7f80d8`](https://github.com/byronwade/zugzology.com/tree/5b7f80d81b4819f9d38f51da89bf3247763077ed)
(July 31, 2026), which is still the head of `main`. The repository is public,
not archived, and has no license file. A shallow clone was read locally. The
project's own lint, type-check, and build were not run. The live shop was not
signed into, and no traffic, revenue, or inventory figures were read.

The page date `2023-09-01`, the URL, the title, the client-work category, and
the archived grouping are unchanged. Nothing in this commit dates the shop's
launch, so the date stays an owner question. The first GitHub link in the body
is the repository root, so the Source action opens the repository.

| What the page now says | Where it is in `5b7f80d8` |
| --- | --- |
| README says Next.js 15; the package depends on Next.js 16, React 19, NextAuth 4, and Tailwind CSS 3 | [README](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/README.md) opening line; [`package.json`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/package.json) has `next` `^16.0.6`, `react` `^19.2.0`, `next-auth` `^4.24.11`, `tailwindcss` `^3.3.5`. |
| Catalog uses Storefront API 2024-01; default sort is best-selling | Endpoint in [`client.ts`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/lib/api/shopify/client.ts#L104); default branch in [`getProducts`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/lib/actions/shopify/index.ts#L158-L161) sets `BEST_SELLING`. |
| Missing credentials or a failed live call serve Mock.shop | [`shopifyFetch`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/lib/api/shopify/client.ts#L116-L137) and [`MOCK_SHOP_ENDPOINT`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/lib/api/shopify/demo-mode.ts#L6). |
| An unreachable shop can show a panel with Home, Products, and Help | [`ShopifyUnavailable`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/components/ui/shopify-unavailable.tsx#L16-L47). Demo mode counts as available. |
| Search re-orders with stock, mid-range price, recency, and `custom.featured_rank`; the catalog does not | [`rankProducts`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/lib/ranking/product-ranker.ts#L43-L191) is called only from [`realtime-products-content.tsx`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/components/features/products/realtime-products-content.tsx#L132), which only [`/search`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/app/(products)/search/page.tsx) imports. Featured rank 1 scores 100 points. [`searchProducts`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/lib/ranking/product-ranker.ts#L255-L264) matches title, description, and tags. |
| Wishlist handles live in local storage, then one batch load | [`useSyncedLocalStorage`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/components/providers/wishlist-provider.tsx#L29-L63); [`fetchWishlistProducts`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/lib/actions/wishlist-actions.ts#L10-L24). |
| Nine product groups under a product, each in its own Suspense boundary | [`sectionConfigs`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/components/features/products/sections/progressive-sections-manager.tsx#L17-L27) and the [Suspense wrapper](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/components/features/products/sections/progressive-section-loader.tsx#L185-L195). |
| Five section types render; others show a not-implemented box | [`SectionRenderer`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/components/features/pages/section-renderer.tsx#L50-L76). Metaobject fields are parsed in [`parseMetaobjectToSection`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/lib/api/shopify/page-actions.ts#L10-L46). |
| Blogs index uses the expert-guides title; posts come from Shopify | [`generateMetadata`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/app/(content)/blogs/page.tsx#L23-L27) and `getPaginatedBlogPosts`. |
| Google Merchant XML and Facebook catalog CSV, both `no-store` | [`google-merchant/route.ts`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/app/api/feeds/google-merchant/route.ts#L21-L26) and [`facebook/route.ts`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/app/api/feeds/facebook/route.ts#L17-L23). |
| Sign-in is Shopify customer-account OAuth when three secrets exist; register uses Storefront `customerCreate` | [`hasShopifyCredentials`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/auth.ts#L16-L38); the button label in [`next-auth-buttons.tsx`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/components/features/auth/next-auth-buttons.tsx#L63); [`customerCreate`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/app/api/auth/register/route.ts#L85-L86). Neither path was exercised on the live shop. |
| Five-minute default cache; `cache: "no-store"` on the product list is ignored; 24-hour product window is unused by that list | [`postGraphql`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/lib/api/shopify/client.ts#L31-L35) always sets `revalidate` to 300 when the caller omits it, and never reads `cache`. [`getProducts`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/lib/actions/shopify/index.ts#L273-L275) passes `cache: "no-store"` only. [`CACHE_TIMES.PRODUCTS`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/lib/api/shopify/cache-config.ts#L3) is 24 hours. |
| Vitals route keeps 1,000 samples in memory; custom analytics events need a paid Vercel plan | [`vitals/route.ts`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/app/api/analytics/vitals/route.ts#L13-L31); the plan note is the header of [`tracker.ts`](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/src/lib/analytics/tracker.ts#L1-L9). |
| AI routes were deleted in October 2025; stale docs remain | Same commits as the October 20 section above (`a509ce9d`, `b7a6d695`). `docs/ENTERPRISE_AI_SYSTEM.md` is still in the tree at this pin. |
| No field equipment, grower profiles, harvest records, sensors, or yield forecasts | A search of `src` for field-management, IoT, and sensor names hit product FAQ copy and a recipes menu label only. Those phrases are not a field system. |

The old phase list, the "real customer data" and "community trust" advantages,
and the claim that every architectural choice was made for field management are
removed because this commit does not contain them. No reason for the AI removal
was added, because the deletion commit still does not state one.
