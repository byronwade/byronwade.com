# Portfolio client boundary result

VERDICT: PASS

- **Mode:** Implementation. Scoped source, dependency, test, and documentation
  writes; commits and publication to `bot/portfolio-boundary` authorized. No
  merge, force push, deployment command, environment/dashboard change, or
  credential-value inspection.
- **Decision:** Extract the existing static catalog into
  `lib/portfolio-projects.ts`; keep API/cache functions in
  `lib/portfolio-data.ts` behind `import "server-only"`. The client catch-all
  page imports only the static catalog.
- **Reused:** Existing project records, their private type, API implementations,
  cache tags, server API/Figma callers, and native rendered-test infrastructure.
  The Markdown project loader remains a separate content contract.
- **Created or extended:** One client-safe catalog module, the conventional
  `server-only@0.0.1` marker dependency, and a production client-chunk regression
  in `tests/rendered/portfolio-boundary.test.mjs`. No UI code was copied.
- **Recursive cleanup:** Removed the static export/type from the API module and
  migrated its sole consumer without a compatibility re-export. Import searches
  confirm only server callers remain. Catalog ownership and test command
  documentation now describe the split. Knip reports no unused surface.
- **Mechanical prevention:** Next.js rejects future client imports of the API
  module. `npm run test:rendered` independently scans every emitted client
  JavaScript chunk for portfolio environment symbols, API/cache helpers, the
  Figma SDK, and `next/cache`.

## Verification

All release checks ran locally on Node 24.21.0 / Next.js 16.2.7.

| Command / check | Result |
| --- | --- |
| `npm run lint` | PASS; 123 files, no fixes, exit 0 |
| `npm run type-check` | PASS; route type generation and strict TypeScript, exit 0 |
| `npm run knip` | PASS; no unused files/exports/dependencies, exit 0 |
| `npm run build` | PASS; 39 prerendered pages, exit 0 |
| `npm run test:rendered` | PASS; 2 tests, 0 failures; scanned 26 client chunks |
| Exact-symbol `rg -l` over `.next/static/chunks/**/*.js` | PASS; 0 matching client files |
| `rg -l` for API/cache symbols in `.next/server/chunks` | 6 matching server chunks; server implementation retained |
| Raw-contact probe over client scripts and prerendered HTML | PASS; 0 matching files |
| Catalog/API comparison with `38261e9` | PASS; catalog unchanged; API differs only by extraction and guard |
| `git diff --check` and full branch diff review | PASS |

The independent client grep used:

```text
\b(GITHUB_(API_TOKEN|TOKEN)|FIGMA_(ACCESS_TOKEN|TEAM_ID)|DRIBBBLE_TOKEN|unstable_cache|CACHE_TAGS|githubHeaders|getFigmaFiles?|getGitHub(Stats|Repositories)|getDribbbleShots)\b|figma-js|next/cache
```

Exact symbol boundaries distinguish this repository's `CACHE_TAGS` from Next's
unrelated `NEXT_CACHE_TAGS_HEADER` constant. The regression contains the same
boundary; no chunk or module exemptions were added.

Before migration, adding the guard while retaining the original client import
made `npm run build` exit 1 as expected. Turbopack traced the forbidden import
through both browser and SSR client paths in
`app/portfolio/[...slug]/page.tsx`. The final build passes with the guard intact.

Catalog SHA-256:
`9867999e766ab94ed9d17676cdd76c3b187ff2555ef3a0a2405a76ac46dacb06`.

## Rendered smoke and design evidence

Headless Chrome via existing `puppeteer-core`, against an owned local production
server on `127.0.0.1:3317`, with browser cache disabled:

| Route | Desktop 1440 × 1000 | Phone 390 × 844 |
| --- | --- | --- |
| `/projects` | 200; Projects heading and Thorbis link | 200; same |
| `/projects/thorbis` | 200; Thorbis case-study heading | 200; same |
| `/portfolio/thorbis` | 200; Thorbis.com heading and key features | 200; same |
| `/portfolio/thorbis-ai` | 200; AI Platform heading and key features | 200; same |
| `/portfolio/thorbis-mobile` | 200; Mobile Platform heading and key features | 200; same |

All ten navigations passed. Zero browser runtime exceptions; zero requests to
`/api/portfolio`; keyboard Tab reached a focusable control on every page.
Light and dark media preferences were exercised; visual theme fidelity was not
audited. The local smoke transcript is `.next/portfolio-boundary-smoke.json`.
The isolated browser and owned server were closed after the run.

No composition, styles, interactions, content, or motion changed. Existing
Showcase/Evidence profiles and organizing moves are preserved. A design/motion
redesign gate and performance comparison are not applicable; no speed claim is
made. Full accessibility/state/visual regression and `npm run dev` checks were
not run for this import-only page change. Contact action `npm test` was not run
because contact behavior is outside scope; its existing rendered check passed.

## Remaining findings and publication

- Build used existing fallbacks when Figma credentials were unavailable and the
  Dribbble request failed. Live third-party data freshness was not validated.
- Smoke observed local resource failures: 404 for Vercel telemetry scripts,
  500 from `/api/screenshot`, and 400 from `/_next/image`. Main documents,
  project data, and keyboard focus rendered successfully. These resources and
  their implementations were not changed in this boundary fix.
- Shared toolkit advisory reservation failed because its configuration names a
  missing unrelated workspace. Native command exit/output evidence was used;
  toolkit configuration and cleanup quarantine were untouched.
- No GitHub Actions workflow was dispatched. The existing repository-managed
  CodeQL limitation documented in `PROJECT_PROFILE.md` remains outside scope.
- Pushed `bot/portfolio-boundary` and opened ready PR
  [#46](https://github.com/byronwade/byronwade.com/pull/46) to `main`. Verified
  `isDraft: false` and `state: OPEN`. Not merged; next step is owner review.
