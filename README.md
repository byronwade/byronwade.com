# byronwade.com

Personal portfolio for Byron Wade, full-stack developer. An editorial homepage,
case-study projects, a live GitHub portfolio, a Markdown blog, and a resume.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Editorial homepage, intro, projects, recent posts |
| `/projects`, `/projects/[slug]` | Case studies from Markdown (`content/projects/`) |
| `/portfolio` | Live GitHub repositories (`/api/portfolio`) |
| `/blog`, `/blog/[slug]` | Blog from Markdown (`content/blog/`) |
| `/resume` | Resume (with PDF export) |
| `/contact` | Contact form (Resend) |
| `/privacy`, `/terms` | Legal |

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full folder map.

## Governance

This repository runs on the **Warm Precision** kit, a design standard plus an
agent protocol, adapted to this project rather than pasted into it.

| File | Owns | Read it when |
|---|---|---|
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
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run dev:turbo` | Dev with Turbopack |
| `npm run build` | Production build |
| `npm run lint` / `lint:fix` | Ultracite over Biome ,  **CI gate** |
| `npm run type-check` | `next typegen` + strict TypeScript ,  **CI gate** |
| `npm run knip` | Unused files, exports, types, deps ,  **CI gate**, at zero |
| `npm run build` | Production build ,  **CI gate** |
| `npm run check` | Lint with fixes, then type-check and knip |
| `npm run audit:react` | react-doctor. React codebase health |
| `npm run audit:ui` | shadcn registry/config check |
| `npm run audit:deploy` | `vercel build` (needs a linked project) |
| `npm run perf:budget` | Build + Lighthouse against `lighthouse-budget.json` |
| `npm run clear` | Remove `.next` and `node_modules` |

All four gates run on every pull request. React Scan is wired into
`npm run dev` and never reaches production.

## Tech

Next.js 16 (App Router, React Compiler) · React 19 · TypeScript strict with
`noUncheckedIndexedAccess` · Tailwind CSS v4 · Base UI primitives · Ultracite
over Biome · knip · Vercel.

`PROJECT_PROFILE.md` holds the approved-dependency table, including why each one
is there and what it replaces.

## Environment

Create `.env.local`. All are server-only except `NEXT_PUBLIC_BASE_URL`:

| Variable | Used for |
|---|---|
| `GITHUB_API_TOKEN` | GitHub repos and stats on `/portfolio` |
| `DRIBBBLE_ACCESS_TOKEN` | Dribbble shots |
| `FIGMA_ACCESS_TOKEN` | Figma files and the `/portfolio/figma` viewer |
| `RESEND_API_KEY` | Contact form delivery |
| `REVALIDATION_SECRET` | Authorizes `POST /api/cache/revalidate` |
| `NEXT_PUBLIC_BASE_URL` | Canonical URLs and metadata |

Every external fetch degrades to a usable fallback, so the site builds and runs
with these unset.
