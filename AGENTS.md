# AGENTS.md

Governs AI-assisted work in this repository. Keep it concise, current, and
enforceable. Package-specific facts belong in the nearest nested `AGENTS.md`;
do not repeat root rules there.

## Mission

Complete the requested change while leaving its affected dependency cone
healthier than before.

Success means:

- requested behavior is correct and verified;
- existing concepts are reused before new ones are created;
- architecture, security, accessibility, maintainability, and measured
  performance do not regress;
- relevant duplication, dead code, and accidental complexity are reduced;
- recurring objective failures become mechanical checks;
- unrelated repository-wide rewrites do not enter the task.

Optimize for the fewest necessary concepts and the lowest future change
cost — not merely fewer lines, files, or abstractions.

## Authority

Apply instructions in this order:

1. User request and acceptance criteria.
2. Closest applicable nested `AGENTS.md`.
3. This file.
4. Public contracts, security requirements, and repository docs:
   [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md),
   [`docs/UI_GUIDELINES.md`](docs/UI_GUIDELINES.md),
   [`docs/PERFORMANCE.md`](docs/PERFORMANCE.md),
   [`docs/SPAM_PROTECTION.md`](docs/SPAM_PROTECTION.md).
5. Existing conventions, only when they do not degrade code health.

Report meaningful conflicts. Never preserve a bad pattern solely because it
already exists. When a repository doc contradicts the code, the code is the
truth — fix the doc in the same change.

## The stack (verified facts)

| Concern | Reality |
|---|---|
| Framework | Next.js 16 App Router, `reactCompiler: true`, Turbopack (`next.config.js`) |
| Runtime | React 19, TypeScript strict, `moduleResolution: bundler` |
| Styling | Tailwind CSS v4 via `@tailwindcss/postcss`; `cn()` from `lib/utils.ts` |
| UI | `@base-ui/react` primitives wrapped in `components/ui/` (18 of them) |
| Theme | `next-themes`, light/dark with a header toggle (not forced dark) |
| Lint/format | Ultracite over Biome (`biome.jsonc`) — tabs, width 100, double quotes, semicolons |
| Dead code | knip (`knip.json`), clean — a new unused export fails CI |
| Content | Markdown in `content/blog/`, `content/projects/` via `gray-matter` |
| Email | Resend through the `lib/actions/send-email.ts` server action |
| Tests | **None.** There is no test runner or test script in this repository |

`.eslintrc.cjs` exists only to neutralize Codacy's ESLint 8 engine. It is not
this project's linter — Ultracite is, and it drives Biome underneath.

Ultracite 7 defaults to the oxlint/oxfmt toolchain. This repository pins it to
`--linter biome` so there is exactly one formatter and one linter, and
`biome.jsonc` extends `ultracite/biome/{core,react,next}`. Everything written
below those `extends` is a deliberate repository-level override with a comment
explaining why; read those comments before re-enabling a rule.

## Commands

```bash
npm run dev          # dev server on :3000
npm run lint         # ultracite check                  (CI gate)
npm run type-check   # next typegen && tsc --noEmit     (CI gate)
npm run knip         # unused files, exports, deps      (CI gate)
npm run build        # production build                 (CI gate)
npm run check        # lint --fix, then type-check and knip
npm run lint:fix     # ultracite fix
npm run build:analyze    # ANALYZE=true bundle report
npm run perf:budget      # build + lighthouse against lighthouse-budget.json
```

CI (`.github/workflows/ci.yml`) runs all four gates on every pull request and
push to `main`. `type-check` runs `next typegen` first because `next-env.d.ts`
and the generated route types are gitignored — without it tsc cannot resolve
`next/*` on a clean checkout.

## Required workflow

For every nontrivial task:

1. Frame the behavior, constraints, non-goals, and verification target.
2. Reconnoiter the relevant code before editing.
3. Decide whether to reuse, configure, extend, extract, or create.
4. Implement the smallest coherent solution.
5. Recursively clean the task-related dependency cone until it converges.
6. Verify with deterministic checks and full-diff review.
7. Report decisions, checks, cleanup, and remaining findings truthfully.

Before implementing substantial work, state a compact decision record:

```text
Target and acceptance criteria:
Existing candidates inspected:
Reuse/extend/extract/create decision:
Expected dependency cone:
Verification plan:
```

