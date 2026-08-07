---
title: "A Design System Has to Be Enforceable or It Is Just Documentation"
date: 2026-07-12
updated: 2026-08-07
excerpt: "Tokens, components, accessibility rules, and motion principles only become a system when products inherit them automatically. AI-generated interfaces make that enforcement more important, not less."
tags:
  - Design systems
  - UI
  - Product engineering
  - Accessibility
  - AI
---

Most design systems do not fail because the team chose the wrong shade of blue.

They fail because the system remains optional.

The tokens exist in one repository. The components exist in another. Figma shows the intended design. Documentation explains the rules. Then a product deadline arrives, a developer copies the closest component, an AI agent generates a new variation, and the actual interface moves another inch away from the system.

Eventually the design system becomes a museum of what the company once intended to build.

I started [byronwade/ui](/projects/byronwade-ui) because I was creating too many products for that kind of drift to remain affordable. Goodmarks, SignalRoute, Thorbis, and this site all needed navigation, forms, panels, status, typography, motion, responsive behavior, and accessibility.

Recreating those decisions for every product felt flexible at first.

It was actually repeated debt.

> A design system earns its keep when the correct decision is inherited and the inconsistent decision becomes harder to ship.

That requires more than a component library. It requires a contract between design intent, implementation, and the tools producing the interface.

## Reuse is not the same as consistency

A team can reuse components and still have an inconsistent product.

The same button can appear with different surrounding spacing, hierarchy, wording, loading behavior, and error handling. The same color token can be used for the wrong meaning. A modal primitive can be technically shared while every feature handles focus, dismissal, and destructive actions differently.

Consistency lives at several layers:

- **Values:** color, spacing, type, radius, elevation, and motion
- **Primitives:** buttons, inputs, links, panels, status, and controls
- **Patterns:** forms, navigation, empty states, search, filtering, and confirmation
- **Behavior:** focus, keyboard input, loading, errors, optimistic updates, and recovery
- **Policy:** accessibility, reduced motion, responsive rules, writing tone, and prohibited patterns
- **Composition:** how the product decides which pattern belongs in a particular situation

A component library usually covers the first two layers well.

The expensive drift often begins in the rest.

That is why “we already have a button component” does not solve AI-generated UI inconsistency. The agent may use the button and still invent a new card, a different information hierarchy, an unnecessary modal, another animation curve, and a one-off form pattern.

The component is available.

The decision boundary is not.

## The system needs machine-readable meaning

Raw design values are easy to copy and difficult to govern.

A token named `#f4b740` tells a tool the color. A token named `brand-accent` tells the tool the role. A token named `warning-surface` tells the tool even more: this value belongs to a semantic family and should not be substituted merely because another orange looks close.

