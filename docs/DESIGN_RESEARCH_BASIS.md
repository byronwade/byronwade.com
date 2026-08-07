# Research basis for Warm Precision

**Status:** informative, not normative
**Authority:** root `DESIGN.md` owns decisions
**Purpose:** record evidence and reasoning so the operational design contract can remain focused

> **Read this only when revising `DESIGN.md`**, not during ordinary tasks. It
> exists so the design contract can stay short without losing its reasoning.

## How byronwade.com applied it

The synthesis below is portable. These are the specific decisions it produced
here, so the reasoning is traceable to something real rather than admired in the
abstract:

| Source principle | What it changed in this repository |
| --- | --- |
| Emil Kowalski — separate operating modes | `AGENTS.md` opens with a mode table; reference and review are read-only, and a URL is explicitly not permission to edit |
| Emil Kowalski — motion gate before curve | `DESIGN.md` §6.1; the gate is run before any animation, and failing frequency/purpose/function means shipping no animation |
| Emil Kowalski — exact ingredients, one scale | `--motion-*` tokens in `app/globals.css`. Before adoption the same `cubic-bezier(.22,1,.36,1)` was copy-pasted into four files with no owner |
| Linear — quiet chrome, strong alignment | The dock stays planar and quiet; elevation is reserved for transient layers |
| Visitors — subject-specific organizing move | `DESIGN.md` §7.1 assigns each route its own move and forbids transplanting one to another |
| Cursor — the real work is the proof | The homepage leads with evidence rather than preamble |
| Apple HIG — reduced motion changes the experience | A global `prefers-reduced-motion` block, so motion is never load-bearing |
| WCAG 2.2 — alternatives to dragging | `hooks/use-drag-resize.ts` ships arrow-key and Home handling beside the pointer path |
| WCAG 2.2 — focus not obscured | The floating dock must never cover a focused control |
| Core Web Vitals | `lighthouse-budget.json`, plus field data through `@vercel/speed-insights` |
| Design Tokens CG — one runtime truth | `app/globals.css` is the only place a design value is defined; `PROJECT_PROFILE.md` records it as the owner |
| Cleveland & McGill | No charts exist. Adding one requires naming the reader question first — the research is why the bar is set there rather than at "add a dashboard" |

The cautions section at the end of this file is the most important part. This
site is a single-owner personal portfolio, not Linear, Shopify, or Cursor. Their
density, information architecture, and business models do not transfer.

## Method

The system is built from:

1. the adopting product owner’s stated preferences and constraints;
2. read-only inspection of each project’s existing architecture, design documents, components, tokens, and enforcement tooling;
3. first-party product and design guidance from strong reference companies;
4. Emil Kowalski’s public design-engineering skill suite;
5. accessibility and web-platform standards;
6. foundational human-computer interaction, cognitive psychology, and graphical-perception research.

A successful company interface is not proof that every visible choice is universally correct. References are used to identify durable principles. Those principles must still be evaluated against the current project’s users, workflows, frequency, data density, architecture, maturity, accessibility, and performance constraints.

The research file is not loaded for every ordinary task. It exists to explain and revise the normative decisions in `DESIGN.md` without turning that file into a literature review.

## Research synthesis