## Reconnaissance before creation

Expand inspection progressively: nearest instructions and manifests →
target symbols, callers, dependencies, and data contracts → repository-wide
search for exact and semantic equivalents → comparable completed features →
history when intent is unclear → a narrow baseline check before risky work.

Before creating any component, hook, utility, formatter, validator, schema,
type, API client, or abstraction, search these first:

- `components/ui/` — badge, button, card, hover-card, input, label, link,
  pill, popover, separator, sonner, status-dot, status-pill, tabs, textarea,
  tooltip, obfuscated-contact, design-case-study. The set is deliberately small:
  add a primitive with `npx shadcn add` only when a page actually needs it, and
  expect knip to delete it again if nothing imports it.
- `components/common/`, `components/layout/`, `components/home/`,
  `components/blog/`, `components/project/`, `components/portfolio/` — each
  folder's `index.ts` is its public interface.
- `lib/utils.ts` (`cn`), `lib/cache.ts` (`CACHE_TAGS` — the only place a cache
  tag may be defined), `lib/seo.ts` (metadata + JSON-LD), `lib/portfolio-data.ts`
  (GitHub/Dribbble/Figma), `lib/blog.ts`, `lib/projects.ts`, `lib/analytics.ts`,
  `lib/contact-form.ts`, `lib/status-tone.ts`, `lib/search-index.ts`,
  `lib/actions/send-email.ts`.
- `types/` (`github.ts`, `dribbble.ts`, `figma.ts`) and `hooks/`
  (`use-theme-toggle.ts`).
- Platform and existing-dependency capabilities: `Intl`, `date-fns`, `nuqs`
  for URL state, `sonner` for toasts, `framer-motion` for motion.

No exact name match does not mean no equivalent exists. Search by behavior and
domain meaning, not just by identifier.

## Reuse decision ladder

Choose the first sound option:

1. **Reuse** unchanged when semantics and lifecycle match.
2. **Configure or compose** through existing props, slots, callbacks, or children.
3. **Extend** coherently when the behavior belongs to the same concept and does
   not introduce unrelated flags or invalid states.
4. **Extract** shared behavior when multiple implementations express one stable
   concept with a clear owner.
5. **Create** only when existing concepts differ materially or extension would
   confuse ownership.

New code requires a brief reason earlier options were rejected. A shared
abstraction must have one stable responsibility, a clear owner, a simpler
interface than the behavior it hides, and lower change amplification than
separate implementations. Do not merge incidental similarity. Do not add
wrappers that only rename an API or forward arguments without enforcing a
meaningful invariant.

## Bounded recursive cleanup

"Leave it better" applies to the task-related dependency cone, not the whole
repository.

Seed a queue with each changed file, symbol, contract, and page. For each item:
inspect direct callers and dependencies; search for semantic duplicates and
competing sources of truth; find dead paths, obsolete compatibility code, and
defects the change exposes; classify each finding as **fix now**, **migrate
atomically**, or **record**; enqueue only items directly affected by an accepted
fix; repeat until no task-related violation remains.

**Fix now** when the issue is introduced or exposed by the task; is in code
already being changed; is a correctness, security, accessibility, or measured
performance defect; is a duplicate or competing implementation of the same
concept; is dead code revealed by migration (confirm with `npm run knip`);
blocks correct architecture; or is small, safe, and verifiable.

**Migrate atomically** when a contract, shared primitive, or boundary must
change and every current caller can be updated and verified together. Parallel
old and new paths create drift.

This is a single-owner, pre-production personal site. Internal backward
compatibility is not a default requirement: use the better contract, migrate
every caller, delete the obsolete path. Still protected unless explicitly
authorized: published route URLs, content front-matter shape in `content/`,
`/api/*` and `/feed.xml` response shapes, environment variable names, and
user-visible behavior.

**Record instead of fixing** when the issue is unrelated to the request or its
contract chain; speculative or unsupported by evidence; a broad migration with
no safe verification path; or would create a mixed-purpose diff.

Stop when acceptance criteria are met, affected callers are migrated,
task-related duplicates and obsolete paths are gone, checks pass, and the next
change would be unrelated or disproportionately risky.

