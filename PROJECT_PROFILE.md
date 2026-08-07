# Project profile — byronwade.com

Completed adaptation of `PROJECT_PROFILE_TEMPLATE.md`. `DESIGN.md` and
`AGENTS.md` are only authoritative once this file is accurate; keep it current
when owners, commands, or dependencies change.

Every entry below was verified against the repository, not assumed.

## Identity

- **Project name:** byronwade.com
- **One-sentence purpose:** Byron Wade's personal site — the work, the writing,
  and a way to get in touch.
- **Product maturity:** pre-production, single owner. Internal backward
  compatibility is not a default requirement.
- **Primary platforms:** web
- **Public or private surfaces:** entirely public. There is no authenticated
  area, no user accounts, and no database.
- **Regulatory, legal, privacy, or security constraints:** contact details are
  deliberately obfuscated (`docs/SPAM_PROTECTION.md`); the contact form sends
  through Resend; `/privacy` and `/terms` are published. No PII is stored.

## Users and jobs

| User or role | Core job | Frequency | Environment | Main risk or failure cost |
| --- | --- | --- | --- | --- |
| Prospective client or employer | Decide within a couple of minutes whether Byron can solve their problem | Once, maybe twice | Desktop or phone, often mid-scan of several candidates | They leave without seeing evidence of real shipped work |
| Engineer or designer peer | Read a specific post or look at how something was built | Occasional, often deep-linked from social | Desktop, reading at length | Article body is slow, cramped, or hard to scan |
| Recruiter | Pull role, stack, and dates quickly, often to PDF | Once | Desktop, skimming, frequently printing | Resume is unreadable in print or hides the summary |
| Byron | Publish a post or project by adding Markdown | Weekly-ish | Local editor | Publishing requires touching component code |

The site has no repeat operational user. That single fact removes Workbench
from the profile and makes first-visit clarity the dominant design concern.

## Product personality

- **Primary traits:** direct, evidence-first, quietly confident, technically
  literate
- **Traits to avoid:** salesy, playful, corporate, mysterious, hype-driven
- **Warmth level:** warm — the canvas is warm off-white, not clinical white
- **Density level:** comfortable for reading, compact for indexes. Never sparse
  for its own sake.
- **Motion personality:** crisp and near-still. Motion confirms and orients; it
  never performs.
- **Writing voice:** first person, plain, specific. Numbers where numbers help.
  No superlatives without evidence.
- **Reference products and the exact principle borrowed:**
  - Linear — quiet chrome, strong alignment, dense indexes that still breathe
  - Cursor — the real work is the proof; atmosphere frames it, never replaces it
  - Visitors — each page gets its own organizing move rather than one template
  - Apple HIG — direct manipulation, immediate response, reduced motion respected
- **Visual identities that must not be copied:** any of the above. Borrow the
  principle, express it through this site's own warm-neutral identity.

## Surface profiles

| Profile | Used? | Owners or routes | Notes |
| --- | --- | --- | --- |
| Workbench | No | — | No authenticated or repeat-use operational surface exists |
| Guided | Yes | `/contact`, the inline contact sheet | Single focused task, interruption- and failure-aware |
| Evidence | Yes | `/resume`, `/projects/[slug]` | Reader has a specific question; supports an executive and an audit read |
| Showcase | Yes | `/`, `/projects`, `/portfolio`, `/blog` | The dominant profile for this site |
| Shared primitives | Yes | `components/ui/`, `app/globals.css` | One token system and one primitive set across all profiles |

## Repository ownership

- **Root design authority:** `DESIGN.md`
- **Root agent protocol:** `AGENTS.md` (`CLAUDE.md` points at it; it holds no rules of its own)
- **Nested instruction locations:** none currently
- **Architecture decisions:** `docs/ARCHITECTURE.md`
- **Runtime token owner:** `app/globals.css` — `:root` and `.dark` blocks, surfaced
  to Tailwind through `@theme inline`. The only place a design value is defined.