The Design Tokens Community Group published its stable [2025.10 format specification](https://www.designtokens.org/tr/2025.10/format/) as a shared file format for exchanging design tokens between tools. The report is explicitly **not** a W3C Standard, but it is considered stable and intended for implementation.

That distinction matters. It is not a universal law. It is a credible common vocabulary.

A portable token format can describe the values, types, groups, and references that make up a visual system. It cannot decide whether a destructive action deserves a confirmation step, whether a dashboard should use a table or cards, or whether motion clarifies the relationship between two states.

Tokens make decisions addressable.

They do not make the decisions.

The stronger design contract combines machine-readable tokens with machine-discoverable component APIs, usage rules, diagnostics, examples, and policy.

An agent should be able to ask:

- Which surface token belongs here?
- Which components already solve this behavior?
- What states must this pattern support?
- Is an overlay allowed on this product?
- What is the minimum touch target?
- How should reduced motion change the transition?
- Which text role belongs to this hierarchy?
- Is this proposed component semantically different from an existing one?
- What rule will CI use to reject the wrong implementation?

That is a system an AI can compose inside.

A screenshot and a paragraph of taste are not.

## The Morph Panel is useful because it has ownership

The signature pattern in byronwade/ui is the Morph Panel.

It is a capsule that expands in place from a compact control into a larger panel instead of making a disconnected surface appear somewhere else. The launcher, dock, and related chrome can share the same material and motion language.

The visual effect is not the important part.

The ownership is.

Without a shared primitive, each product could invent its own version:

- one panel changes width but not height,
- one uses a different radius,
- one shifts surrounding layout,
- one traps focus,
- one does not,
- one closes on Escape,
- one ignores it,
- one respects reduced motion,
- one still scales across the screen,
- one restores focus to the trigger,
- one drops the user somewhere else.

They might all look similar in a screenshot.

They would not be the same behavior.

When the pattern has one owner, an improvement to interruption, focus, timing, responsive behavior, or reduced motion can propagate. The system is not saving the code required to draw a rounded rectangle. It is saving the repeated reasoning and repeated mistakes around that rectangle.

That is where a design system becomes financially useful.

## The compounding math is the real reason

Design systems are often justified through vague statements about efficiency.

The value becomes clearer when change amplification is made visible.

Assume six products each implement 12 shared interface primitives separately. A systemic issue is discovered—perhaps focus restoration, loading-state wording, target size, or a dark-theme contrast problem. Assume inspecting and correcting each implementation takes 30 minutes.

The decentralized cost is:

`6 products × 12 primitives × 30 minutes = 36 hours`

Now assume the primitives have one implementation. Correcting the central behavior takes one hour, and validating the affected behavior in each product takes 15 minutes:

`1 hour + (6 products × 15 minutes) = 2.5 hours`

The illustrative savings from that one class of change is:

`36 hours - 2.5 hours = 33.5 hours`

The exact numbers will vary. The mechanism does not.

A shared system reduces **change amplification**: the number of places a decision has to be rediscovered, implemented, tested, and corrected.

This is also why a design system can become more valuable as the number of products increases, but only when the products genuinely share the behavior. A bad abstraction spreads confusion just as efficiently as a good one spreads quality.

The goal is not maximum reuse.

The goal is one owner for each stable decision.

## Accessibility has to be inherited

Accessibility work is especially vulnerable to optional implementation.

A product deadline will usually preserve the visible design. Invisible behavior is easier to miss:

- focus order,
- accessible names,
- keyboard operation,
- error association,
- target size,
- contrast,
- screen-reader announcements,
- focus return,
- and reduced motion.

A real design system puts those requirements inside the normal path.

[WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) defines a Level AA minimum target-size rule of 24 by 24 CSS pixels with specific exceptions. Its stricter [Target Size Enhanced](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced) guidance uses 44 by 44 pixels. The system should encode an appropriate control scale so product teams are not debating the hit area of every icon button from scratch.

Motion needs the same treatment.

The [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) media feature has been broadly available across browsers since 2020. It allows an interface to detect that a person wants non-essential motion reduced, removed, or replaced.

That should not depend on every developer remembering one media query.

The motion primitive should have a reduced behavior by default.

For the Morph Panel, reduced motion does not mean the feature becomes unusable or a second product has to be designed. It means the visual transition can collapse to a near-instant state change while preserving focus, hierarchy, and cause and effect.

Accessibility is most durable when it is part of the component’s contract rather than a checklist applied after the design is finished.

## Motion is a relationship, not decoration

Motion is one of the easiest parts of a design system to turn into theater.

A library collects easing curves and durations. Teams start animating because the tokens exist. The interface becomes more consistent and more distracting at the same time.

The stronger question is not, “Which motion token should we use?”

It is, “Does this transition explain a relationship the static interface cannot explain as clearly?”

The Morph Panel has a reason to move: the compact control becomes the expanded surface. The motion shows continuity between the trigger and result.

A status message does not need to bounce because the product has a spring token.

A design contract should define both allowed ingredients and allowed purposes:

- orient the user,
- preserve object continuity,
- confirm direct manipulation,
- reveal hierarchy,
- or communicate a meaningful state change.

If none applies, the correct duration is zero.

This is an example of a rule that tokens cannot express alone. The system needs policy and review criteria around the token.

## AI makes taste more scalable and drift more dangerous

Before AI coding agents, inconsistency was constrained by human production speed.

Now a team can generate many pages, components, and variations in a short period. That can increase output. It can also industrialize local decisions that should never have become permanent.

An agent is very good at producing a plausible component.

“Plausible” is the problem.

The new card may look correct. The repository already has a card that solves the same behavior. The new component may use the right colors while introducing a different spacing scale, state model, accessibility path, or responsive rule.

The agent did not intentionally violate the design system. It lacked a discoverable contract and an enforcement mechanism.

For AI-authored UI, a serious design system needs four capabilities.

### Discovery

The agent must be able to find the tokens, components, patterns, examples, and constraints that apply to the current surface.

### Composition

The available components need clear semantics and APIs. A pile of flexible primitives forces the agent to reinvent the pattern.

### Diagnostics

The toolchain should identify off-token values, duplicate components, prohibited patterns, inaccessible states, unsupported variants, and divergence from established composition rules.

### Safe correction

Some failures can be repaired mechanically: replace a raw value with a token, use the canonical component, add the required state, or correct a target size. Other failures require judgment and should be reported rather than automatically “fixed.”

This is the direction I think design systems are moving toward: not another hosted component gallery, but a local contract compiler that turns design intent into something coding agents can discover and CI can enforce.

The design system becomes less like a library and more like a type system for interface decisions.

## Enforcement cannot replace judgment

There is a danger in taking the contract idea too far.

Not every design decision can be proven.

A linter can detect a raw hex value. It cannot reliably decide whether the page has the right dominant object. A schema can require an empty state. It cannot determine whether the wording respects the user. A component API can prevent an unsupported button variant. It cannot guarantee that the product has the correct information hierarchy.

The system should be strict where correctness is mechanical and explicit where judgment remains human.

Mechanically enforceable examples include:

- token usage,
- approved component imports,
- prohibited duplicate primitives,
- required accessible names,
- supported state combinations,
- reduced-motion handling,
- contrast thresholds,
- and known responsive constraints.

Judgment-oriented examples include:

- whether the page should exist,
- which information deserves priority,
- whether an interaction is too clever,
- whether motion helps,
- whether the abstraction has one coherent responsibility,
- and whether the interface feels like the product rather than the design system.

The goal is not to automate taste.

It is to stop wasting taste on decisions the system already made.

## When abstraction becomes another form of drift

A design system can also fail by trying to absorb everything.

A universal component with 40 props, several modes, optional slots, boolean combinations, and product-specific escape hatches may technically reduce the number of files. It increases the number of invalid states.

I use a simple test:

**Does the shared abstraction make the behavior easier to understand than the implementations it replaces?**

Reuse is appropriate when the concepts share semantics, lifecycle, accessibility behavior, and change pressure.

Reuse is dangerous when the components merely look similar.

A billing status and a project category may both appear as colored text. They do not necessarily share meaning. A command launcher and a confirmation dialog may both expand from a capsule. They do not necessarily share interaction.

A healthy system needs the ability to say no to consolidation.

One stable owner per decision does not mean one component for every visual resemblance.

## When the system earns its keep

A design system earns its keep when:

1. A new product starts with hardened behavior rather than an empty canvas.
2. Fixing one real defect improves every product that owns the same behavior.
3. Accessibility, responsive behavior, and reduced motion are inherited.
4. AI agents discover existing concepts before generating new ones.
5. CI catches mechanical drift before a reviewer has to see it.
6. Product-specific decisions remain possible without forking the foundation.
7. The system becomes sharper because real products continually test it.

That last point matters.

A design system built only in documentation will optimize for examples. A system used by real products has to survive long content, error states, weak devices, keyboard input, dark themes, deadlines, and ideas the original author did not anticipate.

The product is the test bench.

## Documentation is the beginning

I still believe design documentation matters.

It records intent, names the patterns, explains the exceptions, and gives humans and agents a shared vocabulary. Tokens matter. Components matter. Figma matters. Examples matter.

But none of them alone creates the system.

The system exists when a design decision has:

- a clear owner,
- a machine-readable expression where possible,
- a reusable implementation where appropriate,
- an explicit policy where judgment is required,
- a diagnostic for known failure modes,
- and evidence from a product that actually ships.

That is the standard I am building toward with byronwade/ui and the broader design-contract work around it.

If the system only tells people what they should do, it is guidance.

If products inherit the decision and the toolchain can reject the wrong path, it is infrastructure.

And if it only exists as a set of polished Figma frames, it still has not earned rent.