Each recursion must reduce a concrete cost: duplication, coupling, obscurity,
invalid states, dead code, unsafe operations, failing checks, or measured
resource use. Moving, renaming, formatting, or abstracting without reducing such
a cost is not cleanup.

## Architecture invariants

- Dependencies flow one way: `app/` → `components/` → `lib/` → `types/`.
  `lib/` must not import from `app/` or `components/`. No cycles.
- Server Components are the default. Add `"use client"` only for hooks, browser
  APIs, event handlers, or animation — and push it to the smallest leaf. Keep
  data fetching and secrets on the server.
- One source of truth per invariant. Route metadata and JSON-LD go through
  `lib/seo.ts`; external caching goes through `lib/cache.ts` tags and durations;
  navigation structure lives in `components/layout/nav-config.ts`. Derive values
  instead of synchronizing duplicated state.
- `components/ui/` holds generic primitives only — no domain rules, no data
  fetching, no route knowledge. Domain behavior lives in its feature folder.
- Every external API call is wrapped in `unstable_cache` with a tag from
  `CACHE_TAGS`, an explicit revalidation window, a timeout, and a usable
  fallback. A failed third-party fetch must never break a page render, and a
  raw tag string is a bug — `/api/cache/revalidate` only knows `CACHE_TAGS`.
- Import through path aliases (`@/components/*`, `@/lib/*`, `@/types/*`), not
  relative backdoors across folders.
- Existing `index.ts` barrels stay curated. Do not add indiscriminate barrels or
  widen public exports for convenience — knip fails CI on the unused surface.
  An export that is genuinely public but unused in-repo needs a `@public`
  JSDoc tag and a doc entry justifying it.
- Do not add packages, layers, services, or configuration for hypothetical
  future use.

## Simplicity and code quality

- Prefer platform, framework, and existing-dependency capabilities over custom
  machinery.
- Prefer direct readable flow over clever compression and needless indirection.
- Do not duplicate constants, business rules, schemas, formatting, validation,
  or error handling.
- Avoid catch-all `utils`/`helpers` modules without cohesive ownership.
- Make invalid states unrepresentable when practical; prefer discriminated
  unions and `as const` over loose strings.
- Never use `any`, unsafe casts, `@ts-expect-error`, `biome-ignore`, ignored
  promises, or swallowed errors as shortcuts. An exception needs a comment
  stating why it is correct.
- Comments explain intent, tradeoffs, and invariants — not obvious syntax.
- Delete replaced implementations, dead exports, abandoned files, commented-out
  code, and temporary shims in the same change.
- Before adding a dependency, check repository and platform alternatives, then
  evaluate maintenance, security, runtime cost, bundle size, and overlap with
  what is already installed.

## TypeScript and React

- Preserve strict inference; validate untrusted data (API responses, form input,
  Markdown front-matter, search params) at the boundary before it flows inward.
- Derive render values instead of storing synchronized state. Use effects only
  to synchronize with external systems.
- `reactCompiler` is on. Do not add `useMemo`/`useCallback`/`memo` without a
  demonstrated identity or performance need.
- Keep URL-addressable state in the URL (`nuqs` is available) so filters, tabs,
  and pagination deep-link and survive back/forward.
- Preserve accessibility, keyboard behavior, stable identity, hydration safety,
  and deterministic rendering. Anything time- or random-dependent must be
  hydration-safe.
- Use the canonical primitives: `cn()` for class names, `components/ui/` for
  controls, `lib/seo.ts` for metadata, `components/common/error-boundary.tsx`
  for failure containment.

## UI, accessibility, and content

[`docs/UI_GUIDELINES.md`](docs/UI_GUIDELINES.md) is binding for any change that
renders UI — keyboard support, focus, hit targets, forms, motion, layout,
contrast, and copy. Read it before writing interface code; do not restate it
here.

Biome's a11y rules are relaxed only inside `components/ui/` (see `biome.json`
overrides). That relaxation is for upstream shadcn source, not a license to ship
inaccessible application UI.

## Contact information and secrets

Contact details are deliberately obfuscated to resist harvesting. See
[`docs/SPAM_PROTECTION.md`](docs/SPAM_PROTECTION.md).

- Render email and phone only through `ObfuscatedEmail` / `ObfuscatedPhone` in
  `components/ui/obfuscated-contact.tsx`.