- **Component/primitives owner:** `components/ui/`
- **Recipes/patterns owner:** feature folders — `components/home/`, `blog/`,
  `project/`, `portfolio/`, `layout/`, `common/`. Each folder's `index.ts` is its
  public interface.
- **Icon owner and approved family:** `lucide-react`. One family, no exceptions.
  The X/Twitter glyph in `dock-toolbar.tsx` is a documented exception — lucide's
  `X` is the close icon, not the logo.
- **Typography owner and loading strategy:** `lib/fonts.ts` — Geist (`--font-sans`),
  Geist Mono (`--font-geist-mono`), and a local signature face
  (`--font-signature`), all `display: swap`, self-hosted through `next/font`.
  `next/font` loaders are server-only; client components use the CSS variable.
- **Motion token owner:** `app/globals.css` (`--motion-*`). Established as part of
  adopting this standard; before that the curve was copy-pasted in four files.
- **Theme owner:** `next-themes`, light default, system aware, toggled from the
  dock and launcher through `hooks/use-theme-toggle.ts`.
- **Content/terminology owner:** `content/blog/*.md`, `content/projects/*.md`,
  read through `lib/blog.ts` and `lib/projects.ts`.
- **Accessibility owner:** `docs/UI_GUIDELINES.md`
- **Performance budget owner:** `lighthouse-budget.json`

## Architecture and boundaries

- **Package/application map:** single Next.js application. `app/` routes,
  `components/` UI, `lib/` domain and data, `hooks/` client behavior, `types/`
  third-party payload shapes, `content/` Markdown.
- **Allowed dependency direction:** `app/` → `components/` → `lib/` → `types/`.
  `hooks/` may be used by `app/` and `components/`, and may import `lib/`.
- **Forbidden imports or cross-app access:** `lib/` must never import from
  `components/` or `app/`. Enforced by `noImportCycles` plus review.
- **Server/client boundary rules:** Server Components by default. `"use client"`
  goes on the smallest leaf that needs it. Secrets and `next/font` loaders stay
  server-side.
- **Public API stability requirements:** published route URLs, `/api/*` and
  `/feed.xml` response shapes, and `content/` front-matter keys are stable
  contracts.
- **Persisted data compatibility requirements:** none — no database.
- **Pre-production migration policy:** prefer the better contract, migrate every
  caller, delete the old path. Do not keep parallel implementations.
- **Generated-code ownership:** `next-env.d.ts` and `.next/types` are generated by
  `next typegen` and gitignored; never edited by hand.

## Canonical UI

- **Application shell:** `components/layout/conditional-layout.tsx` (`SiteLayout`)
- **Navigation:** `components/layout/nav-dock.tsx`, config in `nav-config.ts`
- **Page header/location bar:** `components/layout/app-breadcrumb.tsx`
- **View controls/tabs:** `components/ui/tabs.tsx`
- **Buttons:** `components/ui/button.tsx`
- **Forms and validation:** `components/ui/input.tsx`, `textarea.tsx`, `label.tsx`;
  submission through `lib/actions/send-email.ts`
- **Search and command palette:** `components/layout/dock-toolbar.tsx`, index built
  by `lib/search-index.ts`
- **Filters and saved views:** none — no surface needs them yet
- **Tables/lists:** none — no tabular data on this site
- **Cards/panels:** `components/ui/card.tsx`
- **Dialogs/sheets/popovers/tooltips:** `components/ui/popover.tsx`,
  `hover-card.tsx`, `tooltip.tsx`. There is no dialog primitive; the one modal
  (fullscreen preview) is a portal in `full-width-project-preview.tsx`.
- **Inspectors:** `components/project/project-toc.tsx`
- **Charts/data visualization:** none installed
- **Toasts/notifications:** `sonner` via `components/ui/sonner.tsx`
- **Drag and drop:** `hooks/use-drag-resize.ts` — the preview width handle. Has a
  keyboard path (arrows, Home), which WCAG 2.2 requires.
