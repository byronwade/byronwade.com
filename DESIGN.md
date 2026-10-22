---
name: Thorbis Design, byronwade.com
version: 3.0
status: Thorbis port adopted
principle: "Quiet chrome. Precise work."
adoption:
  project_profile: PROJECT_PROFILE.md
  agent_protocol: AGENTS.md
  research: docs/DESIGN_RESEARCH_BASIS.md
profiles_in_use:
  showcase: "/", /projects, /portfolio, /blog
  evidence: /resume, /projects/[slug]
  guided: /contact and the inline contact sheet
  shared: components/ui, app/globals.css
profiles_not_in_use:
  workbench: "no authenticated or repeat-use operational surface exists"
runtime_ownership:
  tokens: app/globals.css
  components: components/ui
  icons: "@phosphor-icons/react (duotone), via lib/icons.tsx"
  motion: app/globals.css (--motion-*)
---

# Thorbis Design for byronwade.com

Byron directed this site to adopt [Thorbis Design](https://design.thorbis.com).
The authoritative upstream is [byronwade/thorbis-design](https://github.com/byronwade/thorbis-design).
This site uses a faithful CSS/Tailwind port pinned to
`46b6654d02fda9d8fde737395185c3141df52cd2`, with existing Base UI interaction
APIs and Next.js rendering. It does not consume a published Thorbis package.

[docs/THORBIS-DESIGN-PORT.md](docs/THORBIS-DESIGN-PORT.md) maps source files,
tokens, adapters, exceptions and synchronization. To sync, inspect the upstream
diff, select a source revision, run the read-only token adapter, update component
recipes, and verify both themes and responsive states before changing the pin.
The upstream clone is a reference and must never be edited by this site’s work.

## 1. Authority and ownership

The current task and AGENTS.md govern scope. Thorbis owns visual grammar:
quiet chrome, precise work, Inter, Geist Mono, electric blue, neutral surfaces,
sunk fields and lifted commits. This document owns site-specific composition,
content and interaction rules. app/globals.css owns runtime values and semantic
aliases; components/ui owns primitives. Never create a parallel palette or kit.

## 2. Site-specific intent

This is Byron Wade’s personal site. Prospective clients, employers and peers
need evidence of shipped work, readable writing and a reliable way to get in
touch. Use plain first-person language. Keep claims qualified: the plumbing
company’s revenue does not erase its closure. Do not copy the trades product’s
workflow vocabulary into unrelated personal content.

The homepage is compact claim-and-proof: the experience, then the current
product as a framed specimen, then documented work and writing, all on the
shared 42rem measure. Content renders immediately, including with
JavaScript disabled. No viewport-height spacer, bottom-aligned hero, opacity-zero
entrance or scroll reveal may hide that content. The header follows Thorbis's fixed,
52px single row, with space reserved before hydration. Narrow screens use a
triggered navigation panel; wide screens show inline links on the same surface.

## 3. Surface profiles

This site uses four. `PROJECT_PROFILE.md` maps each to its routes.

### 3.1 Showcase, `/`, `/projects`, `/portfolio`, `/blog`

Public pages whose job is to make a visitor understand and decide.

- Cinematic only where the work earns it.
- Specific to the capability being shown.
- Product-led and evidence-led.
- Complete and readable with animation disabled.
- Budgeted (`lighthouse-budget.json`).
- **Never** a centered hero followed by interchangeable cards.

Composition may be bespoke. Tokens, forms, icons, focus behavior, and motion
vocabulary may not.

### 3.2 Evidence, `/resume`, `/projects/[slug]`

Pages where the reader arrives with a question and needs a defensible answer.

- Name the reader, the question, the strongest supported answer, and the caveat.
- Support two reading speeds: an executive path (identity, headline, decisive
  facts) and an audit path (dates, stack, specifics, links to the real thing).
- Preserve units, periods, and sources. Do not manufacture precision.
- The comparison or the artifact is the dominant object, not a card wrapper.

### 3.3 Guided, `/contact` and the inline contact sheet

One focused task, frequently interrupted, often on a phone.

- Touch targets ≥44px.
- Explicit submitting, failed, and succeeded states.
- Preserve what the visitor typed when submission fails. Never clear the form.
- Validation beside the field it concerns.
- Never a compressed desktop layout.

### 3.4 Shared foundation

All profiles share semantic color roles, typography, spacing, shape, elevation,
focus and input states, motion tokens, reduced-motion behavior, component
ownership, and error/loading/empty states. A profile changes composition and
density, never interaction correctness.

### 3.5 Workbench, not used

No authenticated or repeat-use operational surface exists here. The page
archetypes for resource indexes, ledgers, inboxes, and admin queues are
deliberately omitted. If this site ever grows one, restore that section from the
portable kit rather than improvising.

## 4. Universal principles

### 4.1 The work is the hero

Each page has exactly one dominant object:

| Route | Dominant object |
| --- | --- |
| `/` | Who Byron is and the proof, not the avatar, not the nav |
| `/projects` | The list of real case studies |
| `/projects/[slug]` | The case study and its live artifact |
| `/portfolio` | The repositories themselves |
| `/blog` | The posts |
| `/blog/[slug]` | The prose |
| `/resume` | The record |
| `/contact` | The form |

No card, gradient, dock, or animation may become more visually important than
that object.

### 4.2 Calmness comes from hierarchy, not emptiness

Calm is produced by one dominant object, predictable alignment, restrained
contrast, consistent density, quiet inactive states, and stable patterns. It is
not produced by whitespace alone or by hiding useful content.

### 4.3 Density follows the job

- Indexes (projects, posts, repositories): compact, scannable, one row per item.
- Article and case-study bodies: comfortable, ~60–72 character measure.
- Resume: compact but printable.
- Contact: comfortable, touch-first.

Never apply one density across the whole site.

### 4.4 Progressive disclosure is contextual, not secret

Hover, popovers, and the command palette are accelerators. They may never be the
only route to a primary action, a recovery path, or critical status. Every
critical action has a visible or keyboard-discoverable route.

### 4.5 Depth communicates behavior

Persistent structure is planar; spacing and tone separate regions. Borders
identify fields, controls and media, never rows or page sections. Fields sink;
controls and media may use the short lift; transient layers use overlay
elevation. Shadow is not decoration.

### 4.6 Familiarity before novelty

Novel composition is welcome on Showcase pages. Novel *control behavior* is not.
Use the platform, then Base UI, then custom, in that order.

### 4.7 Performance is part of design

A page that looks fast and responds slowly is badly designed. Every design
decision accounts for server versus client work, bundle size, image and font
loading, and layout stability. See §12.

## 5. Tokens and typography

Thorbis source values and light/dark overrides are ported into app/globals.css.
Existing semantic names alias those tokens so all routes share the new system.
Inter is the UI/body face; Geist Mono is for code and technical data. The local
signature face remains available only to the existing resume identity.

Use Thorbis copy roles (12, 13, 14, 16px), heading roles (16, 20, 32px), 4px
spacing grid, 8/10/12/14px radii, source shadows and control sizes. Font sizes,
line heights and elevation are tokens, not page-specific approximations.
Electric blue indicates action/focus. Categories are neutral labels; status is
always written. Any contrast correction must be documented against its source.

## 6. Motion

Motion is an interaction tool. Decide whether it should exist before choosing a
curve.

### 6.1 The gate

Run in order. Failing any of the first three means the correct implementation
contains no animation.

1. **Frequency.** Match the default to how often a visitor meets it:

   | Exposure | Default |
   | --- | --- |
   | Every visit, keyboard-driven (nav, theme toggle, search open) | Instant or near-instant |
   | Common (hover, focus, press) | Imperceptible feedback only |
   | Occasional (contact sheet, fullscreen preview, hover card) | Standard functional motion |
   | Rare or first-view (page entrance) | The delight budget may be spent, once |

2. **Purpose.** Name one: feedback, spatial consistency, state indication,
   continuity, explanation, or rare delight. "It looks good" is not a purpose
   for anything a visitor sees repeatedly.
3. **Function.** Never move content the visitor is reading.
4. **Tool.** Cheapest capable: CSS transition →
   Web Animations API.
   Do not add a library for a fade.
5. **Properties.** `transform` and `opacity`. `clip-path` deliberately (the
   theme-toggle wipe). Never animate `width`, `height`, `top`, or `left` on a
   repeated interaction.
6. **Ingredients.** Use the tokens in §6.2. Do not introduce a parallel scale.
7. **Interruption.** Define retrigger, reversal, and exit before shipping.
8. **Access.** Reduced motion ships with the implementation, not after.

### 6.2 Ingredients

The source curve is `--ease-out`, aliased for existing consumers. Thorbis uses
`--motion-fast` (120ms) and `--motion-overlay` (180ms). Existing duration names
alias these two budgets; never introduce a second curve or duration scale.
Content entrances are absent. Hover changes color; focus is immediate. Reduced
motion disables nonessential transitions and the theme wipe.

### 6.3 Physicality

- Press feedback is immediate: a button settles 1px (`translate-y-px`) only
  when motion is allowed; under reduced motion a press changes colour only.
- Entrances start from `0.95–0.98`, never `scale(0)`.
- Trigger-anchored surfaces animate from their trigger; centered things stay
  centered.
- Enter and exit paths agree.
- Direct manipulation tracks one-to-one, captures the pointer, and always has a
  keyboard equivalent.
- Input is never locked because an animation is running.
- Hover motion is gated to `(hover: hover) and (pointer: fine)`.

### 6.4 Reduced motion

`globals.css` collapses animation and transition durations globally under
`prefers-reduced-motion`. Because of that, motion may never be the only way to
understand sequence, state, or completion, the reduced experience must remain
complete, not broken.

### 6.5 Feel-check

Code review cannot prove feel. For material motion: play at 2–5× duration, step
coordinated properties frame by frame, check transform origin and enter/exit
symmetry, and test gestures on real hardware. Report what was not checked.

## 7. Composition

### 7.1 Every page needs a subject-specific organizing move

This is the rule that prevents this site from becoming a template. Each route
states its move, and the move does not transplant to another route:

| Route | Organizing move |
| --- | --- |
| `/` | Experience, then the current product it led to, then qualified proof, documented work and recent writing, in one column on the measure; no viewport-height preamble |
| `/projects` | A ranked index where each row carries its own evidence: problem, outcome, status |
| `/projects/[slug]` | The live artifact beside the story, the reader can see the thing while reading about it |
| `/portfolio` | Raw open-source activity, pulled live, sorted by signal |
| `/blog` | Chronology with the lede visible, so scanning is reading |
| `/resume` | One record, two reading speeds, printable |
| `/contact` | One task, nothing else on the page competing |

### 7.2 Openings

The first viewport communicates the core relationship, tool, or proof. A large
title alone does not qualify. Available openings: product-led, claim-and-proof,
comparison-led, workflow-sequence, evidence-led.

For a substantial page, compare at least two materially different compositions
before building, change topology and sequence, not card styling.

### 7.3 Shareable state

Filters, tabs, selected items, and search queries belong in the URL when they
are worth sharing. Use native URL/search params; evaluate a query-state library
when a real interactive surface needs one.

### 7.4 Shared arrangements

These are the site's one way of doing each thing; routes compose them rather
than restyling them.

- **Measure.** `SiteShell` keeps the header's 42rem measure with the gutter
  outside it, so title, header and footer share an edge on every route,
  the homepage included. Thorbis keeps its chrome at 42rem everywhere and
  sets its own homepage on that measure; it widens only for a gallery of
  work. So the home hero is one column (claim, product specimen, facts)
  rather than a 64rem split whose title sat 176px left of the header at
  1440. `width="wide"` is only for pages with a live artifact (project
  preview, Figma file). On an artifact page only the artifact spans: the
  title, prose, details and foot sit in `measureClass`, centred on the
  header's axis, and the case-study outline docks in the right gutter at xl
  so it never moves the text's edge. Every route passes its `profile`.
- **Rhythm.** `SiteShell` owns the step between a page's regions (identity,
  body, foot): 40px on phones, 48px from `sm`. Its direct children are those
  regions; routes do not wrap them in their own gap. Inside a region, groups
  sit closer than regions do (Thorbis: the gap between groups is at least
  twice the gap within one).
- **Detail identity.** Case studies and posts open the same way: a 13px
  muted facts line (type or date, then reading time), the 32px title, the
  16px lede, then the evidence (problem and outcome, or tags).
- **Pager.** A post ends with `PostPager` (`components/blog/post-pager.tsx`):
  the older post on the reading edge, the newer opposite it, in the writing
  index's published order, so drafts never appear. Each side is an index row
  (`indexRowLinkClass`), with the same hover fill, focus ring and accent as
  every other list of posts. Related posts exclude the two pager posts, so no
  title repeats at the foot of a post.
- **Rows.** Indexes separate rows with space and a rounded hover fill, never
  hairlines (Thorbis D-017). Chronologies (writing, resume, repositories) lead
  with a mono column for the date or signal; `PostRow` owns the writing row.
  Index descriptions use the 14px content role with its own 1.5 line height
  and pretty wrapping, rather than the long-form leading override. Writing
  row titles are level-three headings below each section or year heading.
- **Sheet.** `components/layout/sheet.tsx` frames real work with a caption that
  says what it is. It bleeds to the phone edge. It is not a card for counts or
  sections, and there is no card primitive.
  Wide project previews keep their caption on `measureClass`: the artifact
  spans, while its explanation shares the article's reading edge. In the home
  specimen, explanatory sentences and stage descriptions use 14px body text;
  the 12px marker role is reserved for numbers and the figure caption.
- **Standalone links.** Back, next and open links use `link-action`: 14px,
  underlined, 44px target. Links inside a sentence use `link-underline` and
  stay inline on the sentence's baseline, so they wrap with the text and never
  stretch the line (WCAG 2.5.8's inline exception). A `link-underline` that
  stands alone, like the footer's, adds its own 44px box. The `Link`
  primitive sets focus only; the recipe sets the size. Underlines use
  Thorbis's link decoration token at from-font thickness, 2px below the text,
  and turn to the foreground on hover.
- **Focus.** One indicator everywhere: the global `:focus-visible` outline,
  2px in the focus token, 2px off the control and following its radius
  (Thorbis `focusRing`). Buttons, fields and badges add no ring of their own;
  a row inside a panel may inset it (`-outline-offset-2`).
- **Fields.** Inputs, the textarea and the native select are one recessed
  well. The select drops the platform paint (WebKit drew it as a light system
  button) and carries a caret, while its options stay the platform picker.
- **Quotes.** A quote in a post or case study follows Thorbis's markdown
  quote: upright body text set in 16px from a 2px rule in the neutral
  border colour, on the body's own rhythm. Never italic, and never an accent
  edge (the rules reject a coloured border on a quote).
- **Code.** A fenced block is Thorbis's markdown code well: the `code-bg`
  surface, a 1px neutral border, the large radius, 16px by 14px padding and
  Geist Mono at the 14px role. Long lines wrap rather than scroll, so the well
  is never a separate scroll stop. Syntax colour is four quiet roles built from
  Thorbis tokens (`--code-comment`, `--code-keyword`, `--code-string`,
  `--code-constant` in `app/globals.css`) plus weight 500 for titles; no bold,
  no italic, no token backgrounds. Every role must hold 4.5:1 on the well in
  both themes, and `tests/code-palette.test.mjs` fails the build if one stops.
- **Failure.** Route errors and the root boundary render `ErrorNotice`;
  collections render `EmptyState`. Both are start-aligned type, never a boxed
  illustration.

## 8. Component contracts

- **Buttons:** one dominant primary action per region; verb-first labels;
  loading preserves width; no page-local wrappers for spacing or color.
- **Forms:** visible labels; helper text explains format or consequence;
  validation beside the field; invalid input is preserved, never cleared or
  silently clamped; native input types and autocomplete.
- **Search:** global search lives in the dock; results identify type and
  context; Escape and arrow keys behave predictably; empty results offer a route out.
- **Cards:** justified only when content has independent identity, state, or
  selection. Never to create spacing, to make a number look important, or to
  fill a grid. No nested cards.
- **Tabs:** switch representations of one object; active state is not
  color-only; object context is preserved.
- **Overlays:** accessible name, sensible initial focus, contained keyboard
  navigation when modal, Escape, a visible close route, and focus return.
- **Empty, loading, error:** every surface that can be empty, slow, or fail has
  a designed state. Empty explains what is missing and the next step. Errors say
  what failed, what is still safe, and what to do.
- **Status:** text with a semantic cue, distinguishable in monochrome.
- **Charts:** none exist. Adding one requires naming the reader's question
  first, preferring position and length, and providing a table alternative.

## 9. Content and voice

First person, plain, specific. Say what changed and why it matters. Concrete
nouns, strong verbs, real numbers with their period and source.

- Buttons use verbs when the action is not obvious.
- Destructive actions name the consequence.
- Empty states explain the next step.
- Errors state what failed and what remains safe.
- No hype, synthetic urgency, or generic AI phrasing.
- Claims on Showcase and Evidence pages stay sourced and qualified.

## 10. Accessibility

Target WCAG 2.2 AA. `docs/UI_GUIDELINES.md` holds the binding rules; this
section states the non-negotiables:

Semantic landmarks; one descriptive `h1`; ordered headings; native controls
first; visible focus never obscured by the dock; accessible names; keyboard
operation throughout; no color-only meaning; sufficient contrast; text resize
and reflow; reduced-motion support; a non-drag alternative wherever dragging
exists; dialog focus containment and return; hover-revealed content also
available on keyboard focus.

Accessibility is not claimed from static inspection. The critical flows are
checked with a keyboard: navigating, reading a post, and submitting the
contact form.

## 11. Responsive behavior

Recomposition, not shrinking.

- **Desktop:** full composition, docked table of contents, keyboard accelerators.
- **Tablet / narrow:** preserve the primary work; move secondary panels to
  overlays; reduce chrome before reducing readability.
- **Mobile:** one column; full-width sheets; the next action stays reachable;
  the dock does not cover focused controls; wide content scrolls horizontally
  rather than being mangled into stacked labels.

## 12. Performance budgets

`lighthouse-budget.json` is the enforcing owner. Targets: LCP ≤2.5s (budget
currently 3s), INP ≤200ms, CLS ≤0.1 at p75.

Also budgeted: script bytes, image bytes, font requests, total requests.

Interaction expectations: press feedback is immediate; local state acknowledges
within ~100ms; long actions expose progress; loading does not shift layout;
client code exists only where interaction requires it.

Performance claims require before-and-after measurement.

## 13. Rejected reflexes

Do not ship: a centered hero followed by a card grid; a page made entirely of
summary cards; repeated KPI boxes where one relationship would be clearer;
nested cards; borders around every row; all-caps eyebrows; gradient text;
glassmorphism; neon glow; decorative blobs or grid backgrounds; icons in colored
tiles; tiny muted text; every control as a pill; arbitrary radii, shadows, or
colors; one layout repeated across unrelated pages; tooltips containing
essential instructions; hover-only or right-click-only critical actions; modals
for non-interruptive work; charts without a reader question; decorative
animation; page-local copies of shared components; a second visual or motion
system.

Avoiding these is not a licence for sterile anti-design. This standard requires
clear hierarchy, real typography, deliberate density, useful depth, and
confident composition.

## 14. Ownership

Before creating a component, pattern, token, or dependency, search for an exact
implementation, a semantic equivalent under another name, an existing variant or
slot, a platform capability, and an installed dependency that already solves it.

Then choose the first sound option: reuse unchanged → configure or compose →
extend the canonical owner → extract a shared recipe → create new.

- Primitives (`components/ui/`) own reusable interaction and accessibility.
- Feature folders own repeated arrangements.
- Pages own one-off content arrangement, never copied component code.
- `app/globals.css` owns values.
- A wrapper that only renames an API or adds hardcoded classes is drift.

## 15. Design decision record

For substantial UI work, record before implementing:

```text
Operating mode:
Surface profile: Showcase | Evidence | Guided | Shared
Route and reader:
Primary job:
Dominant object:
Organizing move:
Primary action or decision:
Existing compositions, components, and tokens inspected:
Reuse / configure / extend / extract / create:
Composition alternatives considered:
State coverage:
Responsive and input plan:
Accessibility risks:
Performance risks and budget:
Motion gate: frequency, purpose, function, tool, reduced-motion path
Verification and feel-check plan:
```

## 16. Quality gate

Score 0–2 in each category. A mature surface scores at least 20/24 with no
critical failure.

1. Purpose clarity
2. Primary action or decision
3. Information hierarchy
4. Data and state trust
5. Named composition, the route uses an intentional organizing move
6. Density and readability
7. State coverage
8. Interaction quality
9. Motion judgment
10. Accessibility
11. Performance shape
12. System integrity

Automatic failure:

- the operating mode was violated;
- a generic card stack substitutes for a real surface;
- one marketing template is repeated across unrelated pages;
- critical actions exist only on hover, right-click, or shortcut;
- inaccessible custom controls replace established primitives;
- a component, token, or dependency was created without searching;
- motion blocks a high-frequency or keyboard-driven action;
- motion lacks a reduced-motion path;
- content is hidden until animation completes;
- a second token, icon, overlay, or motion system is introduced;
- the result is declared complete from one screenshot.

## 17. Completion checklist

- operating mode and write permission honored;
- `PROJECT_PROFILE.md` read and still accurate;
- reader, job, profile, dominant object, and organizing move identified;
- existing components, patterns, and tokens inspected before creating;
- empty, loading, error, and success states inspected where relevant;
- keyboard, pointer, touch, reduced-motion, light, and dark inspected;
- critical actions discoverable without hidden-only accelerators;
- motion passed the gate and has a reduced-motion path;
- desktop, narrow, and mobile recomposition inspected;
- performance and layout stability checked against the budget;
- full diff reviewed for duplicated concepts and unrelated cleanup;
- this file updated if a new stable pattern was established;
- everything not run, rendered, or verified is reported.
