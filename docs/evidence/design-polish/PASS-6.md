# Design polish pass 6

Implementation against `d238896b`, after PRs #150–#155. This pass keeps the
Thorbis token port and the existing route compositions. No authored content,
case-study text, project sources, dependencies, workflows or shop files change.

## Decisions

1. **Content reads as content in the home specimen.** Product explanation and
   stage descriptions use the existing 14px content role and body colour,
   instead of 13px metadata. Stage names keep weight 500, and sequence numbers
   and the figure caption retain their marker role. The heading/action row
   can wrap on narrow screens. No new token or component is needed.
2. **Indexes share a reading rhythm.** Writing, repository and project excerpts
   use the 14px role's 1.5 line height and pretty wrapping. The previous
   long-form leading override made short index descriptions looser than their
   role specifies. Writing titles now use the existing 16px heading role and
   semantic h3 elements under section/year h2 headings, including on home and
   in related writing. Existing PostRow and index owners retain their content,
   targets, focus and hover behaviour. Article paragraphs keep their reading
   rhythm.
3. **A wide artifact has a readable caption.** Project preview captions compose
   the existing measureClass. The image still spans the wide shell; its
   explanation aligns with the title and story rather than beginning in the
   artifact's outer gutter. Mobile keeps the same edge.

The alternative was a larger composition or new ornament. The route subjects
already have distinct arrangements, so this pass improves reading and alignment
without another layer of chrome. No motion is justified: there is no changed
state transition to explain. No JavaScript, font or heavy CSS is added.

## Craft audit

| Route | Decision or retained treatment |
| --- | --- |
| Home | Readable specimen text; shared index rhythm; claim and proof order retained |
| Projects | Shared excerpt rhythm; status remains textual; no project removed |
| Thorbis Design detail | Caption on the story edge; preview recovery retained |
| byronwade/ui detail | Same caption treatment; proof and article unchanged |
| Portfolio | Shared excerpt rhythm; signal column and recovery retained |
| Figma detail | Existing specimen and controls retained; local API fixture used for success evidence |
| Writing index | Semantic post headings and shared excerpt rhythm; chronology retained |
| Building Thorbis post | Related writing inherits PostRow; title, prose, tags and pager retained |
| Design systems post | Same related-writing treatment; code and prose untouched |
| Resume | Recent header/alignment fixes retained; print behaviour unchanged |
| Contact | Focused form and native field/recovery treatment retained |
| Search | Existing focused form retained |
| Search results | Existing grouped index retained; query state stays in the URL |
| Search empty | Existing explanation and browse exits retained |
| Privacy | Existing readable legal composition retained |
| Terms | Existing readable legal composition retained |
| 404 | Existing start-aligned recovery retained |

Checks cover typography, edges, spacing, media/recovery framing, theme parity,
and empty/error states. No new composition is forced onto unaffected routes.

## References and evidence

- Thorbis live homepage and read-only `D:/Dev/thorbis-design`, particularly
  `src/components/rules/rule-content-styles.stylex.ts` and the site shell.
  `docs/THORBIS-DESIGN-RULES.md` owns the content/metadata distinction, named
  type roles, deliberate edges and grouping by space.
- [Mobbin Polywork profile reference](https://mobbin.com/screens/13669ca9-5f66-499c-83c9-af2394005195):
  identity followed by readable supporting evidence. Ideas only; its cards,
  colours and product controls are not copied.
- Before/after screenshots:
  `C:/Users/bcw19/agent-tools/screens/redesign-1022c/{before,after}/`.
  Each includes 17 routes at 390px and 1440px, selected dark variants and
  `overflow-report.json`. Mobile uses WebKit with Playwright's iPhone 13
  profile, touch, mobile layout and DPR 3. PNGs use CSS-pixel scale because
  full-resolution long posts exceed WebKit's screenshot dimension limit.
- Figma success uses `tests/fixtures/figma-browser.mjs`; external frame content
  is excluded. Project screenshots exercise the unavailable/retry state when
  capture credentials are absent. These do not certify live providers.

Completed paired performance measurements are recorded below. The PR and task
result retain command results. The existing layout sensor now includes figure
captions on Evidence pages in its edge comparison at 1280px and 1440px,
protecting the caption fix on all
project routes. No new test framework or broad visual gate is introduced.

## Performance measurements

Three interleaved A/B pairs compare main `d238896b` with design commit
`966afdb`, using `npm run perf:budget` through Git Bash with
`MSYS_NO_PATHCONV=1`. Pair 2 reverses the order. No samples were discarded and
the runner, budgets, settle protocol and font preloads are unchanged.

| Route | Main LCP samples, ms | Candidate LCP samples, ms | Median, main to candidate |
| --- | --- | --- | --- |
| Home | 3003.3, 3012.0, 2997.1 | 3013.4, 1816.7, 3003.8 | 3003.3 to 3003.8 |
| Thorbis Design | 3141.1, 3183.3, 3162.6 | 3227.8, 3148.9, 3192.3 | 3162.6 to 3192.3 |

The detail median is 29.7ms higher. A fresh same-build A/A control measured
3254.2 and 3206.0ms, a 48.1ms difference without a code change. That identical
baseline build previously measured 3162.6ms (same build ID), a 91.5ms spread.
The comparison does not establish a regression at the observed noise level;
it also does not establish a speed improvement.

Home median TBT is 226 to 235ms; detail is 200 to 185ms. Home CLS is zero;
detail median CLS is 0.00098 in both versions. CSS stays at 16,549 transferred
bytes; font bytes and counts are unchanged (home 49,991 / one, detail 65,886 /
two), as are total requests (16 / 18). The shared-layout client chunk stays
48,436 uncompressed bytes. Script transfer differs by 25 bytes on home and 33
on detail alongside changed build/module identifiers, with no application
client code added.

Ten of twelve paired commands exit 1 for the existing 3000ms LCP limit. Both
controls also miss LCP. Every other timing and resource budget passes. These
are not clean absolute performance-budget passes, and the limit was not raised.
Raw samples and controls are retained as `perf-results.json` and
`perf-control-results.json` in the screenshot evidence directory.

Main's subsequent `fcc0d5b` search-corpus cache is integrated separately; it
changes no page composition, tokens or styles on these measured routes.
