# Architecture

Personal developer portfolio: an editorial homepage, Markdown-driven projects and
blog, a live GitHub portfolio, and a resume. Next.js App Router + React 19 +
Tailwind CSS.

## Layout

Every page is wrapped by `components/layout/conditional-layout.tsx` (`SiteLayout`),
which renders the fixed `SiteHeader`, the page `main`, and the `Footer`. Header
clearance is reserved before hydration. `SiteHeader` combines `NavDock` navigation
(which also draws the brand link, see `docs/PERFORMANCE.md` "Route chunk ownership")
with `DockToolbar` search and theme controls; Base UI owns the anchored menu and
search panels. Content width and gutters come from `components/layout/site-shell.tsx`.
Header panel relationships follow their lazy mount lifecycle: the fallback trigger
does not reference a panel before it exists, and Base UI supplies `aria-controls`
for the open popup. Do not override that attribute on the trigger or its rendered
button. The rendered accessibility checks resolve those references before opening,
with results and empty search, after closing, and on reopening. They also read
Chrome's accessibility tree to require the menu's "Navigate" and search's "Search"
dialog names; the canonical WCAG axe rule set does not include `aria-dialog-name`.
On extra-wide screens a breadcrumb sits beside the header; its trail
(`components/layout/breadcrumb-trail.ts`) takes labels from the search index,
links only parent paths that are real pages, and names Figma files "Design file"
because the file name is page-owned data. That page's own trail is named
"Design file breadcrumb" so its landmark stays distinct from the shared
"Breadcrumb", and it hides at xl, where the shared trail shows: one trail per
viewport. URLs that are not pages show no
trail: the static 404 is prerendered at `/_not-found` and hydrates at the
visitor's URL, so any label taken from the path would differ between the two.
For the same reason `NavDock` marks no section current when the root segment is
`_not-found`; otherwise `/blog/missing` would highlight "Blog" in the browser only.

Theme is light/dark via `next-themes` (light default) with a toggle in
the header.

### Local browser verification

Rendered browser tests use `withBrowser` in `tests/fixtures/browser.mjs` to own
launch, unexpected process exit and cleanup. An owned browser that exits before
cleanup fails the test even if its page assertions passed; an exit already
observed when launch resolves prevents the page callback from running. The
fixture records the PID, exit code and signal, preserves an existing page
failure, and combines it with any cleanup failure instead of replacing it.
Exit during requested cleanup is expected. The existing bounded shutdown and
owned-tree fallback remain separate from page assertions and must not be
replaced with retries or ignored errors. `tests/browser-cleanup.test.mjs`
protects these outcomes without launching Chrome.

On Windows, `taskkill /t /f` can return either 128 or 255 when a descendant
exits before the command reaches it, even after the command terminates the root.
For a forced root exit, cleanup accepts these statuses only when every process failure says
"not found" or "no running instance", and still waits for the owned root's
actual exit event. Mixed failures (for example, an already-exited child plus
access denied on another) still fail forced cleanup. The native regressions
cover both statuses with a forced root exit and reject a root that never exits.

## Homepage

`/` renders the editorial homepage (`app/page.tsx`) composed of:

- `components/home/home-hero.tsx`. intro, bio, social links
- `components/home/home-projects.tsx`. project list
- `components/home/home-blog.tsx`. recent posts

## Route map

Blog and project indexes, posts, and case studies render their local Markdown
without a page-level Suspense fallback. Streaming these prerendered pages can
leave the prose in hidden containers that need JavaScript to replace the
skeleton. `tests/rendered/readable-content.test.mjs` checks every published URL
from the build manifest and both indexes in a browser with JavaScript disabled,
asserting visible titles, prose, index entries, and no article/list loading status.
Slug enumeration still owns which URLs exist; missing content keeps the real 404
contract below.

