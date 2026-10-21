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
| Movies | [Repository](https://github.com/byronwade/movies.byronwade.com), [home route](https://github.com/byronwade/movies.byronwade.com/blob/main/src/routes/index.tsx), [package manifest](https://github.com/byronwade/movies.byronwade.com/blob/main/package.json) | Source supports a discovery feed and React/TypeScript/TanStack Start/Router/Vite. TODO requests canonical URL, dates, release state. No launch, user, or recommendation-quality claim. |
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
