---
name: Warm Precision, byronwade.com
version: 2.0
status: adopted baseline
principle: "Warm precision. Quiet power."
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

# Warm Precision, design standard for byronwade.com

This is the design authority for this repository. It owns judgment:
information architecture, composition, interaction, motion, accessibility,
responsive behavior, content hierarchy, and visual quality.

It does not own values. Runtime values live in `app/globals.css` and component
APIs. When this document and the code disagree about a *value*, the code wins
and this document is wrong. When they disagree about a *decision*, this
document wins and the code gets fixed.

The intended feeling is **warm, precise, fast, and quietly powerful**. A visitor
should be able to tell within one viewport what Byron does and see evidence of
it, without the interface performing.

`PROJECT_PROFILE.md` supplies the users, owners, dependencies, commands, and
exceptions this file refers to. Read it first.

## 1. Authority

1. The current user request and its acceptance criteria.
2. The closest applicable repository instructions.
3. `PROJECT_PROFILE.md` for users, personality, owners, paths, and exceptions.
4. This file for design judgment.
5. Runtime tokens in `app/globals.css` and the component APIs in `components/ui/`.
6. `docs/UI_GUIDELINES.md` for the binding interaction and accessibility rules.
7. Existing implementation, only where it does not contradict the above.
8. Screenshots, archived designs, and external references. These are evidence,
   never proof.

Hard rules:

- There is one design authority. Do not create a second.
- Do not copy token tables into Markdown. Link to the owner.
- When a token or component contract changes, migrate every caller. Do not leave
  two systems live.
- External products are references, not templates.
- A design reference does not grant permission to modify anything. Write
  permission is an operating-mode decision governed by `AGENTS.md`.

## 2. Design thesis

| Reference | Principle adopted here | What is not copied |
| --- | --- | --- |
| Cursor | The real work is the proof; atmosphere frames it | Layouts, editor chrome, palette, identity |
| Linear | Quiet chrome, strong alignment, indexes that stay dense without shouting | Issue-tracker IA, their palette |
| Shopify Polaris | Explicit control states, mature forms, purposeful depth | Card-heavy commerce templates |
| Visitors | Each page earns its own organizing move | Their exact sections, copy, or identity |
| Apple HIG | Direct manipulation, immediate response, reduced motion that actually reduces | Scroll hijacking, hardware mimicry |
| Emil Kowalski's design-engineering skills | Motion gate before motion code; separate operating modes; exact ingredients | Treating the site as an animation showcase |

The synthesis, for this site:

> **The work is visually dominant. The interface stays quiet until action is
> needed. Warmth keeps it comfortable. Motion confirms; it never performs.**

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

Persistent structure is planar, borders and tone separate regions. Elevation is
reserved for transient layers: popovers, hover cards, the dock, the fullscreen
preview. Shadow is not decoration.

### 4.6 Familiarity before novelty

Novel composition is welcome on Showcase pages. Novel *control behavior* is not.
Use the platform, then Base UI, then custom, in that order.

### 4.7 Performance is part of design

A page that looks fast and responds slowly is badly designed. Every design
decision accounts for server versus client work, bundle size, image and font
loading, and layout stability. See §12.

## 5. Foundations

Values are owned by `app/globals.css`. This section owns how they are used.

### 5.1 Color

The palette is warm-neutral OKLCH with a single restrained amber brand.

- Brand marks authorship, focus, selection, and the one primary action in a
  region. It is **not** a default container color.
- `success`, `warning`, `destructive`, and `brand` are separate semantic
  families even where two currently resolve to the same value.
- `--type-*` is a **taxonomy** family, not a status one. It classifies work
  (product, client, concept, hobby) and must never be read as an outcome. Never
  borrow a status colour to mean a category, or the palette starts asserting
  things the content does not.
- Status never relies on color alone. pair it with text, icon, or shape.
- Dark mode preserves hierarchy; it is not an inversion.
- No decorative gradients, gradient text, neon glow, or glassmorphism.
- No page-local palette. If a value is needed twice, it becomes a token.

### 5.2 Typography

