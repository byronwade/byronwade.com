# byronwade.com

Personal portfolio for Byron Wade, full-stack developer. An editorial homepage,
case-study projects, a live GitHub portfolio, a Markdown blog, and a resume.

## Quick start

Use Node.js 24.x, as declared in `package.json`. The same declaration selects the
Vercel build and function runtime.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Purpose |
| ------- | --------- |
| `/` | Editorial homepage, intro, projects, recent posts |
| `/projects`, `/projects/[slug]` | Case studies from Markdown (`content/projects/`) |
| `/portfolio` | Live GitHub repositories (`/api/portfolio`) |
| `/blog`, `/blog/[slug]` | Blog from Markdown (`content/blog/`) |
| `/resume` | Resume (with PDF export) |
| `/contact` | Contact form (Resend) |
| `/privacy`, `/terms` | Legal |

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full folder map.

## Governance

This repository uses [Thorbis Design](https://design.thorbis.com), ported from
[byronwade/thorbis-design](https://github.com/byronwade/thorbis-design).
See [the source map and sync guide](docs/THORBIS-DESIGN-PORT.md) for the pinned
revision and CSS/Tailwind adapters. Site-specific governance stays here.

| File | Owns | Read it when |
| --- | --- | --- |
| [`PROJECT_PROFILE.md`](PROJECT_PROFILE.md) | Users, owners, dependencies, commands, budgets, exceptions | **First.** The other two are only authoritative once this is accurate |
| [`DESIGN.md`](DESIGN.md) | Design judgment, composition, density, motion, accessibility, the quality gate | Any change that renders UI |
| [`AGENTS.md`](AGENTS.md) | How work is done, operating modes, reuse ladder, cleanup bounds, verification | Every task |
| [`docs/DESIGN_RESEARCH_BASIS.md`](docs/DESIGN_RESEARCH_BASIS.md) | Why the standard says what it says | Only when revising the standard |

Two rules do most of the work:

- **A reference is not a write.** Asking to look at, review, or audit something
  is read-only. A URL or an available write tool does not grant permission to
  edit. `AGENTS.md` opens with the mode table.
- **One source of truth per value.** `app/globals.css` owns every design value,
  including the `--motion-*` curves and durations. Page-local constants and
  second scales are drift, not style.

Design values are never duplicated into Markdown. These files describe decisions
and point at the code that holds the values.

## Scripts

| Command | Description |
| --------- | ------------- |
| `npm run dev` | Dev server |
| `npm run dev:turbo` | Dev with Turbopack |
| `npm run build` | Production build |
| `npm run lint` / `lint:fix` | Ultracite over Biome ,  **local release gate** |
| `npm run type-check` | `next typegen` + strict TypeScript ,  **local release gate** |
| `npm run knip` | Unused files, exports, types, deps ,  **local release gate**, at zero |
| `npm run build` | Production build ,  **local release gate** |
| `npm run check` | Lint, then type-check and knip |
| `npm test` | Contact, cache-refresh, and content-date regressions; no live services (Node 22.18+) |
| `npm run test:rendered` | Check contact semantics, portfolio client bundles, and visible content dates after `SCREENSHOTONE_ACCESS_KEY=rendered-checks npm run build` (a placeholder key, so project pages keep their previews) |
| `npm run audit:react` | react-doctor. React codebase health |
| `npm run audit:ui` | shadcn registry/config check |
| `npm run audit:deploy` | `vercel build` (needs a linked project) |
| `npm run perf:budget` | Build + Lighthouse against `lighthouse-budget.json` |
| `npm run clear` | Remove `.next` and `node_modules` |

Run all four release gates locally before publishing, plus `npm test` for contact
changes and `npm run test:rendered` after the build. The checked-in Actions workflow
is manual-only; local checks or Depot are the release gate. GitHub's separate
default CodeQL setup still creates automatic Actions runs and needs an owner
settings change to comply with that policy. React Scan is wired into `npm run dev`
and never reaches production.

Publication dates are calendar days. Use `safeFormatDate` / `safeISODate` from
`lib/markdown-utils.ts` for content dates and year groups, including serialized
UTC-midnight YAML dates. Direct local formatting of those ISO strings can display
the previous day or year. Non-midnight timestamps retain local-time formatting.
An impossible calendar day is rejected whether or not it is quoted; it is not
moved to the next real day.

## Tech

Next.js 16 (App Router, React Compiler) · React 19 · TypeScript strict with
`noUncheckedIndexedAccess` · Tailwind CSS v4 · Base UI primitives · Ultracite
over Biome · knip · Vercel.

`PROJECT_PROFILE.md` holds the approved-dependency table, including why each one
is there and what it replaces.

## Environment

Create `.env.local`. All are server-only except `NEXT_PUBLIC_BASE_URL`:

| Variable | Used for |
| --- | --- |
| `GITHUB_API_TOKEN` | GitHub repos and stats on `/portfolio` |
| `DRIBBBLE_ACCESS_TOKEN` | Dribbble shots |
| `FIGMA_ACCESS_TOKEN` | Figma files and the `/portfolio/figma` viewer |
| `RESEND_API_KEY` | Contact form delivery |
| `SCREENSHOTONE_ACCESS_KEY` | Live previews on project pages, fetched server-side by `/api/screenshot/image`. Without it, project pages leave the preview out; adding it takes a redeploy |
| `REVALIDATION_SECRET` | Authorizes `POST /api/cache/revalidate` |
| `NEXT_PUBLIC_BASE_URL` | Overrides the site origin in canonical URLs, the sitemap, the feed and metadata. Defaults to `https://www.byronwade.com`, the host production serves; leave it unset in production |

Every external fetch degrades to a usable fallback, so the site builds and runs
with these unset. Cache refresh is disabled when `REVALIDATION_SECRET` is unset,
empty, or whitespace-only: `POST /api/cache/revalidate` returns `401` without
invalidating anything. With a configured secret, the JSON body must contain that
exact secret and a tag from `CACHE_TAGS` in `lib/cache.ts`. Malformed JSON or a
non-object body returns `400`; an invalid secret returns `401`; an authenticated
request with an invalid tag returns `400`. Successful refreshes retain the
`success`, `message`, and `timestamp` response. `GET` lists usage and available
tags without exposing the configured secret or refreshing the cache.
