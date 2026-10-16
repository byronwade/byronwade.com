# Projects refresh progress

Mode: Implementation. Work only in this dedicated branch/worktree.

1. Read repository guidance; fetch and merge origin/main (contact + Node 24).
2. Inspect project content, loaders, UI, and public GitHub sources; record conservative facts and unknowns.
3. Add nine current projects (update Thorbis), retain fifteen older entries with status/group changes only; reuse existing UI/tokens.
4. Integrate origin/bot/design-system when available before publication.
5. Run local lint, type-check, knip, build; verify 9 + 15 rendered links and all detail routes; capture desktop/mobile evidence.
6. Review diff and acceptance criteria; write RESULT.md, commit small coherent changes, push branch, open ready PR with sources, evidence, and older-project decision table. Never merge or deploy production.

## Imported design-system plan (aff0151)

Implementation mode, authorized October 16, 2026. Scope: tokens, shared primitives,
homepage, nav, footer, first paint, tablet overlap, focus and structured data.
Reference clone D:/Dev/thorbis-design remains read-only. No content lane edits,
production deployment, or merge.

### Plan

1. Sync main; inspect instructions and Thorbis source/live examples; verify package
   and registry availability and pin source revision.
2. Port tokens/primitives into CSS/Tailwind/Base UI owners; redesign home and shell;
   document provenance and sync in DESIGN.md and docs/THORBIS-DESIGN-PORT.md.
3. Run local lint, types, knip, build, contact regressions, rendered verification,
   axe, no-JS, responsive/theme screenshots and perf:budget. Fix actual failures.
4. Review full diff; record evidence per criterion in RESULT.md; commit/push and
   open a ready PR for Byron. Never merge.

### Loop 1 — reconnaissance

- Branch bot/design-system; starting tree clean.
- Fetched and merged origin/main, fast-forward 38261e9 to c69030b.
- Contact and portfolio changes included; PR #49 not in this merge.
- Thorbis revision 46b6654d02fda9d8fde737395185c3141df52cd2, private manifest.
- Registry/npm verification and live inspection pending.
- No implementation or check claims yet.


## Loop 1
- Started: inspecting guidance and clean branch state. No implementation yet.
- Acceptance: pending research, implementation, checks, counts, screenshots, and PR.

## Decision record
- Operating mode: Implementation; commits, branch push, ready PR authorized by the brief.
- Surface profiles: Showcase index; Evidence detail pages. Reader: prospective client or peer.
- Primary job: see current work first, retain access to every earlier project.
- Dominant object / organizing move: ranked project rows with evidence, split into Current work and Earlier work; existing detail story and artifact layout.
- Reuse: `Section`, `ProjectsIndex`, `IndexList`, `StatusPill`, Markdown and existing tokens. No new primitive, dependency, color, or motion.
- Alternatives: one interleaved list hides the historical boundary; a grid loses index density. Choose two sections composed from the existing list.
- Dependency cone: content/projects, projects route, ProjectsIndex, lib/projects date parsing. Homepage/search/sitemap consume this same loader; portfolio-data is a separate portfolio surface and is unchanged.
- States/input: preserve empty/loading/error paths; native links; long titles wrap at mobile widths; inspect desktop/mobile, light/dark, keyboard and reduced motion.
- Motion gate: no new animation; grouping is static and needs no motion. Existing reveal and hover behavior stays under global reduced-motion rules.
- Performance: server-only grouping, no client JS or images added. Run local production build and performance budget; no speed claim.
- Plan: add content and conservative TODOs, preserve legacy bodies/frontmatter except status/featured/flagship; compose two sections; verify schema/counts/preservation and all routes, then capture evidence and publish the PR.
- Mechanical prevention: rendered count/slug assertions and legacy-content comparison recorded as acceptance evidence. No new permanent test framework for this content change.
- Shared toolkit: reserve/run unavailable because roots configuration references a missing legacy path; no shared state or configuration modified. Direct local checks will retain logs and exit codes.
- Baseline: branch clean at 38261e9; fetch + merge origin/main reports already up to date; origin/bot/design-system not published at initial check.
