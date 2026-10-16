# AI agents blog draft progress

Operating mode: Implementation. Stay in `bot/blog-post` in this worktree.

Plan: sync origin/main; read all six existing posts and content consumers; write
one 900–1500 word first-person draft; add minimal centralized draft exclusion;
verify local rendering with screenshots and production exclusion; run local
lint, type-check, knip, and build; review the diff; push and open a ready PR.

Acceptance: valid existing frontmatter plus `draft: true`; 900–1500 visible
words; dev slug renders; production listing hides the draft; all author TODOs
listed in the PR; checks pass. No production deployment, PR merge, external messages,
new design primitives, or edits to other worktrees.

Existing candidates: `lib/blog.ts` owns loading; `/blog`, RSS, sitemap, route
generation, and search consume it. No draft filtering exists. Extend that owner
instead of adding route-specific filters. Reuse existing Markdown rendering.
Dependency cone: one new post, blog loader, focused native Node regression,
and these local handoff notes. No visual or motion changes planned.

Loop 1: merged origin/main at c69030b, including contact and Node 24 changes.
Read all six posts and required guidance. Draft written (1159 whitespace-delimited
body words, excluding frontmatter and HTML comments); three author TODOs.
Extended the canonical blog loader to hide drafts outside development, sharing
that boundary with list, direct lookup, and slug consumers. Removed duplicated
frontmatter parsing and raw slug enumeration. Added native Node regression
coverage for development, production, test, explicit false, and absent draft.
No UI, token, or motion changes. Existing reading surface: prose dominant,
workflow sequence; inspect desktop/mobile, light/dark, keyboard/reduced motion.

Toolkit reservation and job launcher both failed on a missing unrelated configured
root. Do not change toolkit config; use ordinary hidden local command execution.
Dependencies absent in this worktree; npm ci running. Design-system branch is not
yet on origin; recheck before opening the PR. Next: commit/push, run checks and
rendered verification, then record results here and in RESULT.md.

Loop 2: merged origin/bot/design-system at aff0151. This revision contains the
adoption plan only, with no token/component changes yet. Its intent is preserved
below. Check for a newer revision before opening the PR; branch already pushed,
so use merge (never rebase/force-push). The only merge conflict was this handoff.

Design-system lane handoff: scope is tokens, shared primitives, homepage, nav,
footer, first paint, tablet overlap, focus, and structured data. Thorbis source
revision 46b6654d02fda9d8fde737395185c3141df52cd2, private manifest. Its plan:
inspect source/live examples and registry; port through existing CSS/Tailwind/
Base UI owners; document provenance; run local checks, accessibility, no-JS,
responsive/theme screenshots and perf budget; open a ready PR without merging.
No source implementation or verification was included in the fetched revision.

Loop 3: npm ci completed. Native tests: 40/40 pass; draft regression fails on
the original loader as expected. Type-check passed. Lint initially exposed
CRLF checkout drift; normalized local files to indexed LF and refreshed the
index, leaving only intended source changes. Test loops now use Promise.all;
lint passes (125 files, zero findings). Knip running.

Browser caught author comments rendered as text by ReactMarkdown. Repository
search found no authored raw HTML outside the new comments. Extend canonical
Markdown with its skipHtml option, keeping comments out of the reading surface
without enabling HTML execution. Next: repeat dev browser pass, rerun relevant
checks, production build, HTTP visibility verification, and full diff review.

Loop 4: dev browser pass succeeded: 1148 rendered body words; one h1, six h2s;
TODO comments invisible; no horizontal overflow at 1440x1000/light, 390x844/dark,
768x1024/light, 2560x1440/dark. Reduced-motion enabled; skip-to-main followed by
Tab and keyboard Back to writing both work; no page errors. Screenshots captured
and inspected. Initial browser assertions were corrected to allow existing HTML
classes and native skip-link sequential-focus behavior; no application changes
were required for those two checks. All review server trees stopped after use.

Design-system implementation a5347a8 arrived during verification and is now
merged (no code conflicts). Read its updated DESIGN.md, profile and port map.
It ports tokens, core primitives, Inter and layout font wiring; no package changes.
Re-running all four local gates against this revision, then refreshing screenshots
and production exclusion checks. A prior preview displayed October 15 for date-only
October 16 frontmatter because the existing formatter uses the host timezone;
record this date-formatting issue for a separate site-wide fix.

Loop 5: integrated-tree checks passed: lint (126 files, zero findings),
type-check, knip, npm run build (39 generated pages), npm test (40/40).
Build emitted the allowed Figma credential/Dribbble fallback warnings. A shell
runner typo invoked npm build once; corrected to npm run build, which passed.
Repeated dev browser verification after the token/font merge: all four viewports,
themes, keyboard paths, hidden comments, 1148 rendered words, and no page errors
passed. Refreshed both committed review screenshots to the Thorbis token revision.
Build/preview jobs are local and hidden; none use other worktrees.

Production runtime visibility, rendered tests, generated-contact scans and a
Lighthouse budget check are in progress. Port 3000 is occupied, so do not run the
hardcoded perf:budget script against it. Use the same build and Lighthouse budget
on this worktree's own production server at 127.0.0.1:3212 instead. No performance
improvement claim is being made. Next: collect actual runtime/budget results,
write RESULT.md locally, finalize PR body with all three TODOs, push and open a
ready PR to main; never merge.
