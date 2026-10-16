# Architecture

Personal developer portfolio: an editorial homepage, Markdown-driven projects and
blog, a live GitHub portfolio, and a resume. Next.js App Router + React 19 +
Tailwind CSS.

## Layout

Every page is wrapped by `components/layout/conditional-layout.tsx` (`SiteLayout`),
which renders a semantic header containing the floating identity/breadcrumb and
utility toolbar, the nav dock, the page `main`, and the footer. Content width and
gutters come from `components/layout/site-shell.tsx`.

Theme is light/dark via `next-themes` (light default, system aware) with a toggle
in the utility toolbar.

## Homepage

`/` renders the editorial homepage (`app/page.tsx`) composed of:

- `components/home/home-interactive.tsx`. intro, bio, social links
- `components/home/home-projects.tsx`. project list
- `components/home/home-blog.tsx`. recent posts

## Route map

| Route | Purpose |
|-------|---------|
| `/` | Editorial homepage |
| `/projects`, `/projects/[slug]` | Markdown case studies (`content/projects/`) |
| `/portfolio`, `/portfolio/*` | Live GitHub portfolio, static project details, and Figma viewer |
| `/blog`, `/blog/[slug]` | Markdown blog (`content/blog/`) |
| `/resume` | Resume (PDF export via `/api/resume-pdf`) |
| `/contact` | Contact form (Resend via `lib/actions/send-email.ts`) |
| `/shop`, `/shop/success`, `/shop/cancel` | Unlinked placeholder shop with test-only Stripe Checkout ([boundaries and local test](SHOP.md)) |
| `/privacy`, `/terms` | Legal |

## Components

```
components/
  layout/        # Header/footer, site shell, nav dock, launcher, utility toolbar
  home/          # Homepage building blocks
  blog/          # Blog UI
  project/       # Project preview UI
  portfolio/     # Figma viewer
  shop/          # Test checkout form and pending/error feedback
  common/        # Theme, analytics, markdown, error boundary, empty state
  ui/            # Base UI primitives
```

## Data

- `lib/portfolio-data.ts`. Server-only GitHub / Dribbble / Figma APIs and caching;
  guarded against imports from client components
- `lib/portfolio-projects.ts`. Static project catalog for `/portfolio/[...slug]`;
  client-safe, with no API, cache, or environment dependencies
- `lib/projects.ts`, `lib/blog.ts`. Markdown content (`gray-matter`)
- `lib/seo.ts`. Metadata and JSON-LD structured data
- `lib/analytics.ts`. Vercel analytics events
- `lib/cache.ts`. `CACHE_TAGS`, the single source of truth for cache tags
- `lib/actions/send-email.ts`. contact form server action (Resend)
- `lib/shop/products.ts`. typed placeholder catalog; the only shop price source
- `lib/shop/checkout.ts`, `lib/actions/create-checkout.ts`. test-only Stripe
  Checkout mutation and server-action redirect; no fulfillment or order storage