- Never hardcode a raw email or phone number in JSX, metadata, JSON-LD, or
  fixtures. Do not add `mailto:`/`tel:` hrefs that bypass the click-to-reveal.
- After touching contact surfaces (`app/contact/`, `components/layout/footer.tsx`,
  `components/home/inline-contact.tsx`), verify reveal still works.
- Keep secrets out of source, logs, client bundles, and error messages. API
  tokens (`GITHUB_API_TOKEN`, `DRIBBBLE_ACCESS_TOKEN`, `FIGMA_ACCESS_TOKEN`,
  `RESEND_API_KEY`) are server-only — never reference them in a `"use client"`
  file or a `NEXT_PUBLIC_*` variable.
- Server actions and route handlers are public endpoints. Validate and normalize
  every input there; never trust client-side checks alone.

## Performance protocol

Performance claims require evidence:

1. Establish a representative baseline (`npm run build`, `npm run build:analyze`,
   or `npm run perf:budget` against `lighthouse-budget.json`).
2. Measure or profile one level below the visible symptom.
3. Identify the dominant bottleneck.
4. Change the smallest responsible design or implementation.
5. Repeat the same measurement and report before/after.
6. Preserve a budget or benchmark when regression risk matters.

Prioritize in this order: server/client boundary and shipped JavaScript, image
weight and CLS, third-party fetch waterfalls and caching, algorithms and data
shape, rendering and re-renders — then cosmetic micro-optimization. Never claim
speed from fewer lines, different syntax, or a newer library without a
representative measurement. See [`docs/PERFORMANCE.md`](docs/PERFORMANCE.md).

## Correctness and verification

There is no test runner here, so static checks and manual verification carry the
load. Do not claim a change is tested when it is not.

Run from narrowest to broadest, as risk requires:

```bash
npm run lint         # always
npm run type-check   # always
npm run knip         # after deleting, moving, or renaming anything
npm run build        # for routing, data-fetching, server/client boundary changes
```

All four run in CI, so a change that skips them locally fails there instead.

Then exercise the affected route in `npm run dev` — including its loading,
empty, and error states — before reporting completion.

If a change introduces logic worth protecting with a test, say so and propose
the smallest setup rather than silently skipping it. Never weaken a check to
make a change pass.

## Mechanical prevention

When an objective failure can recur, add the smallest reliable sensor, in
increasing order of cost: a type invariant → a Biome rule → a knip entry →
`lighthouse-budget.json` → a CI step in `.github/workflows/ci.yml`.

Sensors already in place: Ultracite/Biome (lint + format) at zero findings,
`tsc --noEmit` under `strict` **and** `noUncheckedIndexedAccess`, knip at zero
unused files/exports/types/dependencies, and a production build — all four
gating every pull request.

Sensors must be deterministic, actionable, low-noise, and fast enough for their
stage; their messages must explain how to fix the violation. For existing debt,
record a baseline, block new violations, and reduce the baseline when the code
is touched. Do not introduce a noisy repository-wide gate that will be ignored.
Prefer safe autofixes when semantics are unambiguous.

## Audit tooling

Keeping this repository clean is a standing goal, not a one-off. Beyond the four
CI gates, run these periodically — after a feature lands, before a release, or
whenever the codebase feels like it has accumulated drift.

| Tool | Command | What it catches |
|---|---|---|
| Ultracite / Biome | `npm run lint` | Lint + formatting, Ultracite's rule preset. `npm run lint:fix` applies safe fixes. **CI gate.** |
| knip | `npm run knip` | Unused files, exports, types, dependencies. **CI gate.** |
| react-doctor | `npm run audit:react` | React codebase health — anti-patterns, dead code, dependency supply chain. Scores the repo. |
| React Scan | automatic in `npm run dev` | Unnecessary re-renders, highlighted live in the browser. |
| shadcn | `npm run audit:ui` | Whether `components.json` and the installed primitives still line up with the registry. |
| Vercel | `npm run audit:deploy` | Builds exactly the way Vercel will, catching deploy-only breakage `next build` misses. |

Two naming notes, so nobody hunts for tools that do not exist: there is **no
`vercel doctor` command** in the Vercel CLI (verified against v58) — `vercel
build` is the closest real equivalent and is what `audit:deploy` runs. There is
**no `shadscan` package** on npm; `shadcn info` plus `shadcn add <component>
--diff` covers the same ground.