- **Virtualization:** none. No list is long enough to justify it.
- **AI surfaces:** none
- **Empty/loading/error patterns:** `components/common/empty-state.tsx`,
  `components/common/error-boundary.tsx`

## Approved dependencies

| Capability | Approved owner | Version/range | Why | Replacement or overlap policy |
| --- | --- | --- | --- | --- |
| Accessible primitives | `@base-ui/react` | ^1.5.0 | Migration off Radix is complete; every surviving primitive uses it | No second primitive library. Radix was removed entirely. |
| Motion | `framer-motion` | ^11.18.2 | Needed only by `social-link-preview`; loaded through `LazyMotion` + `m` | CSS first. A library import must justify itself against `.reveal` and CSS transitions. |
| Command menu | in-house (`dock-toolbar`) | — | The morph capsule is the product; `cmdk` was removed | Do not reintroduce a command-menu dependency |
| Toasts | `sonner` | ^2.0.5 | Already standardized | — |
| Charts | none | — | No data visualization on this site | Adding one requires a reader question first (`DESIGN.md` §9.12) |
| Drag and drop | in-house hook | — | One width handle; a library would be heavier than the behavior | — |
| Virtualization | none | — | Not needed at this scale | — |
| State management | React + `nuqs` | ^2.8.5 | URL-shareable state; no global store needed | Do not add a store for local state |
| Class/variant composition | `clsx` + `tailwind-merge` (`cn`) + `class-variance-authority` | — | `cn()` in `lib/utils.ts` is canonical | Never hand-concatenate class strings |
| Theme management | `next-themes` | ^0.4.6 | Light default, system aware | — |

## Design tokens and defaults

Values live in `app/globals.css`. Recorded here only so an agent can find and
use them correctly.

- **Color model and semantic families:** OKLCH. Families: surface
  (`background`/`card`/`popover`/`muted`), text (`foreground`/`muted-foreground`),
  structural (`border`/`input`/`ring`), `brand` (warm amber, ~`oklch(0.72 0.14 85)`),
  `success`, `warning`, `destructive`, and a `dock` family for the dark chrome.
- **Light/dark/high-contrast policy:** light default; `.dark` is a deliberate
  re-mapping, not an inversion. No separate high-contrast theme.
- **Spacing scale:** Tailwind's 4px grid, 8px dominant rhythm.
- **Radius scale:** derived from `--radius: 0.75rem` through `--radius-sm` … `4xl`.
- **Elevation scale:** `.shadow-card` and `.shadow-float` utilities in
  `globals.css`. Persistent regions use borders and tone; transient layers use
  `shadow-float`.
- **Control-size scale:** owned by `button.tsx` variants. Touch targets ≥44px on
  Guided surfaces.
- **Type roles:** `--font-sans` body/heading, `--font-geist-mono` for data and
  code, `--font-signature` for the wordmark only.
- **Motion curves:** `--motion-ease-out`, `--motion-ease-in-out`, `--motion-ease-drawer`.
- **Motion duration scale:** `--motion-fast` (120ms), `--motion-base` (200ms),
  `--motion-slow` (300ms), `--motion-drawer` (480ms).
- **Spring defaults:** none. Nothing on this site is gesture-driven except the
  preview width handle, which tracks the pointer one-to-one with no easing.
- **Reduced-motion behavior:** a global `prefers-reduced-motion` block in
  `globals.css` reduces every animation and transition to ~0ms. Motion is
  therefore never load-bearing for comprehension.
- **Reduced-transparency/high-contrast behavior:** not implemented. Recorded as
  known debt below.

## Commands and verification

- **Install:** `npm ci`
- **Development:** `npm run dev`
- **Affected tests:** none — there is no test runner in this repository
- **Package tests:** none
- **Type check:** `npm run type-check` (`next typegen && tsc --noEmit`, strict +
  `noUncheckedIndexedAccess`)
- **Lint/static analysis:** `npm run lint` (`ultracite check`, Biome underneath)
- **Format check:** same command; `npm run lint:fix` writes
- **Build:** `npm run build`
- **End-to-end:** none
- **Accessibility:** no automated suite. Biome's a11y rules run in lint; manual
  keyboard passes are required for critical flows.
