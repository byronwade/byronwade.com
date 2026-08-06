# byronwade.com

Personal portfolio for Byron Wade — full-stack developer. An editorial homepage,
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
| `/` | Editorial homepage — intro, projects, recent posts |
| `/projects`, `/projects/[slug]` | Case studies from Markdown (`content/projects/`) |
| `/portfolio` | Live GitHub repositories (`/api/portfolio`) |
| `/blog`, `/blog/[slug]` | Blog from Markdown (`content/blog/`) |
| `/resume` | Resume (with PDF export) |
| `/contact` | Contact form (Resend) |
| `/privacy`, `/terms` | Legal |

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full folder map.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run dev:turbo` | Dev with Turbopack |
| `npm run build` | Production build |
| `npm run lint` / `lint:fix` | Biome lint |
| `npm run type-check` | TypeScript |
| `npm run knip` | Unused code/deps scan |
| `npm run clear` | Remove `.next` and `node_modules` |

## Tech

Next.js (App Router) · React 19 · TypeScript · Tailwind CSS · Biome · Vercel.

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
