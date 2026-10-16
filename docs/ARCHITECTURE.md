# Architecture

Personal developer portfolio: an editorial homepage, Markdown-driven projects and
blog, a live GitHub portfolio, and a resume. Next.js App Router + React 19 +
Tailwind CSS.

## Layout

Every page is wrapped by `components/layout/conditional-layout.tsx` (`SiteLayout`),
which renders a flow header with launcher, wrapping navigation and toolbar, the
page `main`, and the `Footer`. Content width and gutters come from
`components/layout/site-shell.tsx`.

Theme is light/dark via `next-themes` (light default) with a toggle in
the header.

## Homepage

`/` renders the editorial homepage (`app/page.tsx`) composed of:

- `components/home/home-hero.tsx`. intro, bio, social links
- `components/home/home-projects.tsx`. project list
- `components/home/home-blog.tsx`. recent posts

## Route map

| Route | Purpose |
|-------|---------|
| `/` | Editorial homepage |
| `/projects`, `/projects/[slug]` | Markdown case studies (`content/projects/`) |
| `/portfolio`, `/portfolio/*` | Live GitHub portfolio, static project details, and Figma viewer |
| `/blog`, `/blog/[slug]` | Markdown blog (`content/blog/`) |
| `/resume` | Resume, server-rendered; print rules (`print:*`) on the page also shape the PDF export via `/api/resume-pdf` |
| `/contact` | Contact form (Resend via `lib/actions/send-email.ts`) |
| `/shop`, `/shop/[productId]`, `/shop/success`, `/shop/cancel` | Unlinked placeholder shop with test-only Stripe Checkout ([boundaries and local test](SHOP.md)) |
| `/privacy`, `/terms` | Legal |

### Resume PDF export

`/api/resume-pdf` prints `/resume` only after a successful HTTP navigation.
An HTTP error or missing navigation response returns the existing generic 500
JSON with `Cache-Control: no-store`, so an error page cannot be cached as a PDF.
Successful exports retain the shared filename and one-hour cache policy. Email
hydration remains best-effort; the server-rendered record can print without it.
The browser closes on both success and failure. Native Node regressions in
`tests/resume-pdf-route.test.mjs` exercise the route with a synthetic browser;
they do not launch Chromium or call production. The compressed browser in
`@sparticuz/chromium/bin` is read by a computed path that file tracing cannot
see, so `next.config.js` adds it to this route's trace with
`outputFileTracingIncludes`; `tests/rendered/resume-pdf-trace.test.mjs` checks
the built trace includes it and that no other route carries it.

On the page, a plain Download PDF click fetches the route and saves only a
successful `application/pdf` body (`fetchResumePdf` in `lib/resume-pdf.ts`).
An error response, a dropped connection, or no complete PDF within 60 seconds
(headers and body) shows "Couldn’t create the PDF. Try again." The 60 seconds
must stay above the route's own bounds (browser launch, 30s page load, 10s email
wait). Leaving the page while a PDF is pending cancels the request, so a late
PDF is never saved on another page. `tests/resume-download.test.mjs` checks
these cases against a local server.

## Components

```
components/
  layout/        # Flow header, footer, site shell, nav dock, toolbar, launcher
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
  Blog posts with `draft: true` are available only in development. The shared
  loader excludes them from production pages, search, RSS, sitemap, and slugs.
- `lib/seo.ts`. Metadata and JSON-LD structured data
- `lib/analytics.ts`. Vercel analytics events
- `lib/cache.ts`. `CACHE_TAGS`, the single source of truth for cache tags
- `lib/screenshot-capture.ts`. Server-only project previews: `/api/screenshot`
  returns a same-origin image URL and `/api/screenshot/image` fetches the capture
  with the provider key, only for published project URLs at the sizes in
  `lib/screenshot-viewports.ts`
- `lib/actions/send-email.ts`. contact form server action (Resend)
- `lib/shop/products.ts`. typed placeholder catalog; the only shop price source
- `lib/shop/checkout.ts`, `lib/actions/create-checkout.ts`. test-only Stripe
  Checkout mutation and server-action redirect; no fulfillment or order storage