- **UI consistency:** no visual regression suite. Recorded as debt below.
- **Duplicate detection:** `npm run knip`
- **Dead code:** `npm run knip` — currently at zero
- **Bundle/performance:** `npm run build:analyze`, `npm run perf:budget`
- **Visual regression:** none
- **Marketing SEO/Core Web Vitals:** `npm run perf:budget` against
  `lighthouse-budget.json`; field data via `@vercel/speed-insights`
- **Repository diff check:** `git diff --check`

## Performance budgets

From `lighthouse-budget.json`, applied to `/*`.

| Surface | Metric | Budget | Measurement method | Environment |
| --- | --- | --- | --- | --- |
| All routes | LCP | 3000ms (tighten toward the 2500ms CWV target) | Lighthouse | Local production build |
| All routes | FCP | 2000ms | Lighthouse | Local production build |
| All routes | CLS | 0.1 | Lighthouse | Local production build |
| All routes | Total blocking time | 300ms | Lighthouse | Local production build |
| All routes | Script bytes | 300KB | Lighthouse resource budget | Local production build |
| All routes | Image bytes | 500KB | Lighthouse resource budget | Local production build |
| All routes | Font bytes | 100KB | Lighthouse resource budget | Local production build |
| All routes | Total bytes | 1000KB | Lighthouse resource budget | Local production build |
| Public field data | INP | ≤200ms at p75 | `@vercel/speed-insights` | Production |

## Operating-mode exceptions

| Operation | Allowed scope | Trigger | Safeguard | Owner |
| --- | --- | --- | --- | --- |
| `next typegen` | `next-env.d.ts`, `.next/types` | Every `type-check` and `build` | Both are gitignored and regenerated | Next.js |
| `ultracite fix` | Formatting and safe lint fixes | Explicit run, or after an implementation-mode edit | Never `--unsafe` without reading the diff and running type-check plus a cold build | `biome.jsonc` |

No standing permission exists for commits, pushes, or deployments. Those follow
the user's instruction each time.

## Known debt and ratchets

| Area | Current baseline | New violations blocked? | Reduction rule | Tracking location |
| --- | --- | --- | --- | --- |
| Automated tests | None exist | No gate possible | Add a regression test with the first bug fix that admits one | This table |
| Visual regression | None | No | Add once the redesign settles, starting with the four Showcase routes | This table |
| Reduced transparency / high contrast | Not implemented | No | Implement when a surface depends on translucency for legibility | This table |
| `react-doctor` findings | 41, each investigated | No gate | Re-run after UI work; fix new regressions, keep the recorded exceptions | `AGENTS.md` § Audit tooling |
| React Compiler bailouts | 7, all `try`/`catch` around `await` | No | Leave unless the surrounding code is being rewritten anyway | `AGENTS.md` § Audit tooling |

## Explicit exceptions

| Exception | Reason | Owner | Review date | Replacement plan |
| --- | --- | --- | --- | --- |
| Custom X/Twitter glyph outside lucide | lucide's `X` is the close icon, not the brand logo | `components/layout/dock-toolbar.tsx` | When lucide ships a brand set | Replace with the canonical family |
| `components/ui/**` a11y rule relaxations | Base UI primitives forward props, so the control an a11y rule looks for is at the call site | `biome.jsonc` | On any primitive rewrite | Keep call sites correct; the relaxation never applies to application UI |
| `ObfuscatedPhone` exported but unused | Documented public API of the spam-protection module; the phone channel is kept ready | `components/ui/obfuscated-contact.tsx` | If still unused after the redesign | Delete and update `docs/SPAM_PROTECTION.md` together |
| `noLeakedRender` disabled | Every `&&` render tests a string or object; no numeric conditions exist, and there is no autofix | `biome.jsonc` | If numeric conditions appear in JSX | Re-enable and convert the affected sites |