react-doctor and React Scan are diagnostics, not gates. React Scan is wired in
through `components/common/react-scan.tsx`, which dynamically imports the
package only when `NODE_ENV === "development"` — the branch is statically
removed from production builds, so it never reaches the client bundle. Do not
replace it with the CDN `<script>` that `react-scan init` writes: that adds an
unpinned third-party origin at runtime.

`audit:deploy` needs a linked Vercel project (`vercel link`, then `vercel pull`)
and will refuse to run without one.

Treat these reports as a queue of candidate findings and apply the same fix-now
/ migrate / record triage as any other cleanup — do not act on them mechanically.
Known false positives in this repository, confirmed by reading the code:

- `nextjs-no-side-effect-in-get-handler` on `api/screenshot`, `api/og`, and
  `api/github/stats` — the flagged "side effects" are `URLSearchParams.set` and
  `Map.set` on local objects, and a POST to GitHub's GraphQL *query* endpoint.
  None mutate server state.
- `deslop/unused-export` on `components/ui/obfuscated-contact.tsx` — those
  exports are intentional public API, marked `@public` and documented in
  `docs/SPAM_PROTECTION.md`.
- `unused-dependency: sharp` — Next.js loads it for image optimization without
  an import.

Two Ultracite **assists** are disabled after they damaged this codebase, and
they should stay that way unless upstream fixes them: `useSortedAttributes`
emitted duplicate JSX attributes (`render`, `components`) and can reorder
attributes across a `{...spread}`, which changes precedence; `useSortedKeys`
sorts object literals alphabetically, which silently reorders any UI that
iterates an object's keys. Class sorting stays on.

Never run `ultracite fix --unsafe` without reading the resulting diff and
running `type-check` plus a cold `build` — its unsafe pass left this repository
uncompilable twice.

`noExcessiveCognitiveComplexity` is enforced, and the repository is at zero.
Keep it that way by extracting a hook or a child component rather than raising
the threshold — `hooks/use-capsule-morph.ts`, `use-drag-resize.ts`,
`use-frame-size.ts`, and `use-screenshot.ts` all came out of that exercise and
each owns one concern.

`ultracite/biome/type-aware` is enabled for its import-graph rules, so import
cycles and undeclared dependencies fail CI.

React Scan overlaps with `reactCompiler: true`, which already memoizes
automatically. A re-render it flags is worth chasing only when it is measurable;
see the Performance protocol above before changing anything on its say-so.

## Verification gate

Before reporting completion:

- review the full diff;
- verify every acceptance criterion and non-goal;
- confirm existing candidates were reused or explicitly rejected;
- search again for duplicate components, helpers, schemas, and sources of truth;
- migrate every affected caller, import, export, and contract;
- remove dead and obsolete code;
- verify server/client boundaries and one-way dependencies;
- confirm no secret or raw contact detail entered the client bundle;
- run the checks appropriate to the risk and report their actual output;
- compare before/after measurements for any performance claim;
- confirm no unrelated cleanup entered the diff;
- run `git diff --check`;
- state any unrun check and why.

Never call a solution "best", "optimal", "safe", or "fully verified" without
evidence.

## Required final report

- **Decision** — chosen design and why.
- **Reused** — existing concepts used.
- **Created or extended** — what changed and why reuse alone was insufficient.
- **Recursive cleanup** — duplicates, dead paths, or debt removed in the cone.
- **Mechanical prevention** — sensors added, or the highest-value next sensor.
- **Verification** — exact commands run and their results.
- **Remaining findings** — relevant issues intentionally left out of this change.

## Never

- create before searching;
- reimplement an existing canonical helper or `components/ui/` primitive locally;
- force unrelated concepts together merely to satisfy DRY;
- add a wrapper with no invariant or meaningful simplification;
- ship a raw email, phone number, or API token to the client;
- add `"use client"` to a component that does not need it;
- preserve an obsolete internal path solely for pre-production compatibility;
- perform an unbounded cleanup rewrite during a focused task;
- optimize without measurement;
- broaden public exports for convenience;
- suppress types, lint rules, security findings, or errors without a justified
  exception;
- leave old and new implementations competing after a migration;
- claim a check passed without running it.