| Source | Strong principle | Portable adoption | Misapplication to avoid |
| --- | --- | --- | --- |
| Cursor | Real product interaction is stronger proof than decorative marketing; atmosphere can make technical software feel future-facing | Use cinematic framing around real workflows in Showcase; keep repeat-use software neutral and fast | Copying Cursor’s layouts, palette, editor chrome, or identity |
| Linear redesign | Reduce visual noise while preserving density; align every element; define chrome behavior; stress-test major view types | Stable Workbench chrome, compact controls, named archetypes, and deliberate list/board/timeline/split modes | Treating issue-tracker information architecture as universal |
| Shopify Polaris | Layout follows user action; depth communicates hierarchy and interaction; forms, filters, tables, and motion deserve system-level rigor | Strong control contracts, tactical depth, explicit states, and mature operational patterns | Card-heavy commerce templates or decorative shadows |
| ChatGPT and Canvas | Conversation is effective until work requires direct editing, selection, revision, history, and restoration | Keep AI chat calm; open a contextual workspace only when the task requires one | Making every workflow chat-first or decorating every AI feature |
| Visitors | Different capabilities benefit from different narrative layouts and progressive detail | Give each marketing page a subject-specific organizing move | Copying exact sections, examples, metrics, or visual identity |
| Apple HIG and interaction design | Familiar behavior, direct manipulation, immediate response, interruption, momentum, accessible targets, and reduced motion build trust | Guided surfaces follow platform conventions; gestures remain responsive and reversible | Scroll hijacking, imitation hardware scenes, or spectacle without value |
| Emil Kowalski’s skill suite | Taste is trained; invisible details compound; motion needs a gate; review, audit, opportunity search, prototyping, and implementation are distinct modes | Encode exact decision sequences, read-only modes, motion ingredients, prototype discipline, and dependency judgment | Animating everything, treating one expert’s values as universal, or bypassing project ownership |
| WCAG 2.2 and ARIA APG | Focus, keyboard behavior, target size, non-drag alternatives, modal containment, names, roles, and values are interaction requirements | Accessibility is designed into component and workflow architecture | Custom controls that look accessible but omit the interaction contract |
| Core Web Vitals | Loading, responsiveness, and stability can be measured with common field metrics | Public surfaces receive explicit LCP, INP, and CLS budgets | Treating one lab score as complete UX evidence |
| Design Tokens Community Group | Typed aliases and vendor-neutral token exchange reduce cross-tool drift | Keep one runtime token source and evolve interoperability deliberately | Creating a second active token truth during migration |
| Cognitive-load research | Irrelevant processing consumes limited capacity; schemas and stable structure reduce unnecessary work | Stable layouts, predictable action scope, contextual disclosure, and familiar patterns | Hiding necessary information under the banner of simplicity |
| Hick and Hyman | Choice time is affected by uncertainty and alternatives | Group actions by scope and progressively disclose infrequent choices | Reducing every screen to one action or ignoring expertise |
| Fitts | Target size and distance affect pointing time | Keep frequent actions reachable and touch targets comfortable | Making every control oversized regardless of context |
| Cleveland and McGill | Quantitative encodings differ in perceptual accuracy | Prefer common position and length, honest scales, direct labels, and tables for lookup | Decorative charts or one chart form for every dataset |

## Emil Kowalski’s design-engineering skills