Geist for text, Geist Mono for data and code, the signature face for the
wordmark only. All three are owned by `lib/fonts.ts`.

| Role | Use |
| --- | --- |
| Display | One page-defining statement, where scale is earned |
| Page title | Route or object identity, one `h1` per page |
| Section heading | A major turn in the page's argument |
| Lede | One short orientation passage under the title |
| Body | Reading |
| Compact body | Index rows, metadata, inspectors |
| Label | Controls and field names |
| Metadata | Dates, source, freshness |
| Data | Counts, currency, durations, tabular numerals |
| Mono | Code, paths, commands, identifiers |

Rules:

- Sentence case.
- Weight carries hierarchy deliberately; bold is not the default tool.
- Peers share a role. Two project titles look the same even when one is longer.
- Tabular numerals for anything aligned or counting.
- Reading measure stays near 60–72 characters.
- Reflow or rewrite before shrinking type. Never use tiny muted text for density.
- One type scale. A feature does not get its own.

### 5.3 Spacing

4px grid, 8px dominant rhythm: `4 → 8 → 12 → 16 → 24 → 32 → 48 → 64 → 96`.

Every visible gap has one owner. A parent that owns spacing does not have
children adding their own margins.

### 5.4 Shape

Radius derives from `--radius`. `0` for edge-connected structures, small radii
for controls, larger for panels and overlays, full only for avatars, dots, and
intentional pills. A pill is a semantic shape, not a default button.

### 5.5 Elevation

Five tiers: canvas → surface → raised → overlay → modal. Persistent regions do
not all float. `shadow-float` is for transient layers only.

### 5.6 Icons

`@phosphor-icons/react` at duotone weight, one family, imported only through
`lib/icons.tsx`. 16px in dense contexts, 20px standard, 24px only
where hierarchy earns it. Icons support labels rather than replacing them.
Icon-only controls require an accessible name. No icons in decorative colored
tiles. Brand marks (GitHub, LinkedIn, X) stay at `fill` weight; a duotone
company logo reads as a rendering fault rather than a style.

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
4. **Tool.** Cheapest capable: CSS transition → `.reveal` animation →
   Web Animations API → `framer-motion` (already installed; `LazyMotion` only).
   Do not add a library for a fade.
5. **Properties.** `transform` and `opacity`. `clip-path` deliberately (the
   theme-toggle wipe). Never animate `width`, `height`, `top`, or `left` on a
   repeated interaction.
6. **Ingredients.** Use the tokens in §6.2. Do not introduce a parallel scale.
7. **Interruption.** Define retrigger, reversal, and exit before shipping.
8. **Access.** Reduced motion ships with the implementation, not after.

### 6.2 Ingredients

Owned by `app/globals.css`:

```css
--motion-ease-out:      cubic-bezier(0.23, 1, 0.32, 1);   /* enter, exit */
--motion-ease-in-out:   cubic-bezier(0.77, 0, 0.175, 1);  /* move while on screen */
--motion-ease-drawer:   cubic-bezier(0.32, 0.72, 0, 1);   /* sheets, capsule morph */
--motion-fast:   120ms;  /* press, hover, color */
--motion-base:   200ms;  /* popover, tooltip, dropdown */
--motion-slow:   300ms;  /* capsule morph, sheet */
--motion-drawer: 480ms;  /* theme wipe, the one deliberate flourish */

--motion-scene:      640ms;  /* first-view page entrance (`.reveal`) */
--motion-scene-step:  90ms;  /* stagger between staged elements in one opening */
```

`--motion-scene` is the "rare or first-view" row of the §6.1 table and may only
be used for a page entrance. It is not a fourth general duration: nothing a
visitor triggers repeatedly may reach for it.

Never `ease-in` for an entrance; it delays visible response. Linear only for
continuous motion. Durations are budgets, not a second scale, repeated values
get promoted into the tokens above.

### 6.3 Physicality

- Press feedback is immediate.
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
| `/` | Claim, then immediate proof, the numbers and the shipped work sit in the first screen, not below three sections of preamble |
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
are worth sharing. `nuqs` is available.

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
