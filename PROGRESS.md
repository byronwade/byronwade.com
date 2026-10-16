# Portfolio server boundary

Operating mode: Implementation. Writes, small commits, push, and a ready PR to
`main` are authorized. Do not merge or run GitHub Actions.

## Decision record

- Target: static project clients must not import portfolio API clients, cache
  machinery, or GitHub/Figma environment lookups. Keep public listings and
  detail routes working.
- Constraints: preserve UI, URLs, content, API response shapes, and environment
  names. No shop, blog, design-system, credential, or dashboard changes.
- Inspected: root `AGENTS.md`, `CLAUDE.md`, `PROJECT_PROFILE.md`, portfolio
  routes, `lib/portfolio-data.ts`, `lib/projects.ts`, `lib/cache.ts`, all
  portfolio-data imports, manifests, and architecture documentation. No nested
  instructions found. Start: `38261e9` on `bot/portfolio-boundary`, clean tree.
- Root cause: client `app/portfolio/[...slug]/page.tsx` imports the static
  `projects` export from a module with top-level `unstable_cache` calls and
  Figma/API/environment dependencies.
- Reuse/extract: move the existing catalog and private type unchanged into
  `lib/portfolio-projects.ts`; migrate its sole consumer. Keep API functions in
  `lib/portfolio-data.ts` and guard that module with `server-only`. The
  Markdown project loader has a different content contract and cannot own this
  catalog without an unrelated content migration.
- Dependency cone: static portfolio catalog, catch-all page import, API module,
  guard dependency if required, architecture data ownership documentation.
- Verification: reproduce the original import's server-only boundary rejection,
  then local lint, type-check, knip, production build, client-symbol scan, and
  headless route smoke for `/projects`, a Markdown project
  detail, and static portfolio details. Review the full diff and run
  `git diff --check`. Record evidence in `RESULT.md`.

## Plan

1. Install locked dependencies and reproduce the invalid client import with a
   server-only compiler guard before migrating the consumer.
2. Extract the static catalog, enforce the API boundary, and commit the fix.
3. Run release gates and smoke checks; fix only findings in this dependency cone.
4. Write `RESULT.md` with `VERDICT: PASS` or `BLOCKED`, commit evidence, push
   `bot/portfolio-boundary`, and open a ready PR to `main`.

## Progress

- Reconnaissance and dependency installation complete (`npm ci`: 653 packages;
  `npm install --save-exact server-only@0.0.1 --no-audit --no-fund`: exit 0).
- Added the server-only marker before changing the consumer so the original
  import can be checked against the compiler boundary. Added a compiled client
  chunk regression to the existing native `test:rendered` suite; it reports
  filenames only, never chunk contents or credential values.
- Negative boundary check: `npm run build` on Node 24.21.0 exited 1 as expected
  with the old client import still present. Turbopack reported that
  `server-only` cannot be imported from a Client Component and traced both the
  browser and SSR client paths through `app/portfolio/[...slug]/page.tsx`.
- Extracted the existing private type and catalog into `lib/portfolio-projects.ts`
  and migrated the sole static consumer. API implementations and their server
  callers are unchanged. Documented the distinct owners and guard dependency.
- Compared both modules with `38261e9`: catalog is unchanged (SHA-256
  `9867999e766ab94ed9d17676cdd76c3b187ff2555ef3a0a2405a76ac46dacb06`),
  API module differs only by extraction and guard. Import search confirms only
  the API route and server Figma page still import `portfolio-data`.
- `npm run lint`: PASS, 123 files, no fixes. Initial test-loop and formatting
  findings were corrected. Type generation passed; TypeScript is running.
  Remaining checks and production smoke must pass before publishing.
- Release verification complete: lint, type-check, knip, build, and
  `test:rendered` all exited 0. Build generated 39 pages; both rendered tests
  passed and the bundle regression scanned 26 client chunks.
- Exact-symbol client grep: zero matching chunks. Six server chunks retain API
  symbols; raw-contact probe found no matching client scripts/prerendered HTML.
  A broader substring probe matched Next's `NEXT_CACHE_TAGS_HEADER`; exact
  symbol boundaries correctly distinguish it from the repository helper.
- Headless production smoke passed all five routes at desktop and phone sizes:
  ten HTTP 200 responses, expected headings/content, keyboard focus, zero
  browser runtime exceptions, and no portfolio API requests. Disabled browser
  cache for fresh responses after a repeat visit initially returned HTTP 304.
- Recorded local telemetry/screenshot/image resource failures and third-party
  fallback diagnostics in `RESULT.md`; they do not block the scoped boundary
  acceptance criteria. No UI or external-service changes made.
- Implementation commit: `82935f2`. Final evidence/documentation commit and
  publication are next; open a ready PR and do not merge.
- Shared toolkit advisory reservation could not initialize: its configured
  roots include a missing unrelated septic workspace. No configuration or
  quarantine changes made. Use native command exit/output evidence instead.
- `.github/workflows/ci.yml` is manual-only. The profile records a separate
  repository CodeQL default-setup limitation; do not change repository settings.
