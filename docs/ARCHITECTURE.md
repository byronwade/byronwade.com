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
| `/search` | Site search. `?q=` uses the same matcher as the header palette (`lib/search-match.ts`). The page also searches the readable text of each project and article (`buildPageSearchIndex`). The header list stays on titles, summaries, and tags, because every page ships it. The page is `noindex`. The WebSite JSON-LD search box points here. |
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
  common/        # Theme, analytics, markdown, error boundary, empty state
  ui/            # Base UI primitives
```

## Data

- `/portfolio` keeps its eight-second client deadline active through response
  headers and JSON consumption. A timeout ends loading or refreshing and shows
  the existing retry/profile recovery; the profile action retains link semantics.
  Repository empty/error states follow `githubFailed`, so an unavailable optional
  profile does not relabel a healthy empty repository list as a repository outage.
  Effect cleanup cancels quietly and blocks
  stale state updates; settled requests clear their deadline. Native regressions
  in `tests/portfolio-lifecycle.test.mjs` exercise the page's actual effect without
  adding a test renderer or exposing the private hook as production API.
- `lib/portfolio-data.ts`. Server-only GitHub / Dribbble / Figma APIs and caching;
  guarded against imports from client components. GitHub repository/profile and
  Dribbble REST fetches have a five-second abort deadline that remains active
  while reading the JSON body. GitHub repository and profile failures reject to the portfolio
  API's existing `Promise.allSettled` boundary, which retains healthy provider
  data and sets `degraded` for either failure, plus `githubFailed` only for a
  repository failure, without changing the JSON shape.
  A successful empty or filtered-only repository list remains a healthy result.
  The API stays dynamic rather than prerendering an unavailable response; failed
  or degraded responses use `Cache-Control: no-store` so later requests can recover.
  Successful responses retain their CDN policy, and provider data retains the
  same cache keys, tags and one-hour revalidation. A failed or malformed profile
  becomes `stats: null` with `degraded: true`; it does not invent zero counts or
  mark healthy repositories as failed. Genuine zero profile counts remain healthy.
  Dribbble and Figma are optional. An unset or blank `DRIBBBLE_TOKEN`, or
  `FIGMA_ACCESS_TOKEN`/`FIGMA_TEAM_ID`, is a healthy empty list with no request.
  A configured provider whose request fails, times out, returns the wrong envelope
  or returns only invalid records rejects, like GitHub, so the API sets `degraded`
  with `no-store` and `unstable_cache` doesn't store the outage as an empty list.
  A genuinely empty response stays healthy. Figma keeps healthy projects when one
  project request fails; only a failed team request or every project failing
  rejects, so a partial list is still cached as complete. Because failures are no
  longer cached, the API waits at most six seconds for either optional provider
  (Figma's 3 s team plus 5 s project deadlines would otherwise reach the page's
  eight-second deadline); the loaders still cancel their own requests.
  Dribbble JSON enters
  as `unknown`; malformed shot records are omitted while healthy siblings retain
  their original fields and order. Core identity, HTTP(S) media/links, optional
  display metadata, counts, dimensions and timestamps are validated before caching.
  The internal shot type models only validated fields; additional provider metadata
  passes through unchanged and remains untyped. Nullable high-resolution images
  follow the [Dribbble shot response](https://developer.dribbble.com/v2/shots/).
  Repository JSON is read as `unknown` and every entry is validated before
  filtering, sorting or caching. A malformed entry rejects the whole response
  through that same unavailable/retry path, rather than exposing unsafe links,
  invalid dates or values the page cannot render. Valid records keep additional
  API fields. Counts are required by the page; optional metadata and nullable
  timestamps follow GitHub's
  [minimal-repository schema](https://github.com/github/rest-api-description/blob/main/descriptions/api.github.com/api.github.com.json).
  Missing timestamps remain missing in the response and sort after dated
  activity when priority and star counts tie. Native URL/number checks and
  `date-fns` validate values without a new schema dependency.
  Profile JSON is also read as `unknown`: all three counts must be nonnegative
  safe integers and the creation date must be a complete, valid timestamp with
  an explicit timezone, as in GitHub's
  [user endpoint](https://docs.github.com/en/rest/users/users#get-a-user).
  Profile and repository validation share the count and timestamp predicates.
  `tests/portfolio-outcomes.test.mjs` checks the actual loader/API outcome boundary;
  the rendered portfolio contract checks that the API is not prerendered.
  `tests/portfolio-rest.test.mjs` exercises stalled headers and streamed bodies
  against a local HTTP server without calling the providers, including malformed
  repository/profile fields, genuine zero counts, optional/null metadata, filtering
  and ordering. API regressions cover profile failure, uncached recovery and healthy
  sibling data. Figma's SDK gets a
  fresh native abort signal for each request: three seconds for team projects,
  five for each project's files, and two for file details. These deadlines also
  cancel underlying connections during stalled response bodies. The shared SDK
  client replaces request errors with a fixed error before any cache sees them,
  keeping Axios authentication headers out of Next's background revalidation logs.
  A failed project retains healthy sibling files; details remain usable without
  a thumbnail.
  Team/project list payloads are read as `unknown` despite the SDK's static types.
  Only positive safe numeric IDs or exact decimal string IDs can start project
  requests. File keys use the same single plain path-segment rule as detail requests
  (`[A-Za-z0-9_-]`, 1–128 characters), so list entries cannot advertise keys that
  the detail loader rejects. File names, complete valid timestamps and optional HTTP(S)
  thumbnails are validated before sorting/caching, reusing the existing number,
  URL, nonempty-string and timestamp predicates. Invalid entries are skipped with a
  generic warning; healthy entries in the same list survive. A malformed team
  envelope, a nonempty team list whose every project ID is invalid, or a project
  whose envelope is malformed or whose every file is
  invalid, counts as a failed request (see the optional-provider rules above).
  The first six valid
  projects and first twelve valid files per project feed the thirty-file sorted
  result; healthy payloads keep their existing order, caps and four-field projection.
  The optional thumbnail matches Figma's
  [project-files schema](https://github.com/figma/rest-api-spec/blob/main/openapi/openapi.yaml).
  No new API outcome fields are introduced: missing configuration and genuine
  empty lists return `[]`, while failed lists set the existing `degraded` flag.
  The `/portfolio/figma/[key]` detail loader accepts only a single plain path
  segment (`[A-Za-z0-9_-]`, at most 128 characters) as the file key, because the
  SDK concatenates it into the authenticated request path. Any other key returns
  `null` (the page's 404) before a cache entry or request exists. The file response
  is read as `unknown` and projected onto what the page renders: name, last
  modified, optional version, `CANVAS` page count, components (id, optional name
  and description) and style count. The document tree itself is never cached. A
  missing name, an invalid timestamp, or a document, component or style map of the
  wrong type rejects the response through the same `null` fallback instead of
  becoming a false count. Malformed page, component or style entries and an invalid
  version are omitted with one generic warning.
  Only successful detail results enter the two-hour cache. Missing or blank
  credentials return before the cache, and failed requests or invalid responses
  reject inside it; the existing `null` page fallback is applied outside, so a
  transient failure cannot become a cached 404.
  `tests/portfolio-figma.test.mjs` verifies those contracts through the real SDK
  against loopback HTTP, including connection closure, malformed fields/envelopes,
  unsafe list/detail keys, all-invalid team metadata, healthy sibling retention,
  ordering and list caps. Its opt-in cache fixture also checks failure recovery,
  success reuse across loader instances, per-file isolation and sanitized cache
  errors without calling live providers.
  Figma failures log the error message rather than Axios request configuration,
  which includes authentication headers.
- `lib/portfolio-projects.ts`. Static project catalog for `/portfolio/[...slug]`;
  client-safe, with no API, cache, or environment dependencies
- `lib/projects.ts`, `lib/blog.ts`. Markdown content (`gray-matter`)
  Blog posts with `draft: true` are available only in development. The shared
  loader excludes them from production pages, search, RSS, sitemap, and slugs.
  `parseContentDate` in `lib/markdown-utils.ts` validates dates from both loaders:
  complete ISO calendar strings, ISO timestamps with an explicit timezone, and
  valid YAML Date objects. Blog posts without a valid publication date are
  excluded by the same shared boundary and logged for the author to correct.
  Invalid optional update/project dates are omitted. No loader substitutes the
  build date. The sitemap uses an article's update date when present and leaves
  modification dates off undated projects.
  `readContentMatter` in `lib/content-matter.ts` keeps js-yaml's timestamp
  constructor, but only for real calendar days. Impossible unquoted dates such
  as `2026-02-30` stay the original text and fail the same validation as quoted
  dates, instead of shifting onto another day.
  Project collections reuse the detail loader's per-file read/parse boundary:
  an unreadable file or malformed YAML is logged by slug and excluded without
  hiding healthy projects. Static project slugs come from that same collection,
  so failed files are not advertised for prerendering. Homepage selections,
  search, sitemap and screenshot targets all retain the healthy work.
  `readContentMatter` types every front-matter value as `unknown`, so both
  loaders read fields through `frontMatterFields`: text, true/false, finite
  numbers and lists. A wrongly typed value is logged with the file and field and
  read as absent, so one typo drops one field rather than crashing a page or
  hiding the file. A project `url` must be an absolute http(s) address, metric
  figures may be numbers, and a malformed `draft` value keeps the post a draft.
- `lib/seo.ts`. Metadata and JSON-LD structured data
- `lib/analytics.ts`. Vercel analytics events
- `lib/cache.ts`. `CACHE_TAGS`, the single source of truth for cache tags
- `lib/screenshot-capture.ts`. Server-only project previews: `/api/screenshot`
  returns a same-origin image URL and `/api/screenshot/image` fetches the capture
  with the provider key, only for published project URLs at the sizes in
  `lib/screenshot-viewports.ts`
- `lib/actions/send-email.ts`. contact form server action (Resend)
