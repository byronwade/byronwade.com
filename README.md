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

See `env.local.example`. Key variables: `GITHUB_TOKEN`, `DRIBBBLE_ACCESS_TOKEN`,
`FIGMA_ACCESS_TOKEN`, `RESEND_API_KEY`, `NEXT_PUBLIC_BASE_URL`.
