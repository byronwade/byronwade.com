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
- Verification: baseline production build and symbol scan, then local lint,
  type-check, knip, production build, repeat client-symbol scan, boundary
  rejection check, and headless route smoke for `/projects`, a Markdown project
  detail, and static portfolio details. Review the full diff and run
  `git diff --check`. Record evidence in `RESULT.md`.

## Plan

1. Install locked dependencies and reproduce the client chunk contamination.
2. Extract the static catalog, enforce the API boundary, and commit the fix.
3. Run release gates and smoke checks; fix only findings in this dependency cone.
4. Write `RESULT.md` with `VERDICT: PASS` or `BLOCKED`, commit evidence, push
   `bot/portfolio-boundary`, and open a ready PR to `main`.

## Progress

- Reconnaissance complete; dependency installation in progress.
- Shared toolkit advisory reservation could not initialize: its configured
  roots include a missing unrelated septic workspace. No configuration or
  quarantine changes made. Use native command exit/output evidence instead.
- `.github/workflows/ci.yml` is manual-only. The profile records a separate
  repository CodeQL default-setup limitation; do not change repository settings.