- [AI Skills for Design Engineers](https://emilkowal.ski/skill)
- [Skills repository](https://github.com/emilkowalski/skills)
- [Design engineering skill](https://github.com/emilkowalski/skills/tree/main/skills/emil-design-eng)
- [Build animation](https://github.com/emilkowalski/skills/tree/main/skills/animate)
- [Review animations](https://github.com/emilkowalski/skills/tree/main/skills/review-animations)
- [Improve animations](https://github.com/emilkowalski/skills/tree/main/skills/improve-animations)
- [Find animation opportunities](https://github.com/emilkowalski/skills/tree/main/skills/find-animation-opportunities)
- [Prototype](https://github.com/emilkowalski/skills/tree/main/skills/prototype)
- [Animation vocabulary](https://github.com/emilkowalski/skills/tree/main/skills/animation-vocabulary)
- [Apple design](https://github.com/emilkowalski/skills/tree/main/skills/apple-design)
- [Pick a UI library](https://github.com/emilkowalski/skills/tree/main/skills/pick-ui-library)

### What the suite contributes

The most valuable contribution is not a list of animation recipes. It is a set of **separate operating modes**:

- build one animation;
- review an existing animation without editing;
- audit a codebase and write plans without editing source;
- search for worthwhile motion and explicitly reject bad candidates;
- prototype several divergent versions in isolation;
- name an effect precisely before discussing implementation;
- evaluate direct manipulation through Apple-derived principles;
- choose a dependency by capability and existing project context.

That separation prevents an agent from turning every design question into production code.

### Taste and invisible correctness

The skill suite treats taste as trained judgment developed by studying, reverse-engineering, and repeatedly inspecting good work. It also emphasizes that details users rarely notice individually can compound into an interface that feels correct.

Portable implications:

- inspect strong examples, but do not copy them;
- care about default values, edge cases, interruption, origin, focus, and adoption friction;
- make component developer experience part of design quality;
- handle edge cases invisibly when doing so preserves user control;
- prefer a small coherent API with excellent defaults over a broad option surface.

### Motion decision gate

The skills evaluate motion before choosing a curve:

1. frequency;
2. named purpose;
3. speed budget;
4. functional benefit;
5. cheapest capable tool;
6. properties, easing, duration, spatial origin, interruption, exit, and accessibility.

High-frequency and keyboard-driven actions should remain instant or nearly instant. Occasional overlays can use standard motion. Rare moments can use a limited delight budget. Functional data should not move merely for decoration.

The portable system adopts this order because it prevents the most damaging error: animating something that should have remained still.

### Exact ingredients and shared ownership

The suite recommends strong starting curves, sub-300ms interaction budgets for most UI, trigger-aware origins, non-zero scale entrances, transitions for rapidly retriggered states, and springs for gestures that carry velocity or reverse mid-flight.

Warm Precision adopts the decision logic and starter values, with an important boundary: an existing project’s deliberate token system wins. Agents extend canonical motion tokens rather than adding a parallel scale.

### Physical interaction

The Apple-design and motion skills emphasize:

- immediate response on press or touch-down;
- one-to-one tracking during direct manipulation;
- pointer capture;
- velocity and momentum on release;
- interruption and reversal;
- rubber-banding or friction at boundaries;
- multi-touch protection;
- springs when motion should carry energy;
- no input lock merely because an animation is running.

These ideas are incorporated as interaction architecture, not decorative polish.

### Review and audit discipline

The review skill uses an explicit Before/After/Why structure. The audit skill maps the motion surface, confirms every finding at a file and line, separates high-impact defects from polish, and writes exact plans for another executor.

Portable implications:

- reviews remain read-only unless fixes are separately requested;
- findings include evidence and exact values;
- audits vet false positives and respect documented decisions;
- uncertain feel becomes a verification step rather than a guessed claim;
- slow-motion, frame-by-frame, realistic-load, and physical-device checks are first-class.

### Opportunity search as a filter

The opportunity skill requires rejected candidates in addition to accepted suggestions. This matters because “make it feel alive” often produces too much motion.

Warm Precision adopts the restraint model: a short list of high-conviction opportunities, accompanied by examples deliberately rejected for frequency or functional interference.

### Prototype discipline

The prototype skill explores genuinely distinct alternatives behind a quick switcher. The general standard adapts that into an isolated decision workflow:

- one axis per run;
- three variants by default, no more than five;
- realistic content and interaction;
- instant switching;
- user selection;
- promotion of one winner;
- removal of prototype code after the decision.

### Dependency judgment

The library-selection skill checks the real task and installed dependencies before recommending a package. It prefers one clear owner rather than an unranked menu and warns against hand-rolling complex accessible components.

The specific library list is informative, not normative. Libraries change. Each project must verify current maintenance, framework fit, bundle/runtime cost, accessibility, and existing ownership.

## First-party product and design sources

### Cursor

- [Cursor](https://cursor.com/)
- [Cursor home](https://cursor.com/home)

Observed principle: the product itself is staged as proof. Cinematic atmosphere frames interaction rather than replacing it.

### Linear

- [How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui)

Linear describes reducing visual noise, maintaining alignment, increasing hierarchy and navigation density, documenting component behavior, testing major views, and using controlled rollout.

Portable adoption:

- define shell behavior;
- stress-test each major archetype;
- keep chrome quiet;
- preserve dense operational information;
- compare hierarchy and appearance as systems rather than isolated screens.

### Shopify Polaris

- [Designing for layout](https://polaris.shopify.com/foundations/designing/layout)
- [Designing for depth](https://polaris.shopify.com/foundations/designing/depth)
- [Designing for motion](https://polaris.shopify.com/foundations/designing/motion)
- [Designing interactions](https://polaris.shopify.com/foundations/designing/interaction)
- [Filters](https://polaris.shopify.com/patterns/filters)
- [Text field](https://polaris.shopify.com/components/selection-and-input/text-field)
- [Index table](https://polaris.shopify.com/components/tables/index-table)
- [Button](https://polaris.shopify.com/components/actions/button)
- [Data visualization](https://polaris.shopify.com/foundations/data-visualizations)

Portable adoption:

- action-led layout;
- purposeful depth;
- explicit control states;
- mature filters and forms;
- operational tables as first-class surfaces;
- motion used for feedback and continuity.

### OpenAI and ChatGPT

- [Introducing canvas](https://openai.com/index/introducing-canvas/)

Canvas distinguishes simple conversation from work requiring direct editing, targeted revision, inline feedback, history, and restoration.

Portable adoption:

- chat remains the simplest interface for conversational work;
- structured work opens only when direct manipulation is needed;
- targeted edits remain targeted;
- consequential changes are inspectable and reversible.

### Visitors

- [Visitors](https://visitors.now/)
- [Analytics](https://visitors.now/analytics)
- [Realtime](https://visitors.now/realtime)
- [Visitor profiles](https://visitors.now/profiles)

Observed principle: capabilities are presented with different evidence arrangements instead of one repeated landing-page template.

Portable adoption:

- each marketing page receives a subject-specific organizing move;
- progressive detail appears where it becomes relevant;
- the product relationship, not a generic component grid, determines composition.

### Apple

- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility/)
- [Motion](https://developer.apple.com/design/human-interface-guidelines/motion/)
- [Layout](https://developer.apple.com/design/human-interface-guidelines/layout/)
- [Searching](https://developer.apple.com/design/human-interface-guidelines/searching/)

Portable adoption:

- platform conventions in Guided surfaces;
- immediate response and direct manipulation;
- accessibility settings change the actual experience;
- motion never becomes mandatory for comprehension;
- familiarity and flexibility matter more than visual imitation.

## Standards and platform guidance

### WCAG 2.2

- [Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/)
- [What’s New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)

Relevant requirements include focus not obscured, focus appearance, alternatives to dragging, minimum target size, consistent help, reduced redundant entry, and accessible authentication.

Portable implications:

- sticky chrome cannot cover focused controls;
- drag interactions need a non-drag path;
- critical targets cannot be tiny or crowded;
- authentication cannot rely on cognitive tests alone;
- data entry should not repeatedly request known information.

### ARIA Authoring Practices

- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [Keyboard interface practices](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)

Portable implications:

- use native elements first;
- modals contain focus and close with Escape;
- focus returns logically;
- composite widgets implement their full keyboard model;
- visible focus is part of the visual system.

### Core Web Vitals

- [Web Vitals](https://web.dev/articles/vitals)
- [Understanding Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)

Common “good” thresholds are LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS at or below 0.1, evaluated at the 75th percentile.

Portable implications:

- marketing visuals cannot delay useful content;
- scroll sequences must not destabilize layout;
- static content should not require a large client bundle;
- product specimens need explicit image and font loading strategies.

### Design Tokens Community Group

- [Design Tokens Community Group](https://www.designtokens.org/)
- [Design Tokens Format Module](https://www.designtokens.org/TR/2025.10/format/)

The format defines a vendor-neutral representation for tokens, groups, aliases, types, and metadata.

Portable implication:

- each project keeps one runtime truth;
- future cross-platform exchange may use a compatible source format;
- migration must not introduce two active token truths.

## Foundational research

### Cognitive load

John Sweller, “Cognitive Load During Problem Solving: Effects on Learning,” *Cognitive Science*, 1988.
DOI: [10.1207/s15516709cog1202_4](https://doi.org/10.1207/s15516709cog1202_4)

Design interpretation:

- stable patterns and visible structure reduce unnecessary reconstruction;
- explain unfamiliar systems;
- avoid making users infer action scope from inconsistent placement;
- remove irrelevant competition;
- do not confuse reduced cognitive load with reduced information.

### Choice and uncertainty

W. E. Hick, “On the Rate of Gain of Information,” *Quarterly Journal of Experimental Psychology*, 1952.
DOI: [10.1080/17470215208416600](https://doi.org/10.1080/17470215208416600)

Design interpretation:

- group actions by meaning;
- prioritize common actions;
- progressively disclose infrequent choices;
- maintain stable order;
- do not overgeneralize the relationship to every complex decision.

### Target acquisition

Paul M. Fitts, “The Information Capacity of the Human Motor System in Controlling the Amplitude of Movement,” *Journal of Experimental Psychology*, 1954.
DOI: [10.1037/h0055392](https://doi.org/10.1037/h0055392)

Design interpretation:

- frequent actions should be reachable;
- touch targets require comfortable size and spacing;
- destructive actions should not be accidentally adjacent to common actions;
- tiny icon controls are inappropriate on Guided surfaces;
- target size is one factor, not a universal reason for oversized UI.

### Graphical perception

William S. Cleveland and Robert McGill, “Graphical Perception: Theory, Experimentation, and Application to the Development of Graphical Methods,” *Journal of the American Statistical Association*, 1984.
DOI: [10.1080/01621459.1984.10478080](https://doi.org/10.1080/01621459.1984.10478080)

Design interpretation:

- prefer common position for comparison;
- use length when position is not practical;
- avoid forcing users to compare area or angle when precision matters;
- show exact values and a table for audit;
- choose chart geometry from the reader’s question.

## Research cautions

### Do not turn laws into slogans

Hick’s law does not mean fewer buttons are always better. Fitts’s law does not mean every control should be huge. Cognitive-load theory does not mean hide information. Graphical-perception research does not ban every pie chart.

Use research as evidence for decisions, not as a substitute for user context, testing, or judgment.

### Do not copy mature products without project evidence

Linear optimizes product-development work. Shopify optimizes commerce operations. Cursor optimizes programming. ChatGPT optimizes conversation and AI collaboration. Apple controls an integrated hardware and software ecosystem. Visitors has its own product model. Emil’s skills encode one experienced design engineer’s judgment.

The adopting product must reflect its own users, frequency, risk, environments, and business model.

### Do not use aesthetics to conceal missing structure

A warm palette, good typography, soft shadow, and polished motion cannot repair:

- unclear ownership;
- missing states;
- bad data;
- excessive clicks;
- duplicated components;
- poor performance;
- inaccessible interaction;
- weak information architecture.

## Resulting portable principles

1. Keep one runtime token source.
2. Use canonical components and owned variants.
3. Name the user’s job and composition before layout.
4. Keep work or evidence dominant.
5. Apply density according to the task.
6. Use progressive disclosure without hiding critical capability.
7. Use depth and motion to explain behavior.
8. Gate motion by frequency, purpose, speed, and function.
9. Preserve platform familiarity and direct manipulation.
10. Separate reference, review, audit, opportunity, prototype, and implementation modes.
11. Treat forms, filters, tables, search, and overlays as core infrastructure.
12. Keep AI changes transparent and reversible.
13. Make marketing composition specific to the capability.
14. Prototype divergent options in isolation and promote one winner.
15. Inspect installed dependencies before adding new ones.
16. Enforce accessibility and performance mechanically.
17. Recursively clean only the affected dependency cone.
18. Convert recurring drift into low-noise checks.
