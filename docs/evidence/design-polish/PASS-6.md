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

The PR and task result contain final command results and paired performance
numbers. The existing layout sensor now includes direct evidence-figure captions
in its edge comparison at 1280px and 1440px, protecting the caption fix on all
project routes. No new test framework or broad visual gate is introduced.