Project screenshots are optional progressive enhancement. `FullWidthProjectPreview`
renders a native site link before hydration and explains the JavaScript requirement
inside `<noscript>`, so visitors with scripts never see that notice flash; capture
controls and loading status appear only after mount. The same rendered reading test
checks these fallbacks on every published project with a preview, and
`project-preview.test.mjs` holds a script-enabled page before hydration to check the
notice stays hidden.
Recovery content can grow beyond the capture dimensions; `project-preview.test.mjs`
checks that both actions fit at 320px with 100% and 200% root text sizing.
The browser's URL-resolution request has a ten-second deadline covering headers
and the JSON body, so a stalled response reaches the existing Retry and Open site
fallback. This request only reads local metadata; the separate image route retains
the provider's longer capture deadline. Concurrent requests for one target and size
share a resolution, successful URLs are cached, and failures release the pending
entry so Retry starts a fresh request. `tests/screenshot-client.test.mjs` checks
stalled headers and streamed bodies against a local server, plus cache reuse,
concurrency, malformed responses and recovery without calling the provider.
The preview's rendered control checks use local images at each offered capture
size. The toolbar actions and status groups wrap when enlarged text leaves too
little room; the status bar grows from its normal 28px minimum rather than
clipping device names or the fullscreen hint. Rendered checks measure visible
text and controls within both bars at 320px and 1280px in both themes, including
200% root text, active resizing, Reset and keyboard fullscreen entry/exit.
They also cover keyboard width adjustment, reset, preset selection and capture
reuse, plus native fullscreen focus, background inertness, Escape and exit-button
focus return in both themes. Reset returns focus to the next toolbar control
before its own button disappears. Native dialog navigation may include browser
chrome, as allowed by [W3C H102](https://www.w3.org/WAI/WCAG22/Techniques/html/H102);
background page controls remain inert.

Fullscreen padding dismisses only a primary gesture that starts and ends there.
A click's target can be the common ancestor of its press and release. Touch
implicitly captures its pointer and can retain press coordinates for a tap's
click. The preview records the press target, hit-tests `pointerup` coordinates
and dismisses on click only when both ends qualify. Cancellation clears the
gesture. The rendered checks exercise both crossed gestures with real Chrome mouse
and touch input at 390px and 1280px in both themes; they require trusted clicks
so a cancelled scroll cannot masquerade as a passing touch case. Intentional
padding clicks and taps still close, restore scrolling and return focus.

The width handle uses one captured primary pointer for mouse, touch and pen.
Release commits the final position; cancellation, lost capture, window blur,
reset and unmount discard pending frame work and restore the previous cursor
and text-selection styles. Pointer moves keep the latest position per frame.
The container takes precedence when it is narrower than the 320px resize
minimum, so manual sizing preserves the screenshot's aspect ratio on phones.
The rendered preview checks cover touch cancellation, window blur and this
narrow-screen sizing boundary with local captures.

Root metadata (`app/metadata.config.ts`) sets only Googlebot preview limits,
so it cannot add an indexing directive to Next's automatic `noindex` on 404s.
Public pages without a page-level policy use the crawler defaults, `index, follow`;
the root no longer adds `nocache`. Page-specific policies remain in `lib/seo.ts`,
including `/search`'s `noindex`. The missing-content regression checks one generic
robots tag on 404s, no contradictory Googlebot `index`, published-page indexing,
and preserved preview limits. See [Next's notFound contract](https://nextjs.org/docs/app/api-reference/functions/not-found)
and [Google's robots defaults](https://developers.google.com/search/docs/crawling-indexing/special-tags).

| Route | Purpose |
|-------|---------|
| `/` | Editorial homepage |
| `/projects`, `/projects/[slug]` | Markdown case studies (`content/projects/`). Both slug routes set `dynamicParams = false`: only loader slugs are pages, so unknown slugs and production drafts get the static 404 (status 404, `noindex`, `no-store`) instead of a streamed 200 that `next start` would cache (`tests/rendered/missing-content.test.mjs`) |
| `/portfolio`, `/portfolio/figma/[key]` | Live GitHub portfolio and Figma viewer. The retired 2024 Thorbis pitch pages (`/portfolio/thorbis`, `-ai`, `-mobile`) redirect permanently to `/projects/thorbis` (`next.config.js`; checked by `tests/rendered/legacy-portfolio.test.mjs`) |
| `/blog`, `/blog/[slug]` | Markdown blog (`content/blog/`); same 404 contract as projects. Development rebuilds the slug list per request, so drafts still preview |
| `/resume` | Resume, server-rendered; print rules (`print:*`) on the page also shape the PDF export via `/api/resume-pdf` |
| `/contact` | Contact form (Resend via `lib/actions/send-email.ts`) |
| `/search` | Site search. `?q=` uses the same matcher as the header palette (`lib/search-match.ts`). The page also searches the readable text of each project and article (`buildPageSearchIndex`). The header list stays on titles, summaries, and tags, because every page ships it. The page is `noindex`. The WebSite JSON-LD search box points here. |
| `/privacy`, `/terms` | Legal |

Search body text follows the same `markdownOptions` grammar as the article and
its table of contents. `lib/search-text.ts` reads the renderer's element tree,
preserving words across inline markup and decoding character references. Block
boundaries separate words. Code blocks, images, raw HTML, comments and hidden
link destinations stay out; inline code and visible URLs remain searchable.
`lib/search-match.ts` collapses every whitespace run before applying the shared
120-character query limit. `tests/search.test.mjs` protects these boundaries.

In production, `buildPageSearchIndex` caches the computed corpus with Next's
existing Data Cache. It reads and validates the files first, then passes the
complete project and published-post values as cache arguments. Bodies, metadata,
additions, removals, draft changes and repaired files therefore select their
current corpus without waiting for a timer or manual invalidation. Development
bypasses this cache, including draft previews. The header keeps its compact,
body-free index. The `page-search-corpus-v1` key is a format revision, not a cache
tag; bump it when the mapping, static page entries or shared Markdown grammar
changes, because the Data Cache can survive deployments. No external cache tag
or refresh endpoint is involved. The rendered search regression checks reuse
in the real local cache and content freshness through production HTTP requests.

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

Article sharing and the inline contact form share `hooks/use-copy-to-clipboard.ts`.
It serializes clipboard writes, exposes failure instead of logging it silently,
and owns the two-second success reset with effect cleanup. Each caller keeps its
own recovery wording in a polite status region: use the browser address for an
article link, or reveal the email for manual copying. Copy controls keep their
accessible names and keyboard focus while pending (`aria-disabled`, enforced by
the hook). `tests/rendered/clipboard.test.mjs` covers denial, an unavailable API,
pending writes, explicit retry, confirmation, draft preservation and email reveal.
Revealed contact addresses may break anywhere (`components/ui/obfuscated-contact.tsx`),
so the inline panel, `/contact` and footer emails stay inside the viewport.
In the inline panel the send label, heading and close control can also wrap,
and the homepage facts use intrinsic columns. Shared section headings
wrap their index links onto another line when needed; index rows can break
overlong words. These keep recovery inside the viewport at 320px
with 200% text.

```
components/
  layout/        # Fixed header, navigation, search, footer, site shell
  home/          # Homepage building blocks
  blog/          # Blog UI
  project/       # Project preview UI
  portfolio/     # Figma viewer
  common/        # Theme, analytics, markdown, error boundary, empty state
  ui/            # Base UI primitives
```

## Data

- Markdown rendering and project contents share CommonMark/GFM options in
  `lib/markdown.ts`. Contents walk the installed renderer's element tree and
  reuse `lib/markdown-utils.ts` text extraction and slug allocation, including
  headings inside containers and setext headings. Parser dependencies stay out
  of the date utility module used by client components. Renderer-agreement
  regressions cover grammar edge cases and every authored blog/project file in
  `tests/markdown-headings.test.mjs`.
- `/portfolio` renders its repository list on the server. A failed request shows
  retry/profile recovery with link semantics; a successful empty profile has a
  distinct empty state. Optional profile data cannot relabel healthy repositories
  as a repository outage. `connection()` keeps failure HTML out of the Full Route
  Cache, so retry can call the loader again. Successful data keeps its existing
  one-hour cache. The page has no client request effect or stale state to
  synchronize. Native regressions in `tests/portfolio-lifecycle.test.mjs` exercise
  the actual page orchestration and row rendering with primitive stand-ins;
  browser verification covers the real controls and keyboard behavior.
  After a build, `tests/rendered/portfolio-retry.test.mjs` uses Next's real caches
  and a loopback provider to verify failure, retry recovery and successful-data
  reuse without replacing normal cached API data.
- `lib/portfolio-data.ts`. Server-only GitHub / Dribbble / Figma APIs and caching;
  guarded against imports from client components. GitHub repository/profile and
  Dribbble REST fetches have a five-second abort deadline that remains active
  while reading the JSON body. GitHub repository and profile failures reject
  instead of caching missing data. The page owns repository recovery; the API's
  existing `Promise.allSettled` boundary retains healthy provider data and sets
  `degraded` for either failure, plus `githubFailed` only for a repository failure,
  without changing the JSON shape.
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
  `null` before a cache entry or request exists, and the segment's `layout.tsx`
  answers it with a real HTTP 404. That check must stay above `loading.tsx`: the
  loading boundary streams a 200 shell before the page renders, so a page-level
  `notFound()` only produced a soft 404 (checked by
  `tests/rendered/figma-detail.test.mjs`). The page's `generateMetadata` also
  returns nothing for such a key: the client applies page metadata after
  hydration, so without that bail-out the 404 would be titled "Design file
  unavailable". The file response
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
